import bcrypt from 'bcrypt';
import db from '../../shared/database/connection';
import { QUERIES } from '../../shared/database/queries';
import { UnauthorizedError, ConflictError } from '../../shared/errors/index';
import { generateTokenPair, revokeAllUserTokens, rotateRefreshToken } from '../../shared/utils/index';
import { logSuccess } from '../../shared/utils/index';
import { 
    AdminUserRow, 
    CustomerRow, 
    TokenPayload, 
    AuthTokens,
    SignupCustomerDTO,
    SigninDTO
} from '../../shared/types/index';

// ─── Helper: info del cliente ─────────────────────────

export const getClientInfo = (req: {
    headers: { [key: string]: string | string[] | undefined };
    socket: { remoteAddress?: string };
}) => {
    const ip = (
        req.headers['x-forwarded-for'] as string ||
        req.socket.remoteAddress || '0.0.0.0'
    ).split(',')[0].trim();

    const userAgent = req.headers['user-agent'] as string || 'unknown';
    return { ip, userAgent };
};

// ─── Signup Customer ──────────────────────────────────

export const signupCustomer = async (
    data: SignupCustomerDTO
): Promise<{ id: string }> => {
    // Verificar si el email ya existe
    const existing = await db.callFunction<CustomerRow>(
        QUERIES.CST_USER.GET_BY_EMAIL,
        { email: data.email },
        true
    );

    if (existing.length) {
        throw new ConflictError('Email already registered', { email: data.email });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Crear customer
    const result = await db.callFunction<{ fn_add_cst_user: string }>(
        QUERIES.CST_USER.ADD,
        {
            firstname: data.firstname,
            lastname:  data.lastname,
            email:     data.email,
            password:  hashedPassword
        }
    );

    logSuccess('Customer registered', { email: data.email });
    return { id: result[0].fn_add_cst_user };
};

// ─── Signin ───────────────────────────────────────────

export const signin = async (
    data: SigninDTO,
    ip: string,
    userAgent: string
): Promise<{ tokens: AuthTokens; user: Partial<AdminUserRow | CustomerRow> }> => {
    const { email, password, type } = data;

    // Registrar intento (siempre, para auditoría)
    const logAttempt = async (success: boolean) => {
        await db.callFunction(QUERIES.LOGIN_ATTEMPT.ADD, {
            email,
            user_type: type,
            ip,
            success
        });
    };

    if (type === 'admin') {
        // Buscar admin
        const admins = await db.callFunction<AdminUserRow>(
            QUERIES.ADM_USER.GET_BY_EMAIL,
            { email },
            true
        );

        if (!admins.length) {
            await logAttempt(false);
            throw new UnauthorizedError('Invalid credentials');
        }

        const admin = admins[0];

        if (!admin.state) {
            await logAttempt(false);
            throw new UnauthorizedError('Account disabled');
        }

        // Verificar password
        const match = await bcrypt.compare(password, admin.password);
        await logAttempt(match);

        if (!match) throw new UnauthorizedError('Invalid credentials');

        // Generar tokens
        const payload: TokenPayload = {
            userId: admin.id,
            email:  admin.email,
            role:   admin.role,
            type:   'admin'
        };

        const tokens = await generateTokenPair(payload, ip, userAgent);

        logSuccess('Admin signed in', { email });
        return {
            tokens,
            user: {
                id:        admin.id,
                firstname: admin.firstname,
                lastname:  admin.lastname,
                email:     admin.email,
                role:      admin.role
            }
        };

    } else {
        // Buscar customer
        const customers = await db.callFunction<CustomerRow>(
            QUERIES.CST_USER.GET_BY_EMAIL,
            { email },
            true
        );

        if (!customers.length) {
            await logAttempt(false);
            throw new UnauthorizedError('Invalid credentials');
        }

        const customer = customers[0];

        if (!customer.state) {
            await logAttempt(false);
            throw new UnauthorizedError('Account disabled');
        }

        // Verificar password
        const match = await bcrypt.compare(password, customer.password);
        await logAttempt(match);

        if (!match) throw new UnauthorizedError('Invalid credentials');

        // Generar tokens
        const payload: TokenPayload = {
            userId: customer.id,
            email:  customer.email,
            role:   'customer',
            type:   'customer'
        };

        const tokens = await generateTokenPair(payload, ip, userAgent);

        logSuccess('Customer signed in', { email });
        return {
            tokens,
            user: {
                id:        customer.id,
                firstname: customer.firstname,
                lastname:  customer.lastname,
                email:     customer.email
            }
        };
    }
};

// ─── Refresh Token ────────────────────────────────────

export const refreshToken = async (
    rawToken: string,
    ip: string,
    userAgent: string
): Promise<{ accessToken: string }> => {
    const result = await rotateRefreshToken(rawToken, ip, userAgent);

    if (!result) {
        throw new UnauthorizedError('Invalid or expired refresh token', {
            code: 'REFRESH_INVALID'
        });
    }

    return { accessToken: result.tokens.accessToken };
};

// ─── Logout ───────────────────────────────────────────

export const logout = async (
    userId: string,
    userType: 'admin' | 'customer'
): Promise<void> => {
    await revokeAllUserTokens(userId, userType);
    logSuccess('User logged out', { userId });
};

// ─── Me (perfil) ──────────────────────────────────────

export const getMe = async (
    userId: string,
    userType: 'admin' | 'customer'
): Promise<Partial<AdminUserRow | CustomerRow>> => {
    if (userType === 'admin') {
        const result = await db.callFunction<AdminUserRow>(
            QUERIES.ADM_USER.GET_BY_ID,
            { id: userId },
            true
        );

        if (!result.length) {
            throw new UnauthorizedError('User not found');
        }

        const { password, ...user } = result[0];
        return user;
    } else {
        const result = await db.callFunction<CustomerRow>(
            QUERIES.CST_USER.GET_BY_ID,
            { id: userId },
            true
        );

        if (!result.length) {
            throw new UnauthorizedError('User not found');
        }

        const { password, ...user } = result[0];
        return user;
    }
};
