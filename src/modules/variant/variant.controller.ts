import { Request, Response } from 'express';
import * as variantService from './variant.service';
import { 
    CreateVariantDTO, 
    CreateVariantSpecValDTO 
} from '../../shared/types/index';

// POST /sales/api/variant/
export const create = async (
    req: Request<{}, {}, CreateVariantDTO>,
    res: Response
): Promise<void> => {
    const id = await variantService.createVariant(req.body);
    res.status(201).json({ success: true, data: { id } });
};

// POST /sales/api/variant/spec-val
export const createSpecVal = async (
    req: Request<{}, {}, CreateVariantSpecValDTO>,
    res: Response
): Promise<void> => {
    const id = await variantService.createVariantSpecVal(req.body);
    res.status(201).json({ success: true, data: { id } });
};

// DELETE /sales/api/variant/:id
export const remove = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await variantService.deleteVariant(parseInt(req.params.id));
    res.json({ success: true, message: 'Variant deleted' });
};

// PATCH /sales/api/variant/:id/activate
export const activate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await variantService.activateVariant(parseInt(req.params.id));
    res.json({ success: true, message: 'Variant activated' });
};

// PATCH /sales/api/variant/:id/deactivate
export const deactivate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await variantService.deactivateVariant(parseInt(req.params.id));
    res.json({ success: true, message: 'Variant deactivated' });
};