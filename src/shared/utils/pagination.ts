/**
 * Pagination:
 * 
 * Funciones y tipos para manejar la paginación en las respuestas de la API.
 * Esto incluye el parseo de parámetros de consulta, el cálculo de offsets y la construcción
 * de metadatos de paginación para respuestas consistentes.
 * 
 */

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

// Envio de parámetros de consulta para paginación, con valores por defecto y límites.
export const parsePagination = (
    query: { page?: string; limit?: string }
): PaginationParams => {
    const page = Math.max(1, parseInt(query.page || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10')));
    return { page, limit };
};

// Calculo del offset para consultas a la base de datos basado en la página y el límite.
export const getOffset = (page: number, limit: number): number => {
    return (page - 1) * limit;
};

// Construcción de los metatadatos de paginación que se incluirán en la respuesta de la API, calculando el total de páginas y si hay páginas siguientes o anteriores.
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

// Construcción de la respuesta paginada 
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