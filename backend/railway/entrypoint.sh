#!/bin/bash
set -e  # Exit on any error

# Ensure we're in the app directory
cd /app

# Ensure all packages are discovered
echo "Discovering packages..."
php artisan package:discover --ansi

# Run database migrations
echo "Running migrations..."
php artisan migrate --force 2>&1

# Optimize Laravel for production
echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start FrankenPHP on the dynamic port
# We use --root ./public to tell FrankenPHP to serve your Laravel app's public entry point.
echo "Starting FrankenPHP on port $PORT..."
exec frankenphp php-server --listen 0.0.0.0:$PORT --root ./public
