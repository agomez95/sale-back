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
    parsePagination,
    getOffset,
    buildPaginatedResponse,
    PaginatedResponse
} from '../../shared/utils/index';

// ─── Services ─────────────────────────────────────────

export const getAllBrands = async (
    query: { page?: string; limit?: string }
): Promise<PaginatedResponse<Omit<BrandPagedRow, 'total'>>> => {
    const { page, limit } = parsePagination(query);
    const offset = getOffset(page, limit);

    const rows = await db.callFunction<BrandPagedRow>(
        QUERIES.BRAND.GET_ALL_PAGED, 
        { limit, offset },
        true
    );

    const total = rows.length > 0 ? Number(rows[0].total) : 0;
    const data = rows.map(({ total, ...row }) => row);

    return buildPaginatedResponse(data, total, page, limit);
};

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

export const createBrand = async (data: CreateBrandDTO): Promise<number> => {
    const result = await db.callFunction<{ fn_add_brand: number }>(
        QUERIES.BRAND.ADD,
        { name: data.name }
    );

    return result[0].fn_add_brand;
};

export const updateBrand = async (
    id: number,
    data: UpdateBrandDTO
): Promise<void> => {
    await getBrandById(id); // verifica que existe

    await db.callFunction(
        QUERIES.BRAND.EDIT,
        { id, name: data.name }
    );
};

export const activateBrand = async (id: number): Promise<void> => {
    await getBrandById(id); // verifica que existe

    await db.callFunction(QUERIES.BRAND.ACTIVATE, { id });
};

export const deactivateBrand = async (id: number): Promise<void> => {
    await getBrandById(id); // verifica que existe

    await db.callFunction(QUERIES.BRAND.DEACTIVATE, { id });
};

export const deleteBrand = async (id: number): Promise<void> => {
    await getBrandById(id); // verifica que existe

    await db.callFunction(QUERIES.BRAND.DELETE, { id });
};