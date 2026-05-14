import { Request, Response } from 'express';
import * as subcategoryService from './subcategory.service';
import { CreateSubcategoryDTO, UpdateSubcategoryDTO } from '../../shared/types/index';

// GET /sales/api/subcategory/
export const getAll = async (
    req: Request,
    res: Response
): Promise<void> => {
    const subcategories = await subcategoryService.getAllSubcategories(req.query);
    res.json(subcategories);
};

// GET /sales/api/subcategory/:id
export const getById = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const subcategory = await subcategoryService.getSubcategoryById(
        parseInt(req.params.id)
    );
    res.json({ success: true, data: subcategory });
};

// POST /sales/api/subcategory/
export const create = async (
    req: Request<{}, {}, CreateSubcategoryDTO>,
    res: Response
): Promise<void> => {
    const id = await subcategoryService.createSubcategory(req.body);
    res.status(201).json({ success: true, data: { id } });
};

// PATCH /sales/api/subcategory/:id
export const update = async (
    req: Request<{ id: string }, {}, UpdateSubcategoryDTO>,
    res: Response
): Promise<void> => {
    await subcategoryService.updateSubcategory(
        parseInt(req.params.id),
        req.body
    );
    res.json({ success: true, message: 'Subcategory updated' });
};

// PATCH /sales/api/subcategory/:id/activate
export const activate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await subcategoryService.activateSubcategory(parseInt(req.params.id));
    res.json({ success: true, message: 'Subcategory activated' });
};

// PATCH /sales/api/subcategory/:id/deactivate
export const deactivate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await subcategoryService.deactivateSubcategory(parseInt(req.params.id));
    res.json({ success: true, message: 'Subcategory deactivated' });
};

// DELETE /sales/api/subcategory/:id
export const remove = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await subcategoryService.deleteSubcategory(parseInt(req.params.id));
    res.json({ success: true, message: 'Subcategory deleted' });
};