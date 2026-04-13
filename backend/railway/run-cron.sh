#!/bin/bash

echo "Starting scheduler loop..."

while [ true ]
do
  echo "Running schedule..."
  php artisan schedule:run --no-interaction &
  sleep 60
done
