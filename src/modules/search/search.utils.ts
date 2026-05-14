import { QUERIES } from '../../shared/database/queries';
import {
    SpecTypeRow,
    SizColRow,
    ColRow,
    SizRow,
    SpecRow,
    VariantDetailRow,
    SubcatWithSpecRow
} from '../../shared/types/index';

// ─── Interfaces de salida ─────────────────────────────

interface VariantOutput {
    code: number;
    name: string;
    stock: number;
    cost: number;
    is_available: boolean;
    color?: string;
    size?: string;
    created_at: Date;
}

interface ProductOutput {
    name: string;
    code: number;
    description: string;
    long_description: string;
    brand: { id: number; name: string };
    category: { id: number; name: string };
    subcategory: { id: number; name: string };
    variants: VariantOutput[];
    specifications: { value: string }[];
}

interface SubcategorySpecOutput {
    id: number;
    name: string;
    specifications: {
        id: number;
        constant: string;
        constant_id: number;
        created_at: Date;
        modified_at: Date;
    }[];
}

// ─── QueryMap ─────────────────────────────────────────

type SearchType = 'brand' | 'subcategory' | 'product';

interface QueryPair {
    firstQuery: string;
    secondQuery?: string;
}

const QUERY_MAP: Record<SearchType, Record<number, QueryPair>> = {
    brand: {
        1: { firstQuery: QUERIES.SEARCH.COL_BRAND,              secondQuery: QUERIES.SEARCH.SPEC_BRAND },
        2: { firstQuery: QUERIES.SEARCH.SIZ_BRAND,              secondQuery: QUERIES.SEARCH.SPEC_BRAND },
        3: { firstQuery: QUERIES.SEARCH.SIZ_COL_BRAND,          secondQuery: QUERIES.SEARCH.SPEC_BRAND },
        4: { firstQuery: QUERIES.SEARCH.VARIANTS_DETAILS_BRAND  }
    },
    subcategory: {
        1: { firstQuery: QUERIES.SEARCH.COL_SUBCAT,             secondQuery: QUERIES.SEARCH.SPEC_SUBCAT },
        2: { firstQuery: QUERIES.SEARCH.SIZ_SUBCAT,             secondQuery: QUERIES.SEARCH.SPEC_SUBCAT },
        3: { firstQuery: QUERIES.SEARCH.SIZ_COL_SUBCAT,         secondQuery: QUERIES.SEARCH.SPEC_SUBCAT },
        4: { firstQuery: QUERIES.SEARCH.VARIANTS_DETAILS_SUBCAT }
    },
    product: {
        1: { firstQuery: QUERIES.SEARCH.COL_PRODUCT,            secondQuery: QUERIES.SEARCH.SPEC_PRODUCT },
        2: { firstQuery: QUERIES.SEARCH.SIZ_PRODUCT,            secondQuery: QUERIES.SEARCH.SPEC_PRODUCT },
        3: { firstQuery: QUERIES.SEARCH.SIZ_COL_PRODUCT,        secondQuery: QUERIES.SEARCH.SPEC_PRODUCT },
        4: { firstQuery: QUERIES.SEARCH.VARIANTS_DETAILS_PRODUCT }
    }
};

export const resolveQuery = (
    type: SearchType,
    specs: SpecTypeRow[]
): QueryPair | null => {
    const specType = specs[0].specification_type;

    if (specType === 0) return null; // sin specs

    return QUERY_MAP[type][specType] ?? null;
};

// ─── Transformación de productos ─────────────────────

type ProductRow = SizColRow | ColRow | SizRow;

const buildVariant = (
    row: ProductRow,
    specType: number
): VariantOutput => {
    const variant: VariantOutput = {
        code:         row.pro_variant_id,
        name:         row.pro_variant,
        stock:        row.pro_stock,
        cost:         Number(row.pro_cost),
        is_available: row.available,
        created_at:   row.creation_date
    };

    if (specType === 1 || specType === 3) variant.color = (row as ColRow).color;
    if (specType === 2 || specType === 3) variant.size  = (row as SizRow).size;

    return variant;
};

const buildProduct = (row: ProductRow): ProductOutput => ({
    name:             row.product,
    code:             row.pro_code,
    description:      row.pro_description,
    long_description: row.pro_long_description,
    brand: {
        id:   row.brand_code,
        name: row.brand
    },
    category: {
        id:   row.category_code,
        name: row.category
    },
    subcategory: {
        id:   row.subcategory_code,
        name: row.subcategory
    },
    variants:       [],
    specifications: []
});

const addVariantToProduct = (
    products: ProductOutput[],
    row: ProductRow,
    specType: number
): void => {
    let product = products.find(p => p.name === row.product);

    if (!product) {
        product = buildProduct(row);
        products.push(product);
    }

    product.variants.push(buildVariant(row, specType));
};

const addSpecsToProducts = (
    products: ProductOutput[],
    specsData: SpecRow[]
): void => {
    for (const row of specsData) {
        const product = products.find(p => p.code === row.pro_code);
        if (product && row.specification === 'TEXT') {
            const exists = product.specifications.find(s => s.value === row.value);
            if (!exists) {
                product.specifications.push({ value: row.value });
            }
        }
    }
};

export const buildProductListWithTwoQueries = (
    productsData: ProductRow[],
    specsData: SpecRow[],
    specs: SpecTypeRow[]
): ProductOutput[] => {
    const products: ProductOutput[] = [];
    const specType = specs[0].specification_type;

    for (const row of productsData) {
        addVariantToProduct(products, row, specType);
    }

    addSpecsToProducts(products, specsData);

    return products;
};

export const buildProductListWithOneQuery = (
    data: VariantDetailRow[]
): ProductOutput[] => {
    const products: ProductOutput[] = [];

    for (const row of data) {
        addVariantToProduct(products, row as unknown as ProductRow, 3);
    }

    addSpecsToProducts(products, data as unknown as SpecRow[]);

    return products;
};

// ─── Transformación de subcategorías ─────────────────

export const buildSubcategoryList = (
    rows: SubcatWithSpecRow[]
): SubcategorySpecOutput[] => {
    const subcategories: SubcategorySpecOutput[] = [];
    
    for (const row of rows) {
        let subcategory = subcategories.find(s => s.id === row.subcategory_id);

        if (!subcategory) {
            subcategory = {
                id:             row.subcategory_id,
                name:           row.subcategory,
                specifications: []
            };
            subcategories.push(subcategory);
        }

        if (row.specification_id) {
            subcategory.specifications.push({
                id:          row.specification_id,
                constant:    row.specification,
                constant_id: row.specification_constant_id,
                created_at:  row.created_at,
                modified_at: row.modified_at
            });
        }
    }

    return subcategories;
};