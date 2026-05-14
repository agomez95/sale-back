import { Request, Response } from 'express';
import * as userService from './user.service';
import { 
    SignupCustomerDTO,
    SigninDTO
} from '../../shared/types/index';

// ─── POST /sales/api/user/signup ──────────────────────
export const signup = async (
    req: Request<{}, {}, SignupCustomerDTO>,
    res: Response
): Promise<void> => {
    const result = await userService.signupCustomer(req.body);
    res.status(201).json({ success: true, data: result });
};

// ─── POST /sales/api/user/signin ──────────────────────
export const signin = async (
    req: Request<{}, {}, SigninDTO>,
    res: Response
): Promise<void> => {
    const { ip, userAgent } = userService.getClientInfo(req);
    const { tokens, user } = await userService.signin(req.body, ip, userAgent);

    // Refresh token en cookie HttpOnly
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:   7 * 24 * 60 * 60 * 1000 // 7 días
    });

    res.json({
        success:     true,
        accessToken: tokens.accessToken,
        data:        user
    });
};

// ─── POST /sales/api/user/refresh ─────────────────────
export const refresh = async (
    req: Request,
    res: Response
): Promise<void> => {
    const rawToken = req.cookies?.refreshToken;
    const { ip, userAgent } = userService.getClientInfo(req);

    if (!rawToken) {
        res.status(401).json({
            success: false,
            error: { message: 'Refresh token required', statusCode: 401 }
        });
        return;
    }

    const result = await userService.refreshToken(rawToken, ip, userAgent);

    res.json({ success: true, accessToken: result.accessToken });
};

// ─── POST /sales/api/user/logout ──────────────────────
export const logout = async (
    req: Request,
    res: Response
): Promise<void> => {
    if (req.user) {
        await userService.logout(req.user.userId, req.user.type);
    }

    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out successfully' });
};

// ─── GET /sales/api/user/me ───────────────────────────
export const me = async (
    req: Request,
    res: Response
): Promise<void> => {
    const user = await userService.getMe(
        req.user!.userId,
        req.user!.type
    );
    res.json({ success: true, data: user });
};