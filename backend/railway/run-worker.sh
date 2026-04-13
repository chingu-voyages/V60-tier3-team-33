#!/bin/bash

echo "Starting queue worker..."
php artisan queue:work --tries=3 --timeout=90
