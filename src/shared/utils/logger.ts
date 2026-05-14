import chalk from 'chalk';
import { LogContext } from '../types/index';

const SERVICE_NAME = process.env.SERVICE_NAME || 'sale-back';

// ─── Logger Utility ───────────────────────────────────────
// Este módulo proporciona funciones de logging con formato consistente y colores para diferentes niveles de log.
// Cada función de log acepta un mensaje y un contexto opcional que puede incluir información sobre la solicitud 
// (método, ruta, código de estado, duración, etc.).
// El formato del log es: [timestamp] [service-name] [level] [request] [method] [path] - [statusCode] - [duration]ms - message

/**
 * Obtiene el timestamp actual en formato ISO.
 * @returns El timestamp actual como string ISO.
 */
function getTimestamp(): string {
    return new Date().toISOString();
}

/**
 * Registra un mensaje de log con el formato específico.
 * @param level: INFO, SUCCESS, ERROR, WARN
 * @param color: chalk color function
 * @param message: log message
 * @param context 
 */
function log(
    level: string,
    color: (text: string) => string,
    message: string,
    context: LogContext = {}
): void {
    const timestamp = getTimestamp();
    const method = context.method ? `[${context.method}]` : 'N/A';
    const path = context.path ? `[${context.path}]` : 'N/A';
    const statusCode = context.statusCode ? `${context.statusCode}` : 'N/A';
    const duration = context.duration ? `${context.duration}` : '0';

    const logMessage = `[${timestamp}] [${SERVICE_NAME}] [${level}] [REQUEST] ${method} ${path} - ${statusCode} - ${duration}ms - ${message}`;

    if (level === 'ERROR') {
        console.error(color(logMessage));
    } else if (level === 'WARN') {
        console.warn(color(logMessage));
    } else {
        console.log(color(logMessage));
    }
}

export function logInfo(message: string, context: LogContext = {}): void {
    log('INFO', chalk.blue, message, context);
}

export function logSuccess(message: string, context: LogContext = {}): void {
    log('SUCCESS', chalk.green, message, context);
}

export function logError(message: string, context: LogContext = {}): void {
    log('ERROR', chalk.red, message, context);
}

export function logWarn(message: string, context: LogContext = {}): void {
    log('WARN', chalk.yellow, message, context);
}