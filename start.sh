#!/bin/sh

echo "⏳ Waiting for DB..."
sleep 2

echo "📦 Running migrations..."
npx prisma migrate dev --name init

echo "🚀 Starting app..."
exec "$@"
