#!/bin/bash

# ============================================
#   SALE-BACK - Setup Script
#   Express 5 + TypeScript + Node 24
# ============================================

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ----------------------------
# Helpers
# ----------------------------
success() { echo -e "${GREEN}✅ $1${NC}"; }
error()   { echo -e "${RED}❌ $1${NC}"; exit 1; }
info()    { echo -e "${CYAN}ℹ️  $1${NC}"; }
warn()    { echo -e "${YELLOW}⚠️  $1${NC}"; }
step()    { echo -e "\n${BLUE}▶ $1${NC}"; }

# ----------------------------
# Verificar que estamos en el
# directorio correcto
# ----------------------------
check_directory() {
    step "Verificando directorio del proyecto..."

    if [ ! -f "package.json" ]; then
        error "No se encontró package.json. Asegúrate de estar en la raíz del proyecto sale-back"
    fi

    PROJECT_NAME=$(node -p "require('./package.json').name" 2>/dev/null)
    info "Proyecto detectado: $PROJECT_NAME"
    success "Directorio correcto"
}

# ----------------------------
# Verificar Node.js y npm
# ----------------------------
check_node() {
    step "Verificando Node.js..."

    if ! command -v node &> /dev/null; then
        error "Node.js no está instalado. Instálalo desde https://nodejs.org"
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    info "Node.js versión: $(node -v)"

    if [ "$NODE_VERSION" -lt 22 ]; then
        warn "Se recomienda Node.js v22 (LTS) o superior. Tienes v$(node -v)"
        warn "Puedes actualizar con: nvm install 24 && nvm use 24"
    else
        success "Versión de Node.js compatible"
    fi

    info "npm versión: $(npm -v)"
}

# ----------------------------
# Crear estructura de carpetas
# ----------------------------
create_structure() {
    step "Creando estructura de carpetas..."

    # Carpetas del proyecto
    mkdir -p src/modules/user
    mkdir -p src/modules/category
    mkdir -p src/modules/subcategory
    mkdir -p src/modules/brand
    mkdir -p src/modules/product
    mkdir -p src/modules/variant
    mkdir -p src/modules/specification
    mkdir -p src/modules/search
    mkdir -p src/modules/photo

    mkdir -p src/shared/config
    mkdir -p src/shared/database
    mkdir -p src/shared/middlewares
    mkdir -p src/shared/types
    mkdir -p src/shared/utils

    # Carpetas públicas
    mkdir -p public/files/photos
    mkdir -p public/files/temp

    # Carpeta de scripts
    mkdir -p scripts

    # Carpeta de DB (SQLs)
    mkdir -p db

    success "Estructura de carpetas creada"
}

# ----------------------------
# Instalar dependencias
# ----------------------------
install_dependencies() {
    step "Instalando dependencias de producción..."

    npm install \
        express@5 \
        bcrypt \
        cors \
        joi \
        jsonwebtoken \
        multer \
        pg \
        sharp \
        express-rate-limit \
        cookie-parser \
        helmet \
        || error "Falló la instalación de dependencias de producción"

    success "Dependencias de producción instaladas"

    step "Instalando dependencias de desarrollo..."

    npm install -D \
        typescript \
        ts-node \
        nodemon \
        @types/node \
        @types/express \
        @types/bcrypt \
        @types/cors \
        @types/jsonwebtoken \
        @types/multer \
        @types/pg \
        @types/sharp \
        @types/cookie-parser \
        @types/helmet \
        || error "Falló la instalación de dependencias de desarrollo"

    success "Dependencias de desarrollo instaladas"
}

# ----------------------------
# Crear tsconfig.json
# ----------------------------
create_tsconfig() {
    step "Creando tsconfig.json..."

    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "Node16",
    "allowSyntheticDefaultImports": true,
    "typeRoots": ["./src/shared/types", "./node_modules/@types"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "public"]
}
EOF

    success "tsconfig.json creado"
}

# ----------------------------
# Crear .env.example
# ----------------------------
create_env_example() {
    step "Creando .env.example..."

    if [ ! -f ".env.example" ]; then
        cat > .env.example << 'EOF'
# Server
PORT=3000
NODE_ENV=development

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=sales_db

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Files
UPLOAD_PATH=public/files
PHOTOS_PATH=public/files/photos
TEMP_PATH=public/files/temp
MAX_FILE_SIZE=5242880
EOF
        success ".env.example creado"
    else
        warn ".env.example ya existe, no se sobreescribió"
    fi
}

# ----------------------------
# Crear .gitignore
# ----------------------------
create_gitignore() {
    step "Creando .gitignore..."

    if [ ! -f ".gitignore" ]; then
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build
dist/

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Uploads (no subir fotos al repo)
public/files/photos/*
public/files/temp/*
!public/files/photos/.gitkeep
!public/files/temp/.gitkeep
EOF
        success ".gitignore creado"
    else
        warn ".gitignore ya existe, no se sobreescribió"
    fi
}

# ----------------------------
# Crear .gitkeep para carpetas
# vacías en git
# ----------------------------
create_gitkeeps() {
    step "Creando .gitkeep en carpetas de uploads..."
    touch public/files/photos/.gitkeep
    touch public/files/temp/.gitkeep
    success ".gitkeep creados"
}

# ----------------------------
# Verificar instalación final
# ----------------------------
verify_installation() {
    step "Verificando instalación..."

    # Verificar TypeScript
    if npx tsc --version &> /dev/null; then
        success "TypeScript: $(npx tsc --version)"
    else
        error "TypeScript no se instaló correctamente"
    fi

    # Verificar Express
    EXPRESS_VERSION=$(node -p "require('./node_modules/express/package.json').version" 2>/dev/null)
    if [ ! -z "$EXPRESS_VERSION" ]; then
        success "Express: v$EXPRESS_VERSION"
    else
        error "Express no se instaló correctamente"
    fi

    # Verificar estructura
    REQUIRED_DIRS=(
        "src/modules/user"
        "src/modules/product"
        "src/shared/config"
        "src/shared/database"
        "src/shared/middlewares"
        "public/files/photos"
        "public/files/temp"
    )

    for dir in "${REQUIRED_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            success "Carpeta: $dir"
        else
            warn "Carpeta faltante: $dir"
        fi
    done
}

# ----------------------------
# Resumen final
# ----------------------------
print_summary() {
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}   ✅ SETUP COMPLETADO EXITOSAMENTE         ${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo -e "${CYAN}📁 Estructura creada:${NC}"
    echo "   src/modules/  → Tus módulos (user, product, etc.)"
    echo "   src/shared/   → Config, DB, middlewares, utils"
    echo "   public/files/ → Uploads (photos + temp)"
    echo ""
    echo -e "${CYAN}📋 Próximos pasos:${NC}"
    echo "   1. Copia tu .env.example → .env y configura tus variables"
    echo "   2. Ejecuta: npm run dev"
    echo ""
    echo -e "${CYAN}🚀 Comandos disponibles:${NC}"
    echo "   npm run dev    → Desarrollo con hot-reload"
    echo "   npm run build  → Compilar TypeScript"
    echo "   npm run start  → Producción"
    echo ""
}

# ----------------------------
# MAIN - Ejecutar todo
# ----------------------------
main() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}   SALE-BACK Setup - Express 5 + TypeScript ${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""

    check_directory
    check_node
    create_structure
    install_dependencies
    create_tsconfig
    create_env_example
    create_gitignore
    create_gitkeeps
    verify_installation
    print_summary
}

main