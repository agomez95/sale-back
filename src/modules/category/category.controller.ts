import { Request, Response } from 'express';
import * as categoryService from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../../shared/types/index';

// GET /sales/api/category/
export const getAll = async (
    req: Request,
    res: Response
): Promise<void> => {
    const categories = await categoryService.getAllCategories(req.query);
    res.json(categories);
};

// GET /sales/api/category/:id
export const getById = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const category = await categoryService.getCategoryById(
        parseInt(req.params.id)
    );
    res.json({ success: true, data: category });
};

// POST /sales/api/category/
export const create = async (
    req: Request<{}, {}, CreateCategoryDTO>,
    res: Response
): Promise<void> => {
    const id = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: { id } });
};

// PATCH /sales/api/category/:id
export const update = async (
    req: Request<{ id: string }, {}, UpdateCategoryDTO>,
    res: Response
): Promise<void> => {
    await categoryService.updateCategory(
        parseInt(req.params.id),
        req.body
    );
    res.json({ success: true, message: 'Category updated' });
};

// PATCH /sales/api/category/:id/activate
export const activate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await categoryService.activateCategory(parseInt(req.params.id));
    res.json({ success: true, message: 'Category activated' });
};

// PATCH /sales/api/category/:id/deactivate
export const deactivate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await categoryService.deactivateCategory(parseInt(req.params.id));
    res.json({ success: true, message: 'Category deactivated' });
};

// DELETE /sales/api/category/:id
export const remove = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await categoryService.deleteCategory(parseInt(req.params.id));
    res.json({ success: true, message: 'Category deleted' });
};