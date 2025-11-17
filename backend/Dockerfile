FROM php:8.2-cli

# Dependencies and extensions for PHP
RUN apt-get update && apt-get install -y \
    git zip unzip libicu-dev libonig-dev libzip-dev libpng-dev \
    && docker-php-ext-install pdo_mysql intl zip

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy app
COPY . /var/www/html

# Rights
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
