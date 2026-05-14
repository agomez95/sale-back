import { Router } from 'express';
import { idSchema } from './search.schema';
import * as searchController from './search.controller';
import { validateRequest } from '../../shared/middlewares/index';

const router = Router();

// ─── Todas públicas ───────────────────────────────────
router.get('/brand/:id',
    validateRequest(idSchema),
    searchController.getByBrand
);

router.get('/subcategory/:id',
    validateRequest(idSchema),
    searchController.getBySubcategory
);

router.get('/product/:id',
    validateRequest(idSchema),
    searchController.getByProduct
);

router.get('/subcategories',
    searchController.getSubcategoriesWithSpecs
);

export default router;