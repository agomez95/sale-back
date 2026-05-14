
-- DELETE TRIGGER BY VARIANT

CREATE OR REPLACE FUNCTION FN_DEL_PHOTO_ON_VARIANT()
RETURNS TRIGGER AS
$func$
DECLARE
    photo_ids INTEGER[];
    attribute_ids INTEGER[];
    storage_ids INTEGER[];
BEGIN
    -- Obtener los IDs de las fotos asociadas a la variante eliminada
    SELECT ARRAY(SELECT PRO_photo_id FROM PRO_photo_configuration WHERE PRO_variant_id = OLD.id) INTO photo_ids;
    
    -- Obtener los IDs de los atributos y rutas de almacenamiento antes de eliminar las fotos
    SELECT ARRAY(SELECT PRO_photo_attribute_id FROM PRO_photos WHERE id = ANY(photo_ids)) INTO attribute_ids;
    SELECT ARRAY(SELECT PRO_photo_storage_id FROM PRO_photos WHERE id = ANY(photo_ids)) INTO storage_ids;
   
    -- Eliminar configuraciones de fotos asociadas
    DELETE FROM PRO_photo_configuration WHERE PRO_variant_id = OLD.id;

    -- Eliminar fotos
    DELETE FROM PRO_photos WHERE id = ANY(photo_ids);
    
    -- Eliminar atributos de fotos asociadas
    DELETE FROM PRO_photo_attributes WHERE id = ANY(attribute_ids);

    -- Eliminar rutas de almacenamiento de fotos asociadas
    DELETE FROM PRO_photo_storage WHERE id = ANY(storage_ids);

    RETURN OLD;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER TR_DEL_PHOTO_ON_VARIANT
BEFORE DELETE ON PRO_variants
FOR EACH ROW
EXECUTE FUNCTION FN_DEL_PHOTO_ON_VARIANT();

-- DELETE TRIGGER BY PHOTO

CREATE OR REPLACE FUNCTION FN_DEL_DATA_ON_PHOTO()
RETURNS TRIGGER AS
$func$
BEGIN
    -- Eliminar atributos de fotos asociadas
    DELETE FROM PRO_photo_attributes WHERE id = OLD.PRO_photo_attribute_id;

    -- Eliminar rutas de almacenamiento de fotos asociadas
    DELETE FROM PRO_photo_storage WHERE id = OLD.PRO_photo_storage_id;

    RETURN OLD;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER TR_DEL_DATA_ON_PHOTO
AFTER DELETE ON PRO_photos
FOR EACH ROW
EXECUTE FUNCTION FN_DEL_DATA_ON_PHOTO();

-- DEACTIVATION OF CATEGORIES AND SONS( SUBCATEGORIES, PRODUCTS, VARIANTS, VARIANT SPECIFICATION VALUES) THIS IS FOR CLIENT VIEW, NO PANEL

CREATE OR REPLACE FUNCTION FN_DEACT_CATEGORY_SONS()
RETURNS TRIGGER AS
$func$
DECLARE
    subcategory_ids INTEGER[];
    product_ids INTEGER[];
    variant_ids INTEGER[];
    variant_specification_value_ids INTEGER[];
BEGIN
    -- Solo ejecutar si el estado cambia de TRUE a FALSE
    IF OLD.state = TRUE AND NEW.state = FALSE THEN
        -- Obtener los IDs de las subcategorías de la categoría desactivada
        SELECT ARRAY_AGG(id) INTO subcategory_ids 
        FROM PRO_subcategorys 
        WHERE PRO_category_id = OLD.id;

        -- Desactivar las subcategorías
        UPDATE PRO_subcategorys SET state = FALSE WHERE PRO_category_id = OLD.id;

        -- Obtener los IDs de los productos asociados a las subcategorías
        SELECT ARRAY_AGG(id) INTO product_ids 
        FROM products 
        WHERE PRO_subcategory_id = ANY(subcategory_ids);

        -- Desactivar los productos
        UPDATE products SET state = FALSE WHERE id = ANY(product_ids);

        -- Obtener los IDs de las variantes asociadas a los productos
        SELECT ARRAY_AGG(id) INTO variant_ids 
        FROM PRO_variants 
        WHERE PRO_id = ANY(product_ids);

        -- Desactivar las variantes
        UPDATE PRO_variants SET state = FALSE WHERE PRO_id = ANY(product_ids);

        -- Obtener los IDs de los valores de especificaciones de las variantes
        SELECT ARRAY_AGG(id) INTO variant_specification_value_ids 
        FROM PRO_variant_specification_values 
        WHERE PRO_variant_id = ANY(variant_ids);

        -- Desactivar los valores de especificaciones de variantes
        UPDATE PRO_variant_specification_values SET state = FALSE WHERE PRO_variant_id = ANY(variant_ids);
    END IF;

    RETURN NEW;
