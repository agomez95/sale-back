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
    parsePagination,
    getOffset,
    buildPaginatedResponse,
    PaginatedResponse
} from '../../shared/utils/index';

// ─── Services ─────────────────────────────────────────

export const getAllProducts = async (
    query: { page?: string; limit?: string }
): Promise<PaginatedResponse<Omit<ProductPagedRow, 'total'>>> => {
    const { page, limit } = parsePagination(query);
    const offset = getOffset(page, limit);

    const rows = await db.callFunction<ProductPagedRow>(
        QUERIES.PRODUCT.GET_ALL_PAGED, 
        { limit, offset },
        true
    );

    const total = rows.length > 0 ? Number(rows[0].total) : 0;
    const data = rows.map(({ total, ...row }) => row);

    return buildPaginatedResponse(data, total, page, limit);
}

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

export const createProduct = async (data: CreateProductDTO): Promise<number> => {
    // Verifica que subcategoría y marca existen
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

export const activateProduct = async (id: number): Promise<void> => {
    await getProductById(id);
    await db.callFunction(QUERIES.PRODUCT.ACTIVATE, { id });
};

export const deactivateProduct = async (id: number): Promise<void> => {
    await getProductById(id);
    await db.callFunction(QUERIES.PRODUCT.DEACTIVATE, { id });
};