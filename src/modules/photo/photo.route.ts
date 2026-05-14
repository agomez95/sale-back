import { Router } from 'express';
import * as photoController from './photo.controller';
import { uploadPhotoSchema } from './photo.schema';
import { 
    uploadMiddleware, 
    validateRequest, 
    authenticate, 
    requireRole 
} from '../../shared/middlewares/index';

const router = Router();

router.post('/upload',
    authenticate,
    requireRole('admin', 'editor'),
    uploadMiddleware,
    validateRequest(uploadPhotoSchema),
    photoController.upload
);

export default router;