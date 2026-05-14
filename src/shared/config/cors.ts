import { CorsOptions } from 'cors';

const ALLOWED_ORIGINS = [
    'http://localhost:3000',    // desarrollo
    'http://localhost:5173',    // Vite frontend dev
    'https://tu-dominio.com'    // producción
];

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Permite requests sin origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: Origin ${origin} not allowed`));
        }
    },
    credentials:    true,     // ← necesario para cookies HttpOnly
    methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining']
};