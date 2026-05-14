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
    parsePagination,
    getOffset,
    buildPaginatedResponse,
    PaginatedResponse
} from '../../shared/utils/index';

// ─── Services ─────────────────────────────────────────

export const getAllCategories = async (
    query: { page?: string; limit?: string }
): Promise<PaginatedResponse<Omit<CategoryPagedRow, 'total'>>> => {
    const { page, limit } = parsePagination(query);
    const offset = getOffset(page, limit);

    const rows = await db.callFunction<CategoryPagedRow>(
        QUERIES.CATEGORY.GET_ALL_PAGED,
        { limit, offset },
        true
    );

    const total = rows.length > 0 ? Number(rows[0].total) : 0;
    const data = rows.map(({ total, ...row }) => row);

    return buildPaginatedResponse(data, total, page, limit);
};

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

export const createCategory = async (data: CreateCategoryDTO): Promise<number> => {
    const result = await db.callFunction<{ fn_add_category: number }>(
        QUERIES.CATEGORY.ADD,
        { name: data.name }
    );

    return result[0].fn_add_category;
};

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

export const activateCategory = async (id: number): Promise<void> => {
    await getCategoryById(id);

    await db.callFunction(QUERIES.CATEGORY.ACTIVATE, { id });
};

export const deactivateCategory = async (id: number): Promise<void> => {
    await getCategoryById(id);

    await db.callFunction(QUERIES.CATEGORY.DEACTIVATE, { id });
};

export const deleteCategory = async (id: number): Promise<void> => {
    await getCategoryById(id);

    await db.callFunction(QUERIES.CATEGORY.DELETE, { id });
};