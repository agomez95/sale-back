import { QueryResultRow } from 'pg';

/**
 * Logger Context:
 * Intefaz que define la estructura del objeto de contexto que se pasará al logger en cada petición.
 * Permite incluir información relevante como método, ruta, status code, duración, etc.
 * Además, al tener un índice de tipo [key: string]: unknown, se pueden agregar campos personalizados según la necesidad de cada log.
 * Esto ayuda a mantener un formato consistente en los logs y facilita la depuración y monitoreo de la aplicación.
 */
export interface LogContext {
    method?: string;
    path?: string;
    statusCode?: number;
    duration?: number;
    stack?: string;
    [key: string]: unknown; // ← Permite cualquier campo extra
}

/**
 * ApiResponse:
 * Interfaz genérica para estandarizar las respuestas de la API.
 * Incluye un campo 'success' para indicar si la operación fue exitosa
 * Un campo opcional 'data' que puede contener cualquier tipo de datos (definido por el tipo genérico T)
 * Un campo opcional 'message' para mensajes adicionales.
 * Al usar una interfaz genérica, se puede reutilizar esta estructura para diferentes tipos de respuestas en toda la aplicación
 * Manteniendo la consistencia y facilitando el manejo de las respuestas en el frontend.
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
}

/**
 * BaseRow:
 * Interfaz base que extiende QueryResultRow de 'pg' y define los campos comunes a todas las tablas de la base de datos.
 * Incluye un campo 'id' como número, un campo 'state' para indicar si el registro está activo o no, y campos de fecha 'created_at' y 'modified_at'.
 * Al extender QueryResultRow, se asegura que todas las filas obtenidas de la base de datos tengan esta estructura básica, lo que facilita el manejo de los datos en la aplicación.
 * Cada tabla específica (Brand, Category, Product, etc.) puede extender esta interfaz para incluir campos adicionales específicos de esa entidad.
 */
export interface BaseRow extends QueryResultRow {
    id: number;
    state: boolean;
    created_at: Date;
    modified_at: Date;
}

/**
 * Tablas y DTOs:
 * A continuacion se definen las interfaces específicas para cada tabla de la base de datos, DTOs y operaciones de adicion y/o actualización.
 * Cada interfaz de fila (Row) se extiende de BaseRow para la inclusion de campos comunes y luego se agregan los especificos de cada entidad.
 * Los DTOs (CreateBrandDTO, UpdateBrandDTO, etc.) definen la estructura de los datos que se esperan recibir en las operaciones de creación y actualización, lo que ayuda a validar y tipar correctamente los datos en los servicios y controladores.
 */

// ─── Brand ─────────────────────────────────────────────
// FN_GET_BRAND retornan:
export interface BrandDetailRow extends QueryResultRow {
    id: number;
    name: string;
    state: boolean;
    created_at: Date; // viene como DATE de postgres
}

// DTOs para Brand
export interface CreateBrandDTO {
    name: string;
}

export interface UpdateBrandDTO {
    name: string;
}

// ─── Category ─────────────────────────────────────────────
// Table: PRO_categorys
// FN_GET_CATEGORY retornan:
export interface CategoryDetailRow extends QueryResultRow {
    id: number;
    name: string;
    state: boolean;
    created_at: Date;
}

export interface CreateCategoryDTO {
    name: string;
}

export interface UpdateCategoryDTO {
    name: string;
}

// ─── Subcategory ──────────────────────────────────────────
// Table: PRO_subcategorys
// FN_GET_SUBCATEGORY retorna (con category_id):
export interface SubcategoryDetailRow extends QueryResultRow {
    id: number;
    name: string;
    category: string;
    category_id: number;    // PRO_category_id
    state: boolean;
    created_at: Date;
}

export interface CreateSubcategoryDTO {
    name: string;
    category_id: number;
}

export interface UpdateSubcategoryDTO {
    name: string;
    category_id: number;
}

// ─── Product ──────────────────────────────────────────────
// Table: products
export interface ProductDetailRow extends QueryResultRow {
    id:               number;
    name:             string;
    description:      string;
    long_description: string;
    state:            boolean;
    created_at:       Date;
    subcategory_id:   number;
    subcategory:      string;
    brand_id:         number;
    brand:            string;
    category_id:      number;
    category:         string;
}

