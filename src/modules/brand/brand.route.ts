import { Router } from 'express';
import * as brandController from './brand.controller';
import { 
    validateRequest, 
    authenticate, 
    requireRole 
} from '../../shared/middlewares/index';
import {
    createBrandSchema,
    updateBrandSchema,
    brandIdSchema
} from './brand.schema';

const router = Router();

// ─── Públicas ─────────────────────────────────────────
router.get('/',    brandController.getAll);
router.get('/:id',
    validateRequest(brandIdSchema),
    brandController.getById
);

// ─── Protegidas admin/editor ──────────────────────────
router.post('/',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(createBrandSchema),
    brandController.create
);

router.patch('/:id/activate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(brandIdSchema),
    brandController.activate
);

router.patch('/:id/deactivate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(brandIdSchema),
    brandController.deactivate
);

router.patch('/:id',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(brandIdSchema),
    validateRequest(updateBrandSchema),
    brandController.update
);

router.delete('/:id',
    authenticate,
    requireRole('admin'),
    validateRequest(brandIdSchema),
    brandController.remove
);

export default router;