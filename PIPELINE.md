# Portfolio System — Fasa, Flow & Pipeline

Pelan kerja untuk menyiapkan sistem ini, dibuat berdasarkan `_handoff/HANDOFF.md`.
Setiap fasa ditanda siap (`[x]`) hanya selepas semakan fasa itu lulus.

---

## 1. Fasa kerja

| Fasa                       | Skop                                                                                                                             | Semakan sebelum lulus                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **0. Setup projek**        | `laravel new` (React starter kit), pindah ke folder ini                                                                          | `php artisan --version` jalan                                 |
| **1. Backend & wiring**    | Salin overlay, CSS token, font, Fortify (`home=/admin`, tutup register), layout resolver, `.env`, `storage:link`, migrate + seed | `migrate:fresh --seed` bersih, `route:list` papar semua route |
| **2. Tema macOS (public)** | `public/home`, `public/projects/index`, `public/projects/show` → `themes/mac/*`; login terminal (`auth/login`)                   | Halaman buka tanpa ralat, `types:check` lulus                 |
| **3. Panel admin**         | `layouts/admin-layout.tsx` + dashboard, profile, theme, skills, experiences, projects (gambar + cover), messages                 | CRUD setiap seksyen berfungsi                                 |
| **4. Tema PowerShell**     | `themes/powershell/{ui,home,projects,project}` ikut mockup `WinHome`                                                             | Tukar tema di admin → public berubah                          |
| **5. Tema Professional**   | `themes/professional/{shell,home,projects,project}` — layout cerah, sans-serif                                                   | Sama seperti fasa 4                                           |
| **6. Semakan akhir & run** | `types:check`, `build`, `migrate:fresh --seed`, ujian pelayar (3 tema, login, CRUD, upload, contact, mobile)                     | Semua lulus → sistem dijalankan                               |
| **7. Deploy (kemudian)**   | Docker, GitHub Actions, VPS Contabo, SSL, Uptime Kuma, SEO                                                                       | Di luar skop sekarang                                         |

### Status

- [x] Fasa 0 — Setup projek
- [x] Fasa 1 — Backend & wiring
- [x] Fasa 2 — Tema macOS + login
- [x] Fasa 3 — Panel admin
- [x] Fasa 4 — Tema PowerShell
- [x] Fasa 5 — Tema Professional
- [x] Fasa 6 — Semakan akhir & run
- [ ] Fasa 7 — Deploy (kemudian)

---

## 2. Flow sistem

### 2.1 Pelawat (public)

```
Pelayar ── GET / , /projects , /projects/{slug}
   │
   ▼
routes/web.php ──► PortfolioController
   │                  ├─ ambil data: Profile, SkillCategory+Skill, Experience, Project (+cover, skills)
   │                  └─ tentukan tema: ?theme= (admin sahaja) → profiles.theme → 'mac'
   ▼
Inertia::render('public/…', { theme, profile, … })
   │
   ▼
pages/public/*.tsx  ── switch (props.theme)
   ├─ 'mac'          → themes/mac/*
   ├─ 'powershell'   → themes/powershell/*
   └─ 'professional' → themes/professional/*
```

Borang hubungi: `POST /contact` (had 5/minit) → jadual `messages` → toast "Message sent" → muncul di inbox admin.

### 2.2 Admin

```
/login (terminal "sudo login --admin")
   │  POST /login (Fortify)  — tiada pendaftaran
   ▼
/admin  (middleware auth, layouts/admin-layout.tsx)
   ├─ Dashboard    : statistik, projek terkini, mesej terkini
   ├─ Profile      : nama, bio, pautan, avatar + resume PDF (multipart)
   ├─ Theme        : pilih mac | powershell | professional, pratonton /?theme=x
   ├─ Skills       : kategori + skill (tambah / ubah nama / padam, inline)
   ├─ Experiences  : CRUD + tag skill
   ├─ Projects     : CRUD, multi-upload gambar, set cover, publish/featured, tag skill
   ├─ Messages     : tanda dibaca / padam
   └─ Settings     : kata laluan & 2FA (halaman starter kit)
```

### 2.3 Aliran data

```
Admin ubah data ──► MySQL ──► PortfolioController ──► tema aktif ──► pelawat
Gambar / avatar / resume ──► storage/app/public ──(storage:link)──► /storage/…
```

---

## 3. Pipeline

### 3.1 Pembangunan (lokal)

```
composer run dev
  ├─ php artisan serve      (http://127.0.0.1:8010)
  ├─ php artisan queue:listen
  └─ npm run dev            (Vite + HMR)
```

### 3.2 Semakan kualiti (setiap fasa)

```
php -l / php artisan route:list      → backend sah
php artisan migrate:fresh --seed     → skema + data contoh
npm run types:check                  → TypeScript
npm run check  (vp: lint + format)   → gaya kod JS/TS
vendor/bin/pint --test               → gaya kod PHP
php artisan test                     → ujian PHPUnit
npm run build                        → bundle production
Ujian pelayar                        → desktop + lebar mobile
```

### 3.3 Deploy (Fasa 7, kemudian)

```
git push main
   ▼
GitHub Actions
   ├─ composer install, npm ci
   ├─ types:check, lint, test, build
   └─ build imej Docker (app + nginx) → push registry
   ▼
VPS Contabo (docker compose: app, mysql, nginx)
   ├─ php artisan migrate --force
   ├─ SSL (Let's Encrypt)
   └─ Uptime Kuma memantau domain
```

---

## 4. Nota persekitaran & cara jalankan

- PHP & Laravel installer datang dari Herd (`~/.config/herd/bin`).
- Herd versi percuma **tiada MySQL**, jadi MySQL Server 8.4 (sedia dipasang) dijalankan sebagai proses biasa, bukan servis Windows:
  - data dir & config: `C:UsersAiman.mysql84my.ini` (root tanpa password, 127.0.0.1:3306, DB `portfolio`)
  - mula: `& "C:Program FilesMySQLMySQL Server 8.4inmysqld.exe" --defaults-file="C:UsersAiman.mysql84my.ini"`
- Port 8000 dipakai projek lain (Publishing-Management-System), jadi app ini guna **8010** (`SERVER_PORT=8010` dan `APP_URL` dalam `.env`).
- Jalankan: `composer run dev` → http://127.0.0.1:8010 (admin: `/login`).
- Kredential admin hanya dalam `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`), tidak pernah dalam kod. Jika `ADMIN_PASSWORD` kosong, seeder jana kata laluan rawak dan paparkannya sekali.

## 5. Semakan yang telah lulus (Fasa 6)

- `php artisan migrate:fresh --seed` bersih; `route:list` = 41 route.
- `npm run types:check`, `npm run check` (lint + format), `npm run build` lulus.
- `php artisan test`: 41 ujian lulus (termasuk `tests/Feature/PortfolioTest.php`).
- Ujian pelayar E2E (Playwright): 43 semakan lulus tanpa ralat konsol — borang hubungi → inbox, login (salah & betul), CRUD skills/kategori, experiences (+ validasi tarikh), projek (upload 2 gambar, set cover, padam gambar, slug dinormalkan, slug pendua ditolak), profil + avatar, tukar 3 tema, `?theme=` diabaikan untuk tetamu, logout.
- Tangkapan skrin desktop (1440px) & mobile (390px) untuk ketiga-tiga tema dan admin.
