import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError } from '../../shared/errors/index'
import { 
    CategoryRow,
    CategoryPagedRow,
    CreateCategoryDTO, 
    UpdateCategoryDTO
} from '../../shared/types/index';
import {
    PaginationQuery,
    runPagedQuery
} from '../../shared/utils/index';

/**
 * Category Service:
 * 
 * El servicio "category" contiene la lógica de negocio para las operaciones relacionadas con las categorías,
 * incluyendo la creación, actualización, activación/desactivación y eliminación de categorías, así como
 * la recuperación de información sobre las categorías existentes en el sistema.
 */

/**
 * Helper interno:
 * 
 * @description - Ejecuta una acción específica (activar, desactivar o eliminar) sobre una categoría identificada por su ID,
 * asegurando que la categoría exista antes de intentar realizar la acción.
 * 
 * @param queryKey - La clave de la consulta a ejecutar para realizar la acción sobre la categoría (definida en QUERIES).
 * @param id - El ID de la categoría sobre la cual se realizará la acción.
 * @returns - Una promesa que se resuelve cuando la acción se completa.
 * 
 * @throws - NotFoundError si la categoría no existe.
 */
const runCategoryAction = async (
    queryKey: string,
    id: number
): Promise<void> => {
    await getCategoryById(id); // verifica que existe

    await db.callFunction(queryKey, { id });
};

/**
 * @description - Obtiene una lista paginada de categorías disponibles en el sistema, con soporte para parámetros de paginación y filtrado.
 * 
 * @param query - Parámetros de paginación y filtrado para la consulta de categorías.
 * @returns - Una promesa que resuelve con la lista paginada de categorías.
 */
export const getAllCategories = (query: PaginationQuery) =>
    runPagedQuery<CategoryPagedRow>(QUERIES.CATEGORY.GET_ALL_PAGED, query);

/**
 * @description - Obtiene la información de una categoría específica por su ID, lanzando un error si la categoría no existe.
 * 
 * @param id - El ID de la categoría a recuperar.
 * @returns - Una promesa que resuelve con la información de la categoría.
 */
export const getCategoryById = async (id: number): Promise<CategoryRow> => {
    const result = await db.callFunction<CategoryRow>(
        QUERIES.CATEGORY.GET_ONE,
        { id },
        true
    );

    if (!result.length) {
        throw new NotFoundError('Category not found', { id });
    }

    return result[0];
};

/**
 * @description - Crea una nueva categoría en el sistema con la información proporcionada, devolviendo el ID de la categoría creada.
 * 
 * @param data - DTO con la información necesaria para crear una nueva categoría.
 * @returns - Una promesa que resuelve con el ID de la nueva categoría creada.
 */
export const createCategory = async (data: CreateCategoryDTO): Promise<number> => {
    const result = await db.callFunction<{ fn_add_category: number }>(
        QUERIES.CATEGORY.ADD,
        { name: data.name }
    );

    return result[0].fn_add_category;
};

/**
 * @description - Actualiza la información de una categoría existente identificada por su ID, asegurando que la categoría 
 * exista antes de intentar actualizarla.
 * 
 * @param id - El ID de la categoría a actualizar.
 * @param data - DTO con la información necesaria para actualizar la categoría.
 * @returns - Una promesa que se resuelve cuando la actualización se completa.
 */
export const updateCategory = async (
    id: number,
    data: UpdateCategoryDTO
): Promise<void> => {
    await getCategoryById(id);

    await db.callFunction(
        QUERIES.CATEGORY.EDIT,
        { id, name: data.name }
    );
};

/**
 * @description - Realiza una acción específica (activar, desactivar o eliminar) 
 * sobre una categoría identificada por su ID, asegurando que la categoría exista 
 * antes de intentar realizar la acción.
 * 
 * @param id - ID de la categoría a activar, desactivar o eliminar.
 * @returns - Una promesa que resuelve cuando la acción se completa.
 */

export const activateCategory = (id: number) => runCategoryAction(QUERIES.CATEGORY.ACTIVATE, id);

export const deactivateCategory = (id: number) => runCategoryAction(QUERIES.CATEGORY.DEACTIVATE, id);

export const deleteCategory = (id: number) => runCategoryAction(QUERIES.CATEGORY.DELETE, id);