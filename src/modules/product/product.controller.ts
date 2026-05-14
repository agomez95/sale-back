import { Request, Response } from 'express';
import * as productService from './product.service';
import { CreateProductDTO } from '../../shared/types/index';

// GET /sales/api/product/
export const getAll = async (
    req: Request,
    res: Response
): Promise<void> => {
    const products = await productService.getAllProducts(req.query);
    res.json(products);
}; 

// GET /sales/api/product/:id
export const getById = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const product = await productService.getProductById(
        parseInt(req.params.id)
    );
    res.json({ success: true, data: product });
};

// POST /sales/api/product/
export const create = async (
    req: Request<{}, {}, CreateProductDTO>,
    res: Response
): Promise<void> => {
    const id = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: { id } });
};

// PATCH /sales/api/product/:id/activate
export const activate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await productService.activateProduct(parseInt(req.params.id));
    res.json({ success: true, message: 'Product activated' });
};

// PATCH /sales/api/product/:id/deactivate
export const deactivate = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await productService.deactivateProduct(parseInt(req.params.id));
    res.json({ success: true, message: 'Product deactivated' });
};