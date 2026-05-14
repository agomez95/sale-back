-- Extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PRODUCTS:

CREATE TABLE PRO_categorys(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    state BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP
);

CREATE TABLE PRO_subcategorys(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    state BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    PRO_category_id INTEGER NOT NULL
);

ALTER TABLE PRO_subcategorys ADD CONSTRAINT fk_subcategorys_categorys FOREIGN KEY (PRO_category_id) REFERENCES PRO_categorys (id);

CREATE TABLE PRO_brands(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    state BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP
);

CREATE TABLE products(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    description VARCHAR(250) NOT NULL,
	long_description TEXT NOT NULL,
    state BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    PRO_subcategory_id INTEGER NOT NULL,
    PRO_brand_id INTEGER NOT NULL
);

ALTER TABLE products ADD CONSTRAINT fk_products_subcategorys FOREIGN KEY (PRO_subcategory_id) REFERENCES PRO_subcategorys (id);
ALTER TABLE products ADD CONSTRAINT fk_products_brands FOREIGN KEY (PRO_brand_id) REFERENCES PRO_brands (id);

-- CREATE TABLE PRO_prices(
--     id SERIAL NOT NULL PRIMARY KEY,
--     price DECIMAL(10,2) NOT NULL,
--     state BOOLEAN NOT NULL,
--     created_at TIMESTAMP,
--     modified_at TIMESTAMP,
--     PRO_id INTEGER NOT NULL
-- );

CREATE TABLE specificaction_constants(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    state BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP
);

