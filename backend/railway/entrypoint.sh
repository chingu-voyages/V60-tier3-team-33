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
if [ $? -ne 0 ]; then
  echo "ERROR: Database migration failed!"
  exit 1
fi

# Optimize Laravel for production
echo "Optimizing application..."
php artisan config:cache 2>&1
php artisan route:cache 2>&1
php artisan view:cache 2>&1

# Start FrankenPHP on the dynamic port
# Using exec ensures that the PHP server receives system signals (like SIGTERM) directly
# Set the PORT if not already set by Railway (defaults to 8000 for local development)
PORT=${PORT:-8000}
echo "Starting FrankenPHP on port $PORT..."
export FRANKENPHP_CONFIG="listen 0.0.0.0:$PORT worker ./public/index.php"
echo "FRANKENPHP_CONFIG=$FRANKENPHP_CONFIG"
exec frankenphp run 2>&1
