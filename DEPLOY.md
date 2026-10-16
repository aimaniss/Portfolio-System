# Deploy ke VPS `byaiman`

Portfolio dijalankan sebagai satu stack Compose (`name: portfolio`) di VPS yang sama dengan Wedding Guest Moment.
Ia ikut peraturan VPS: **tiada port dipublish**, hanya container `web` masuk network `proxy` (alias `portfolio-web`),
dan Caddy di `/srv/proxy` yang terima trafik dari Cloudflare.

```
Cloudflare ──► Caddy (/srv/proxy) ──► portfolio-web:80 (Nginx) ──► app:9000 (PHP-FPM 8.3)
                                                                   ├─ worker (queue:work)
                                                                   └─ db (MySQL 8.4, volume portfolio_dbdata)
```

| Fail | Fungsi |
|------|--------|
| `docker/Dockerfile` | Multi-stage: composer → build Vite (dengan PHP untuk Wayfinder) → `app` (PHP-FPM) → `web` (Nginx) |
| `docker/php/*` | `php.ini`, pool FPM kecil (max 8 child), entrypoint (buat folder storage, `optimize`, chown) |
| `docker/nginx/default.conf` | Fail statik, `/storage`, FastCGI ke `app:9000`, upload sampai 80 MB |
| `compose.production.yaml` | `app`, `web`, `worker`, `db` |
| `scripts/deploy.sh` | git pull → build → migrate → `up -d` |
| `.env.production.example` | Templat `.env` production |

## Setup kali pertama

1. **Cloudflare**: tambah rekod A (proxied) untuk domain portfolio → IP VPS. Origin cert `*.byaiman.com` dah cover.
2. **Folder** (sebagai `aiman`):
   ```bash
   sudo mkdir -p /srv/portfolio/storage
   sudo chown -R deploy:deploy /srv/portfolio
   sudo -iu deploy
   git clone https://github.com/aimaniss/Portfolio-System.git /srv/portfolio/app
   ```
   Repo private: guna deploy key read-only atau token, sama macam repo wedding.
3. **`.env`**:
   ```bash
   cd /srv/portfolio/app
   cp .env.production.example .env && chmod 600 .env
   nano .env   # isi DB_PASSWORD, DB_ROOT_PASSWORD, ADMIN_*, APP_URL
   ```
4. **Build dan start**:
   ```bash
   docker compose -f compose.production.yaml build
   docker compose -f compose.production.yaml run --rm app php artisan key:generate --show
   #   salin output ke APP_KEY dalam .env
   docker compose -f compose.production.yaml up -d db
   docker compose -f compose.production.yaml run --rm app php artisan migrate --force --seed
   docker compose -f compose.production.yaml up -d
   ```
5. **Caddy**: tambah `PORTFOLIO_DOMAIN=…` dalam `/srv/proxy/.env`, dan blok ini dalam `/srv/proxy/Caddyfile`:
   ```
   {$PORTFOLIO_DOMAIN} {
   	tls /certs/origin.pem /certs/origin.key
   	reverse_proxy portfolio-web:80 {
   		header_up X-Forwarded-For {client_ip}
   	}
   }
   ```
   Kemudian `cd /srv/proxy && docker compose up -d`.
   Kalau domain ialah `byaiman.com`, pastikan `compose.yaml` Caddy ada `PORTFOLIO_DOMAIN` dalam environment (atau `env_file: .env`).
6. **Semak**: `curl -I https://<domain>/up` patut bagi 200, dan `docker ps` hanya tunjuk port 80/443 pada `proxy-caddy-1`.

## Deploy seterusnya

```bash
sudo -iu deploy
bash /srv/portfolio/app/scripts/deploy.sh
```

## Nota

- **Jangan deploy atau restart pada 7 Nov 2026** (hari wedding). Semak `docker stats --no-stream` dan `df -h /` sebelum start stack ini.
- Anggaran memori: MySQL ~350 MB, PHP-FPM + worker ~150–250 MB, Nginx ~10 MB.
- Upload (avatar, resume, gambar projek) disimpan di `/srv/portfolio/storage/app/public`. Backup folder ini bersama dump DB:
  `docker compose -f compose.production.yaml exec -T db sh -c 'mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" portfolio' > backup.sql`
- Log Laravel: `/srv/portfolio/storage/logs/`. Log container: `docker compose -f compose.production.yaml logs -f --tail 50 web app worker`.
- Belum ada: auto-deploy GitHub Actions, backup automatik, monitor Uptime Kuma.
