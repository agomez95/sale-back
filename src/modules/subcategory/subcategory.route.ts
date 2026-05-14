import { Router } from 'express';
import * as subcategoryController from './subcategory.controller';
import { 
    validateRequest, 
    authenticate, 
    requireRole 
} from '../../shared/middlewares/index';
import {
    createSubcategorySchema,
    updateSubcategorySchema,
    subcategoryIdSchema
} from './subcategory.schema';

const router = Router();

// ─── Públicas ─────────────────────────────────────────
router.get('/',    subcategoryController.getAll);
router.get('/:id',
    validateRequest(subcategoryIdSchema),
    subcategoryController.getById
);

// ─── Protegidas admin/editor ──────────────────────────
router.post('/',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(createSubcategorySchema),
    subcategoryController.create
);

router.patch('/:id/activate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(subcategoryIdSchema),
    subcategoryController.activate
);

router.patch('/:id/deactivate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(subcategoryIdSchema),
    subcategoryController.deactivate
);

router.patch('/:id',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(subcategoryIdSchema),
    validateRequest(updateSubcategorySchema),
    subcategoryController.update
);

router.delete('/:id',
    authenticate,
    requireRole('admin'),
    validateRequest(subcategoryIdSchema),
    subcategoryController.remove
);

export default router;