export interface CreateProductDTO {
    name: string;
    description: string;
    long_description: string;
    subcategory_id: number;
    brand_id: number;
}

// ─── Variant ──────────────────────────────────────────────
// Table: PRO_variants
export interface VariantRow extends QueryResultRow {
    id: number;
    name: string;
    stock: number;
    cost: number;
    is_available: boolean;
    state: boolean;
    created_at: Date;
    modified_at: Date;
    pro_id: number;         // FK → products.id
}

export interface CreateVariantDTO {
    name: string;
    stock: number;
    cost: number;
    product_id: number;
}

// ─── Specification ────────────────────────────────────────
// Table: PRO_specifications
export interface SpecificationRow extends QueryResultRow {
    id: number;
    state: boolean;
    created_at: Date;
    modified_at: Date;
    specification_constant_id: number;
    pro_subcategory_id: number;
}

export interface CreateSpecDTO {
    specification_constant_id: number;
    subcategory_id: number;
}

// Table: PRO_specification_values
export interface SpecificationValueRow extends QueryResultRow {
    id: number;
    value: string;
    state: boolean;
    created_at: Date;
    modified_at: Date;
    pro_specification_id: number;
}

export interface CreateSpecValueDTO {
    value: string;
    specification_id: number;
}

// ─── Variant Specification Values ─────────────────────────
// Table: PRO_variant_specification_values
export interface VariantSpecValRow extends QueryResultRow {
    id: number;
    state: boolean;
    created_at: Date;
    modified_at: Date;
    pro_variant_id: number;
    pro_specification_value_id: number;
}

export interface CreateVariantSpecValDTO {
    variant_id: number;
    specification_value_id: number;
}

/**
 * Photo:
 * Definición de las interfaces relacionadas con la gestión de fotos de productos, incluyendo la tabla principal PRO_photos, sus atributos y almacenamiento.
 * La interfaz PhotoRow representa la estructura de una foto en la base de datos, incluyendo su relación con los atributos y el almacenamiento.
 * La interfaz PhotoAttributeRow define los atributos específicos de una foto, como tamaño, dimensiones y tipo.
 * La interfaz PhotoStorageRow describe la información de almacenamiento de la foto, como la ruta donde se encuentra almacenada.
 * Los DTOs (AddPhotoDTO y UploadPhotoDTO) definen la estructura de los datos necesarios para agregar una nueva foto o subir una foto existente a un producto, facilitando la validación y el manejo de estos datos en los servicios correspondientes.
 */

// Table: PRO_photos + PRO_photo_attributes + PRO_photo_storage
export interface PhotoRow extends QueryResultRow {
    id: number;
    name: string;
    pro_photo_attribute_id: number;
    pro_photo_storage_id: number;
}

export interface PhotoAttributeRow extends QueryResultRow {
    id: number;
    size: number;
    height: number;
    width: number;
    type: string;
}

export interface PhotoStorageRow extends QueryResultRow {
    id: number;
    route: string;
}

export interface AddPhotoDTO {
    size: number;
    height: number;
    width: number;
    type: string;
    route: string;
    name: string;
    variant_id: number;
    [key: string]: unknown; 
}

export interface UploadPhotoDTO {
    pro_variant_id: string; // viene como string desde FormData
}

/**
 * Search Results:
 * Definición de las interfaces relacionadas con los resultados de búsqueda de productos, incluyendo diferentes tipos de resultados según las especificaciones (color, tamaño, etc.).
 * Cada interfaz (SpecTypeRow, SizColRow, ColRow, SizRow, SpecRow, VariantDetailRow, SubcatWithSpecRow) representa la estructura de los datos devueltos por las funciones de búsqueda específicas en la base de datos.
 * Estas interfaces permiten tipar correctamente los resultados de búsqueda en los servicios y controladores, facilitando el manejo de estos datos en la aplicación y asegurando que se acceda a los campos correctos según el tipo de búsqueda realizada.
 */

