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
    parsePagination,
    getOffset,
    buildPaginatedResponse,
    PaginatedResponse
} from '../../shared/utils/index';

// ─── Services ─────────────────────────────────────────

export const getAllSubcategories = async (
    query: { page?: string; limit?: string }
): Promise<PaginatedResponse<Omit<SubcategoryPagedRow, 'total'>>> => {
    const { page, limit } = parsePagination(query);
    const offset = getOffset(page, limit);

    const rows = await db.callFunction<SubcategoryPagedRow>(
        QUERIES.SUBCATEGORY.GET_ALL_PAGED, 
        { limit, offset },
        true
    );
    
    const total = rows.length > 0 ? Number(rows[0].total) : 0;
    const data = rows.map(({ total, ...row }) => row);

    return buildPaginatedResponse(data, total, page, limit);
};

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

export const createSubcategory = async (data: CreateSubcategoryDTO): Promise<number> => {
    // Verifica que la categoría existe antes de crear
    await getCategoryById(data.category_id);

    const result = await db.callFunction<{ fn_add_subcategory: number }>(
        QUERIES.SUBCATEGORY.ADD,
        { name: data.name, category_id: data.category_id }
    );

    return result[0].fn_add_subcategory;
};

export const updateSubcategory = async (
    id: number,
    data: UpdateSubcategoryDTO
): Promise<void> => {
    await getSubcategoryById(id);

    // Verifica que la nueva categoría existe
    await getCategoryById(data.category_id);

    await db.callFunction(
        QUERIES.SUBCATEGORY.EDIT,
        { id, name: data.name, category_id: data.category_id }
    );
};

export const activateSubcategory = async (id: number): Promise<void> => {
    await getSubcategoryById(id);

    await db.callFunction(QUERIES.SUBCATEGORY.ACTIVATE, { id });
};

export const deactivateSubcategory = async (id: number): Promise<void> => {
    await getSubcategoryById(id);

    await db.callFunction(QUERIES.SUBCATEGORY.DEACTIVATE, { id });
};

export const deleteSubcategory = async (id: number): Promise<void> => {
    await getSubcategoryById(id);

    await db.callFunction(QUERIES.SUBCATEGORY.DELETE, { id });
};