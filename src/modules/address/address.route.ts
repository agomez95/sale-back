import { Router } from 'express';
import * as addressController from './address.controller';
import { authenticate, requireRole, validateRequest } from '../../shared/middlewares/index';
import {
    createAddressSchema,
    updateAddressSchema,
    addressIdSchema
} from './address.schema';

const router = Router();

// ─── Públicas ─────────────────────────────────────────
// Países para el formulario de dirección
router.get('/countries', addressController.getCountries);

// ─── Solo customers ───────────────────────────────────
router.get('/',
    authenticate,
    requireRole('customer'),
    addressController.getMyAddresses
);

router.get('/:id',
    authenticate,
    requireRole('customer'),
    validateRequest(addressIdSchema),
    addressController.getById
);

router.post('/',
    authenticate,
    requireRole('customer'),
    validateRequest(createAddressSchema),
    addressController.create
);

router.patch('/:id/default',
    authenticate,
    requireRole('customer'),
    validateRequest(addressIdSchema),
    addressController.setDefault
);

router.patch('/:id',
    authenticate,
    requireRole('customer'),
    validateRequest(addressIdSchema),
    validateRequest(updateAddressSchema),
    addressController.update
);

router.delete('/:id',
    authenticate,
    requireRole('customer'),
    validateRequest(addressIdSchema),
    addressController.remove
);

export default router;