END;
$func$
LANGUAGE plpgsql;

-- Crear el trigger correctamente
DROP TRIGGER IF EXISTS TR_DEACT_CATEGORY_SONS ON PRO_categorys;

CREATE TRIGGER TR_DEACT_CATEGORY_SONS
BEFORE UPDATE ON PRO_categorys
FOR EACH ROW
WHEN (OLD.state IS DISTINCT FROM NEW.state)  -- Evita ejecuciones innecesarias
EXECUTE FUNCTION FN_DEACT_CATEGORY_SONS();

-- ACTIVATION OF CATEGORIES AND SONS( SUBCATEGORIES, PRODUCTS, VARIANTS, VARIANT SPECIFICATION VALUES) THIS IS FOR CLIENT VIEW, NO PANEL

CREATE OR REPLACE FUNCTION FN_ACT_CATEGORY_SONS()
RETURNS TRIGGER AS
$func$
DECLARE
    subcategory_ids INTEGER[];
    product_ids INTEGER[];
    variant_ids INTEGER[];
    variant_specification_value_ids INTEGER[];
BEGIN
    -- Solo ejecutar si el estado cambia de FALSE a TRUE
    IF OLD.state = FALSE AND NEW.state = TRUE THEN
        -- Obtener los IDs de las subcategorías de la categoría activada
        SELECT ARRAY_AGG(id) INTO subcategory_ids 
        FROM PRO_subcategorys 
        WHERE PRO_category_id = OLD.id;

        -- Activar las subcategorías
        UPDATE PRO_subcategorys SET state = TRUE WHERE PRO_category_id = OLD.id;

        -- Obtener los IDs de los productos asociados a las subcategorías
        SELECT ARRAY_AGG(id) INTO product_ids 
        FROM products 
        WHERE PRO_subcategory_id = ANY(subcategory_ids);

        -- Activar los productos
        UPDATE products SET state = TRUE WHERE id = ANY(product_ids);

        -- Obtener los IDs de las variantes asociadas a los productos
        SELECT ARRAY_AGG(id) INTO variant_ids 
        FROM PRO_variants 
        WHERE PRO_id = ANY(product_ids);

        -- Activar las variantes
        UPDATE PRO_variants SET state = TRUE WHERE PRO_id = ANY(product_ids);

        -- Obtener los IDs de los valores de especificaciones de las variantes
        SELECT ARRAY_AGG(id) INTO variant_specification_value_ids 
        FROM PRO_variant_specification_values 
        WHERE PRO_variant_id = ANY(variant_ids);

        -- Activar los valores de especificaciones de variantes
        UPDATE PRO_variant_specification_values SET state = TRUE WHERE PRO_variant_id = ANY(variant_ids);
    END IF;

    RETURN NEW;
END;
$func$
LANGUAGE plpgsql;

-- Crear el trigger para activar
DROP TRIGGER IF EXISTS TR_ACT_CATEGORY_SONS ON PRO_categorys;

CREATE TRIGGER TR_ACT_CATEGORY_SONS
BEFORE UPDATE ON PRO_categorys
FOR EACH ROW
WHEN (OLD.state IS DISTINCT FROM NEW.state)  -- Evita ejecuciones innecesarias
EXECUTE FUNCTION FN_ACT_CATEGORY_SONS();

-- DEACTIVATION OF SUBCATEGORIES AND SONS( PRODUCTS, VARIANTS, VARIANT SPECIFICATION VALUES) THIS IS FOR CLIENT VIEW, NO PANEL

CREATE OR REPLACE FUNCTION FN_DEACT_SUBCATEGORY_SONS()
RETURNS TRIGGER AS
$func$
DECLARE
    product_ids INTEGER[];
    variant_ids INTEGER[];
    variant_specification_value_ids INTEGER[];
