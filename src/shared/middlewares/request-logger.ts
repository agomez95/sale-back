import { Request, Response, NextFunction } from 'express';
import { logInfo, logSuccess, logWarn, logError } from '../utils/logger';
import { STATUS_RANGES, MESSAGES_LOGGER } from '../utils/constants';
import { LogContext } from '../types/index';

type LoggerFn = (msg: string, ctx: LogContext) => void;

const LOGGERS: Record<string, LoggerFn> = {
    serverError: (msg, ctx) => logError(msg, ctx),
    clientError: (msg, ctx) => logWarn(msg, ctx),
    notFound:    (msg, ctx) => logInfo(msg, ctx),
    success:     (msg, ctx) => logSuccess(msg, ctx),
    default:     (msg, ctx) => logInfo(msg, ctx),
};

function redirection(status: number, context: LogContext): void {
    if (status === 404) {
        return LOGGERS.notFound(MESSAGES_LOGGER.notFound || 'Resource not found', context);
    }

    for (const [type, range] of STATUS_RANGES.entries()) {
        if (status >= range.min && status <= range.max) {
            return LOGGERS[type](MESSAGES_LOGGER[type], context);
        }
    }

    LOGGERS.default(MESSAGES_LOGGER.default, context);
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
        const context: LogContext = {
            method:     req.method,
            path:       req.path,
            statusCode: res.statusCode,
            duration:   Date.now() - start
        };

        redirection(res.statusCode, context);
    });

    next();
}