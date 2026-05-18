// Modulos del src
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsOptions } from './shared/config/cors';
import { 
    errorHandler, 
    notFoundMiddleware,
    apiLimiter,
} from './shared/middlewares/index';

// Modulos de rutas
import adminRoutes from './modules/admin/admin.route';
import brandRoutes from './modules/brand/brand.route';
import categoryRoutes from './modules/category/category.route';
import subcategoryRoutes from './modules/subcategory/subcategory.route';
import productRoutes from './modules/product/product.route';
import specificationRoutes from './modules/specification/specification.route';
import variantRoutes from './modules/variant/variant.route';
import searchRoutes from './modules/search/search.route';
import photoRoutes from './modules/photo/photo.route';
import userRoutes from './modules/user/user.route';
import addressRoutes from './modules/address/address.route';

const app: Express = express();

// SEGURIDAD Y UTILIDADES
app.use(helmet()); // headers seguros
app.use(cors(corsOptions)); // CORS configurado para permitir solo el frontend u orígenes específicos
app.use(cookieParser()); // lee cookies HttpOnly, necesario para autenticación basada en cookies
app.use(express.json());

// Rate limit global
app.use('/sales/api/', apiLimiter);

// Routes
app.use('/sales/api/admin/', adminRoutes);
app.use('/sales/api/brand/', brandRoutes);
app.use('/sales/api/category/', categoryRoutes);
app.use('/sales/api/subcategory/', subcategoryRoutes);
app.use('/sales/api/product/', productRoutes);
app.use('/sales/api/specification/', specificationRoutes);
app.use('/sales/api/variant/', variantRoutes);
app.use('/sales/api/search/', searchRoutes);
app.use('/sales/api/photo/', photoRoutes);
app.use('/sales/api/user/', userRoutes);
app.use('/sales/api/address/', addressRoutes);

// Error handlers — SIEMPRE al final
app.use(notFoundMiddleware);
app.use(errorHandler);

export default app;