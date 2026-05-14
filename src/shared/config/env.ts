import { HttpError } from '../errors/index';

interface Config {
    PORT: string;
    ACCESS_SECRET: string;
    API_LOCAL: string;
    PG_PORT_LOCAL: string;
    PG_HOST_LOCAL: string;
    PG_USER_LOCAL: string;
    PG_PASSWORD_LOCAL: string;
    PG_DB_LOCAL: string;
    JWT_ACCESS_EXPIRY: string;
    JWT_REFRESH_EXPIRY: string;
}

const loadEnv = (variable: string, required = false): string => {
    const param = process.env[variable];

    if (!param) {
        if (required) throw new HttpError(500, `ENV VARIABLE IS NOT DEFINED: ${variable}`);
        return '';
    }

    return param;
};

const config: Config = {
    PORT:               loadEnv('PORT', true),
    ACCESS_SECRET:      loadEnv('ACCESS_SECRET', true),
    API_LOCAL:          loadEnv('API_LOCAL', true),
    PG_PORT_LOCAL:      loadEnv('PG_PORT_LOCAL', true),
    PG_HOST_LOCAL:      loadEnv('PG_HOST_LOCAL', true),
    PG_USER_LOCAL:      loadEnv('PG_USER_LOCAL', true),
    PG_PASSWORD_LOCAL:  loadEnv('PG_PASSWORD_LOCAL', true),
    PG_DB_LOCAL:        loadEnv('PG_DB_LOCAL', true),
    JWT_ACCESS_EXPIRY:  loadEnv('JWT_ACCESS_EXPIRY', true),
    JWT_REFRESH_EXPIRY: loadEnv('JWT_REFRESH_EXPIRY', true),
};

export default config;