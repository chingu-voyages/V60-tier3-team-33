FROM dunglas/frankenphp:1-php8.4-bookworm

# Install required system dependencies and PHP extensions
RUN install-php-extensions \
    bcmath \
    gd \
    intl \
    zip \
    opcache \
    pdo_mysql \
    pcntl

# Set the PHP configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Set wording directory
WORKDIR /app

# Enable FrankenPHP features
# The PORT env var is provided by Railway at runtime
# Note: Don't use worker mode - Laravel's public/index.php is a single-request handler
ENV FRANKENPHP_CONFIG=""

# Copy application code
COPY . .

# Copy composer from official image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

# Clear any existing bootstrap caches
RUN rm -f /app/bootstrap/cache/*.php

# Set permissions for Laravel
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Ensure the railway scripts are executable
RUN chmod +x /app/railway/*.sh

# Port mapping is handled by Railway internally, but we stay consistent
EXPOSE 80

# Use our unified entrypoint to handle migrations and port binding
ENTRYPOINT ["/app/railway/entrypoint.sh"]
