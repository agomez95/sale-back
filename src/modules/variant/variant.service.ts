import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError } from '../../shared/errors/index';
import { getProductById } from '../product/product.service';
import { 
    CreateVariantDTO, 
    CreateVariantSpecValDTO 
} from '../../shared/types/index';

/**
 * Variant Service:
 * 
 * El servicio "variant" contiene la lógica de negocio para las operaciones relacionadas con las variantes de productos,
 * incluyendo la creación, activación/desactivación y eliminación de variantes, así como la asociación de valores de especificación a las variantes. 
 */

/**
 * Helper interno:
 * 
 * @description - Verifica la existencia de una variante por su ID, lanzando un error si la variante no existe.
 * 
 * @param id - El ID de la variante a verificar.
 * @returns Una promesa que se resuelve si la variante existe, o se rechaza con un NotFoundError si no existe.
 * 
 * @throws NotFoundError si la variante no existe.
 */
const variantExists = async (id: number): Promise<void> => {
    const result = await db.query<{ fn_variant_exist: boolean }>(
        QUERIES.VARIANT.EXISTS,
        [id]
    );

    if (!result[0].fn_variant_exist) {
        throw new NotFoundError('Variant not found', { id });
    }
};

/**
 * Helper interno:
 * 
 * @description - Ejecuta una acción específica (activar, desactivar o eliminar) sobre una variante identificada por su ID,
 * asegurando que la variante exista antes de intentar realizar la acción. Además, permite ejecutar una acción adicional
 * antes de realizar la acción principal (por ejemplo, eliminar asociaciones).
 * 
 * @param queryKey - La clave de la consulta a ejecutar para realizar la acción sobre la variante (definida en QUERIES).
 * @param id - El ID de la variante sobre la cual se realizará la acción.
 * @param beforeAction - Una función opcional que se ejecutará antes de realizar la acción principal
 * @returns Una promesa que se resuelve cuando la acción se completa.
 */
const runVariantAction = async (
    queryKey: string,
    id: number,
    beforeAction?: () => Promise<unknown> // el unknown si y el any no porque no nos importa el resultado, solo que se ejecute antes de la acción principal y sea verificado
): Promise<void> => {
    await variantExists(id);
    if (beforeAction) await beforeAction();
    await db.callFunction(queryKey, { id });
};

/**
 * @description - Crear una nueva variante de producto, asegurando que el producto asociado exista antes de crear la variante.
 * 
 * @param data - Un objeto que contiene la información necesaria para crear la variante, incluyendo el nombre, stock, costo y el ID del producto al que pertenece.
 * @returns Una promesa que se resuelve con el ID de la variante creada.
 */
export const createVariant = async (data: CreateVariantDTO): Promise<number> => {
    await getProductById(data.product_id);

    const result = await db.callFunction<{ fn_add_variant: number }>(
        QUERIES.VARIANT.ADD,
        {
            name: data.name,
            stock: data.stock,
            cost: data.cost,
            product_id: data.product_id
        }
    );

    return result[0].fn_add_variant;
};

/**
 * @description - Crea una asociación entre una variante y un valor de especificación, asegurando que la variante 
 * exista antes de crear la asociación.
 * 
 * @param data - Un objeto que contiene el ID de la variante y el ID del valor de especificación a asociar.
 * @returns - Una promesa que se resuelve con el ID de la asociación creada entre la variante y el valor de especificación.
 */
export const createVariantSpecVal = async (
    data: CreateVariantSpecValDTO
): Promise<number> => {
    await variantExists(data.variant_id);

    const result = await db.callFunction<{ fn_add_variant_spec_val: number }>(
        QUERIES.VARIANT.ADD_SPEC_VAL,
        {
            variant_id: data.variant_id,
            specification_value_id: data.specification_value_id
        }
    );

    return result[0].fn_add_variant_spec_val;
};

/**
 * @description - Realiza la accion solicitada sobre una variante del sistema, asegurando que la variante exista antes 
 * de intentar eliminarla.
 * 
 * @param id - El ID de la variante sobre la cual se realizará la acción (activar, desactivar o eliminar).
 * @returns - Una promesa que se resuelve cuando la acción se completa.
 * 
 */

export const deleteVariant = (id: number) => runVariantAction(QUERIES.VARIANT.DELETE, id, () => db.callFunction(QUERIES.VARIANT.DEL_SPEC_VAL, { id }));
export const activateVariant = (id: number) => runVariantAction(QUERIES.VARIANT.ACTIVATE, id);
export const deactivateVariant = (id: number) => runVariantAction(QUERIES.VARIANT.DEACTIVATE, id);
