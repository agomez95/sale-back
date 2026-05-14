import { Router } from 'express';
import * as variantController from './variant.controller';
import { 
    validateRequest, 
    authenticate, 
    requireRole 
} from '../../shared/middlewares/index';
import {
    createVariantSchema,
    createVariantSpecValSchema,
    variantIdSchema
} from './variant.schema';

const router = Router();

// ─── Protegidas admin/editor ──────────────────────────
router.post('/',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(createVariantSchema),
    variantController.create
);

router.post('/spec-val',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(createVariantSpecValSchema),
    variantController.createSpecVal
);

router.patch('/:id/activate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(variantIdSchema),
    variantController.activate
);

router.patch('/:id/deactivate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(variantIdSchema),
    variantController.deactivate
);

router.delete('/:id',
    authenticate,
    requireRole('admin'),
    validateRequest(variantIdSchema),
    variantController.remove
);

export default router;