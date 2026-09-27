# Portfolio System — handoff

This file continues a planning/design chat so work can carry on in VS Code.
The owner (Aiman) writes in Malay; reply in Malay unless asked otherwise.

## 1. What we're building

A personal portfolio site with a private admin panel.

- **Public site**: profile, skills, work experience, projects (images, GitHub and live links), contact form.
- **Admin panel** (`/admin`, single admin user, registration disabled): edit profile, avatar and resume PDF; CRUD for skills, experiences and projects (multi-image upload, set cover, tag skills, publish/featured toggles); contact-message inbox; **theme switcher**.
- **Three public themes**, chosen in admin (`profiles.theme`), all using the same data:
    1. `mac`: macOS Terminal window (default)
    2. `powershell`: Windows Terminal + PowerShell
    3. `professional`: a clean, conventional portfolio (light background, sans-serif; not designed yet, so design it in code)
    - A logged-in admin can preview any theme with `?theme=mac|powershell|professional` on public URLs.
- The admin panel itself always uses the macOS terminal look.

## 2. Decisions already made

| Topic         | Decision                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| Stack         | Laravel 13 monolith, official **React starter kit** (Inertia v3, React 19, TS, Tailwind v4, Fortify auth) |
| DB            | MySQL via **Laravel Herd** (user `root`, empty password)                                                  |
| Images        | Local `public` disk (`storage/app/public`) + `php artisan storage:link`                                   |
| Routing in TS | Plain URL strings in new pages (no Wayfinder imports needed)                                              |
| Deploy        | Contabo VPS + own domain, **later** (Docker, GitHub Actions, Uptime Kuma). Not in scope now               |
| Mobile        | Public pages and admin must be responsive (mockups include mobile)                                        |

## 3. Design (see `_handoff/mockups/`)

Open the `.png` files, or open the `.html` files in a browser.

- `Main`: macOS home (approved). Sections in order: `whoami` (profile), `tree skills/`, `cat experience.log`, `ls projects/ --featured`, `./contact.sh`, then an idle prompt with a blinking cursor.
- `Project`: macOS project detail (`cat <slug>/README.md`, gallery, markdown body, `stat` side panel).
- `Login`: `sudo login --admin` terminal login.
- `Admin`: dashboard (sidebar file tree, 4 stat tiles, recent projects table, recent messages).
- `AdminProject`: edit-project form (fields left, publish / stack / danger panels right, image grid with cover and remove).
- `MobileHome`, `MobileAdmin`: phone layouts (admin uses a bottom tab bar on mobile).
- `WinHome`: PowerShell theme home (`Get-Profile`, `Get-ChildItem .\skills | Format-Table`, experience as `Format-List` cards, `.\Send-Message.ps1`).

Feedback from the owner to respect:

- **No tab/nav bar** under the macOS title bar (it felt crowded).
- Every section header uses the same pattern: prompt command on the left, a muted `# comment` on the right, and a thin rule below.
- Keep it spacious and tidy.

Colour and font tokens for all three themes are in `overlay/resources/css/portfolio.css`. Use them as Tailwind classes, for example `bg-mac-bg`, `text-mac-green`, `font-mac`, `bg-ps-bg` and `text-pro-ink`.

## 4. Setting up the Laravel project (not done yet)

`C:\Projects\Portfolio System` currently holds only this `_handoff` folder and a short `CLAUDE.md`, so `laravel new` can't target it directly. Do this:

```powershell
cd C:\Projects
laravel new portfolio-tmp --react --database=mysql
# answer: Laravel built-in auth, any test framework, npm install = yes
```

If the installer prompts interactively and you can't answer, ask the owner to run that command in a terminal.

Then move everything from `portfolio-tmp` into `Portfolio System`, including dotfiles (`.env`, `.gitignore`, `.editorconfig`), and delete `portfolio-tmp`. If the new project brings its own `CLAUDE.md`, merge it with the existing one.

## 5. Apply the code written so far

Copy `_handoff/overlay/*` over the project root. It replaces `routes/web.php` and `database/seeders/DatabaseSeeder.php`; every other file in it is new.

**Backend (done, lint-checked with `php -l`, not yet run):**

- `database/migrations/2026_09_27_000001_create_portfolio_tables.php`: profiles (includes `theme`), skill_categories, skills, experiences, experience_skill, projects (`built_at` date, `is_published`, `is_featured`, `sort_order`), project_images (`is_cover`), project_skill, messages.
- Models: `Profile` (`Profile::current()` singleton, `THEMES` const, appended `avatar_url` and `resume_url`), `SkillCategory`, `Skill`, `Experience`, `Project` (route key `slug`; `published()` and `ordered()` scopes; `cover` and `images` relations), `ProjectImage` (appended `url`), `Message`.
- `PortfolioController`: home, projects (`?skill=` filter), show, contact. Each passes a `theme` prop.
- `Admin\*` controllers: Dashboard, Profile (multipart; avatar and resume upload/remove), Theme, Skill (skills and categories inline), Experience (resource), Project (POST for update so file uploads work; setCover, destroyImage), Message (toggle read, delete).
- `routes/web.php`: all routes. Public: `/`, `/projects`, `/projects/{slug}`, `POST /contact`. Admin under `/admin` with the `auth` middleware. `/dashboard` redirects to `/admin`.
- `app:create-admin` artisan command; the seeder creates an admin from `ADMIN_EMAIL`, `ADMIN_NAME` and `ADMIN_PASSWORD`, plus the profile, 13 skills in 4 categories and a sample `portfolio-cms` project.
- Flash toasts use the starter's `Inertia::flash('toast', [...])` and the `useFlashToast()` hook.

