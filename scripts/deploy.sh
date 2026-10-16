#!/usr/bin/env bash
# Deploy the portfolio stack on the VPS. Run as `deploy` from /srv/portfolio/app.
set -euo pipefail

cd "$(dirname "$0")/.."
compose="docker compose -f compose.production.yaml"

git pull --ff-only
$compose build
$compose up -d db
$compose run --rm app php artisan migrate --force
$compose up -d --remove-orphans

# Old images and build cache pile up on every build; keep only the last week of cache.
docker image prune -f >/dev/null
docker builder prune -f --filter until=168h >/dev/null

echo "Deployed $(git rev-parse --short HEAD)"
