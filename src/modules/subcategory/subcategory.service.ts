import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError } from '../../shared/errors/index';
import { getCategoryById } from '../category/category.service';
import { 
    SubcategoryPagedRow,
    SubcategoryDetailRow,
    CreateSubcategoryDTO,
    UpdateSubcategoryDTO
} from '../../shared/types/index';
import {
    PaginationQuery,
    runPagedQuery
} from '../../shared/utils/index';

/**
 * Subcategory Service:
 * 
 * El servicio "subcategory" contiene la lógica de negocio para las operaciones relacionadas con las subcategorías,
 * incluyendo la creación, activación/desactivación y recuperación de información sobre las subcategorías existentes en el sistema.
 */

/**
 * Helper interno:
 * 
 * @description - Ejecuta una acción específica (activar, desactivar o eliminar) sobre una subcategoría identificada por su ID,
 * asegurando que la subcategoría exista antes de intentar realizar la acción.
 * 
 * @param queryKey - La clave de la consulta a ejecutar para realizar la acción sobre la subcategoría (definida en QUERIES).
 * @param id - El ID de la subcategoría sobre la cual se realizará la acción.
 */
const runSubcategoryAction = async (
    queryKey: string,
    id: number
): Promise<void> => {
    await getSubcategoryById(id);

    await db.callFunction(queryKey, { id });
}

/**
 * @description - Obtiene una lista paginada de subcategorías disponibles en el sistema, con soporte para parámetros de paginación 
 * y filtrado.
 * 
 * @param query - Parámetros de paginación y filtrado para la consulta de subcategorías.
 * @returns - Una promesa que resuelve con la lista paginada de subcategorías.
 */
export const getAllSubcategories = (query: PaginationQuery) =>
    runPagedQuery<SubcategoryPagedRow>(QUERIES.SUBCATEGORY.GET_ALL_PAGED, query);

/**
 * @description - Obtiene la información de una subcategoría específica por su ID, lanzando un error si la subcategoría no existe.
 * 
 * @param id  - El ID de la subcategoría a recuperar.
 * @returns - Una promesa que resuelve con la información de la subcategoría.
 * @throws NotFoundError si la subcategoría no existe.
 */
export const getSubcategoryById = async (id: number): Promise<SubcategoryDetailRow> => {
    const result = await db.callFunction<SubcategoryDetailRow>(
        QUERIES.SUBCATEGORY.GET_ONE,
        { id },
        true
    );

    if (!result.length) {
        throw new NotFoundError('Subcategory not found', { id });
    }

    return result[0];
};

/**
 * @description - Crea una nueva subcategoría en el sistema.
 * Antes de crear la subcategoría, se verifica que la categoría asociada exista en el sistema.
 * 
 * @param data - DTO con la información necesaria para crear una nueva subcategoría.
 * @returns - Una promesa que resuelve con el ID de la nueva subcategoría creada.
 */
export const createSubcategory = async (data: CreateSubcategoryDTO): Promise<number> => {
    await getCategoryById(data.category_id);

    const result = await db.callFunction<{ fn_add_subcategory: number }>(
        QUERIES.SUBCATEGORY.ADD,
        { name: data.name, category_id: data.category_id }
    );

    return result[0].fn_add_subcategory;
};

/**
 * @description - Actualiza la información de una subcategoría específica por su ID.
 * Antes de actualizar la subcategoría, se verifica que la subcategoría a actualizar exista y que la categoría asociada exista en el sistema.
 * 
 * @param id - El ID de la subcategoría a actualizar.
 * @param data - DTO con la información actualizada de la subcategoría.
 * @returns - Una promesa que resuelve cuando la actualización se completa.
 */
export const updateSubcategory = async (
    id: number,
    data: UpdateSubcategoryDTO
): Promise<void> => {
    await getSubcategoryById(id);
    await getCategoryById(data.category_id);

    await db.callFunction(
        QUERIES.SUBCATEGORY.EDIT,
        { id, name: data.name, category_id: data.category_id }
    );
};

/**
 * @description - Realiza una acción (activar, desactivar o eliminar) sobre una subcategoría específica por su ID.
 * Antes de realizar la acción, se verifica que la subcategoría exista en el sistema.
 * 
 * @param id - El ID de la subcategoría sobre la cual se realizará la acción.
 * @returns - Una promesa que resuelve cuando la acción se completa.
 */

export const activateSubcategory = (id: number): Promise<void> => runSubcategoryAction(QUERIES.SUBCATEGORY.ACTIVATE, id);

export const deactivateSubcategory = (id: number): Promise<void> => runSubcategoryAction(QUERIES.SUBCATEGORY.DEACTIVATE, id);

export const deleteSubcategory = (id: number): Promise<void> => runSubcategoryAction(QUERIES.SUBCATEGORY.DELETE, id);