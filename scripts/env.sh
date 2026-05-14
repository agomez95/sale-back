#!/bin/bash

# ============================================
#   SALE-BACK - Environment Variables
# ============================================
export PORT=3000
export NODE_ENV=development
export ACCESS_SECRET=generate_with_crypto_randombytes_64
export API_LOCAL=http://localhost:3000

export PG_PORT_LOCAL=5432
export PG_HOST_LOCAL=localhost
export PG_USER_LOCAL=postgres
export PG_PASSWORD_LOCAL=postgres
export PG_DB_LOCAL=sales_db

# Generar con: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
export JWT_SECRET=generate_with_crypto_randombytes_64
export JWT_ACCESS_EXPIRY=15m
export JWT_REFRESH_EXPIRY=7d