import app from './app';
import config from './shared/config/env';
import db from './shared/database/connection';
import { logSuccess, logError, logInfo, registerProcessHandlers } from './shared/utils/index';

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

// Función para esperar a que la base de datos esté disponible antes de iniciar el servidor, con reintentos y logging.
const waitForDatabase = async (retries = MAX_RETRIES): Promise<void> => {
    try {
        logInfo(`Connecting to database... (attempt ${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
        await db.connect();
        logSuccess('Database connected successfully');
    } catch (error) {
        if (retries <= 1) {
            logError('Could not connect to database after max retries');
            throw error;
        }
        logInfo(`Retrying in ${RETRY_DELAY / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return waitForDatabase(retries - 1);
    }
};

const serverStart = async (): Promise<void> => {
    try {
        // 1. Registrar handlers de proceso
        registerProcessHandlers();

        // 2. Conectar DB
        await waitForDatabase();

        // 3. Arrancar el servidor
        app.listen(config.PORT, () => {
            logSuccess(`Server running on port: ${config.PORT}`);
            logInfo(`API: http://localhost:${config.PORT}/sales/api`);
            logInfo(`Environment: ${process.env.NODE_ENV}`);
        });

    } catch (error) {
        logError('Server startup failed', { path: 'server' });
        process.exit(1);
    }
};

serverStart();