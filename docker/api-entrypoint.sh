#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate --schema prisma/schema.prisma

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema prisma/schema.prisma

echo "Starting API..."
node dist/app/src/main.js
