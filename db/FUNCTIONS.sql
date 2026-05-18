
/* PRODUCT CATEGORYS */

CREATE OR REPLACE FUNCTION FN_GET_CATEGORIES()
RETURNS TABLE(id INTEGER, name VARCHAR, state BOOLEAN, created_at DATE)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT c.id AS id, c.name AS name, c.state AS state, date(c.created_at) AS creation_date FROM PRO_categorys AS c;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_CATEGORY(id_in INTEGER)
RETURNS TABLE(id INTEGER, name VARCHAR, state BOOLEAN, created_at DATE)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT c.id AS id, c.name AS name, c.state AS state, date(c.created_at) AS creation_date FROM PRO_categorys AS c where c.id = id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_ADD_CATEGORY(name_in VARCHAR)
RETURNS INTEGER AS 
$func$
DECLARE
	c_new_id INTEGER;
BEGIN
	INSERT INTO PRO_categorys(name, state, created_at, modified_at) VALUES (name_in, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	RETURNING id INTO c_new_id;
	RETURN c_new_id;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEL_CATEGORY(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	c_delete_count INTEGER;	
BEGIN
	DELETE FROM PRO_categorys where id = id_in
	RETURNING * INTO c_delete_count;
	RETURN c_delete_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_ACT_CATEGORY(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	c_activate_count INTEGER;	
BEGIN
	UPDATE PRO_categorys SET state = TRUE WHERE id = id_in
	RETURNING * INTO c_activate_count;
	RETURN c_activate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEACT_CATEGORY(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	c_deactivate_count INTEGER;	
BEGIN
	UPDATE PRO_categorys SET state = FALSE WHERE id = id_in
	RETURNING * INTO c_deactivate_count;
	RETURN c_deactivate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_EDIT_CATEGORY(id_in INTEGER, name_in VARCHAR)
RETURNS INTEGER AS
$func$
DECLARE
	c_edit_count INTEGER;	
BEGIN
	UPDATE PRO_categorys SET name = name_in, modified_at = CURRENT_TIMESTAMP WHERE id = id_in
	RETURNING * INTO c_edit_count;
	RETURN c_edit_count;
END;
$func$
LANGUAGE plpgsql;


/* PRODUCT SUBCATEGORYS */


CREATE OR REPLACE FUNCTION FN_GET_SUBCATEGORIES()
RETURNS TABLE(id INTEGER, name VARCHAR, category VARCHAR, state BOOLEAN, created_at DATE)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT sc.id AS id, sc.name AS name, c.name AS category, sc.state AS state, date(sc.created_at) AS creation_date 
    FROM PRO_subcategorys AS sc
    INNER JOIN PRO_categorys AS c ON c.id = sc.PRO_category_id;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_SUBCATEGORY(id_in INTEGER)
RETURNS TABLE(id INTEGER, name VARCHAR, category VARCHAR, category_id INTEGER, state BOOLEAN, created_at DATE)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT sc.id AS id, sc.name AS name, c.name AS category, sc.PRO_category_id AS category_id, sc.state AS state, date(sc.created_at) AS creation_date 
    FROM PRO_subcategorys AS sc
    INNER JOIN PRO_categorys AS c ON c.id = sc.PRO_category_id
    WHERE sc.id = id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_ADD_SUBCATEGORY(name_in VARCHAR, category_id_in INTEGER)
RETURNS INTEGER AS 
$func$
DECLARE
	sc_new_id INTEGER;
BEGIN
	INSERT INTO PRO_subcategorys(name, state, created_at, modified_at, PRO_category_id) VALUES (name_in, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, category_id_in)
	RETURNING id INTO sc_new_id;
	RETURN sc_new_id;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEL_SUBCATEGORY(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	sc_delete_count INTEGER;	
BEGIN
	DELETE FROM PRO_subcategorys where id = id_in
	RETURNING * INTO sc_delete_count;
	RETURN sc_delete_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_ACT_SUBCATEGORY(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	sc_activate_count INTEGER;	
BEGIN
	UPDATE PRO_subcategorys SET state = TRUE WHERE id = id_in
	RETURNING * INTO sc_activate_count;
	RETURN sc_activate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEACT_SUBCATEGORY(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	sc_deactivate_count INTEGER;	
BEGIN
	UPDATE PRO_subcategorys SET state = FALSE WHERE id = id_in
	RETURNING * INTO sc_deactivate_count;
	RETURN sc_deactivate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_EDIT_SUBCATEGORY(id_in INTEGER, name_in VARCHAR, category_id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	sc_edit_count INTEGER;	
BEGIN
	UPDATE PRO_subcategorys SET name = name_in, PRO_category_id = category_id_in, modified_at = CURRENT_TIMESTAMP WHERE id = id_in
	RETURNING * INTO sc_edit_count;
	RETURN sc_edit_count;
END;
$func$
LANGUAGE plpgsql;


/* PRODUCT BRANDS */


CREATE OR REPLACE FUNCTION FN_GET_BRANDS()
RETURNS TABLE(id INTEGER, name VARCHAR, state BOOLEAN, created_at DATE)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT b.id AS id, b.name AS name, b.state AS state, date(b.created_at) AS creation_date FROM PRO_brands AS b;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_BRAND(id_in INTEGER)
RETURNS TABLE(id INTEGER, name VARCHAR, state BOOLEAN, created_at DATE)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT b.id AS id, b.name AS name, b.state AS state, date(b.created_at) AS creation_date FROM PRO_brands AS b where b.id = id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_ADD_BRAND(name_in VARCHAR)
RETURNS INTEGER AS 
$func$
DECLARE
	b_new_id INTEGER;
BEGIN
	INSERT INTO PRO_brands(name, state, created_at, modified_at) VALUES (name_in, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
	RETURNING id INTO b_new_id;
	RETURN b_new_id;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEL_BRAND(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	b_delete_count INTEGER;	
BEGIN
	DELETE FROM PRO_brands where id = id_in
	RETURNING * INTO b_delete_count;
	RETURN b_delete_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_ACT_BRAND(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	b_activate_count INTEGER;	
BEGIN
	UPDATE PRO_brands SET state = TRUE WHERE id = id_in
	RETURNING * INTO b_activate_count;
	RETURN b_activate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEACT_BRAND(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	b_deactivate_count INTEGER;	
BEGIN
	UPDATE PRO_brands SET state = FALSE WHERE id = id_in
	RETURNING * INTO b_deactivate_count;
	RETURN b_deactivate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_EDIT_BRAND(id_in INTEGER, name_in VARCHAR)
RETURNS INTEGER AS
$func$
DECLARE
	b_edit_count INTEGER;	
BEGIN
	UPDATE PRO_brands SET name = name_in, modified_at = CURRENT_TIMESTAMP WHERE id = id_in
	RETURNING * INTO b_edit_count;
	RETURN b_edit_count;
END;
$func$
LANGUAGE plpgsql;


/* PRODUCTS */


CREATE OR REPLACE FUNCTION FN_GET_PRODUCT(id_in INTEGER)
RETURNS TABLE(
    id               INTEGER,
    name             VARCHAR,
    description      VARCHAR,
    long_description TEXT,
    state            BOOLEAN,
    created_at       DATE,
    subcategory_id   INTEGER,
    subcategory      VARCHAR,
    brand_id         INTEGER,
    brand            VARCHAR,
    category_id      INTEGER,
    category         VARCHAR
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.description,
        p.long_description,
        p.state,
        date(p.created_at)  AS created_at,
        sc.id               AS subcategory_id,
        sc.name             AS subcategory,
        b.id                AS brand_id,
        b.name              AS brand,
        c.id                AS category_id,
        c.name              AS category
    FROM products p
    INNER JOIN PRO_subcategorys sc ON sc.id = p.PRO_subcategory_id
    INNER JOIN PRO_brands b        ON b.id  = p.PRO_brand_id
    INNER JOIN PRO_categorys c     ON c.id  = sc.PRO_category_id
    WHERE p.id = id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_ADD_PRODUCT(name_in VARCHAR, description_in VARCHAR, long_description_in TEXT, subcategory_id_in INTEGER, brand_id_in INTEGER)
RETURNS INTEGER AS 
$func$
DECLARE
	p_new_id INTEGER;
BEGIN
	INSERT INTO products(name, description, long_description, state, created_at, modified_at, PRO_subcategory_id, PRO_brand_id) VALUES (name_in, description_in, long_description_in, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, subcategory_id_in, brand_id_in)
	RETURNING id INTO p_new_id;
	RETURN p_new_id;
END;
$func$
LANGUAGE plpgsql;

-- ACTIVATION AND DESACTIVATION OF PRODUCTS TRUE OR FALSE

CREATE OR REPLACE FUNCTION FN_ACT_PRODUCT(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    p_activate_count INTEGER;
BEGIN
    UPDATE products SET state = TRUE WHERE id = id_in
    RETURNING * INTO p_activate_count;
    RETURN p_activate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEACT_PRODUCT(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    p_deactivate_count INTEGER;
BEGIN
    UPDATE products SET state = FALSE WHERE id = id_in
    RETURNING * INTO p_deactivate_count;
    RETURN p_deactivate_count;
END;
$func$
LANGUAGE plpgsql;


/* PRODUCT SPECIFICATIONS */


CREATE OR REPLACE FUNCTION FN_ADD_SPEC(specification_constant_id_in INTEGER, subcategory_id_in INTEGER)
RETURNS INTEGER AS 
$func$
DECLARE
	s_new_id INTEGER;
BEGIN
	INSERT INTO PRO_specifications(state, created_at, modified_at, specification_constant_id, PRO_subcategory_id) VALUES (TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, specification_constant_id_in, subcategory_id_in)
	RETURNING id INTO s_new_id;
	RETURN s_new_id;
END;
$func$
LANGUAGE plpgsql;

-- ACTIVATION AND DESACTIVATION OF SPECIFICATIONS TRUE OR FALSE

CREATE OR REPLACE FUNCTION FN_ACT_SPEC(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    s_activate_count INTEGER;
BEGIN
    UPDATE PRO_specifications SET state = TRUE WHERE id = id_in
    RETURNING * INTO s_activate_count;
    RETURN s_activate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEACT_SPEC(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    s_deactivate_count INTEGER;
BEGIN
    UPDATE PRO_specifications SET state = FALSE WHERE id = id_in
    RETURNING * INTO s_deactivate_count;
    RETURN s_deactivate_count;
END;
$func$
LANGUAGE plpgsql;


/* SUBCATEGORIES WITHOUT SPECS*/


CREATE OR REPLACE FUNCTION FN_GET_SUBCAT_WITHOUT_SPECS()
RETURNS TABLE(
	subcategory_id INTEGER,
	subcategory VARCHAR,
	created_at DATE,
	modified_at DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT
	    psub.id AS subcategory_id,
	    psub.name AS subcategory,
		date(psub.created_at) AS created_at,
		date(psub.modified_at) AS modified_at
	FROM pro_subcategorys AS psub
	LEFT JOIN pro_specifications AS pspec ON pspec.pro_subcategory_id = psub.id
	WHERE pspec.id IS NULL;
END
$func$;


/* PRODUCT SPECIFICATION VALUES */


CREATE OR REPLACE FUNCTION FN_ADD_SPEC_VAL(value_in VARCHAR, specification_id_in INTEGER)
RETURNS INTEGER AS 
$func$
DECLARE
	s_new_id INTEGER;
BEGIN
	INSERT INTO PRO_specification_values(value, state, created_at, modified_at, PRO_specification_id) VALUES (value_in, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, specification_id_in)
	RETURNING id INTO s_new_id;
	RETURN s_new_id;
END;
$func$
LANGUAGE plpgsql;

--- DESACTIVATION OF SPECIFICATIONS_VALUES TRUE OR FALSE

CREATE OR REPLACE FUNCTION FN_ACT_SPEC_VAL(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    sv_activate_count INTEGER;
BEGIN
    UPDATE PRO_specification_values SET state = TRUE WHERE id = id_in
    RETURNING * INTO sv_activate_count;
    RETURN sv_activate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEACT_SPEC_VAL(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    sv_deactivate_count INTEGER;
BEGIN
    UPDATE PRO_specification_values SET state = FALSE WHERE id = id_in
    RETURNING * INTO sv_deactivate_count;
    RETURN sv_deactivate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_SPEC_EXIST(spec_id_in INT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM PRO_specifications WHERE id = spec_id_in
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_SPEC_VAL_EXIST(spec_val_id_in INT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM PRO_specification_values WHERE id = spec_val_id_in
    );
END;
$$ LANGUAGE plpgsql;

/* PRODUCT VARIANTS */


CREATE OR REPLACE FUNCTION FN_ADD_VARIANT(name_in VARCHAR, stock_in INTEGER, cost_in NUMERIC, PRO_id_in INTEGER)
RETURNS INTEGER AS 
$func$
DECLARE
	v_new_id INTEGER;
BEGIN
	INSERT INTO PRO_variants(name, stock, cost, is_available, state, created_at, modified_at, PRO_id) VALUES (name_in, stock_in, cost_in, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, PRO_id_in)
	RETURNING id INTO v_new_id;
	RETURN v_new_id;
END;
$func$
LANGUAGE plpgsql;

--- DESACTIVATION OF VARIANTS TRUE OR FALSE

CREATE OR REPLACE FUNCTION FN_ACT_VARIANT(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    v_activate_count INTEGER;
BEGIN
    UPDATE PRO_variants SET state = TRUE WHERE id = id_in
    RETURNING * INTO v_activate_count;
    RETURN v_activate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEACT_VARIANT(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    v_deactivate_count INTEGER;
BEGIN
    UPDATE PRO_variants SET state = FALSE WHERE id = id_in
    RETURNING * INTO v_deactivate_count;
    RETURN v_deactivate_count;
END;
$func$
LANGUAGE plpgsql;

/* DELETE VARIANT */

CREATE OR REPLACE FUNCTION FN_DEL_VARIANT(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	v_delete_count INTEGER;	
BEGIN
	DELETE FROM PRO_variants where id = id_in
	RETURNING * INTO v_delete_count;
	RETURN v_delete_count;
END;
$func$
LANGUAGE plpgsql;

/* PRODUCT VARIANT SPECIFICATION VALUES */


CREATE OR REPLACE FUNCTION FN_ADD_VARIANT_SPEC_VAL(variant_id_in INTEGER, specification_value_id_in INTEGER)
RETURNS INTEGER AS 
$func$
DECLARE
	v_new_id INTEGER;
BEGIN
	INSERT INTO PRO_variant_specification_values(state, created_at, modified_at, PRO_variant_id, PRO_specification_value_id) VALUES (TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, variant_id_in, specification_value_id_in)
	RETURNING id INTO v_new_id;
	RETURN v_new_id;
END;
$func$
LANGUAGE plpgsql;

--- DESACTIVATION OF VARIANTS SPECIFICATION VALUES TRUE OR FALSE

CREATE OR REPLACE FUNCTION FN_ACT_VARIANT_SPEC_VAL(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    vsv_activate_count INTEGER;
BEGIN
    UPDATE PRO_variant_specification_values SET state = TRUE WHERE id = id_in
    RETURNING * INTO vsv_activate_count;
    RETURN vsv_activate_count;
END;
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION FN_DEACT_VARIANT_SPEC_VAL(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
    vsv_deactivate_count INTEGER;
BEGIN
    UPDATE PRO_variant_specification_values SET state = FALSE WHERE id = id_in
    RETURNING * INTO vsv_deactivate_count;
    RETURN vsv_deactivate_count;
END;
$func$
LANGUAGE plpgsql;

/* DELETE SPECIFICATION VALUES BY VARIANT - THIS FUNCTION WORKS FOR CLEAN SPECIFICATION VALUES FROM VARIANT*/

CREATE OR REPLACE FUNCTION FN_DEL_VARIANT_SPEC_VAL(id_in INTEGER)
RETURNS INTEGER AS
$func$
DECLARE
	vsp_delete_count INTEGER;	
BEGIN
    DELETE FROM PRO_variant_specification_values 
    WHERE PRO_variant_id = id_in;
    
    -- GET DIAGNOSTICS: Obtener el número de filas afectadas
    GET DIAGNOSTICS vsp_delete_count = ROW_COUNT;

    RETURN vsp_delete_count;
END;
$func$
LANGUAGE plpgsql;

-- SELECT delete_PRO_variant_specification_value(2);


/* INFORMATION */


-- SELECT add_PRO_category('ropa'); -- agregado categoria 'ropa'
-- SELECT add_PRO_subcategory('jeans hombre', 1); -- agregado sub-categoria 'jeans de hombre'
-- SELECT add_PRO_brand('American Cold'); -- agregado marca 'amercian cold'
-- SELECT add_product('Pantalon Hombre Basement', 'PRO12', 1, 1); -- agregado producto 'Pantalon Hombre Basement'


-- SELECT add_PRO_specification(1, 1); -- agregado especificacion COLOR para la subcategoria de 'jeans de hombre'
-- SELECT add_PRO_specification(2, 1); -- agregado especificacion SIZE para la subcategoria de 'jeans de hombre'
-- SELECT add_PRO_specification(3, 1); -- agregado especificacion TEXT para la subcategoria de 'jeans de hombre'


-- SELECT add_PRO_specification_value('NEGRO', 1); -- agregado valor 'NEGRO' a la especificacion COLOR para la subcategoria de 'jeans de hombre'
-- SELECT add_PRO_specification_value('AZUL', 1); -- agregado valor 'AZUL' a la  especificacion COLOR para la subcategoria de 'jeans de hombre'
-- SELECT add_PRO_specification_value('BEIGE', 1); -- agregado valor 'BEIGE' a la  especificacion COLOR para la subcategoria de 'jeans de hombre'


-- SELECT add_PRO_specification_value('32', 2); -- agregada talla '32' a la especificacion SIZE para la subcategoria de 'jeans de hombre'
-- SELECT add_PRO_specification_value('30', 2); -- agregada talla '30' a la especificacion SIZE para la subcategoria de 'jeans de hombre'
-- SELECT add_PRO_specification_value('28', 2); -- agregada talla '28' a la especificacion SIZE para la subcategoria de 'jeans de hombre'


-- SELECT add_PRO_specification_value('Material: Drill', 3); -- agregado valor informativo 'Material: Drill' a la especificacion TEXT para la subcategoria de 'jeans de hombre'


-- SELECT add_PRO_variant('PANTALON NEGRO 32', 10, 59.9, 1); -- agregada variante 'PANTALON NEGRO 32' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant('PANTALON AZUL 32', 10, 59.9, 1); -- agregada variante 'PANTALON AZUL 32' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant('PANTALON BEIGE 32', 10, 59.9, 1); -- agregada variante 'PANTALON BEIGE 32' del producto 'Pantalon Hombre Basement'

-- SELECT add_PRO_variant('PANTALON NEGRO 30', 10, 59.9, 1); -- agregada variante 'PANTALON NEGRO 30' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant('PANTALON AZUL 30', 10, 59.9, 1); -- agregada variante 'PANTALON AZUL 30' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant('PANTALON BEIGE 30', 10, 59.9, 1); -- agregada variante 'PANTALON BEIGE 30' del producto 'Pantalon Hombre Basement'


-- SELECT add_PRO_variant('PANTALON NEGRO 28', 10, 59.9, 1); -- agregada variante 'PANTALON NEGRO 28' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant('PANTALON AZUL 28', 10, 59.9, 1); -- agregada variante 'PANTALON AZUL 28' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant('PANTALON BEIGE 28', 10, 59.9, 1); -- agregada variante 'PANTALON BEIGE 28' del producto 'Pantalon Hombre Basement'


-- SELECT add_PRO_variant_specification_value(1,1); -- agregada valor 'NEGRO' de las especificaciones a la variante 'PANTALON NEGRO 32' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant_specification_value(1,4); -- agregada valor '32' de las especificaciones a la variante 'PANTALON NEGRO 32' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant_specification_value(1,7); -- agregada valor 'Material: Dril' de las especificaciones a la variante 'PANTALON NEGRO 32' del producto 'Pantalon Hombre Basement'


-- SELECT add_PRO_variant_specification_value(2,2); -- agregada valor 'AZUL' de las especificaciones a la variante 'PANTALON AZUL 32' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant_specification_value(2,4); -- agregada valor '32' de las especificaciones a la variante 'PANTALON AZUL 32' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant_specification_value(2,7); -- agregada valor 'Material: Dril' de las especificaciones a la variante 'PANTALON AZUL 32' del producto 'Pantalon Hombre Basement'


-- SELECT add_PRO_variant_specification_value(3,3); -- agregada valor 'BEIGE' de las especificaciones a la variante 'PANTALON BEIGE 32' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant_specification_value(3,4); -- agregada valor '32' de las especificaciones a la variante 'PANTALON BEIGE 32' del producto 'Pantalon Hombre Basement'
-- SELECT add_PRO_variant_specification_value(3,7); -- agregada valor 'Material: Dril' de las especificaciones a la variante 'PANTALON BEIGE 32' del producto 'Pantalon Hombre Basement'


/* SEARCHES */

CREATE OR REPLACE FUNCTION FN_SEARCH_SPECS_SUBCAT(subcategory_id_in INTEGER)
RETURNS TABLE(specification_type INTEGER)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
    SELECT 
    CASE
    	WHEN COUNT (CASE WHEN sc.id = 1 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 2 THEN sc.id END) = 0 THEN 1 -- ONLY COLOR
    	WHEN COUNT (CASE WHEN sc.id = 2 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 1 THEN sc.id END) = 0 THEN 2 -- ONLY SIZE
    	WHEN COUNT (CASE WHEN sc.id = 1 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 2 THEN sc.id END) > 0 THEN 3 -- COLOR AND SIZE
    	WHEN COUNT (CASE WHEN sc.id = 3 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 1 THEN sc.id END) = 0 AND COUNT (CASE WHEN sc.id = 2 THEN sc.id END) = 0 THEN 4 -- ONLY TEXT
        ELSE 0  -- NO SPEC
	    END AS specification_type
    FROM products p
    JOIN PRO_variants v ON p.id = v.PRO_id
    JOIN PRO_variant_specification_values vsv ON v.id = vsv.PRO_variant_id
    JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
    JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
  	JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
    WHERE p.PRO_subcategory_id = subcategory_id_in;
	RETURN;
END
$func$;

CREATE OR REPLACE FUNCTION FN_SEARCH_SPECS_BRAND(brand_id_in INTEGER)
RETURNS TABLE(specification_type INTEGER)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
    SELECT 
    CASE
    	WHEN COUNT (CASE WHEN sc.id = 1 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 2 THEN sc.id END) = 0 THEN 1 -- ONLY COLOR
    	WHEN COUNT (CASE WHEN sc.id = 2 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 1 THEN sc.id END) = 0 THEN 2 -- ONLY SIZE
    	WHEN COUNT (CASE WHEN sc.id = 1 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 2 THEN sc.id END) > 0 THEN 3 -- COLOR AND SIZE
    	WHEN COUNT (CASE WHEN sc.id = 3 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 1 THEN sc.id END) = 0 AND COUNT (CASE WHEN sc.id = 2 THEN sc.id END) = 0 THEN 4 -- ONLY TEXT
        ELSE 0  -- NO SPEC
	    END AS specification_type
    FROM products p
    JOIN PRO_variants v ON p.id = v.PRO_id
    JOIN PRO_variant_specification_values vsv ON v.id = vsv.PRO_variant_id
    JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
    JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
  	JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
    WHERE p.PRO_brand_id = brand_id_in;
	RETURN;
END
$func$;

CREATE OR REPLACE FUNCTION FN_SEARCH_SPECS_PRODUCT(PRO_id_in INTEGER)
RETURNS TABLE(specification_type INTEGER)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
    SELECT 
    CASE
    	WHEN COUNT (CASE WHEN sc.id = 1 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 2 THEN sc.id END) = 0 THEN 1 -- ONLY COLOR
    	WHEN COUNT (CASE WHEN sc.id = 2 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 1 THEN sc.id END) = 0 THEN 2 -- ONLY SIZE
    	WHEN COUNT (CASE WHEN sc.id = 1 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 2 THEN sc.id END) > 0 THEN 3 -- COLOR AND SIZE
    	WHEN COUNT (CASE WHEN sc.id = 3 THEN sc.id END) > 0 AND COUNT (CASE WHEN sc.id = 1 THEN sc.id END) = 0 AND COUNT (CASE WHEN sc.id = 2 THEN sc.id END) = 0 THEN 4 -- ONLY TEXT
        ELSE 0  -- NO SPEC
	    END AS specification_type
    FROM products p
    JOIN PRO_variants v ON p.id = v.PRO_id
    JOIN PRO_variant_specification_values vsv ON v.id = vsv.PRO_variant_id
    JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
    JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
  	JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
    WHERE p.id = PRO_id_in;
	RETURN;
END
$func$;


/* GET SIZES-COLORS BY */


CREATE OR REPLACE FUNCTION FN_GET_SIZ_COL_SUBCAT(subcategory_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN, 
	color VARCHAR, 
	size VARCHAR, 
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		c.color AS color, 
		s.size AS size, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS color 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'COLOR') AS c ON pv.id = c.variant
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS size 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'SIZE') AS s ON pv.id = s.variant
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND ps.id = subcategory_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_SIZ_COL_BRAND(brand_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER, 
	available BOOLEAN, 
	color VARCHAR, 
	size VARCHAR, 
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		c.color AS color, 
		s.size AS size, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS color 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'COLOR') AS c ON pv.id = c.variant
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS size 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'SIZE') AS s ON pv.id = s.variant
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pb.id = brand_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_SIZ_COL_PRODUCT(PRO_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN, 
	color VARCHAR, 
	size VARCHAR, 
	creation_date DATE)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		c.color AS color, 
		s.size AS size, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS color 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'COLOR') AS c ON pv.id = c.variant
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS size 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'SIZE') AS s ON pv.id = s.variant
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pv.PRO_id = PRO_id_in
	ORDER BY pv.id;
END
$func$;


/* GET COLORS BY */


CREATE OR REPLACE FUNCTION FN_GET_COL_SUBCAT(subcategory_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN, 
	color VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		c.color AS color, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS color 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'COLOR') AS c ON pv.id = c.variant
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND ps.id = subcategory_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_COL_BRAND(brand_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN, 
	color VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		c.color AS color, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS color 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'COLOR') AS c ON pv.id = c.variant
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pb.id = brand_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_COL_PRODUCT(PRO_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN, 
	color VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		c.color AS color, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS color 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'COLOR') AS c ON pv.id = c.variant
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pv.PRO_id = PRO_id_in;
END
$func$;

/* GET SIZES BY */

CREATE OR REPLACE FUNCTION FN_GET_SIZ_SUBCAT(subcategory_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN, 
	size VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		s.size AS size, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS size 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'SIZE') AS s ON pv.id = s.variant
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND ps.id = subcategory_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_SIZ_BRAND(brand_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN, 
	size VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		s.size AS size, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS size 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'SIZE') AS s ON pv.id = s.variant
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pb.id = brand_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_SIZ_PRODUCT(PRO_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN, 
	size VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code, 
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		s.size AS size, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN ( 
		SELECT vsv.PRO_variant_id AS variant, sv.value AS size 
		FROM PRO_variant_specification_values vsv 
		INNER JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
		INNER JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
		INNER JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
		WHERE sc.name = 'SIZE') AS s ON pv.id = s.variant
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pv.PRO_id = PRO_id_in;
END
$func$;


/* GET SPECIFICATIONS BY */


CREATE OR REPLACE FUNCTION FN_GET_SPEC_SUBCAT(subcategory_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	specification VARCHAR,
	value VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		sc.name AS specification, 
		sv.value AS value, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN PRO_variant_specification_values vsv ON pv.id = vsv.PRO_variant_id
	JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
	JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
	JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND ps.id = subcategory_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_SPEC_BRAND(brand_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	specification VARCHAR,
	value VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		sc.name AS specification, 
		sv.value AS value, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN PRO_variant_specification_values vsv ON pv.id = vsv.PRO_variant_id
	JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
	JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
	JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pb.id = brand_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_SPEC_PRODUCT(PRO_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	specification VARCHAR,
	value VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		sc.name AS specification, 
		sv.value AS value, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN PRO_variant_specification_values vsv ON pv.id = vsv.PRO_variant_id
	JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
	JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
	JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pv.PRO_id = PRO_id_in;
END
$func$;


/* GET VARIANTS DETAILS BY */


CREATE OR REPLACE FUNCTION FN_GET_VARIANTS_DETAILS_SUBCAT(subcategory_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN,
	specification VARCHAR,
	value VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		sc.name AS specification, 
		sv.value AS value, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN PRO_variant_specification_values vsv ON pv.id = vsv.PRO_variant_id
	JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
	JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
	JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND ps.id = subcategory_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_VARIANTS_DETAILS_BRAND(brand_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN,
	specification VARCHAR,
	value VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		sc.name AS specification, 
		sv.value AS value, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN PRO_variant_specification_values vsv ON pv.id = vsv.PRO_variant_id
	JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
	JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
	JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pb.id = brand_id_in;
END
$func$;

CREATE OR REPLACE FUNCTION FN_GET_VARIANTS_DETAILS_PRODUCT(PRO_id_in INTEGER)
RETURNS TABLE(
	product VARCHAR, 
	PRO_code INTEGER,
	PRO_description VARCHAR,
	PRO_long_description VARCHAR,
	brand VARCHAR,
	brand_code INTEGER,
	subcategory VARCHAR,
	subcategory_code INTEGER,
	category VARCHAR,
	category_code INTEGER,
	PRO_variant VARCHAR,
	PRO_variant_id INTEGER,
	PRO_cost NUMERIC, 
	PRO_stock INTEGER,
	available BOOLEAN,
	specification VARCHAR,
	value VARCHAR,
	creation_date DATE
)
LANGUAGE plpgsql AS
$func$
BEGIN
	RETURN QUERY
	SELECT 
		p.name AS product, 
		p.id AS PRO_code,
		p.description AS PRO_description,
		p.long_description::VARCHAR AS PRO_long_description,
		pb.name AS brand, 
		pb.id AS brand_code, 
		ps.name AS subcategory, 
		ps.id AS subcategory_code, 
		pc.name AS category, 
		pc.id AS category_code, 
		pv.name AS PRO_variant, 
		pv.id AS PRO_variant_id, 
		pv.cost AS PRO_cost, 
		pv.stock AS PRO_stock, 
		pv.is_available AS available, 
		sc.name AS specification, 
		sv.value AS value, 
		date(pv.created_at) AS creation_date
	FROM PRO_variants pv
	JOIN products p ON pv.PRO_id = p.id
	JOIN PRO_variant_specification_values vsv ON pv.id = vsv.PRO_variant_id
	JOIN PRO_specification_values sv ON vsv.PRO_specification_value_id = sv.id
	JOIN PRO_specifications s ON sv.PRO_specification_id = s.id
	JOIN specificaction_constants sc ON s.specification_constant_id = sc.id
	JOIN PRO_brands pb ON p.PRO_brand_id = pb.id
	JOIN PRO_subcategorys ps ON p.PRO_subcategory_id = ps.id
	JOIN PRO_categorys pc ON ps.PRO_category_id = pc.id
	WHERE p.state = TRUE AND pv.PRO_id = PRO_id_in;
END
$func$;


/* GET SUBCATEGORIES WITH SPECIFICATIONS */

CREATE OR REPLACE FUNCTION FN_GET_SUBCATEGORIES_WITH_SPECS()
RETURNS TABLE (
    subcategory_id INT,
    subcategory VARCHAR,
    specification_id INT,
    specification VARCHAR,
    specification_constant_id INT,
    created_at TIMESTAMP,
    modified_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        psub.id AS subcategory_id,
        psub.name AS subcategory,
        pspec.id AS specification_id,
        sconst.name AS specification,
        pspec.specification_constant_id AS specification_constant_id,
        pspec.created_at,
        pspec.modified_at
    FROM 
        PRO_subcategorys AS psub
    LEFT JOIN 
        PRO_specifications AS pspec ON pspec.PRO_subcategory_id = psub.id
    LEFT JOIN 
        specificaction_constants AS sconst ON sconst.id = pspec.specification_constant_id
    ORDER BY 
        psub.id;
END;
$$ LANGUAGE plpgsql;

/*************************** FOTO ********************************/

/* GET VARIANTS BY */

CREATE OR REPLACE FUNCTION FN_VARIANT_EXIST(variant_id_in INT) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM pro_variants WHERE id = variant_id_in);
END;
$$ LANGUAGE plpgsql;

-- SELECT variant_exists(1); retorna true o false

/* GET NUMERATION BY VARIANT ID */

CREATE OR REPLACE FUNCTION FN_GET_NUMERATION_PHOTO(variant_id_in INT)
RETURNS INT AS
$func$
DECLARE
    next_number INT;
    photos_count INTEGER;
BEGIN

    SELECT COUNT(*) INTO photos_count FROM pro_photo_configuration WHERE pro_variant_id = variant_id_in;
    
    IF photos_count > 0 THEN
        SELECT COALESCE(MAX(SUBSTRING(name FROM '[0-9]+$')::INT), 0) + 1
        INTO next_number
        FROM PRO_photos
        WHERE name LIKE variant_id_in || '_%';
    ELSE
        next_number := 0;
    END IF;

    RETURN next_number;
END;
$func$
LANGUAGE plpgsql;

-- SELECT get_numeration_photo(1); retorna 0 SI no hay fotos con esa variant y retorna X numero SI existen variantes configuradas

/* ADD PHOTO VARIANT*/

CREATE OR REPLACE FUNCTION FN_ADD_PHOTO_VAR(
    p_size_in FLOAT,
    p_height_in INTEGER,
    p_width_in INTEGER,
    p_type_in VARCHAR(50),
    p_route_in VARCHAR(700),
    p_name_in VARCHAR(500),
    p_pro_variant_id_in INTEGER
)
RETURNS INTEGER AS 
$func$
DECLARE
    v_photo_attribute_id INTEGER;
    v_photo_storage_id INTEGER;
    v_photo_id INTEGER;
	v_photo_configuration_id INTEGER;
BEGIN
	INSERT INTO PRO_photo_attributes(size, height, width, type)
	VALUES (p_size_in, p_height_in, p_width_in, p_type_in)
	RETURNING id INTO v_photo_attribute_id;

	INSERT INTO PRO_photo_storage(route)
	VALUES (p_route_in)
	RETURNING id INTO v_photo_storage_id;
	
	INSERT INTO PRO_photos(name, PRO_photo_attribute_id, PRO_photo_storage_id)
	VALUES (p_name_in, v_photo_attribute_id, v_photo_storage_id)
	RETURNING id INTO v_photo_id;
	
    BEGIN
        INSERT INTO PRO_photo_configuration (PRO_variant_id, PRO_photo_id)
        VALUES (p_pro_variant_id_in, v_photo_id);
        
        v_photo_configuration_id := 1;
    EXCEPTION WHEN OTHERS THEN
        v_photo_configuration_id := 0;
    END;

	RETURN v_photo_configuration_id;
END;
$func$
LANGUAGE plpgsql;


/************************* CUSTOMER & ADDRESSES *************************/


-- GET addresses by customer
CREATE OR REPLACE FUNCTION FN_GET_ADDRESSES_BY_CUSTOMER(
    p_customer_id_in UUID
)
RETURNS TABLE(
    address_id      INTEGER,
    number          VARCHAR,
    street          VARCHAR,
    address_line_1  VARCHAR,
    address_line_2  VARCHAR,
    city            VARCHAR,
    state_province  VARCHAR,
    postal_code     VARCHAR,
    country_id      INTEGER,
    country         VARCHAR,
    country_short   VARCHAR,
    is_default      BOOLEAN,
    created_at      TIMESTAMPTZ,
    modified_at     TIMESTAMPTZ
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        a.id            AS address_id,
        a.number,
        a.street,
        a.address_line_1,
        a.address_line_2,
        a.city,
        a.state_province,
        a.postal_code,
        c.id            AS country_id,
        c.fullname      AS country,
        c.shortname     AS country_short,
        ca.is_default,
        a.created_at,
        a.modified_at
    FROM CST_customer_address ca
    INNER JOIN ADR_addresses a  ON a.id  = ca.ADR_address_id
    INNER JOIN ADR_country c    ON c.id  = a.ADR_country_id
    WHERE ca.CST_customer_id = p_customer_id_in
    ORDER BY ca.is_default DESC, a.created_at DESC;
END
$func$;

-- GET address by ID (verifica que pertenece al customer)
CREATE OR REPLACE FUNCTION FN_GET_ADDRESS_BY_ID(
    p_address_id_in   INTEGER,
    p_customer_id_in  UUID
)
RETURNS TABLE(
    address_id      INTEGER,
    number          VARCHAR,
    street          VARCHAR,
    address_line_1  VARCHAR,
    address_line_2  VARCHAR,
    city            VARCHAR,
    state_province  VARCHAR,
    postal_code     VARCHAR,
    country_id      INTEGER,
    country         VARCHAR,
    country_short   VARCHAR,
    is_default      BOOLEAN,
    created_at      TIMESTAMPTZ,
    modified_at     TIMESTAMPTZ
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        a.id            AS address_id,
        a.number,
        a.street,
        a.address_line_1,
        a.address_line_2,
        a.city,
        a.state_province,
        a.postal_code,
        c.id            AS country_id,
        c.fullname      AS country,
        c.shortname     AS country_short,
        ca.is_default,
        a.created_at,
        a.modified_at
    FROM CST_customer_address ca
    INNER JOIN ADR_addresses a ON a.id  = ca.ADR_address_id
    INNER JOIN ADR_country c   ON c.id  = a.ADR_country_id
    WHERE ca.ADR_address_id  = p_address_id_in
      AND ca.CST_customer_id = p_customer_id_in;
END
$func$;

-- ADD address
CREATE OR REPLACE FUNCTION FN_ADD_ADDRESS(
    p_customer_id_in   UUID,
    p_number_in        VARCHAR(250),
    p_street_in        VARCHAR(250),
    p_address_line_1   VARCHAR(250),
    p_address_line_2   VARCHAR(250),
    p_city_in          VARCHAR(250),
    p_state_province_in VARCHAR(250),
    p_postal_code_in   VARCHAR(250),
    p_country_id_in    INTEGER
)
RETURNS INTEGER AS
$func$
DECLARE
    v_address_id    INTEGER;
    v_is_default    BOOLEAN;
    v_address_count INTEGER;
BEGIN
    -- Si es la primera dirección → es default automáticamente
    SELECT COUNT(*) INTO v_address_count
    FROM CST_customer_address
    WHERE CST_customer_id = p_customer_id_in;

    v_is_default := (v_address_count = 0);

    -- Insertar dirección
    INSERT INTO ADR_addresses (
        number, street, address_line_1, address_line_2,
        city, state_province, postal_code, ADR_country_id
    )
    VALUES (
        p_number_in, p_street_in, p_address_line_1, p_address_line_2,
        p_city_in, p_state_province_in, p_postal_code_in, p_country_id_in
    )
    RETURNING id INTO v_address_id;

    -- Relacionar con el customer
    INSERT INTO CST_customer_address (CST_customer_id, ADR_address_id, is_default)
    VALUES (p_customer_id_in, v_address_id, v_is_default);

    RETURN v_address_id;
END;
$func$
LANGUAGE plpgsql;

-- EDIT address
CREATE OR REPLACE FUNCTION FN_EDIT_ADDRESS(
    p_address_id_in     INTEGER,
    p_customer_id_in    UUID,
    p_number_in         VARCHAR(250),
    p_street_in         VARCHAR(250),
    p_address_line_1    VARCHAR(250),
    p_address_line_2    VARCHAR(250),
    p_city_in           VARCHAR(250),
    p_state_province_in VARCHAR(250),
    p_postal_code_in    VARCHAR(250),
    p_country_id_in     INTEGER
) RETURNS BOOLEAN AS
$func$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Verificar que la dirección pertenece al customer
    SELECT EXISTS (
        SELECT 1 FROM CST_customer_address
        WHERE ADR_address_id  = p_address_id_in
          AND CST_customer_id = p_customer_id_in
    ) INTO v_exists;

    IF NOT v_exists THEN
        RETURN FALSE;
    END IF;

    UPDATE ADR_addresses SET
        number         = p_number_in,
        street         = p_street_in,
        address_line_1 = p_address_line_1,
        address_line_2 = p_address_line_2,
        city           = p_city_in,
        state_province = p_state_province_in,
        postal_code    = p_postal_code_in,
        ADR_country_id = p_country_id_in,
        modified_at    = NOW()
    WHERE id = p_address_id_in;

    RETURN TRUE;
END;
$func$
LANGUAGE plpgsql;

-- DELETE address
CREATE OR REPLACE FUNCTION FN_DEL_ADDRESS(
    p_address_id_in  INTEGER,
    p_customer_id_in UUID
) RETURNS BOOLEAN AS
$func$
DECLARE
    v_exists     BOOLEAN;
    v_is_default BOOLEAN;
BEGIN
    -- Verificar que pertenece al customer
    SELECT EXISTS (
        SELECT 1 FROM CST_customer_address
        WHERE ADR_address_id  = p_address_id_in
          AND CST_customer_id = p_customer_id_in
    ) INTO v_exists;

    IF NOT v_exists THEN
        RETURN FALSE;
    END IF;

    -- Verificar si era la default
    SELECT is_default INTO v_is_default
    FROM CST_customer_address
    WHERE ADR_address_id  = p_address_id_in
      AND CST_customer_id = p_customer_id_in;

    -- Eliminar relación
    DELETE FROM CST_customer_address
    WHERE ADR_address_id  = p_address_id_in
      AND CST_customer_id = p_customer_id_in;

    -- Eliminar dirección
    DELETE FROM ADR_addresses WHERE id = p_address_id_in;

    -- Si era default → asignar la más reciente como nueva default
    IF v_is_default THEN
        UPDATE CST_customer_address SET is_default = TRUE
        WHERE CST_customer_id = p_customer_id_in
          AND ADR_address_id = (
              SELECT ADR_address_id
              FROM CST_customer_address ca
              INNER JOIN ADR_addresses a ON a.id = ca.ADR_address_id
              WHERE ca.CST_customer_id = p_customer_id_in
              ORDER BY a.created_at DESC
              LIMIT 1
          );
    END IF;

    RETURN TRUE;
END;
$func$
LANGUAGE plpgsql;

-- SET DEFAULT address
CREATE OR REPLACE FUNCTION FN_SET_DEFAULT_ADDRESS(
    p_address_id_in  INTEGER,
    p_customer_id_in UUID
) RETURNS BOOLEAN AS
$func$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Verificar que pertenece al customer
    SELECT EXISTS (
        SELECT 1 FROM CST_customer_address
        WHERE ADR_address_id  = p_address_id_in
          AND CST_customer_id = p_customer_id_in
    ) INTO v_exists;

    IF NOT v_exists THEN
        RETURN FALSE;
    END IF;

    -- Quitar default de todas las direcciones del customer
    UPDATE CST_customer_address SET is_default = FALSE
    WHERE CST_customer_id = p_customer_id_in;

    -- Marcar la nueva default
    UPDATE CST_customer_address SET is_default = TRUE
    WHERE ADR_address_id  = p_address_id_in
      AND CST_customer_id = p_customer_id_in;

    RETURN TRUE;
END;
$func$
LANGUAGE plpgsql;

-- GET countries (para el formulario de dirección)
CREATE OR REPLACE FUNCTION FN_GET_COUNTRIES()
RETURNS TABLE(
    id        INTEGER,
    fullname  VARCHAR,
    shortname VARCHAR
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT c.id, c.fullname, c.shortname
    FROM ADR_country c
    ORDER BY c.fullname;
END
$func$;


/************************* SECURITY *************************/


/* REFRESH TOKENS */
-- Insertar refresh token para admin
CREATE OR REPLACE FUNCTION FN_ADD_REFRESH_TOKEN_ADM(
    p_adm_user_id_in UUID,
    p_token_in       VARCHAR(512),
    p_expires_at_in  TIMESTAMPTZ,
    p_ip_in          VARCHAR(45),
    p_user_agent_in  TEXT
) RETURNS INTEGER AS
$func$
DECLARE
    v_id INTEGER;
BEGIN
    INSERT INTO refresh_tokens
        (adm_user_id, token, expires_at, ip_address, user_agent)
    VALUES
        (p_adm_user_id_in, p_token_in, p_expires_at_in, p_ip_in, p_user_agent_in)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$func$
LANGUAGE plpgsql;

-- Insertar refresh token para customer
CREATE OR REPLACE FUNCTION FN_ADD_REFRESH_TOKEN_CST(
    p_cst_user_id_in UUID,
    p_token_in       VARCHAR(512),
    p_expires_at_in  TIMESTAMPTZ,
    p_ip_in          VARCHAR(45),
    p_user_agent_in  TEXT
) RETURNS INTEGER AS
$func$
DECLARE
    v_id INTEGER;
BEGIN
    INSERT INTO refresh_tokens
        (cst_user_id, token, expires_at, ip_address, user_agent)
    VALUES
        (p_cst_user_id_in, p_token_in, p_expires_at_in, p_ip_in, p_user_agent_in)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$func$
LANGUAGE plpgsql;

-- Obtener refresh token por hash
CREATE OR REPLACE FUNCTION FN_GET_REFRESH_TOKEN(
    p_token_in VARCHAR(512)
)
RETURNS TABLE(
    id          INTEGER,
    adm_user_id UUID,
    cst_user_id UUID,
    expires_at  TIMESTAMPTZ,
    revoked     BOOLEAN
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        rt.id,
        rt.adm_user_id,
        rt.cst_user_id,
        rt.expires_at,
        rt.revoked
    FROM refresh_tokens rt
    WHERE rt.token = p_token_in;
END;
$func$;

-- Revocar token por id
CREATE OR REPLACE FUNCTION FN_REVOKE_REFRESH_TOKEN(
    p_id_in INTEGER
) RETURNS VOID AS
$func$
BEGIN
    UPDATE refresh_tokens SET revoked = true WHERE id = p_id_in;
END;
$func$
LANGUAGE plpgsql;

-- Revocar todos los tokens de un admin
CREATE OR REPLACE FUNCTION FN_REVOKE_ALL_TOKENS_ADM(
    p_adm_user_id_in UUID
) RETURNS VOID AS
$func$
BEGIN
    UPDATE refresh_tokens 
    SET revoked = true 
    WHERE adm_user_id = p_adm_user_id_in;
END;
$func$
LANGUAGE plpgsql;

-- Revocar todos los tokens de un customer
CREATE OR REPLACE FUNCTION FN_REVOKE_ALL_TOKENS_CST(
    p_cst_user_id_in UUID
) RETURNS VOID AS
$func$
BEGIN
    UPDATE refresh_tokens 
    SET revoked = true 
    WHERE cst_user_id = p_cst_user_id_in;
END;
$func$
LANGUAGE plpgsql;

/* LOGIN ATTEMPTS */
-- Registrar intento de login
CREATE OR REPLACE FUNCTION FN_ADD_LOGIN_ATTEMPT(
    p_email_in     VARCHAR(255),
    p_user_type_in VARCHAR(10),
    p_ip_in        VARCHAR(45),
    p_success_in   BOOLEAN
) RETURNS VOID AS
$func$
BEGIN
    INSERT INTO login_attempts
        (email, user_type, ip_address, success)
    VALUES
        (p_email_in, p_user_type_in, p_ip_in, p_success_in);
END;
$func$
LANGUAGE plpgsql;

/* ADMIN USERS */
-- Obtener admin por email
CREATE OR REPLACE FUNCTION FN_GET_ADM_USER_BY_EMAIL(
    p_email_in VARCHAR(250)
)
RETURNS TABLE(
    id          UUID,
    firstname   VARCHAR,
    lastname    VARCHAR,
    email       VARCHAR,
    password    VARCHAR,
    role        VARCHAR,
    state       BOOLEAN
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.firstname,
        u.lastname,
        u.email,
        u.password,
        u.role,
        u.state
    FROM ADM_users u
    WHERE u.email = LOWER(p_email_in);
END;
$func$;

-- Obtener admin por id
CREATE OR REPLACE FUNCTION FN_GET_ADM_USER_BY_ID(
    p_id_in UUID
)
RETURNS TABLE(
    id          UUID,
    firstname   VARCHAR,
    lastname    VARCHAR,
    email       VARCHAR,
    role        VARCHAR,
    state       BOOLEAN,
    created_at  TIMESTAMPTZ
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.firstname,
        u.lastname,
        u.email,
        u.role,
        u.state,
        u.created_at
    FROM ADM_users u
    WHERE u.id = p_id_in;
END;
$func$;

-- Crear admin user
CREATE OR REPLACE FUNCTION FN_ADD_ADM_USER(
    p_firstname_in VARCHAR(250),
    p_lastname_in  VARCHAR(250),
    p_email_in     VARCHAR(250),
    p_password_in  VARCHAR(250),
    p_role_in      VARCHAR(20)
) RETURNS UUID AS
$func$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO ADM_users
        (firstname, lastname, email, password, role)
    VALUES
        (p_firstname_in, p_lastname_in, LOWER(p_email_in), p_password_in, p_role_in)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$func$
LANGUAGE plpgsql;

/* CUSTOMERS */
-- Obtener customer por email
CREATE OR REPLACE FUNCTION FN_GET_CST_USER_BY_EMAIL(
    p_email_in VARCHAR(250)
)
RETURNS TABLE(
    id          UUID,
    firstname   VARCHAR,
    lastname    VARCHAR,
    email       VARCHAR,
    password    VARCHAR,
    state       BOOLEAN
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.firstname,
        c.lastname,
        c.email,
        c.password,
        c.state
    FROM CST_customers c
    WHERE c.email = LOWER(p_email_in);
END;
$func$;

-- Obtener customer por id
CREATE OR REPLACE FUNCTION FN_GET_CST_USER_BY_ID(
    p_id_in UUID
)
RETURNS TABLE(
    id          UUID,
    firstname   VARCHAR,
    lastname    VARCHAR,
    email       VARCHAR,
    state       BOOLEAN,
    created_at  TIMESTAMPTZ
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.firstname,
        c.lastname,
        c.email,
        c.state,
        c.created_at
    FROM CST_customers c
    WHERE c.id = p_id_in;
END;
$func$;

-- Crear customer
CREATE OR REPLACE FUNCTION FN_ADD_CST_USER(
    p_firstname_in VARCHAR(250),
    p_lastname_in  VARCHAR(250),
    p_email_in     VARCHAR(250),
    p_password_in  VARCHAR(250)
) RETURNS UUID AS
$func$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO CST_customers
        (firstname, lastname, email, password)
    VALUES
        (p_firstname_in, p_lastname_in, LOWER(p_email_in), p_password_in)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$func$
LANGUAGE plpgsql;


/************************* PAGINATION HELPERS *************************/

-- BRANDS con paginación
CREATE OR REPLACE FUNCTION FN_GET_BRANDS_PAGINATED(
    p_limit_in  INTEGER,
    p_offset_in INTEGER
)
RETURNS TABLE(
    id         INTEGER,
    name       VARCHAR,
    state      BOOLEAN,
    created_at DATE,
    total      BIGINT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        b.id,
        b.name,
        b.state,
        date(b.created_at) AS created_at,
        COUNT(*) OVER() AS total
    FROM PRO_brands b
    ORDER BY b.id
    LIMIT p_limit_in
    OFFSET p_offset_in;
END
$func$;

-- CATEGORIES con paginación
CREATE OR REPLACE FUNCTION FN_GET_CATEGORIES_PAGINATED(
    p_limit_in  INTEGER,
    p_offset_in INTEGER
)
RETURNS TABLE(
    id         INTEGER,
    name       VARCHAR,
    state      BOOLEAN,
    created_at DATE,
    total      BIGINT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.name,
        c.state,
        date(c.created_at) AS created_at,
        COUNT(*) OVER() AS total
    FROM PRO_categorys c
    ORDER BY c.id
    LIMIT p_limit_in
    OFFSET p_offset_in;
END
$func$;

-- SUBCATEGORIES con paginación
CREATE OR REPLACE FUNCTION FN_GET_SUBCATEGORIES_PAGINATED(
    p_limit_in  INTEGER,
    p_offset_in INTEGER
)
RETURNS TABLE(
    id         INTEGER,
    name       VARCHAR,
    category   VARCHAR,
    state      BOOLEAN,
    created_at DATE,
    total      BIGINT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        sc.id,
        sc.name,
        c.name AS category,
        sc.state,
        date(sc.created_at) AS created_at,
        COUNT(*) OVER() AS total
    FROM PRO_subcategorys sc
    INNER JOIN PRO_categorys c ON c.id = sc.PRO_category_id
    ORDER BY sc.id
    LIMIT p_limit_in
    OFFSET p_offset_in;
END
$func$;

-- PRODUCTS con paginación
CREATE OR REPLACE FUNCTION FN_GET_PRODUCTS_PAGINATED(
    p_limit_in  INTEGER,
    p_offset_in INTEGER
)
RETURNS TABLE(
    id               INTEGER,
    name             VARCHAR,
    description      VARCHAR,
    long_description TEXT,
    state            BOOLEAN,
    created_at       DATE,
    subcategory      VARCHAR,
    brand            VARCHAR,
    total            BIGINT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.description,
        p.long_description,
        p.state,
        date(p.created_at) AS created_at,
        sc.name AS subcategory,
        b.name  AS brand,
        COUNT(*) OVER() AS total
    FROM products p
    INNER JOIN PRO_subcategorys sc ON sc.id = p.PRO_subcategory_id
    INNER JOIN PRO_brands b        ON b.id  = p.PRO_brand_id
    ORDER BY p.id
    LIMIT p_limit_in
    OFFSET p_offset_in;
END
$func$;

/************************* ADMIN *************************/

-- GET admins paginado
CREATE OR REPLACE FUNCTION FN_GET_ADM_USERS_PAGINATED(
    p_limit_in  INTEGER,
    p_offset_in INTEGER
)
RETURNS TABLE(
    id          UUID,
    firstname   VARCHAR,
    lastname    VARCHAR,
    email       VARCHAR,
    role        VARCHAR,
    state       BOOLEAN,
    created_at  TIMESTAMPTZ,
    total       BIGINT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        u.id,
        u.firstname,
        u.lastname,
        u.email,
        u.role,
        u.state,
        u.created_at,
        COUNT(*) OVER() AS total
    FROM ADM_users u
    ORDER BY u.created_at DESC
    LIMIT p_limit_in
    OFFSET p_offset_in;
END
$func$;

-- GET customers paginado
CREATE OR REPLACE FUNCTION FN_GET_CST_USERS_PAGINATED(
    p_limit_in  INTEGER,
    p_offset_in INTEGER
)
RETURNS TABLE(
    id          UUID,
    firstname   VARCHAR,
    lastname    VARCHAR,
    email       VARCHAR,
    state       BOOLEAN,
    created_at  TIMESTAMPTZ,
    total       BIGINT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.firstname,
        c.lastname,
        c.email,
        c.state,
        c.created_at,
        COUNT(*) OVER() AS total
    FROM CST_customers c
    ORDER BY c.created_at DESC
    LIMIT p_limit_in
    OFFSET p_offset_in;
END
$func$;

-- GET login attempts paginado
CREATE OR REPLACE FUNCTION FN_GET_LOGIN_ATTEMPTS_PAGINATED(
    p_limit_in  INTEGER,
    p_offset_in INTEGER
)
RETURNS TABLE(
    id           INTEGER,
    email        VARCHAR,
    user_type    VARCHAR,
    ip_address   VARCHAR,
    success      BOOLEAN,
    attempted_at TIMESTAMPTZ,
    total        BIGINT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        la.id,
        la.email,
        la.user_type,
        la.ip_address,
        la.success,
        la.attempted_at,
        COUNT(*) OVER() AS total
    FROM login_attempts la
    ORDER BY la.attempted_at DESC
    LIMIT p_limit_in
    OFFSET p_offset_in;
END
$func$;

-- GET active refresh tokens paginado
CREATE OR REPLACE FUNCTION FN_GET_ACTIVE_TOKENS_PAGINATED(
    p_limit_in  INTEGER,
    p_offset_in INTEGER
)
RETURNS TABLE(
    id          INTEGER,
    user_id     UUID,
    user_type   VARCHAR,
    ip_address  VARCHAR,
    user_agent  TEXT,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ,
    total       BIGINT
)
LANGUAGE plpgsql AS
$func$
BEGIN
    RETURN QUERY
    SELECT
        rt.id,
        COALESCE(rt.adm_user_id, rt.cst_user_id) AS user_id,
        CASE
            WHEN rt.adm_user_id IS NOT NULL THEN 'admin'
            ELSE 'customer'
        END::VARCHAR AS user_type,
        rt.ip_address,
        rt.user_agent,
        rt.expires_at,
        rt.created_at,
        COUNT(*) OVER() AS total
    FROM refresh_tokens rt
    WHERE rt.revoked = false
      AND rt.expires_at > NOW()
    ORDER BY rt.created_at DESC
    LIMIT p_limit_in
    OFFSET p_offset_in;
END
$func$;

-- Cambiar state de admin user
CREATE OR REPLACE FUNCTION FN_TOGGLE_ADM_USER_STATE(
    p_id_in    UUID,
    p_state_in BOOLEAN
) RETURNS VOID AS
$func$
BEGIN
    UPDATE ADM_users SET state = p_state_in WHERE id = p_id_in;
END;
$func$
LANGUAGE plpgsql;

-- Cambiar state de customer
CREATE OR REPLACE FUNCTION FN_TOGGLE_CST_USER_STATE(
    p_id_in    UUID,
    p_state_in BOOLEAN
) RETURNS VOID AS
$func$
BEGIN
    UPDATE CST_customers SET state = p_state_in WHERE id = p_id_in;
END;
$func$
LANGUAGE plpgsql;