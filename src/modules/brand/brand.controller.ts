import { Request, Response } from 'express';
import * as brandService from './brand.service';
import { CreateBrandDTO, UpdateBrandDTO } from '../../shared/types/index';

// GET /sales/api/brand/
export const getAll = async (
    req: Request,
    res: Response
): Promise<void> => {
    const brands = await brandService.getAllBrands(req.query);
    res.json(brands);
};

// GET /sales/api/brand/:id
export const getById = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const brand = await brandService.getBrandById(
        parseInt(req.params.id)
    );
    res.json({ success: true, data: brand });
};

// POST /sales/api/brand/
export const create = async (
    req: Request<{}, {}, CreateBrandDTO>,
    res: Response
): Promise<void> => {
    const id = await brandService.createBrand(req.body);
    res.status(201).json({ success: true, data: { id } });
};

// PATCH /sales/api/brand/:id
export const update = async (
    req: Request<{ id: string }, {}, UpdateBrandDTO>,
    res: Response
): Promise<void> => {
    await brandService.updateBrand(
        parseInt(req.params.id),
        req.body
    );
    res.json({ success: true, message: 'Brand updated' });
};

// PATCH /sales/api/brand/:id/activate
export const activate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await brandService.activateBrand(parseInt(req.params.id));
    res.json({ success: true, message: 'Brand activated' });
};

// PATCH /sales/api/brand/:id/deactivate
export const deactivate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await brandService.deactivateBrand(parseInt(req.params.id));
    res.json({ success: true, message: 'Brand deactivated' });
};

// DELETE /sales/api/brand/:id
export const remove = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await brandService.deleteBrand(parseInt(req.params.id));
    res.json({ success: true, message: 'Brand deleted' });
};