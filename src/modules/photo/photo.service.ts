import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { BadRequestError } from '../../shared/errors/index';
import { makeNumeration } from '../../shared/utils/index';
import { AddPhotoDTO } from '../../shared/types/index';

const PHOTOS_FOLDER = path.join(__dirname, '../../../public/files/photos');

export const uploadPhoto = async (
    file: Express.Multer.File,
    variantId: string
): Promise<{ name: string; path: string }> => {
    const pro_variant_id = parseInt(variantId);

    // 1. Verificar que la variante existe
    const existResult = await db.query<{ fn_variant_exist: boolean }>(
        QUERIES.VARIANT.EXISTS,
        [pro_variant_id]
    );

    if (!existResult[0].fn_variant_exist) {
        // Eliminar archivo temporal
        fs.unlink(file.path, () => {});
        throw new BadRequestError('Variant not found', { pro_variant_id });
    }

    // 2. Obtener numeración de fotos
    const countResult = await db.query<{ fn_get_numeration_photo: number }>(
        QUERIES.PHOTO.GET_NUMERATION,
        [pro_variant_id]
    );

    const photoNumber = makeNumeration(countResult[0].fn_get_numeration_photo);
    const photoName = `${pro_variant_id}_${photoNumber}`;

    // 3. Leer metadata con sharp
    const { width, height } = await sharp(file.path).metadata();
    const type = file.mimetype.split('/')[1];
    const size = parseFloat((file.size / (1024 * 1024)).toFixed(2));

    // 4. Ruta final
    const finalPath = path.join(PHOTOS_FOLDER, `${photoName}.${type}`);

    // 5. Guardar metadata en DB
    const metadata: AddPhotoDTO = {
        size,
        height:         height!,
        width:          width!,
        type,
        route:          finalPath,
        name:           photoName,
        variant_id:     pro_variant_id  
    };

    await db.callFunction(QUERIES.PHOTO.ADD_VAR, metadata);

    // 6. Mover archivo de temp a photos
    await new Promise<void>((resolve, reject) => {
        fs.rename(file.path, finalPath, (err) => {
            if (err) {
                // Limpiar temp si falla el move
                fs.unlink(file.path, () => {});
                reject(err);
            }
            resolve();
        });
    });

    return {
        name: `${photoName}.${type}`,
        path: finalPath
    };
};