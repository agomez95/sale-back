import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../database/connection';
import config from '../config/env';
import { TokenPayload, AuthTokens } from '../types/index';
import { QUERIES } from '../database/queries';
import { logWarn, logInfo } from './index';

// ─── Generar Access Token ─────────────────────────────

export const generateAccessToken = (payload: TokenPayload): string => {
    const options: SignOptions = {
        expiresIn: config.JWT_ACCESS_EXPIRY as SignOptions['expiresIn'],
        issuer:    'sale-back'
    };
    return jwt.sign(payload as object, config.ACCESS_SECRET, options);
};

// ─── Generar Refresh Token ────────────────────────────

export const generateRefreshToken = async (
    userId: string,
    userType: 'admin' | 'customer',
    ip: string,
    userAgent: string
): Promise<string> => {
    const rawToken = crypto.randomBytes(64).toString('hex');

    const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Usar función SQL según tipo de usuario
    const fnName = userType === 'admin'
        ? QUERIES.TOKEN.ADD_ADM
        : QUERIES.TOKEN.ADD_CST;

    await db.callFunction(fnName, {
        user_id:    userId,
        token:      hashedToken,
        expires_at: expiresAt,
        ip:         ip,
        user_agent: userAgent
    });

    return rawToken;
};

// ─── Generar par de tokens ────────────────────────────

export const generateTokenPair = async (
    payload: TokenPayload,
    ip: string,
    userAgent: string
): Promise<AuthTokens> => {
    const accessToken  = generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(
        payload.userId,
        payload.type,
        ip,
        userAgent
    );
    return { accessToken, refreshToken };
};

// ─── Verificar Access Token ───────────────────────────

export const verifyAccessToken = (token: string): TokenPayload => {
    return jwt.verify(token, config.ACCESS_SECRET, {
        issuer: 'sale-back'
    }) as TokenPayload;
};

// ─── Rotar Refresh Token ──────────────────────────────

export const rotateRefreshToken = async (
    rawToken: string,
    ip: string,
    userAgent: string
): Promise<{ tokens: AuthTokens; payload: TokenPayload } | null> => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');

    // Buscar token usando función SQL
    const result = await db.callFunction<{
        id: number;
        adm_user_id: string | null;
        cst_user_id: string | null;
        expires_at: Date;
        revoked: boolean;
    }>(QUERIES.TOKEN.GET, { token: hashedToken }, true);

    const tokenRow = result[0];
    if (!tokenRow) return null;

    // ⚠️ Detección de reutilización
    if (tokenRow.revoked) {
        const userId   = tokenRow.adm_user_id || tokenRow.cst_user_id;
        const userType = tokenRow.adm_user_id ? 'admin' : 'customer';
        const fnRevoke = userType === 'admin'
            ? QUERIES.TOKEN.REVOKE_ALL_ADM
            : QUERIES.TOKEN.REVOKE_ALL_CST;

        await db.callFunction(fnRevoke, { user_id: userId });

        logWarn('Token reuse detected — possible theft', {
            path: 'tokens/rotateRefreshToken'
        });
        return null;
    }

    // Token expirado
    if (new Date() > new Date(tokenRow.expires_at)) {
        await db.callFunction(
            QUERIES.TOKEN.REVOKE,
            { id: tokenRow.id }
        );
        logInfo('Refresh token expired', {
            path: 'tokens/rotateRefreshToken'
        });
        return null;
    }

    // Revocar token actual (rotación)
    await db.callFunction(QUERIES.TOKEN.REVOKE, { id: tokenRow.id });

    const userType = tokenRow.adm_user_id ? 'admin' : 'customer';
    const userId   = tokenRow.adm_user_id || tokenRow.cst_user_id!;

    let payload: TokenPayload;

    if (userType === 'admin') {
        const users = await db.callFunction<{
            email: string;
            role: 'admin' | 'editor';
            state: boolean;
        }>(QUERIES.ADM_USER.GET_BY_ID, { id: userId }, true);

        const user = users[0];
        if (!user || !user.state) return null;

        payload = {
            userId,
            email: user.email,
            role:  user.role,
            type:  'admin'
        };
    } else {
        const users = await db.callFunction<{
            email: string;
            state: boolean;
        }>(QUERIES.CST_USER.GET_BY_ID, { id: userId }, true);

        const user = users[0];
        if (!user || !user.state) return null;

        payload = {
            userId,
            email: user.email,
            role:  'customer',
            type:  'customer'
        };
    }

    const tokens = await generateTokenPair(payload, ip, userAgent);
    return { tokens, payload };
};

// ─── Revocar todos los tokens (logout) ───────────────

export const revokeAllUserTokens = async (
    userId: string,
    userType: 'admin' | 'customer'
): Promise<void> => {
    const fnName = userType === 'admin'
        ? QUERIES.TOKEN.REVOKE_ALL_ADM
        : QUERIES.TOKEN.REVOKE_ALL_CST;

    await db.callFunction(fnName, { user_id: userId });
};