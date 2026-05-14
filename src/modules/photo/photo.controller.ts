import { Request, Response } from 'express';
import * as photoService from './photo.service';

// POST /sales/api/photo/upload
export const upload = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { pro_variant_id } = req.body;

    const result = await photoService.uploadPhoto(
        req.file!,
        pro_variant_id
    );

    res.status(201).json({
        success: true,
        message: 'Photo uploaded successfully',
        data: result
    });
};