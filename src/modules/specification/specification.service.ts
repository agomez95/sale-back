import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { NotFoundError } from '../../shared/errors/index';
import { getSubcategoryById } from '../subcategory/subcategory.service';
import { CreateSpecDTO, CreateSpecValueDTO } from '../../shared/types/index';

/**
 * Specification Service:
 * 
 * El servicio "specification" contiene la lógica de negocio para las operaciones relacionadas con las especificaciones de productos,
 * incluyendo la creación, activación/desactivación y recuperación de información sobre las especificaciones existentes en el sistema.
 * 
 * Este servicio se encarga de ejecutar las consultas necesarias para obtener la información requerida y construir
 * las respuestas adecuadas para cada caso de uso.
 */

/**
 * Helper interno:
 * 
 * @description - Verifica la existencia de una especificación o valor de especificación antes de realizar una acción sobre 
 * ella (activar, desactivar, eliminar).
 * Si la especificación o valor de especificación no existe, lanza un error NotFoundError con un mensaje adecuado.
 * 
 * @param queryKey - La clave de la consulta a ejecutar para verificar la existencia de la especificación o valor de especificación (definida en QUERIES).
 * @param resultKey - La clave del resultado devuelto por la consulta que indica si la especificación o valor de especificación existe.
 * @param id - El ID de la especificación o valor de especificación a verificar.
 * @param label - La etiqueta descriptiva para el mensaje de error en caso de que la especificación o valor de especificación no exista.
 * @returns - Una promesa que se resuelve si la especificación o valor de especificación existe, o se rechaza con un NotFoundError si no existe.
 * 
 * @throws - NotFoundError si la especificación o valor de especificación no existe.
 */
const checkExists = async (
    queryKey: string,
    resultKey: string,
    id: number,
    label: string
): Promise<void> => {
    const result = await db.query<Record<string, boolean>>(queryKey, [id]);

    if (!result[0][resultKey]) {
        throw new NotFoundError(`${label} not found`, { id });
    }
};

/**
 * Helpers internos: 
 * 
 * @description - Funciones específicas para verificar la existencia de una especificación o valor de especificación, y para ejecutar acciones sobre ellos (activar, desactivar).
 * Estas funciones utilizan el helper genérico checkExists para realizar la verificación y luego ejecutan la acción correspondiente si la verificación es exitosa.
 * 
 * @param id - El ID de la especificación o valor de especificación sobre el cual se realizará la acción.
 * @returns - Una promesa que se resuelve cuando la acción se completa, o se rechaza con un NotFoundError si la especificación o valor de especificación no existe.
 */
const specExists = (id: number) => checkExists(QUERIES.SPECIFICATION.EXISTS, 'fn_spec_exist', id, 'Specification');
const specValueExists = (id: number) => checkExists(QUERIES.SPECIFICATION.EXISTS_VAL, 'fn_spec_val_exist', id, 'Specification value');

/**
 * Helper interno:
 * 
 * @description - Ejecuta una acción específica (activar, desactivar o eliminar) sobre una especificación o valor de especificación 
 * identificado por su ID, asegurando que la especificación o valor de especificación exista antes de intentar realizar la acción.
 * 
 * @param existsFn - La función de verificación de existencia a utilizar para verificar la existencia de la especificación o valor de especificación (specExists o specValueExists).
 * @param actionKey - La clave de la consulta a ejecutar para realizar la acción sobre la especificación o valor de especificación (definida en QUERIES).
 * @param id - El ID de la especificación o valor de especificación sobre el cual se realizará la acción.
 */
const runSpecAction = async (
    existsFn: (id: number) => Promise<void>,
    actionKey: string,
    id: number
): Promise<void> => {
    await existsFn(id);
    await db.callFunction(actionKey, { id });
};

/**
 * @description - Crea una nueva especificación en el sistema con la información proporcionada, devolviendo el ID de la 
 * especificación creada.
 * Antes de crear la especificación, se verifica que la subcategoría asociada exista en el sistema.
 * 
 * @param data - DTO con la información necesaria para crear una nueva especificación.
 * @returns - Una promesa que resuelve con el ID de la nueva especificación creada.
 */
export const createSpec = async (data: CreateSpecDTO): Promise<number> => {
    await getSubcategoryById(data.subcategory_id);

    const result = await db.callFunction<{ fn_add_spec: number }>(
        QUERIES.SPECIFICATION.ADD,
        {
            specification_constant_id: data.specification_constant_id,
            subcategory_id: data.subcategory_id
        }
    );

    return result[0].fn_add_spec;
};

/**
 * Crea un nuevo valor de especificación en el sistema con la información proporcionada, devolviendo el ID del valor de especificación creado.
 * Antes de crear el valor de especificación, se verifica que la especificación asociada exista en el sistema.
 * 
 * @param data - DTO con la información necesaria para crear un nuevo valor de especificación.
 * @returns - Una promesa que resuelve con el ID del nuevo valor de especificación creado.
 */
export const createSpecValue = async (data: CreateSpecValueDTO): Promise<number> => {
    await specExists(data.specification_id);

    const result = await db.callFunction<{ fn_add_spec_val: number }>(
        QUERIES.SPECIFICATION.ADD_VAL,
        {
            value: data.value,
            specification_id: data.specification_id
        }
    );

    return result[0].fn_add_spec_val;
};

/**
 * Ejecuta una acción específica (activar o desactivar) sobre una especificación o valor de especificación identificado por su ID,
 * asegurando que la especificación o valor de especificación exista antes de intentar realizar la acción.
 * 
 * @param id - El ID de la especificación o valor de especificación a activar o desactivar.
 * @returns - Una promesa que resuelve cuando la acción se completa, o se rechaza con un NotFoundError si la especificación o valor de especificación no existe.
 */
export const activateSpec = (id: number) => runSpecAction(specExists, QUERIES.SPECIFICATION.ACTIVATE, id);
export const deactivateSpec = (id: number) => runSpecAction(specExists, QUERIES.SPECIFICATION.DEACTIVATE, id);
export const activateSpecValue = (id: number) => runSpecAction(specValueExists, QUERIES.SPECIFICATION.ACT_VAL, id);
export const deactivateSpecValue = (id: number) => runSpecAction(specValueExists, QUERIES.SPECIFICATION.DEACT_VAL, id);