// Retorno de FN_SEARCH_SPECS_*
export interface SpecTypeRow extends QueryResultRow {
    specification_type: number; // 0=none, 1=color, 2=size, 3=color+size, 4=text
}

// Retorno de FN_GET_SIZ_COL_* (color + size)
export interface SizColRow extends QueryResultRow {
    product: string;
    pro_code: number;
    pro_description: string;
    pro_long_description: string;
    brand: string;
    brand_code: number;
    subcategory: string;
    subcategory_code: number;
    category: string;
    category_code: number;
    pro_variant: string;
    pro_variant_id: number;
    pro_cost: number;
    pro_stock: number;
    available: boolean;
    color: string;
    size: string;
    creation_date: Date;
}

// Retorno de FN_GET_COL_* (solo color)
export interface ColRow extends QueryResultRow {
    product: string;
    pro_code: number;
    pro_description: string;
    pro_long_description: string;
    brand: string;
    brand_code: number;
    subcategory: string;
    subcategory_code: number;
    category: string;
    category_code: number;
    pro_variant: string;
    pro_variant_id: number;
    pro_cost: number;
    pro_stock: number;
    available: boolean;
    color: string;
    creation_date: Date;
}

// Retorno de FN_GET_SIZ_* (solo size)
export interface SizRow extends QueryResultRow {
    product: string;
    pro_code: number;
    pro_description: string;
    pro_long_description: string;
    brand: string;
    brand_code: number;
    subcategory: string;
    subcategory_code: number;
    category: string;
    category_code: number;
    pro_variant: string;
    pro_variant_id: number;
    pro_cost: number;
    pro_stock: number;
    available: boolean;
    size: string;
    creation_date: Date;
}

// Retorno de FN_GET_SPEC_* (especificaciones)
export interface SpecRow extends QueryResultRow {
    product: string;
    pro_code: number;
    pro_description: string;
    pro_long_description: string;
    brand: string;
    brand_code: number;
    subcategory: string;
    subcategory_code: number;
    category: string;
    category_code: number;
    pro_variant: string;
    pro_variant_id: number;
    specification: string;
    value: string;
    creation_date: Date;
}

// Retorno de FN_GET_VARIANTS_DETAILS_*
export interface VariantDetailRow extends QueryResultRow {
    product: string;
    pro_code: number;
    pro_description: string;
    pro_long_description: string;
    brand: string;
    brand_code: number;
    subcategory: string;
    subcategory_code: number;
    category: string;
    category_code: number;
    pro_variant: string;
    pro_variant_id: number;
    pro_cost: number;
    pro_stock: number;
    available: boolean;
    specification: string;
    value: string;
    creation_date: Date;
}

// Retorno de FN_GET_SUBCATEGORIES_WITH_SPECS
export interface SubcatWithSpecRow extends QueryResultRow {
    subcategory_id: number;
    subcategory: string;
    specification_id: number;
    specification: string;         // Typo intencional de tu DB
    specification_constant_id: number;
    created_at: Date;
    modified_at: Date;
}

// ─── Specification Constants ──────────────────────────────
// Table: specificaction_constants (type: COLOR, SIZE, TEXT)
export type SpecConstantType = 'COLOR' | 'SIZE' | 'TEXT';

export interface SpecConstantRow extends QueryResultRow {
    id: number;
    name: SpecConstantType;
    state: boolean;
    created_at: Date;
    modified_at: Date;
}

// ─── Address ──────────────────────────────────────────
export interface AddressRow extends QueryResultRow {
    address_id: number;
    number: string;
    street: string;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string;
    state_province: string;
    postal_code: string;
    country_id: number;
    country: string;
    country_short: string;
    is_default: boolean;
    created_at: Date;
    modified_at: Date;
}

export interface CountryRow extends QueryResultRow {
    id: number;
    fullname: string;
    shortname: string;
}

export interface CreateAddressDTO {
    number: string;
    street: string;
    address_line_1?: string;
    address_line_2?: string;
    city: string;
    state_province: string;
    postal_code: string;
    country_id: number;
}

