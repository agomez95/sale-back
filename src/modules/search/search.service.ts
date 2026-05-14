import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import {
    SpecTypeRow,
    SubcatWithSpecRow,
    SizColRow,
    ColRow,
    SizRow,
    SpecRow,
    VariantDetailRow
} from '../../shared/types/index';
import {
    resolveQuery,
    buildProductListWithTwoQueries,
    buildProductListWithOneQuery,
    buildSubcategoryList
} from './search.utils';

type SearchContext = 'brand' | 'subcategory' | 'product';

const searchProducts = async (context: SearchContext, id: number) => {
    // 1. Obtener tipo de specs
    const specsQuery = {
        brand:       QUERIES.SEARCH.SPECS_BRAND,
        subcategory: QUERIES.SEARCH.SPECS_SUBCAT,
        product:     QUERIES.SEARCH.SPECS_PRODUCT
    }[context];

    const specs = await db.query<SpecTypeRow>(
        `SELECT ${specsQuery}($1)`,
        [id]
    );

    if (!specs.length) return null;

    // 2. Resolver qué queries ejecutar
    const queries = resolveQuery(context, specs);
    if (!queries) return null;

    // 3. Ejecutar queries
    const productsData = await db.query<SizColRow | ColRow | SizRow>(
        `SELECT ${queries.firstQuery}($1)`,
        [id]
    );

    let specsData: SpecRow[] = [];
    if (queries.secondQuery) {
        specsData = await db.query<SpecRow>(
            `SELECT ${queries.secondQuery}($1)`,
            [id]
        );
    }

    // 4. Construir lista de productos
    const products = queries.secondQuery
        ? buildProductListWithTwoQueries(productsData, specsData, specs)
        : buildProductListWithOneQuery(productsData as unknown as VariantDetailRow[]);

    return products;
};

export const getProductsByBrand = async (id: number) => {
    return searchProducts('brand', id);
};

export const getProductsBySubcategory = async (id: number) => {
    return searchProducts('subcategory', id);
};

export const getProductsByProduct = async (id: number) => {
    return searchProducts('product', id);
};

export const getSubcategoriesWithSpecs = async () => {
    const rows = await db.query<SubcatWithSpecRow>(
        QUERIES.SUBCATEGORY.WITH_SPECS
    );

    if (!rows.length) return null;

    return buildSubcategoryList(rows);
};