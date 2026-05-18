import { Request, Response } from 'express';
import * as adminService from './admin.service';
import * as addressService from '../address/address.service';
import { getIpCacheStats, clearIpCache } from '../../shared/middlewares/index';
import { logSuccess } from '../../shared/utils/index';
import { 
    CreateAdminDTO,
} from '../../shared/types/index';

/**
 * Admin Controller:
 * El controller "admin" maneja las operaciones administrativas del sistema,
 * incluyendo la gestión de usuarios admin y clientes,
 * además de la supervisión y gestión de la caché de IPs y los intentos de inicio de sesión.
 */

// - Cache Management
// GET /sales/api/admin/cache/stats
export const getCacheStats = async (
    req: Request,
    res: Response
): Promise<void> => {
    const stats = getIpCacheStats();
    res.json({ success: true, data: stats });
};

// DELETE /sales/api/admin/cache
export const clearCache = async (
    req: Request,
    res: Response
): Promise<void> => {
    clearIpCache();
    logSuccess('IP cache cleared by admin', {
        path:   'admin/clearCache',
        userId: req.user?.userId
    });
    res.json({ success: true, message: 'IP cache cleared successfully' });
};

// Admin management
// POST /sales/api/admin/users/admins
export const createAdmin = async (
    req: Request<{}, {}, CreateAdminDTO>,
    res: Response
): Promise<void> => {
    const result = await adminService.createAdmin(req.body);
    res.status(201).json({ success: true, data: result });
};

// GET /sales/api/admin/users/admins
export const getAdminUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    const result = await adminService.getAdminUsers(req.query);
    res.json(result);
};

// PATCH /sales/api/admin/users/admins/:id/activate 
export const activateAdmin = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await adminService.toggleAdminState(
        req.params.id,
        true,
        req.user!.userId
    );
    res.json({ success: true, message: 'Admin user activated' });
};

// PATCH /sales/api/admin/users/admins/:id/deactivate 
export const deactivateAdmin = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await adminService.toggleAdminState(
        req.params.id,
        false,
        req.user!.userId
    );
    res.json({ success: true, message: 'Admin user deactivated' });
};

// Customers management
// GET /sales/api/admin/users/customers
export const getCustomers = async (
    req: Request,
    res: Response
): Promise<void> => {
    const result = await adminService.getCustomers(req.query);
    res.json(result);
};

// PATCH /sales/api/admin/users/customers/:id/activate
export const activateCustomer = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await adminService.toggleCustomerState(req.params.id, true);
    res.json({ success: true, message: 'Customer activated' });
};

// PATCH /sales/api/admin/users/customers/:id/deactivate
export const deactivateCustomer = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await adminService.toggleCustomerState(req.params.id, false);
    res.json({ success: true, message: 'Customer deactivated' });
};

// Login Attemps and tokens management
// GET /sales/api/admin/login-attempts
export const getLoginAttempts = async (
    req: Request,
    res: Response
): Promise<void> => {
    const result = await adminService.getLoginAttempts(req.query);
    res.json(result);
};

// GET /sales/api/admin/tokens/active
export const getActiveTokens = async (
    req: Request,
    res: Response
): Promise<void> => {
    const result = await adminService.getActiveTokens(req.query);
    res.json(result);
};

// DELETE /sales/api/admin/tokens/:userId/:type
export const revokeUserTokens = async (
    req: Request<{ userId: string; type: string }>,
    res: Response
): Promise<void> => {
    const { userId, type } = req.params;

    if (type !== 'admin' && type !== 'customer') {
        res.status(422).json({
            success: false,
            error: { message: 'Type must be admin or customer', statusCode: 422 }
        });
        return;
    }

    await adminService.revokeUserTokens(userId, type);
    res.json({ success: true, message: 'User tokens revoked' });
};

// GET /admin/customers/:id/addresses
export const getCustomerAddresses = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const addresses = await addressService.getMyAddresses(req.params.id);
    res.json({ success: true, data: addresses });
};