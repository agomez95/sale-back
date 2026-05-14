import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokens';
import { UnauthorizedError, ForbiddenError } from '../errors/http-error';
import { TokenPayload, UserRole } from '../types/index';

// ─── Extensión local de Request ──────────────────────
interface AuthRequest extends Request {
    user?: TokenPayload;
}

// ─── Extender Request globalmente ────────────────────
declare module 'express-serve-static-core' {
    interface Request {
        user?: TokenPayload;
    }
}

// ─── Verificar Access Token ───────────────────────────
export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        next(new UnauthorizedError('Access token required'));
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = verifyAccessToken(token);
        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            next(new UnauthorizedError('Token expired', { code: 'TOKEN_EXPIRED' }));
        } else {
            next(new UnauthorizedError('Invalid token'));
        }
    }
};

// ─── Verificar Rol ────────────────────────────────────
export const requireRole = (...roles: Array<UserRole | 'customer'>) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            next(new UnauthorizedError('Not authenticated'));
            return;
        }

        if (!roles.includes(req.user.role)) {
            next(new ForbiddenError(
                `Required role: ${roles.join(' or ')}`,
                { userRole: req.user.role }
            ));
            return;
        }

        next();
    };
};