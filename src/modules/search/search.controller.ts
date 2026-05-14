import { Request, Response } from 'express';
import * as searchService from './search.service';

// GET /sales/api/search/brand/:id
export const getByBrand = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const products = await searchService.getProductsByBrand(
        parseInt(req.params.id)
    );

    if (!products) {
        res.status(204).json({ success: true, data: [] });
        return;
    }

    res.json({ success: true, count: products.length, data: products });
};

// GET /sales/api/search/subcategory/:id
export const getBySubcategory = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const products = await searchService.getProductsBySubcategory(
        parseInt(req.params.id)
    );

    if (!products) {
        res.status(204).json({ success: true, data: [] });
        return;
    }

    res.json({ success: true, count: products.length, data: products });
};

// GET /sales/api/search/product/:id
export const getByProduct = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    const products = await searchService.getProductsByProduct(
        parseInt(req.params.id)
    );

    if (!products) {
        res.status(204).json({ success: true, data: [] });
        return;
    }

    res.json({ success: true, count: products.length, data: products });
};

// GET /sales/api/search/subcategories
export const getSubcategoriesWithSpecs = async (
    req: Request,
    res: Response
): Promise<void> => {
    const subcategories = await searchService.getSubcategoriesWithSpecs();

    if (!subcategories) {
        res.status(204).json({ success: true, data: [] });
        return;
    }

    res.json({ success: true, count: subcategories.length, data: subcategories });
};