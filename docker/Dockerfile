# syntax=docker/dockerfile:1

# --- PHP dependencies -------------------------------------------------------
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist

# --- Front-end build (Wayfinder needs PHP + artisan during the Vite build) ---
FROM php:8.3-cli-alpine AS assets
RUN apk add --no-cache nodejs npm
WORKDIR /app
COPY --from=vendor /usr/bin/composer /usr/bin/composer
COPY --from=vendor /app/vendor ./vendor
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
    && cp .env.example .env \
    && composer dump-autoload --no-dev \
    && php artisan key:generate \
    && npm run build

# --- Runtime: PHP-FPM -------------------------------------------------------
FROM php:8.3-fpm-alpine AS app
COPY --from=mlocati/php-extension-installer:2 /usr/bin/install-php-extensions /usr/local/bin/
RUN apk add --no-cache su-exec \
    && install-php-extensions pdo_mysql opcache intl bcmath pcntl
COPY docker/php/php.ini /usr/local/etc/php/conf.d/zz-app.ini
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/zz-www.conf
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

WORKDIR /var/www/html
COPY --from=vendor /usr/bin/composer /usr/bin/composer
COPY --from=vendor /app/vendor ./vendor
COPY . .
COPY --from=assets /app/public/build ./public/build
RUN composer dump-autoload --optimize --classmap-authoritative --no-dev \
    && rm /usr/bin/composer \
    && rm -f public/storage && ln -s ../storage/app/public public/storage \
    && chown -R www-data:www-data bootstrap/cache

ENTRYPOINT ["entrypoint"]
CMD ["php-fpm"]

# --- Runtime: Nginx (static files + FastCGI to app) -------------------------
FROM nginx:1.27-alpine AS web
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=app /var/www/html/public /var/www/html/public