BEGIN
    -- Solo ejecutar si el estado cambia de TRUE a FALSE
    IF OLD.state = TRUE AND NEW.state = FALSE THEN
        -- Obtener los IDs de los productos de la subcategoría desactivada
        SELECT ARRAY_AGG(id) INTO product_ids 
        FROM products 
        WHERE PRO_subcategory_id = OLD.id;

        -- Desactivar los productos
        UPDATE products SET state = FALSE WHERE id = ANY(product_ids);

        -- Obtener los IDs de las variantes asociadas a los productos
        SELECT ARRAY_AGG(id) INTO variant_ids 
        FROM PRO_variants 
        WHERE PRO_id = ANY(product_ids);

        -- Desactivar las variantes
        UPDATE PRO_variants SET state = FALSE WHERE PRO_id = ANY(product_ids);

        -- Obtener los IDs de los valores de especificaciones de las variantes
        SELECT ARRAY_AGG(id) INTO variant_specification_value_ids 
        FROM PRO_variant_specification_values 
        WHERE PRO_variant_id = ANY(variant_ids);

        -- Desactivar los valores de especificaciones de las variantes
        UPDATE PRO_variant_specification_values SET state = FALSE WHERE PRO_variant_id = ANY(variant_ids);
    END IF;

    RETURN NEW;
END;
$func$
LANGUAGE plpgsql;

-- Crear el trigger para desactivar
DROP TRIGGER IF EXISTS TR_DEACT_SUBCATEGORY_SONS ON PRO_subcategorys;

CREATE TRIGGER TR_DEACT_SUBCATEGORY_SONS
BEFORE UPDATE ON PRO_subcategorys
FOR EACH ROW
WHEN (OLD.state IS DISTINCT FROM NEW.state)  -- Evita ejecuciones innecesarias
EXECUTE FUNCTION FN_DEACT_SUBCATEGORY_SONS();

-- ACTIVATION OF SUBCATEGORIES AND SONS( PRODUCTS, VARIANTS, VARIANT SPECIFICATION VALUES) THIS IS FOR CLIENT VIEW, NO PANEL

CREATE OR REPLACE FUNCTION FN_ACT_SUBCATEGORY_SONS()
RETURNS TRIGGER AS
$func$
DECLARE
    product_ids INTEGER[];
    variant_ids INTEGER[];
    variant_specification_value_ids INTEGER[];
BEGIN
    -- Solo ejecutar si el estado cambia de FALSE a TRUE
    IF OLD.state = FALSE AND NEW.state = TRUE THEN
        -- Obtener los IDs de los productos de la subcategoría activada
        SELECT ARRAY_AGG(id) INTO product_ids 
        FROM products 
        WHERE PRO_subcategory_id = OLD.id;

        -- Activar los productos
        UPDATE products SET state = TRUE WHERE id = ANY(product_ids);

        -- Obtener los IDs de las variantes asociadas a los productos
        SELECT ARRAY_AGG(id) INTO variant_ids 
        FROM PRO_variants 
        WHERE PRO_id = ANY(product_ids);

        -- Activar las variantes
        UPDATE PRO_variants SET state = TRUE WHERE PRO_id = ANY(product_ids);

        -- Obtener los IDs de los valores de especificaciones de las variantes
        SELECT ARRAY_AGG(id) INTO variant_specification_value_ids 
        FROM PRO_variant_specification_values 
        WHERE PRO_variant_id = ANY(variant_ids);

        -- Activar los valores de especificaciones de variantes
        UPDATE PRO_variant_specification_values SET state = TRUE WHERE PRO_variant_id = ANY(variant_ids);
    END IF;

    RETURN NEW;
END;
$func$
LANGUAGE plpgsql;

-- Crear el trigger para activar
DROP TRIGGER IF EXISTS TR_ACT_SUBCATEGORY_SONS ON PRO_subcategorys;

CREATE TRIGGER TR_ACT_SUBCATEGORY_SONS
BEFORE UPDATE ON PRO_subcategorys
FOR EACH ROW
WHEN (OLD.state IS DISTINCT FROM NEW.state)  -- Evita ejecuciones innecesarias
EXECUTE FUNCTION FN_ACT_SUBCATEGORY_SONS();

