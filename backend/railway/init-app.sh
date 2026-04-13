#!/bin/bash

# Run database migrations
echo "Running migrations..."
php artisan migrate --force

# Optimize Laravel for production
echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Initialization complete!"
