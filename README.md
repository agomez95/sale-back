# Sale-Back API

REST API para sistema de ventas construida con **Express 5** + **TypeScript** + **Node.js 24 LTS**

---

## Requisitos previos

- [Node.js](https://nodejs.org) v22 o superior (recomendado v24 LTS)
- [npm](https://www.npmjs.com) v10 o superior
- [Docker](https://www.docker.com) para la base de datos PostgreSQL

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/agomez95/sale-back.git
cd sale-back
```

### 2. Ejecutar el script de setup

```bash
# Dar permisos al script
chmod +x scripts/setup.sh

# Ejecutar desde la raíz del proyecto
bash scripts/setup.sh
```

> El script instala dependencias, crea la estructura de carpetas y genera los archivos de configuración necesarios.

### 3. Configurar variables de entorno

```bash
# Editar env.sh con tus valores reales
code scripts/env.sh
```

Genera un secret seguro:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Levantar la base de datos

```bash
# Cargar variables y levantar Docker
source scripts/env.sh && npm run docker

# Verificar que está corriendo:
docker ps  # debe mostrar sale-back-db (healthy)
```

### 5. Arrancar el servidor

```bash
source scripts/env.sh && npm run dev
```

---

## Variables de entorno

Edita `scripts/env.sh` con tus valores reales:

```bash
export PORT=3000
export NODE_ENV=development
export ACCESS_SECRET=your_secret_here
export API_LOCAL=http://localhost:3000

export PG_PORT_LOCAL=5432
export PG_HOST_LOCAL=localhost
export PG_USER_LOCAL=postgres
export PG_PASSWORD_LOCAL=your_password_here
export PG_DB_LOCAL=sales_db

export JWT_SECRET=your_secret_here
export JWT_ACCESS_EXPIRY=15m
export JWT_REFRESH_EXPIRY=7d
```

---

## Comandos disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Compilar TypeScript a JavaScript
npm run build

# Ejecutar versión compilada (producción)
npm run start

# Levantar base de datos con Docker
npm run docker

# Crear carpetas de uploads
npm run dir
```

### Docker

```bash
# Ver si está corriendo
docker ps

# Ver logs de postgres
docker logs sale-back-db

# Detener el contenedor
docker stop sale-back-db

# Destruir el contenedor (datos se mantienen en el volumen)
docker rm sale-back-db

# Destruir TODO incluyendo datos
docker compose down -v
```

---

## Estructura del proyecto

```
sale-back/
├── _doc/                             # Archivos .http para probar la API
│   ├── admin.http
│   ├── brand.http
│   ├── category.http
│   ├── photo.http
│   ├── product.http
│   ├── search.http
│   ├── specification.http
│   ├── subcategory.http
│   ├── user.http
│   └── variant.http
│
├── db/                               # Scripts SQL
│   ├── TABLES.sql
│   ├── FUNCTIONS.sql
│   └── TRIGGERS.sql
│
├── public/                           # Archivos estáticos
│   └── files/
│       ├── photos/                   # Fotos almacenadas
│       └── temp/                     # Fotos temporales
│
├── scripts/                          # Scripts de utilidad
│   ├── env.sh                        # Variables de entorno
│   └── setup.sh                      # Setup inicial del proyecto
│
├── src/
│   ├── modules/                      # Módulos de negocio
│   │   ├── admin/                    # Gestión administrativa
│   │   ├── brand/                    # Marcas
│   │   ├── category/                 # Categorías
│   │   ├── subcategory/              # Subcategorías
│   │   ├── product/                  # Productos
│   │   ├── variant/                  # Variantes
│   │   ├── specification/            # Especificaciones
│   │   ├── search/                   # Búsqueda
│   │   ├── photo/                    # Gestión de fotos
│   │   └── user/                     # Usuarios y autenticación
│   │
│   ├── shared/                       # Código compartido
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   ├── cors.config.ts
│   │   │   └── multer.config.ts
│   │   ├── database/
│   │   │   ├── connection.ts
│   │   │   └── queries.ts
│   │   ├── errors/
│   │   │   ├── http-error.ts
│   │   │   ├── error-handler.ts
│   │   │   └── index.ts
│   │   ├── middlewares/
│   │   │   ├── auth.ts
│   │   │   ├── validate-request.ts
│   │   │   ├── rate-limit.middleware.ts
│   │   │   ├── ip-guard.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   ├── request-logger.ts
│   │   │   ├── 404.ts
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       ├── tokens.util.ts
│   │       ├── pagination.util.ts
│   │       ├── photo.util.ts
│   │       ├── process-handler.ts
│   │       └── index.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── README.md
└── tsconfig.json
```

---

## Endpoints

Base URL: `http://localhost:3000/sales/api`

### Públicos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/brand/` | Listar marcas (paginado) |
| GET | `/brand/:id` | Obtener marca |
| GET | `/category/` | Listar categorías (paginado) |
| GET | `/category/:id` | Obtener categoría |
| GET | `/subcategory/` | Listar subcategorías (paginado) |
| GET | `/subcategory/:id` | Obtener subcategoría |
| GET | `/product/` | Listar productos (paginado) |
| GET | `/product/:id` | Obtener producto |
| GET | `/search/brand/:id` | Buscar por marca |
| GET | `/search/subcategory/:id` | Buscar por subcategoría |
| GET | `/search/product/:id` | Buscar por producto |
| GET | `/search/subcategories` | Subcategorías con specs |
| POST | `/user/signup` | Registro de cliente |
| POST | `/user/signin` | Login |
| POST | `/user/refresh` | Renovar access token |

### Autenticado

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/user/logout` | Cerrar sesión |
| GET | `/user/me` | Ver mi perfil |

### Admin + Editor

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/brand/` | Crear marca |
| PATCH | `/brand/:id` | Editar marca |
| PATCH | `/brand/:id/activate` | Activar marca |
| PATCH | `/brand/:id/deactivate` | Desactivar marca |
| POST | `/category/` | Crear categoría |
| PATCH | `/category/:id` | Editar categoría |
| PATCH | `/category/:id/activate` | Activar categoría |
| PATCH | `/category/:id/deactivate` | Desactivar categoría |
| POST | `/subcategory/` | Crear subcategoría |
| PATCH | `/subcategory/:id` | Editar subcategoría |
| PATCH | `/subcategory/:id/activate` | Activar subcategoría |
| PATCH | `/subcategory/:id/deactivate` | Desactivar subcategoría |
| POST | `/product/` | Crear producto |
| PATCH | `/product/:id/activate` | Activar producto |
| PATCH | `/product/:id/deactivate` | Desactivar producto |
| POST | `/variant/` | Crear variante |
| POST | `/variant/spec-val` | Asignar spec a variante |
| PATCH | `/variant/:id/activate` | Activar variante |
| PATCH | `/variant/:id/deactivate` | Desactivar variante |
| POST | `/specification/` | Crear especificación |
| POST | `/specification/value` | Crear valor de spec |
| PATCH | `/specification/:id/activate` | Activar especificación |
| PATCH | `/specification/:id/deactivate` | Desactivar especificación |
| POST | `/photo/upload` | Subir foto |

### Solo Admin

| Método | Ruta | Descripción |
|--------|------|-------------|
| DELETE | `/brand/:id` | Eliminar marca |
| DELETE | `/category/:id` | Eliminar categoría |
| DELETE | `/subcategory/:id` | Eliminar subcategoría |
| DELETE | `/variant/:id` | Eliminar variante |
| POST | `/admin/users/admins` | Crear usuario admin |
| GET | `/admin/users/admins` | Listar admins (paginado) |
| PATCH | `/admin/users/admins/:id/activate` | Activar admin |
| PATCH | `/admin/users/admins/:id/deactivate` | Desactivar admin |
| GET | `/admin/users/customers` | Listar customers (paginado) |
| PATCH | `/admin/users/customers/:id/activate` | Activar customer |
| PATCH | `/admin/users/customers/:id/deactivate` | Desactivar customer |
| GET | `/admin/login-attempts` | Ver intentos de login |
| GET | `/admin/tokens/active` | Ver tokens activos |
| DELETE | `/admin/tokens/:userId/:type` | Revocar tokens de usuario |
| GET | `/admin/cache/stats` | Stats del cache de IPs |
| DELETE | `/admin/cache` | Limpiar cache de IPs |

---

## Autenticación

La API usa **JWT + Refresh Tokens** con rotación automática.

```
Authorization: Bearer <access_token>
```

| Token | Duración | Almacenamiento |
|-------|----------|----------------|
| Access Token | 15 minutos | Memoria del cliente |
| Refresh Token | 7 días | Cookie HttpOnly |

### Roles

| Rol | Descripción |
|-----|-------------|
| `admin` | Acceso total al sistema |
| `editor` | Puede crear y editar contenido |
| `customer` | Cliente de la tienda |

---

## Seguridad

- **Helmet** — Headers HTTP seguros
- **CORS** — Orígenes permitidos configurables
- **Rate Limiting** — 60 req/min global, 5 intentos login/15min
- **IP Guard** — Bloquea datacenters y VPNs en login
- **bcrypt** — Hash de contraseñas con salt 12
- **JWT** — Access tokens de corta duración (15min)
- **Refresh Token Rotation** — Detección de reutilización de tokens
- **Login Attempts** — Auditoría completa de intentos de login

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | v24 LTS | Runtime |
| TypeScript | v6.x | Lenguaje |
| Express | v5.x | Framework HTTP |
| PostgreSQL | v16 | Base de datos |
| JWT | v9.x | Access tokens |
| bcrypt | v5.x | Hash de contraseñas |
| Multer | v1.x | Upload de archivos |
| Sharp | v0.33.x | Procesamiento de imágenes |
| Joi | v17.x | Validación de datos |
| Helmet | v8.x | Headers de seguridad |
| express-rate-limit | v7.x | Rate limiting |
| cookie-parser | v1.x | Cookies HttpOnly |
| chalk | v4.x | Logger con colores |

---

## Flujo de imágenes

```
POST /photo/upload (multipart/form-data)
         ↓
multer   → guarda en /temp con nombre único
         ↓
sharp    → lee metadata (width, height, size, type)
         ↓
DB       → guarda metadata + ruta en PostgreSQL
         ↓
fs       → mueve archivo de /temp a /photos
         ↓
response → { name: "1_01.png", path: "..." }
```

> A futuro se planea separar en un servidor dedicado de archivos (similar a AWS S3).

---

## Paginación

Los endpoints GET all soportan paginación:

```
GET /brand?page=1&limit=10
```

```json
{
    "success": true,
    "data": [...],
    "pagination": {
        "total": 45,
        "page": 1,
        "limit": 10,
        "totalPages": 5,
        "hasNext": true,
        "hasPrev": false
    }
}
```