-- DEACTIVATION OF PRODUCTS AND SONS( VARIANTS, VARIANT SPECIFICATION VALUES) THIS IS FOR CLIENT VIEW, NO PANEL

CREATE OR REPLACE FUNCTION FN_DEACT_PRODUCT_SONS()
RETURNS TRIGGER AS
$func$
DECLARE
    variant_ids INTEGER[];
    variant_specification_value_ids INTEGER[];
BEGIN
    -- Solo ejecutar si el estado cambia de TRUE a FALSE
    IF OLD.state = TRUE AND NEW.state = FALSE THEN
        -- Obtener los IDs de las variantes del producto desactivado
        SELECT ARRAY_AGG(id) INTO variant_ids 
        FROM PRO_variants 
        WHERE PRO_id = OLD.id;

        -- Desactivar las variantes
        UPDATE PRO_variants SET state = FALSE WHERE PRO_id = OLD.id;

        -- Obtener los IDs de los valores de especificaciones de las variantes
        SELECT ARRAY_AGG(id) INTO variant_specification_value_ids 
        FROM PRO_variant_specification_values 
        WHERE PRO_variant_id = ANY(variant_ids);

        -- Desactivar los valores de especificaciones de variantes
        UPDATE PRO_variant_specification_values SET state = FALSE WHERE PRO_variant_id = ANY(variant_ids);
    END IF;

    RETURN NEW;
END;
$func$
LANGUAGE plpgsql;

-- Crear el trigger para desactivar
DROP TRIGGER IF EXISTS TR_DEACT_PRODUCT_SONS ON products;

CREATE TRIGGER TR_DEACT_PRODUCT_SONS
BEFORE UPDATE ON products
FOR EACH ROW
WHEN (OLD.state IS DISTINCT FROM NEW.state)  -- Evita ejecuciones innecesarias
EXECUTE FUNCTION FN_DEACT_PRODUCT_SONS();

-- ACTIVATION OF PRODUCTS AND SONS( VARIANTS, VARIANT SPECIFICATION VALUES) THIS IS FOR CLIENT VIEW, NO PANEL

CREATE OR REPLACE FUNCTION FN_ACT_PRODUCT_SONS()
RETURNS TRIGGER AS
$func$
DECLARE
    variant_ids INTEGER[];
    variant_specification_value_ids INTEGER[];
BEGIN
    -- Solo ejecutar si el estado cambia de FALSE a TRUE
    IF OLD.state = FALSE AND NEW.state = TRUE THEN
        -- Obtener los IDs de las variantes del producto activado
        SELECT ARRAY_AGG(id) INTO variant_ids 
        FROM PRO_variants 
        WHERE PRO_id = OLD.id;

        -- Activar las variantes
        UPDATE PRO_variants SET state = TRUE WHERE PRO_id = OLD.id;

        -- Obtener los IDs de los valores de especificaciones de las variantes
        SELECT ARRAY_AGG(id) INTO variant_specification_value_ids 
        FROM PRO_variant_specification_values 
        WHERE PRO_variant_id = ANY(variant_ids);

        -- Activar los valores de especificaciones de variantes
        UPDATE PRO_variant_specification_values SET state = TRUE WHERE PRO_variant_id = ANY(variant_ids);
    END IF;

    RETURN NEW;
END;
$func$
LANGUAGE plpgsql;

-- Crear el trigger para activar
DROP TRIGGER IF EXISTS TR_ACT_PRODUCT_SONS ON products;

CREATE TRIGGER TR_ACT_PRODUCT_SONS
BEFORE UPDATE ON products
FOR EACH ROW
WHEN (OLD.state IS DISTINCT FROM NEW.state)  -- Evita ejecuciones innecesarias
EXECUTE FUNCTION FN_ACT_PRODUCT_SONS();

-- DEACTIVATION OF BRANDS AND SONS( PRODUCTS, VARIANTS, VARIANT SPECIFICATION VALUES) THIS IS FOR CLIENT VIEW, NO PANEL

CREATE OR REPLACE FUNCTION FN_DEACT_BRAND_SONS()
RETURNS TRIGGER AS
$func$
DECLARE
    product_ids INTEGER[];
    variant_ids INTEGER[];
    variant_specification_value_ids INTEGER[];
