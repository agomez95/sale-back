import { Request, Response, NextFunction } from 'express';
import { HttpError } from './http-error';
import { logError } from '../utils/logger';

interface ErrorPayload {
    success: false;
    error: {
        message: string;
        statusCode: number;
        details?: Record<string, unknown>;
        stack?: string;
    };
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
): void {
    const isHttpError = err instanceof HttpError;
    const statusCode = isHttpError ? (err as HttpError).statusCode : 500;

    // Solo loguear errores 5xx (problemas reales del servidor)
    // Los 4xx son errores esperados del cliente
    if (statusCode >= 500) {
        logError(err.message, {
            method: req.method,
            path: req.path,
            statusCode,
            stack: err.stack
        });
    }

    // Para errores 5xx no exponer detalles internos
    const message = statusCode >= 500
        ? 'Internal Server Error'
        : err.message || 'Unknown Error';

    const payload: ErrorPayload = {
        success: false,
        error: {
            message,
            statusCode
        }
    };

    // Solo incluir details si existen y no es error 5xx
    if (
        isHttpError &&
        (err as HttpError).details &&
        Object.keys((err as HttpError).details).length > 0 &&
        statusCode < 500
    ) {
        payload.error.details = (err as HttpError).details;
    }

    // Stack trace solo en desarrollo
    if (process.env.NODE_ENV === 'development') {
        payload.error.stack = err.stack;
    }

    res.status(statusCode).json(payload);
}