**Frontend (started):**

- `resources/js/types/portfolio.ts`: all prop types.
- `resources/js/lib/portfolio.tsx`: date helpers, `useContactForm()`, and a tiny `<Markdown>` renderer (`##`, `###`, `-` lists, paragraphs).
- `resources/css/portfolio.css`: theme tokens and the `animate-blink` utility.
- `resources/js/themes/mac/ui.tsx`: `MacShell`, `Prompt`, `SectionHead`, `Chip`, `Cursor`, `Placeholder` and class presets.

## 6. Wire up the starter kit files

1. `resources/css/app.css`: add `@import './portfolio.css';` right after `@import 'tw-animate-css';`.
2. `npm i @fontsource/jetbrains-mono @fontsource/cascadia-code`
3. `config/fortify.php`: set `'home' => '/admin'`, and remove `Features::registration()` and `Features::emailVerification()`.
4. `resources/js/app.tsx` layout resolver: return `null` for names starting with `public/` or `admin/`, and for `auth/login`. Those pages render their own shells.
5. `.env`: set `APP_NAME="Aiman Ismail"`, `APP_URL`, the MySQL `DB_*` values (Herd default `root` with no password; database `portfolio`), plus `ADMIN_EMAIL`, `ADMIN_NAME` and `ADMIN_PASSWORD`.
6. `php artisan storage:link`, then `php artisan migrate --seed`.
7. Optionally delete the unused starter pages `welcome.tsx` and `dashboard.tsx`. Keep the `settings/*` pages; admin links to them for password and 2FA.

## 7. Remaining work

Build these pages with Inertia `useForm` / `router` and plain URLs. Props come from the controllers.

**Public (each switches on `props.theme`):**

- `pages/public/home.tsx`, `pages/public/projects/index.tsx`, `pages/public/projects/show.tsx` pick one of:
    - `themes/mac/{home,projects,project}.tsx`: follow the macOS mockups.
    - `themes/powershell/{ui,home,projects,project}.tsx`: follow `WinHome`. It needs Windows 11 title bar chrome (one "PowerShell" tab plus `─ ☐ ✕`), the prompt `PS C:\Users\aiman>` with command names in `text-ps-yellow`, and the Cascadia Code font.
    - `themes/professional/{shell,home,projects,project}.tsx`: clean light layout with a top bar (name plus anchor links), hero with avatar, skills chips grouped by category, experience timeline, project cards grid and contact form. Use the `pro-*` tokens and `font-pro`.
- Empty states should stay in character (for example `cat: experience.log: No such file or directory`).

**Admin (`pages/admin/*`, macOS style, wrapped in a new `layouts/admin-layout.tsx`):**

- Layout: desktop sidebar (dashboard, profile, theme, skills, experiences, projects, messages, settings, view site, logout via `POST /logout`); on mobile, a bottom tab bar. Status bar at the bottom. Call `useFlashToast()`.
- `dashboard.tsx`, `profile.tsx` (avatar and resume upload, `forceFormData`), `theme.tsx` (3 cards, each with a preview link `/?theme=x` and an "activate" button that posts to `/admin/theme`), `skills.tsx` (categories with inline add/rename/delete), `experiences/index.tsx` and `experiences/form.tsx`, `projects/index.tsx` and `projects/form.tsx` (match `AdminProject`; POST to `/admin/projects/{id}` with `forceFormData`; images via `/admin/projects/{id}/images/{image}/cover` and DELETE), `messages.tsx`.
- `pages/auth/login.tsx`: replace with the terminal login from the mockup. POST `/login` with `email`, `password` and `remember`. No "sign up" link.

## 8. Checks before calling it done

- `php artisan migrate:fresh --seed` runs cleanly; `php artisan route:list` shows the routes.
- `npm run types:check` and `npm run build` pass.
- Walk through it in the browser (`composer run dev`, or Herd): the public site in all 3 themes (switch in admin), login, and CRUD for every admin section. Also check image upload and set-cover, the contact form landing in the inbox, and a mobile-width view.

## 9. Later (not now)

Dockerfile and docker-compose (app, MySQL, nginx), a GitHub Actions CI/CD deploy to the Contabo VPS, SSL, Uptime Kuma monitoring, SEO meta and OG images.
