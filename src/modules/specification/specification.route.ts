import { Router } from 'express';
import * as specController from './specification.controller';
import { 
    validateRequest, 
    authenticate, 
    requireRole 
} from '../../shared/middlewares/index';
import {
    createSpecSchema,
    createSpecValueSchema,
    specIdSchema
} from './specification.schema';

const router = Router();

// ─── Specification ────────────────────────────────────
router.post('/',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(createSpecSchema),
    specController.createSpec
);

router.patch('/:id/activate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(specIdSchema),
    specController.activateSpec
);

router.patch('/:id/deactivate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(specIdSchema),
    specController.deactivateSpec
);

// ─── Specification Values ─────────────────────────────
router.post('/value',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(createSpecValueSchema),
    specController.createSpecValue
);

router.patch('/value/:id/activate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(specIdSchema),
    specController.activateSpecValue
);

router.patch('/value/:id/deactivate',
    authenticate,
    requireRole('admin', 'editor'),
    validateRequest(specIdSchema),
    specController.deactivateSpecValue
);

export default router;