BEGIN
    -- Solo ejecutar si el estado cambia de TRUE a FALSE
    IF OLD.state = TRUE AND NEW.state = FALSE THEN
        -- Obtener los IDs de los productos de la marca desactivada
        SELECT ARRAY_AGG(id) INTO product_ids 
        FROM products 
        WHERE PRO_brand_id = OLD.id;

        -- Desactivar los productos
        UPDATE products SET state = FALSE WHERE PRO_brand_id = OLD.id;

        -- Obtener los IDs de las variantes asociadas a los productos
        SELECT ARRAY_AGG(id) INTO variant_ids 
        FROM PRO_variants 
        WHERE PRO_id = ANY(product_ids);

        -- Desactivar las variantes
        UPDATE PRO_variants SET state = FALSE WHERE PRO_id = ANY(product_ids);

        -- Obtener los IDs de los valores de especificaciones de las variantes
        SELECT ARRAY_AGG(id) INTO variant_specification_value_ids 
        FROM PRO_variant_specification_values 
        WHERE PRO_variant_id = ANY(variant_ids);

        -- Desactivar los valores de especificaciones de variantes
        UPDATE PRO_variant_specification_values SET state = FALSE WHERE PRO_variant_id = ANY(variant_ids);
    END IF;

    RETURN NEW;
END;
$func$
LANGUAGE plpgsql;

-- Crear el trigger para desactivar
DROP TRIGGER IF EXISTS TR_DEACT_BRAND_SONS ON brands;

CREATE TRIGGER TR_DEACT_BRAND_SONS
BEFORE UPDATE ON PRO_brands
FOR EACH ROW
WHEN (OLD.state IS DISTINCT FROM NEW.state)  -- Evita ejecuciones innecesarias
EXECUTE FUNCTION FN_DEACT_BRAND_SONS();

-- ACTIVATION OF BRANDS AND SONS( PRODUCTS, VARIANTS, VARIANT SPECIFICATION VALUES) THIS IS FOR CLIENT VIEW, NO PANEL

CREATE OR REPLACE FUNCTION FN_ACT_BRAND_SONS()
RETURNS TRIGGER AS
$func$
DECLARE
    product_ids INTEGER[];
    variant_ids INTEGER[];
    variant_specification_value_ids INTEGER[];
BEGIN
    -- Solo ejecutar si el estado cambia de FALSE a TRUE
    IF OLD.state = FALSE AND NEW.state = TRUE THEN
        -- Obtener los IDs de los productos de la marca activada
        SELECT ARRAY_AGG(id) INTO product_ids 
        FROM products 
        WHERE PRO_brand_id = OLD.id;

        -- Activar los productos
        UPDATE products SET state = TRUE WHERE PRO_brand_id = OLD.id;

        -- Obtener los IDs de las variantes asociadas a los productos
        SELECT ARRAY_AGG(id) INTO variant_ids 
        FROM PRO_variants 
        WHERE PRO_id = ANY(product_ids);

        -- Activar las variantes
        UPDATE PRO_variants SET state = TRUE WHERE PRO_id = ANY(product_ids);

        -- Obtener los IDs de los valores de especificaciones de las variantes
        SELECT ARRAY_AGG(id) INTO variant_specification_value_ids 
        FROM PRO_variant_specification_values 
        WHERE PRO_variant_id = ANY(variant_ids);

        -- Activar los valores de especificaciones de variantes
        UPDATE PRO_variant_specification_values SET state = TRUE WHERE PRO_variant_id = ANY(variant_ids);
    END IF;

    RETURN NEW;
END;
$func$
LANGUAGE plpgsql;

-- Crear el trigger para activar
DROP TRIGGER IF EXISTS TR_ACT_BRAND_SONS ON brands;

CREATE TRIGGER TR_ACT_BRAND_SONS
BEFORE UPDATE ON PRO_brands
FOR EACH ROW
WHEN (OLD.state IS DISTINCT FROM NEW.state)  -- Evita ejecuciones innecesarias
EXECUTE FUNCTION FN_ACT_BRAND_SONS();

-- ─── TRIGGER modified_at para ADM_users ──────────────────

CREATE OR REPLACE FUNCTION update_modified_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_adm_users_modified_at
    BEFORE UPDATE ON ADM_users
    FOR EACH ROW EXECUTE FUNCTION update_modified_at();