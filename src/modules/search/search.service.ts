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

/**
 * Search Service:
 * 
 * El servicio "search" contiene la lógica de negocio para las operaciones relacionadas con la búsqueda de productos,
 * incluyendo la recuperación de productos por marca, subcategoría o producto específico, así como la obtención
 * de subcategorías que tienen especificaciones asociadas.
 * 
 * Este servicio se encarga de ejecutar las consultas necesarias para obtener la información requerida y construir
 * las respuestas adecuadas para cada caso de uso.
 */

// Definición de tipos específicos para este servicio
type SearchContext = 'brand' | 'subcategory' | 'product';

/**
 * Helper interno:
 * 
 * @description - Realiza la búsqueda de productos según el contexto (marca, subcategoría o producto) y el ID proporcionado,
 * ejecutando las consultas necesarias para obtener la información de los productos y sus especificaciones.
 * Primero obtiene el tipo de especificaciones asociadas al contexto (1), luego resuelve qué consultas ejecutar (2 y 3) 
 * y finalmente construye la lista de productos a partir de los resultados obtenidos de las consultas (4).
 * 
 * @param context - El contexto de la búsqueda (marca, subcategoría o producto).
 * @param id - El ID del contexto para el cual se realizará la búsqueda (ID de la marca, subcategoría o producto).
 * @returns - Una promesa que resuelve con la lista de productos encontrados o null si no se encuentran productos o el contexto es inválido.
 * 
 */
const searchProducts = async (context: SearchContext, id: number) => {
    // 1.
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

    // 2. 
    const queries = resolveQuery(context, specs);
    if (!queries) return null;

    // 3. 
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

    // 4. 
    const products = queries.secondQuery
        ? buildProductListWithTwoQueries(productsData, specsData, specs)
        : buildProductListWithOneQuery(productsData as unknown as VariantDetailRow[]);

    return products;
};

/**
 * @description - Obtiene una lista de productos asociados a una marca específica, identificada por su ID.
 * 
 * @param id - El ID de la marca para la cual se realizará la búsqueda de productos.
 * @returns - Una promesa que resuelve con la lista de productos encontrados o null si no se encuentran productos para la marca.
 */
export const getProductsByBrand = async (id: number) => {
    return searchProducts('brand', id);
};

/**
 * @description - Obtiene una lista de productos asociados a una subcategoría específica, identificada por su ID.
 * 
 * @param id - El ID de la subcategoría para la cual se realizará la búsqueda de productos.
 * @returns - Una promesa que resuelve con la lista de productos encontrados o null si no se encuentran productos para la subcategoría.
 */
export const getProductsBySubcategory = async (id: number) => {
    return searchProducts('subcategory', id);
};

/**
 * @description - Obtiene una lista de productos asociados a un producto específico, identificado por su ID.
 * 
 * @param id - El ID del producto para el cual se realizará la búsqueda.
 * @returns - Una promesa que resuelve con la lista de productos encontrados o null si no se encuentran productos para el producto.
 */
export const getProductsByProduct = async (id: number) => {
    return searchProducts('product', id);
};

/**
 * @description - Obtiene una lista de subcategorías que tienen especificaciones asociadas, incluyendo la información de las especificaciones.
 * 
 * @returns - Una promesa que resuelve con la lista de subcategorías con especificaciones o null si no se encuentran subcategorías con especificaciones.
 */
export const getSubcategoriesWithSpecs = async () => {
    const rows = await db.query<SubcatWithSpecRow>(
        QUERIES.SUBCATEGORY.WITH_SPECS
    );

    if (!rows.length) return null;

    return buildSubcategoryList(rows);
};