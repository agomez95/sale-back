import db from '../database/connection';

/**
 * Pagination:
 * 
 * Funciones y tipos para manejar la paginación en las respuestas de la API.
 * Esto incluye el parseo de parámetros de consulta, el cálculo de offsets y la construcción
 * de metadatos de paginación para respuestas consistentes.
 * 
 */

// Tipado de los parámetros de consulta para paginación, con ambos campos opcionales.
export type PaginationQuery = {
    page?: string;
    limit?: string;
};

// Los tipos de paginación defininen la estructura de los parámetros de paginación, los metadatos y la respuesta paginada.
export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: PaginationMeta;
}

/**
 * Envio de parámetros de consulta para paginación, con valores por defecto y límites.
 * 
 * @param query - Objeto de consulta que puede contener los parámetros de paginación 'page' y 'limit' como strings.
 * @returns 
 */
export const parsePagination = (
    query: PaginationQuery
): PaginationParams => {
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10')));
    return { page, limit };
};

/**
 * Calculo del offset para consultas a la base de datos basado en la página y el límite.
 * El offset se utiliza para determinar desde qué registro comenzar a devolver resultados 
 * en una consulta paginada.
 * 
 * @param page 
 * @param limit 
 * @returns 
 */
export const getOffset = (page: number, limit: number): number => {
    return (page - 1) * limit;
};

/**
 * Construcción de los metatadatos de paginación que se incluirán en la respuesta de la API, 
 * calculando el total de páginas y si hay páginas siguientes o anteriores.
 * 
 * @param total 
 * @param page 
 * @param limit 
 * @returns 
 */
export const buildPaginationMeta = (
    total: number,
    page: number,
    limit: number
): PaginationMeta => {
    const totalPages = Math.ceil(total / limit);
    return {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
    };
};

/**
 * Construcción de la respuesta paginada que se enviará al cliente, 
 * incluyendo los datos solicitados y los metadatos de paginación.
 * 
 * @param data 
 * @param total 
 * @param page 
 * @param limit 
 * @returns 
 */
export const buildPaginatedResponse = <T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginatedResponse<T> => ({
    success: true,
    data,
    pagination: buildPaginationMeta(total, page, limit)
});

/**
 * La ejecución de una consulta paginada genérica desde la base de datos
 * centralizando así, la lógica de paginación en las distintas operaciones de este servicio
 * usando el parsing, offset ademas de la extración del total y la construcción de la respuesta.
 * 
 * @param queryKey - La clave de la consulta a ejecutar (definida en QUERIES).
 * @param query - Parámetros de consulta para paginación opcionales.
 * @param query.page - Número de página (opcional, por defecto 1).
 * @param query.limit - Cantidad de registros por página (opcional, por defecto 10).
 * @param extraParams - Parámetros adicionales a pasar a la consulta (opcional).
 * 
 * @returns - Una promesa que resuelve en una respuesta paginada, con los datos de los
 * solicitadso (sin el campo total) y la metadata de paginación.
 */
export const runPagedQuery = async <T extends { total: number | string }>(
    queryKey: string,
    query: PaginationQuery,
    extraParams?: Record<string, unknown>
): Promise<PaginatedResponse<Omit<T, 'total'>>> => {
    const { page, limit } = parsePagination(query);
    const offset = getOffset(page, limit);

    const rows = await db.callFunction<T>(
        queryKey,
        { limit, offset, ...extraParams },
        true
    );
    
    const total = rows.length > 0 ? Number(rows[0].total) : 0;
    const data = rows.map(({ total, ...row }) => row as Omit<T, 'total'>);

    return buildPaginatedResponse(data, total, page, limit);
}