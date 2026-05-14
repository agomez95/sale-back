import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { upload } from '../config/multer';
import { BadRequestError } from '../errors/http-error';

export const uploadMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            next(new BadRequestError(
                `Multer error: ${err.message}`,
                { field: err.field, code: err.code }
            ));
            return;
        }

        if (err) {
            next(new BadRequestError(err.message));
            return;
        }

        if (!req.file) {
            next(new BadRequestError('File is required'));
            return;
        }

        next();
    });
};