INSERT INTO specificaction_constants (name, state, created_at, modified_at) VALUES ('COLOR', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 
INSERT INTO specificaction_constants (name, state, created_at, modified_at) VALUES ('SIZE', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 
INSERT INTO specificaction_constants (name, state, created_at, modified_at) VALUES ('TEXT', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 

CREATE TABLE PRO_specifications(
    id SERIAL NOT NULL PRIMARY KEY,
    state BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    specification_constant_id INTEGER NOT NULL,
    PRO_subcategory_id INTEGER NOT NULL
);

ALTER TABLE PRO_specifications ADD CONSTRAINT fk_products_specifications_constants FOREIGN KEY (specification_constant_id) REFERENCES specificaction_constants (id);
ALTER TABLE PRO_specifications ADD CONSTRAINT fk_products_specifications_subcategorys FOREIGN KEY (PRO_subcategory_id) REFERENCES PRO_subcategorys (id);

CREATE TABLE PRO_specification_values (
    id SERIAL NOT NULL PRIMARY KEY,
    value VARCHAR(250) NOT NULL,
    state BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    PRO_specification_id INTEGER NOT NULL
);

ALTER TABLE PRO_specification_values ADD CONSTRAINT fk_products_specification_values_specifications FOREIGN KEY (PRO_specification_id) REFERENCES PRO_specifications (id);

CREATE TABLE PRO_variants(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(250) NOT NULL,
    stock INTEGER NOT NULL,
    cost NUMERIC NOT NULL,
    is_available BOOLEAN NOT NULL,
    state BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    PRO_id INTEGER NOT NULL
);

ALTER TABLE PRO_variants ADD CONSTRAINT fk_products_variants_products FOREIGN KEY (PRO_id) REFERENCES products (id);

CREATE TABLE PRO_variant_specification_values(
    id SERIAL NOT NULL PRIMARY KEY,
    state BOOLEAN NOT NULL,
    created_at TIMESTAMP,
    modified_at TIMESTAMP,
    PRO_variant_id INTEGER NOT NULL,
    PRO_specification_value_id INTEGER NOT NULL
);

ALTER TABLE PRO_variant_specification_values ADD CONSTRAINT fk_products_variant_specification_values_variants FOREIGN KEY (PRO_variant_id) REFERENCES PRO_variants (id);
ALTER TABLE PRO_variant_specification_values ADD CONSTRAINT fk_products_variant_specification_values_specification_values FOREIGN KEY (PRO_specification_value_id) REFERENCES PRO_specification_values (id);


CREATE TABLE PRO_photo_attributes(
	id SERIAL NOT NULL PRIMARY KEY,
	size FLOAT NOT NULL,
	height INTEGER NOT NULL,
	width INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL
);

CREATE TABLE PRO_photo_storage(
	id SERIAL NOT NULL PRIMARY KEY,
	route VARCHAR(700) NOT NULL
);

CREATE TABLE PRO_photos(
	id SERIAL NOT NULL PRIMARY KEY,
	name VARCHAR(500) NOT NULL,
    PRO_photo_attribute_id INTEGER NOT NULL,
    PRO_photo_storage_id INTEGER NOT NULL
);

ALTER TABLE PRO_photos ADD CONSTRAINT fk_PRO_photos_PRO_photo_attributes FOREIGN KEY (PRO_photo_attribute_id) REFERENCES PRO_photo_attributes (id);
ALTER TABLE PRO_photos ADD CONSTRAINT fk_PRO_photos_PRO_photo_storage FOREIGN KEY (PRO_photo_storage_id) REFERENCES PRO_photo_storage (id);

CREATE TABLE PRO_photo_configuration(
	PRO_variant_id INTEGER NOT NULL,
	PRO_photo_id INTEGER NOT NULL
);

ALTER TABLE PRO_photo_configuration ADD CONSTRAINT fk_PRO_photo_configuration_products FOREIGN KEY (PRO_variant_id) REFERENCES PRO_variants (id);
ALTER TABLE PRO_photo_configuration ADD CONSTRAINT fk_PRO_photo_configuration_PRO_images FOREIGN KEY (PRO_photo_id) REFERENCES PRO_photos (id);

-- CUSTOMERS & ADDRESS

CREATE TABLE CST_customers (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firstname   VARCHAR(250) NOT NULL,
    lastname    VARCHAR(250) NOT NULL,
    email       VARCHAR(250) NOT NULL UNIQUE,
    password    VARCHAR(250) NOT NULL,
    state       BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    modified_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ADR_country (
    id        SERIAL NOT NULL PRIMARY KEY,
    fullname  VARCHAR(250) NOT NULL UNIQUE,
    shortname VARCHAR(250) NOT NULL
);

INSERT INTO ADR_country (fullname, shortname) VALUES ('Peru', 'pe');
INSERT INTO ADR_country (fullname, shortname) VALUES ('Spain', 'es');
INSERT INTO ADR_country (fullname, shortname) VALUES ('United States', 'us');

CREATE TABLE ADR_addresses (
    id             SERIAL NOT NULL PRIMARY KEY,
    number         VARCHAR(250) NOT NULL,
    street         VARCHAR(250) NOT NULL,
    address_line_1 VARCHAR(250),
    address_line_2 VARCHAR(250),
    city           VARCHAR(250) NOT NULL,
    state_province VARCHAR(250) NOT NULL,
    postal_code    VARCHAR(250) NOT NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    modified_at    TIMESTAMPTZ DEFAULT NOW(),
    ADR_country_id INTEGER NOT NULL
);

ALTER TABLE ADR_addresses 
    ADD CONSTRAINT fk_address_country 
    FOREIGN KEY (ADR_country_id) REFERENCES ADR_country(id);

CREATE TABLE CST_customer_address (
    CST_customer_id UUID    NOT NULL REFERENCES CST_customers(id) ON DELETE CASCADE,
    ADR_address_id  INTEGER NOT NULL REFERENCES ADR_addresses(id) ON DELETE CASCADE,
    is_default      BOOLEAN NOT NULL DEFAULT false,
    PRIMARY KEY (CST_customer_id, ADR_address_id)
);

-- ─── PAYMENT ──────────────────────────────────────────

CREATE TABLE PMT_methods (
    id    SERIAL NOT NULL PRIMARY KEY,
    name  VARCHAR(250) NOT NULL UNIQUE,
    state BOOLEAN NOT NULL
);

CREATE TABLE CST_payment_method (
    id              SERIAL NOT NULL PRIMARY KEY,
    provider        VARCHAR(250) NOT NULL,
    account         VARCHAR(250) NOT NULL,
    expiry          VARCHAR NOT NULL,
    is_default      BOOLEAN NOT NULL,
    state           BOOLEAN NOT NULL,
    PMT_method_id   INTEGER NOT NULL,
    CST_customer_id UUID NOT NULL,
    CONSTRAINT fk_payment_method_pmt
        FOREIGN KEY (PMT_method_id) REFERENCES PMT_methods(id),
    CONSTRAINT fk_payment_method_customer
        FOREIGN KEY (CST_customer_id) REFERENCES CST_customers(id)
);

-- SECURITY

-- ─── USUARIOS DEL SISTEMA ────────────────────────────────
CREATE TABLE ADM_users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firstname   VARCHAR(250) NOT NULL,
    lastname    VARCHAR(250) NOT NULL,
    email       VARCHAR(250) UNIQUE NOT NULL,
    password    VARCHAR(250) NOT NULL,       -- bcrypt hash
    role        VARCHAR(20) NOT NULL DEFAULT 'editor'
                CHECK (role IN ('admin', 'editor')),
    state       BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── REFRESH TOKENS (compartido para ambos tipos) ────────
CREATE TABLE refresh_tokens (
    id           SERIAL PRIMARY KEY,
    -- Puede pertenecer a un admin O a un customer
    adm_user_id  UUID REFERENCES ADM_users(id) ON DELETE CASCADE,
    cst_user_id  UUID REFERENCES CST_customers(id) ON DELETE CASCADE,
    token        VARCHAR(512) UNIQUE NOT NULL,
    expires_at   TIMESTAMPTZ NOT NULL,
    revoked      BOOLEAN NOT NULL DEFAULT false,
    ip_address   VARCHAR(45),
    user_agent   TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Solo uno de los dos IDs puede estar activo
    CONSTRAINT chk_one_user CHECK (
        (adm_user_id IS NULL) != (cst_user_id IS NULL)
    )
);

-- ─── INTENTOS DE LOGIN ───────────────────────────────────
CREATE TABLE login_attempts (
    id           SERIAL PRIMARY KEY,
    email        VARCHAR(255) NOT NULL,
    user_type    VARCHAR(10) NOT NULL CHECK (user_type IN ('admin', 'customer')),
    ip_address   VARCHAR(45) NOT NULL,
    success      BOOLEAN NOT NULL DEFAULT false,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── ÍNDICES ─────────────────────────────────────────────
CREATE INDEX idx_refresh_tokens_adm_user ON refresh_tokens(adm_user_id);
CREATE INDEX idx_refresh_tokens_cst_user ON refresh_tokens(cst_user_id);
CREATE INDEX idx_refresh_tokens_token    ON refresh_tokens(token);
CREATE INDEX idx_login_attempts_email    ON login_attempts(email, attempted_at);
CREATE INDEX idx_login_attempts_ip       ON login_attempts(ip_address, attempted_at);