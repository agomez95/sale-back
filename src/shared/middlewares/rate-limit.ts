import rateLimit from 'express-rate-limit';
import db from '../database/connection';

// ─── Rate limit global ────────────────────────────────
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minuto
    max:      60,         // 60 requests por minuto
    standardHeaders: true,
    legacyHeaders:   false,
    message: {
        success: false,
        error: {
            message:    'Too many requests, please try again later',
            statusCode: 429
        }
    }
});

// ─── Rate limit para login ────────────────────────────
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max:      5,               // 5 intentos
    standardHeaders: true,
    legacyHeaders:   false,
    handler: async (req, res) => {
        const ip    = req.socket.remoteAddress || '';
        const email = req.body?.email || 'unknown';
        const type  = req.body?.type  || 'unknown';

        // Registrar en DB para auditoría
        try {
            await db.query(
                `INSERT INTO login_attempts (email, user_type, ip_address, success)
                 VALUES ($1, $2, $3, false)`,
                [email, type, ip]
            );
        } catch { /* no crítico */ }

        res.status(429).json({
            success: false,
            error: {
                message:    'Too many login attempts. Wait 15 minutes.',
                statusCode: 429
            }
        });
    }
});

// ─── Rate limit para refresh token ───────────────────
export const refreshLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max:      10,        // 10 renovaciones por minuto
    message: {
        success: false,
        error: {
            message:    'Too many token refresh attempts',
            statusCode: 429
        }
    }
});