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
php artisan config:cache 2>&1
php artisan route:cache 2>&1
php artisan view:cache 2>&1

# Start Laravel using built-in PHP server
# Set the PORT if not already set by Railway (defaults to 8000 for local development)
PORT=${PORT:-8000}
echo "Starting Laravel on port $PORT..."
exec php artisan serve --host=0.0.0.0 --port=$PORT
