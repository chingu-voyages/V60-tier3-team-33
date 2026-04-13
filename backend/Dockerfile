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
ENV FRANKENPHP_CONFIG="worker ./public/index.php"

# Copy application code
COPY . .

# Set permissions for Laravel
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Ensure the railway scripts are executable
RUN chmod +x /app/railway/*.sh

# Port 80 is regulated by Railway
EXPOSE 80

# The default command runs the FrankenPHP server
# For Worker/Cron services, you will override this command in the Railway UI
# Change the last line to handle Railway's dynamic port
CMD ["frankenphp", "php-server", "--listen", ":80"]
