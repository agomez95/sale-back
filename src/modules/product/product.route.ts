import { Router } from 'express';
import * as productController from './product.controller';
import { validateRequest, authenticate, requireRole } from '../../shared/middlewares/index';
import {
    createProductSchema,
    productIdSchema
} from './product.schema';

const router = Router();

// ─── Públicas ─────────────────────────────────────────
router.get('/',
    productController.getAll
);

router.get('/:id',
    validateRequest(productIdSchema),
    productController.getById  // ← nuevo
);

// ─── Protegidas admin/editor ──────────────────────────
router.post('/',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(createProductSchema),
    productController.create
);

router.patch('/:id/activate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(productIdSchema),
    productController.activate
);

router.patch('/:id/deactivate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(productIdSchema),
    productController.deactivate
);

export default router;