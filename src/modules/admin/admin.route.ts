import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate, requireRole } from '../../shared/middlewares/index';
import { validateRequest } from '../../shared/middlewares/index';
import { createAdminSchema } from '../user/user.schema';

const router = Router();

// Todas las rutas admin requieren autenticación + rol admin
router.use(authenticate);
router.use(requireRole('admin'));

// ─── Cache ────────────────────────────────────────────
router.get('/cache/stats',  adminController.getCacheStats);
router.delete('/cache',     adminController.clearCache);

// ─── Admin Users ─────────────────────────────────────
router.post('/users/admins',
    validateRequest(createAdminSchema),
    adminController.createAdmin
);

router.get('/users/admins',
    adminController.getAdminUsers
);
router.patch('/users/admins/:id/activate',
    adminController.activateAdmin
);
router.patch('/users/admins/:id/deactivate',
    adminController.deactivateAdmin
);

// ─── Customers ───────────────────────────────────────
router.get('/users/customers',
    adminController.getCustomers
);
router.patch('/users/customers/:id/activate',
    adminController.activateCustomer
);
router.patch('/users/customers/:id/deactivate',
    adminController.deactivateCustomer
);

// ─── Login Attempts ─────────────────────────────────
router.get('/login-attempts',
    adminController.getLoginAttempts
);

// ─── Active Tokens ─────────────────────────────────
router.get('/tokens/active',
    adminController.getActiveTokens
);
router.delete('/tokens/:userId/:type',
    adminController.revokeUserTokens
);

// ─── Customer Addresses ─────────────────────────────
router.get('/customers/:id/addresses',
    adminController.getCustomerAddresses
);

export default router;