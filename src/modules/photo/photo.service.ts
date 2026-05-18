import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { BadRequestError } from '../../shared/errors/index';
import { makeNumeration } from '../../shared/utils/index';
import { AddPhotoDTO } from '../../shared/types/index';

/**
 * Photo Service:
 * 
 * Este servicio se encarga de manejar la lógica relacionada con las fotos de productos.
 */

// Carpeta donde se almacenarán las fotos finales
const PHOTOS_FOLDER = path.join(__dirname, '../../../public/files/photos');

/**
 * @description - Limpia el archivo temporal y lanza un error.
 * 
 * @param filePath - Ruta del archivo temporal que se debe eliminar en caso de error
 * @param error - Error que se lanzará después de limpiar el archivo temporal
 * @throws El error proporcionado después de eliminar el archivo temporal
 */
const cleanupAndThrow = (filePath: string, error: Error) => {
    fs.unlink(filePath, () => {});
    throw error;
};

/**
 * @description - Sube una foto de producto, asociándola a una variante específica.
 * El proceso incluye verificar la existencia de la variante (1), obtener la numeración 
 * de la foto (2), leer la metadata de la imagen (3), definir la ruta final (4) y mover 
 * el archivo a la ubicación final (5) y guardar la info en la base de datos (6). Si ocurre 
 * algún error durante el proceso, se asegura de limpiar el archivo temporal para evitar 
 * acumulación de archivos no deseados.
 * 
 * @param file - Archivo de imagen a subir mediante Multer
 * @param variantId - ID de la variante a la que se asociará la foto 
 * @returns - Un objeto con el nombre y la ruta de la foto subida
 */
export const uploadPhoto = async (
    file: Express.Multer.File,
    variantId: string
): Promise<{ name: string; path: string }> => {
    const pro_variant_id = parseInt(variantId);

    // 1. 
    const existResult = await db.query<{ fn_variant_exist: boolean }>(
        QUERIES.VARIANT.EXISTS,
        [pro_variant_id]
    );

    if (!existResult[0].fn_variant_exist) {
        cleanupAndThrow(file.path, new BadRequestError('Variant not found', { pro_variant_id }));
    }

    // 2. 
    const countResult = await db.query<{ fn_get_numeration_photo: number }>(
        QUERIES.PHOTO.GET_NUMERATION,
        [pro_variant_id]
    );

    const photoNumber = makeNumeration(countResult[0].fn_get_numeration_photo);
    const photoName = `${pro_variant_id}_${photoNumber}`;

    // 3.
    const { width, height } = await sharp(file.path).metadata();
    const type = file.mimetype.split('/')[1];
    const size = parseFloat((file.size / (1024 * 1024)).toFixed(2));

    // 4.
    const finalPath = path.join(PHOTOS_FOLDER, `${photoName}.${type}`);

    // 5.
    await new Promise<void>((resolve, reject) => {
        fs.rename(file.path, finalPath, (err) => {
            if (err) {
                cleanupAndThrow(file.path, err);
                reject(err);
            }
            resolve();
        });
    });

    // 6.
    await db.callFunction(QUERIES.PHOTO.ADD_VAR, {
        size,
        height: height!,
        width: width!,
        type,
        route: finalPath,
        name: photoName,
        variant_id: pro_variant_id
    } satisfies AddPhotoDTO); // no 'metadata' sino satisfies para AddPhotoDTO

    return {
        name: `${photoName}.${type}`,
        path: finalPath
    };
};