export interface UpdateAddressDTO extends CreateAddressDTO {}

/**
 * Pagination:
 * Definición de las interfaces relacionadas con la paginación de resultados en las consultas a la base de datos.
 * La interfaz PagedResultRow extiende QueryResultRow e incluye un campo adicional 'total' que representa el total de registros disponibles para la consulta, independientemente de la paginación.
 * Esto es útil para implementar paginación en el frontend, ya que permite conocer cuántas páginas de resultados hay en total.
 * Cada entidad (BrandPagedRow, CategoryPagedRow, etc.) extiende PagedResultRow para incluir los campos específicos de esa entidad junto con el campo 'total'.
 */

export interface BrandPagedRow extends QueryResultRow {
    id: number;
    name: string;
    state: boolean;
    created_at: Date;
    total: number;
}

export interface CategoryPagedRow extends QueryResultRow {
    id: number;
    name: string;
    state: boolean;
    created_at: Date;
    total: number;
}

export interface SubcategoryPagedRow extends QueryResultRow {
    id: number;
    name: string;
    category: string;
    state: boolean;
    created_at: Date;
    total: number;
}

export interface ProductPagedRow extends QueryResultRow {
    id: number;
    name: string;
    description: string;
    long_description: string;
    state: boolean;
    created_at: Date;
    subcategory: string;
    brand: string;
    total: number;
}

/**
 * Security and Authentication:
 * Definición de las interfaces relacionadas con la autenticación y autorización de usuarios en la aplicación.
 * Incluye tipos para roles de usuario, tipos de usuario, estructuras de payload para tokens JWT, y DTOs para operaciones de autenticación como registro e inicio de sesión.
 * Estas interfaces ayudan a tipar correctamente los datos relacionados con la seguridad en los servicios y controladores, facilitando la implementación de funcionalidades de autenticación y autorización en la aplicación.
 * Al definir claramente los roles y tipos de usuario, se puede implementar una lógica de control de acceso más robusta y segura en toda la aplicación.
 */

// Roles y Tipos de Usuario
export type UserRole = 'admin' | 'editor';
export type UserType = 'admin' | 'customer';

// Table: Tokens
export interface TokenPayload {
    userId: string;    // UUID
    email: string;
    role: UserRole | 'customer';
    type: UserType;    // diferencia entre admin/editor y customer, para validar en refreshToken si el token es del tipo correcto
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

// ADM_users
export interface AdminUserRow extends QueryResultRow {
    id: string;          // UUID
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: UserRole;
    state: boolean;
    created_at: Date;
    modified_at: Date;
}

export interface AdminUserPagedRow extends QueryResultRow {
    id: string;          // UUID
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    state: boolean;
    created_at: Date;
    total: number;
}

// CST_customers row (actualizado con UUID)
export interface CustomerRow extends QueryResultRow {
    id: string;          // UUID
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    state: boolean;
    created_at: Date;
    modified_at: Date;
}

export interface CustomerPagedRow extends QueryResultRow {
    id: string;          // UUID
    firstname: string;
    lastname: string;
    email: string;
    state: boolean;
    created_at: Date;
    total: number;
}

export interface SignupCustomerDTO {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
}

export interface CreateAdminDTO {
    firstname: string;
    lastname:  string;
    email:     string;
    password:  string;
    role:      'admin' | 'editor';
}

export interface SigninDTO {
    email: string;
    password: string;
    type: 'admin' | 'customer';
}

// Retorno de signinUser (sin password)
export interface SigninRow extends QueryResultRow {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;   // Para comparar con bcrypt, luego se omite en respuesta
    state: boolean;
}

// registro paginado de intentos de login (para monitoreo y seguridad)
export interface LoginAttemptRow extends QueryResultRow {
    id: number;
    email: string;
    user_type: string;
    ip_address: string;
    success: boolean;
    attempted_at: Date;
    total: number;
}

export interface ActiveTokenRow extends QueryResultRow {
    id: number;
    user_id: string;    // UUID
    user_type: string;
    ip_address: string;
    user_agent: string;
    expires_at: Date;
    created_at: Date;
    total: number;
}

/**
 * 
 */