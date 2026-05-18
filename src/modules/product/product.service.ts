import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError } from '../../shared/errors/index';
import { getSubcategoryById } from '../subcategory/subcategory.service';
import { getBrandById } from '../brand/brand.service';
import { 
    ProductDetailRow, 
    ProductPagedRow,
    CreateProductDTO 
} from '../../shared/types/index';
import {
    PaginationQuery,
    runPagedQuery
} from '../../shared/utils/index';

/**
 * Product Service:
 * 
 * El servicio "product" contiene la lógica de negocio para las operaciones relacionadas con los productos,
 * incluyendo la creación, activación/desactivación y recuperación de información sobre los productos existentes en el sistema.
 */

/**
 * Helper interno:
 * 
 * @description - Ejecuta una acción específica (activar, desactivar o eliminar) sobre un producto identificado por su ID,
 * asegurando que el producto exista antes de intentar realizar la acción.
 * 
 * @param queryKey - La clave de la consulta a ejecutar para realizar la acción sobre el producto (definida en QUERIES).
 * @param id - El ID del producto sobre el cual se realizará la acción.
 * @returns Una promesa que se resuelve cuando la acción se completa.
 * 
 * @throws NotFoundError si el producto no existe.
 */
const runProductAction = async (
    queryKey: string,
    id: number
): Promise<void> => {
    await getProductById(id); 

    await db.callFunction(queryKey, { id });
}

/**
 * @description - Obtiene una lista paginada de productos disponibles en el sistema, con soporte para parámetros de paginación y filtrado.
 * 
 * @param query - Parámetros de paginación y filtrado para la consulta de productos.
 * @returns - Una promesa que resuelve con la lista paginada de productos.
 */
export const getAllProducts = (query: PaginationQuery) =>
    runPagedQuery<ProductPagedRow>(QUERIES.PRODUCT.GET_ALL_PAGED, query);

/**
 * @description -  Obtiene la información de un producto específico por su ID, lanzando un error si el producto no existe.
 * 
 * @param id - El ID del producto a recuperar.
 * @returns - Una promesa que resuelve con la información del producto.
 */
export const getProductById = async (id: number): Promise<ProductDetailRow> => {
    const result = await db.callFunction<ProductDetailRow>(
        QUERIES.PRODUCT.GET_ONE,
        { id },
        true
    );

    if (!result.length) {
        throw new NotFoundError('Product not found', { id });
    }

    return result[0];
};

/**
 * @description -  Crea un nuevo producto en el sistema con la información proporcionada, devolviendo el ID del producto creado.
 * Antes de crear el producto, se verifica que la subcategoría y la marca asociadas existan en el sistema.
 *
 * @param data - DTO con la información necesaria para crear un nuevo producto.
 * @returns - Una promesa que resuelve con el ID del nuevo producto creado.
 */
export const createProduct = async (data: CreateProductDTO): Promise<number> => {
    await getSubcategoryById(data.subcategory_id); 
    await getBrandById(data.brand_id); 

    const result = await db.callFunction<{ fn_add_product: number }>(
        QUERIES.PRODUCT.ADD,
        {
            name:             data.name,
            description:      data.description,
            long_description: data.long_description,
            subcategory_id:   data.subcategory_id,
            brand_id:         data.brand_id
        }
    );

    return result[0].fn_add_product;
};

/**
 * @description - Activa o desactiva un producto en el sistema.
 * 
 * @param id - ID del producto a activar o desactivar.
 * @returns - Una promesa que resuelve cuando la acción se completa.
 */

export const activateProduct = (id: number): Promise<void> => runProductAction(QUERIES.PRODUCT.ACTIVATE, id);

export const deactivateProduct = (id: number): Promise<void> => runProductAction(QUERIES.PRODUCT.DEACTIVATE, id);