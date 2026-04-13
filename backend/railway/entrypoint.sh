#!/bin/bash

# Ensure we're in the app directory
cd /app

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Optimize Laravel for production
echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start FrankenPHP on the dynamic port
# Using exec ensures that the PHP server receives system signals (like SIGTERM) directly
echo "Starting FrankenPHP on port $PORT..."
exec frankenphp php-server --listen 0.0.0.0:$PORT
