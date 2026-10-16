#!/bin/sh
set -e

if [ "$(id -u)" = "0" ]; then
    # storage/ is a bind mount from the host, so make sure its folders exist.
    mkdir -p storage/app/public storage/framework/cache storage/framework/sessions \
        storage/framework/views storage/logs

    if [ "$1" = "php-fpm" ]; then
        php artisan optimize
    fi

    chown -R www-data:www-data storage bootstrap/cache

    # php-fpm drops to www-data itself; everything else (artisan, queue) runs as www-data.
    if [ "$1" != "php-fpm" ]; then
        exec su-exec www-data "$@"
    fi
fi

exec "$@"
