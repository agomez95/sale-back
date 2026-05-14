import { Request, Response } from 'express';
import * as specService from './specification.service';
import {
    CreateSpecDTO,
    CreateSpecValueDTO
} from '../../shared/types/index';

// POST /sales/api/specification/
export const createSpec = async (
    req: Request<{}, {}, CreateSpecDTO>,
    res: Response
): Promise<void> => {
    const id = await specService.createSpec(req.body);
    res.status(201).json({ success: true, data: { id } });
};

// POST /sales/api/specification/value
export const createSpecValue = async (
    req: Request<{}, {}, CreateSpecValueDTO>,
    res: Response
): Promise<void> => {
    const id = await specService.createSpecValue(req.body);
    res.status(201).json({ success: true, data: { id } });
};

// PATCH /sales/api/specification/:id/activate
export const activateSpec = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await specService.activateSpec(parseInt(req.params.id));
    res.json({ success: true, message: 'Specification activated' });
};

// PATCH /sales/api/specification/:id/deactivate
export const deactivateSpec = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await specService.deactivateSpec(parseInt(req.params.id));
    res.json({ success: true, message: 'Specification deactivated' });
};

// PATCH /sales/api/specification/value/:id/activate
export const activateSpecValue = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await specService.activateSpecValue(parseInt(req.params.id));
    res.json({ success: true, message: 'Specification value activated' });
};

// PATCH /sales/api/specification/value/:id/deactivate
export const deactivateSpecValue = async (
    req: Request<{ id: string }>,
    res: Response
): Promise<void> => {
    await specService.deactivateSpecValue(parseInt(req.params.id));
    res.json({ success: true, message: 'Specification value deactivated' });
};