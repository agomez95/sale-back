import { Request, Response, NextFunction } from 'express';
import { logWarn, logInfo } from '../utils/index';

const ISP_BLACKLIST = [
    'AWS', 'AMAZON', 'GOOGLE CLOUD', 'AZURE', 'MICROSOFT',
    'DIGITALOCEAN', 'LINODE', 'VULTR', 'HETZNER', 'OVH',
    'NORDVPN', 'EXPRESSVPN', 'CLOUDFLARE', 'PROTONVPN',
    'DATACENTER', 'HOSTING', 'VPS', 'SERVER'
] as const;

interface IpWhoResponse {
    success: boolean;
    connection: {
        isp: string;
        org: string;
    };
}

const ipCache = new Map<string, { blocked: boolean; ts: number }>();
const CACHE_TTL_MS  = 10 * 60 * 1000; // 10 minutos por entrada
const CLEANUP_MS    = 30 * 60 * 1000; // limpiar cada 30 minutos

// ─── Limpieza automática ──────────────────────────────
const cleanupCache = (): void => {
    const now = Date.now();
    let deleted = 0;

    for (const [ip, data] of ipCache.entries()) {
        if (now - data.ts > CACHE_TTL_MS) {
            ipCache.delete(ip);
            deleted++;
        }
    }

    if (deleted > 0) {
        logInfo(`IP cache cleaned: ${deleted} entries removed`, {
            path: 'ip-guard/cleanup'
        });
    }
};

// Ejecutar limpieza cada 30 minutos automáticamente
const cleanupInterval = setInterval(cleanupCache, CLEANUP_MS);

// ─── Limpiar interval al cerrar el servidor ───────────
// Evita que Node.js quede colgado al hacer SIGTERM
process.on('SIGTERM', () => clearInterval(cleanupInterval));
process.on('SIGINT',  () => clearInterval(cleanupInterval));

// ─── Función para limpiar manualmente ────────────────
export const clearIpCache = (): void => {
    const size = ipCache.size;
    ipCache.clear();
    logInfo(`IP cache manually cleared: ${size} entries`, {
        path: 'ip-guard/clearIpCache'
    });
};

// ─── Función para ver el estado del cache ────────────
export const getIpCacheStats = (): {
    size: number;
    blocked: number;
    allowed: number;
} => {
    let blocked = 0;
    let allowed = 0;

    for (const data of ipCache.values()) {
        data.blocked ? blocked++ : allowed++;
    }

    return { size: ipCache.size, blocked, allowed };
};

export const ipGuard = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const ip = (
        req.headers['x-forwarded-for'] as string ||
        req.socket.remoteAddress || ''
    ).split(',')[0].trim();

    if (
        ip === '127.0.0.1'        ||
        ip === '::1'              ||
        ip === '::ffff:127.0.0.1'
    ) {
        next();
        return;
    }

    const cached = ipCache.get(ip);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
        if (cached.blocked) {
            res.status(403).json({
                success: false,
                error: {
                    message:    'Access denied from this network',
                    statusCode: 403
                }
            });
            return;
        }
        next();
        return;
    }

    try {
        const response = await fetch(`https://ipwho.is/${ip}`);
        const data = await response.json() as IpWhoResponse;

        if (!data?.success) {
            next();
            return;
        }

        const isp = (data.connection?.isp || '').toUpperCase();
        const org = (data.connection?.org || '').toUpperCase();

        const isBlocked = ISP_BLACKLIST.some(word =>
            isp.includes(word) || org.includes(word)
        );

        ipCache.set(ip, { blocked: isBlocked, ts: Date.now() });

        if (isBlocked) {
            logWarn('Blocked IP attempt', {
                path:   'ip-guard',
                method: req.method
            });

            res.status(403).json({
                success: false,
                error: {
                    message:    'Access denied from this network',
                    statusCode: 403
                }
            });
            return;
        }

        next();
    } catch {
        next();
    }
};