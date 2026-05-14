import { Client, QueryResult, QueryResultRow } from 'pg';
import config from '../config/env';
import { logSuccess, logError } from '../utils/index';

interface QueryParams {
    [key: string]: unknown;
}

class Database {
    private client: Client;
    private connected: boolean = false;

    constructor() {
        this.client = new Client({
            user:     config.PG_USER_LOCAL,
            host:     config.PG_HOST_LOCAL,
            database: config.PG_DB_LOCAL,
            password: config.PG_PASSWORD_LOCAL,
            port:     parseInt(config.PG_PORT_LOCAL)
        });
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            this.connected = true;
            logSuccess('Database connected successfully');
        } catch (error) {
            logError('Database connection failed', {
                path: 'database/connection'
            });
            throw error;
        }
    }

    // ← Agregamos "extends QueryResultRow" como constraint
    async query<T extends QueryResultRow>(
        query: string,
        values?: unknown[]
    ): Promise<T[]> {
        const result: QueryResult<T> = await this.client.query<T>(query, values);
        return result.rows;
    }

    async callFunction<T extends QueryResultRow>(
        functionName: string,
        params: QueryParams,
        getOne = false
    ): Promise<T[]> {
        const keys = Object.keys(params);
        const variables = keys.map((_, i) => `$${i + 1}`);
        const values = keys.map(key => params[key]);

        const query = getOne
            ? `SELECT * FROM ${functionName}(${variables.join(',')});`
            : `SELECT ${functionName}(${variables.join(',')});`;

        const result: QueryResult<T> = await this.client.query<T>(query, values);
        return result.rows;
    }

    async close(): Promise<void> {
        await this.client.end();
        this.connected = false;
        logSuccess('Database connection closed');
    }

    isConnected(): boolean {
        return this.connected;
    }
}

const db = new Database();
export default db;