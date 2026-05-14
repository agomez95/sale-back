import { Router } from 'express';
import * as categoryController from './category.controller';
import { 
    validateRequest, 
    authenticate, 
    requireRole 
} from '../../shared/middlewares/index';
import {
    createCategorySchema,
    updateCategorySchema,
    categoryIdSchema
} from './category.schema';

const router = Router();

// ─── Públicas ─────────────────────────────────────────
router.get('/',    categoryController.getAll);
router.get('/:id',
    validateRequest(categoryIdSchema),
    categoryController.getById
);

// ─── Protegidas admin/editor ──────────────────────────
router.post('/',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(createCategorySchema),
    categoryController.create
);

router.patch('/:id/activate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(categoryIdSchema),
    categoryController.activate
);

router.patch('/:id/deactivate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(categoryIdSchema),
    categoryController.deactivate
);

router.patch('/:id',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(categoryIdSchema),
    validateRequest(updateCategorySchema),
    categoryController.update
);

router.delete('/:id',
    authenticate,
    requireRole('admin'),
    validateRequest(categoryIdSchema),
    categoryController.remove
);

export default router;