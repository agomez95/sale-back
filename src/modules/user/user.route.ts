import { Router } from 'express';
import * as userController from './user.controller';
import { validateRequest } from '../../shared/middlewares/index';
import { authenticate } from '../../shared/middlewares/auth';
import { loginLimiter, refreshLimiter } from '../../shared/middlewares/index';
import { ipGuard } from '../../shared/middlewares/index';
import {
    signupCustomerSchema,
    signinSchema
} from './user.schema';

const router = Router();

// ─── Públicas ───────────────────────────────────
router.post('/signup',
    validateRequest(signupCustomerSchema),
    userController.signup
);

router.post('/signin',
    ipGuard,
    loginLimiter,
    validateRequest(signinSchema),
    userController.signin
);

router.post('/refresh',
    refreshLimiter,
    userController.refresh
);

// ─── Protegidas (cualquier usuario autenticado) ────────
router.post('/logout',
    authenticate,
    userController.logout
);

router.get('/me',
    authenticate,
    userController.me
);

export default router;