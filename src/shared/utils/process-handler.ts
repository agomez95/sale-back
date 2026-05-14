import { logError, logWarn, logInfo } from './logger';
import db from '../database/connection';

/**
 * Process Handlers:
 * 
 * Funciones para manejar eventos del proceso Node.js, como errores no capturados y señales de terminación.
 * Esto asegura que el servidor pueda cerrar conexiones de manera limpia y loguear información relevante en caso de errores.
 */

export const registerProcessHandlers = (): void => {

    // ─── Errores no capturados ────────────────────────────

    process.on('uncaughtException', (error: Error) => {
        logError('Uncaught Exception', {
            stack: error.stack
        });
        process.exit(1);
    });

    process.on('unhandledRejection', (reason: unknown) => {
        logWarn('Unhandled Rejection', {
            stack: reason instanceof Error
                ? reason.stack
                : String(reason)
        });
        // Express 5 captura errores async de rutas
        // solo logueamos, no matamos el proceso
    });

    // ─── Cierre limpio ────────────────────────────────────

    const gracefulShutdown = async (signal: string): Promise<void> => {
        logWarn(`${signal} received — closing gracefully`);
        try {
            await db.close();
            logInfo('Database connection closed');
            process.exit(0);
        } catch (error) {
            logError('Error during graceful shutdown');
            process.exit(1);
        }
    };

    // Captura señales de terminación para cerrar conexiones de manera limpia
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
};