import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError } from '../../shared/errors/index';
import { 
    BrandRow, 
    BrandPagedRow,
    CreateBrandDTO, 
    UpdateBrandDTO
} from '../../shared/types/index';
import {
    PaginationQuery,
    runPagedQuery
} from '../../shared/utils/index';

/**
 * Brand Service:
 * El servicio "brand" contiene la lógica de negocio para las operaciones relacionadas con las marcas,
 * incluyendo la creación, actualización, activación/desactivación y eliminación de marcas, así como
 * la recuperación de información sobre las marcas existentes en el sistema.
 */

/**
 * Helper interno:
 * 
 * @description - Ejecuta una acción específica (activar, desactivar o eliminar) sobre una marca identificada por su ID,
 * asegurando que la marca exista antes de intentar realizar la acción.
 * 
 * @param queryKey - La clave de la consulta a ejecutar para realizar la acción sobre la marca (definida en QUERIES).
 * @param id - El ID de la marca sobre la cual se realizará la acción.
 * @returns - Una promesa que se resuelve cuando la acción se completa.
 * 
 * @throws - NotFoundError si la marca no existe.
 */
const runBrandAction = async (
    queryKey: string,
    id: number
): Promise<void> => {
    await getBrandById(id); // verifica que existe

    await db.callFunction(queryKey, { id });
};

/**
 * @description - Obtiene una lista paginada de marcas disponibles en el sistema, con soporte para parámetros de paginación y filtrado.
 * 
 * @param query - Parámetros de paginación y filtrado para la consulta de marcas.
 * @returns - Una promesa que resuelve con la lista paginada de marcas.
 */
export const getAllBrands = (query: PaginationQuery) =>
    runPagedQuery<BrandPagedRow>(QUERIES.BRAND.GET_ALL_PAGED, query);

/**
 * @description - Obtiene la información de una marca específica por su ID, lanzando un error si la marca no existe.
 * 
 * @param id - El ID de la marca a recuperar.
 * @returns - Una promesa que resuelve con la información de la marca.
 */
export const getBrandById = async (id: number): Promise<BrandRow> => {
    const result = await db.callFunction<BrandRow>(
        QUERIES.BRAND.GET_ONE,
        { id },
        true
    );

    if (!result.length) {
        throw new NotFoundError('Brand not found', { id });
    }

    return result[0];
};

/**
 * @description - Crea una nueva marca en el sistema con la información proporcionada, devolviendo el ID de la marca creada.
 * 
 * @param data - DTO con la información necesaria para crear una nueva marca.
 * @returns - Una promesa que resuelve con el ID de la marca creada.
 */
export const createBrand = async (data: CreateBrandDTO): Promise<number> => {
    const result = await db.callFunction<{ fn_add_brand: number }>(
        QUERIES.BRAND.ADD,
        { name: data.name }
    );

    return result[0].fn_add_brand;
};

/**
 * @description - Actualiza la información de una marca existente identificada por su ID, asegurando que la marca exista 
 * antes de intentar actualizarla.
 * 
 * @param id - El ID de la marca a actualizar.
 * @param data - DTO con la información necesaria para actualizar la marca.
 */
export const updateBrand = async (
    id: number,
    data: UpdateBrandDTO
): Promise<void> => {
    await getBrandById(id);

    await db.callFunction(
        QUERIES.BRAND.EDIT,
        { id, name: data.name }
    );
};

/**
 * 
 * @param id - ID de la marca a activar, desactivar o eliminar.
 * @returns - Una promesa que resuelve cuando la acción se completa.
 */

export const activateBrand = (id: number) => runBrandAction(QUERIES.BRAND.ACTIVATE, id);

export const deactivateBrand = (id: number) => runBrandAction(QUERIES.BRAND.DEACTIVATE, id);

export const deleteBrand = (id: number) => runBrandAction(QUERIES.BRAND.DELETE, id);