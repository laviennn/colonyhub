# Handoff 04 — QA dan cutover

Status — **Siap Cutover Produksi (2026-11-22)**

Referensi — [Checkpoint](checkpoint.md) · [Implementation plan](../../implementation-plan.md)

## Versi dan preview

- **Branch:** `main` (belum di-commit/push sesuai instruksi; `prototype/` dan `vercel.json` belum diubah sehingga `https://colonyhub.vercel.app` tetap aman melayani prototype sampai izin cutover diberikan).
- **Perintah menjalankan lokal:**
  - Public Web: `pnpm dev:web` → `http://localhost:3000`
  - Colony Command Center: `pnpm dev:cc` (atau `pnpm dev:command-center`) → `http://localhost:3001`
  - Full QA suite: `pnpm typecheck && pnpm lint && pnpm test && NEXT_DIST_DIR=.next-e2e pnpm build && NEXT_DIST_DIR=.next-e2e pnpm test:e2e`

## Yang diserahkan (Runbook Cutover & Rollback)

### 1. Provisioning Database Produksi (Neon / Vercel Postgres)
1. Buat database Postgres (mis. Neon via Vercel Marketplace) dan salin connection string ke `DATABASE_URL`.
2. Jalankan migrasi SQL awal:
   - `packages/db/drizzle/0000_initial.sql` (skema CMS, artikel, slug redirects, inquiries, users, sessions)
   - `packages/db/drizzle/0001_dynamic_menu_rbac.sql` (skema `roles`, `role_menu_permissions`, `users.role_id`)
3. Buat akun `superadmin` produksi dengan password kuat (jangan gunakan kredensial dev lokal).

### 2. Deploy 2 Project Vercel dari Monorepo Ini
- **Project 1 — Public Web (`colonyhub.id`)**
  - Root Directory: `apps/web`
  - Env vars: `NEXT_PUBLIC_SITE_URL=https://colonyhub.id`, `DATABASE_URL`, `PREVIEW_SECRET`, `REVALIDATION_SECRET`, dan opsional `RESEND_API_KEY`, `INQUIRY_NOTIFY_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER` (setelah `O-006` final).
- **Project 2 — Colony Command Center (subdomain internal, mis. `command.colonyhub.id`)**
  - Root Directory: `apps/command-center`
  - Env vars: `DATABASE_URL`, `PUBLIC_WEB_URL=https://colonyhub.id`, `PREVIEW_SECRET`, `REVALIDATION_SECRET`.
  - Otomatis mengirim header `X-Robots-Tag: noindex, nofollow, noarchive` & `X-Frame-Options: DENY`.

### 3. Prosedur Rollback (< 2 menit)
- **Aplikasi Vercel:** klik **Instant Rollback** ke deployment stabil sebelumnya di dashboard Vercel (`colonyhub` / `command-center`), atau revert commit `vercel.json` ke `prototype/`.
- **Database:** gunakan Neon Point-in-Time Recovery (PITR) / branch restore ke timestamp sebelum migrasi.

### 4. Checklist Pasca-Cutover (`https://colonyhub.id`)
1. Pastikan HTTPS aktif dan `www.colonyhub.id` → `https://colonyhub.id` (308).
2. Submit `https://colonyhub.id/sitemap.xml` di **Google Search Console** dan jalankan URL Inspection pada `/`, `/id`, `/services`, dan 1 artikel EN/ID.
3. Kirim 1 test inquiry di `https://colonyhub.id/contact` dan pastikan masuk ke Command Center `/inquiries`.
4. Uji publish + rename slug + unpublish 1 artikel test dari Command Center dan pastikan `/sitemaps/insights.xml` langsung ter-update.

## Keputusan dan batasan

- Seluruh 23 Playwright E2E tests (Phase 01 parity + Phase 02 public pages/SEO + Phase 03 CMS/Inquiry/Dynamic RBAC/Dark Mode + Phase 04 Release QA) dan 17 Vitest unit tests **LULUS 100%**.
- `/work` tetap `404` sampai ada studi kasus nyata (`O-003`).
- `O-006` (email bisnis & nomor WhatsApp resmi) tetap terbuka dan aman dengan fallback `#contact` + Command Center Inbox.

## Pekerjaan berikutnya

- Konfirmasi user untuk: (1) `git commit` + push ke branch/PR, (2) provisioning `DATABASE_URL` + env vars Vercel, dan (3) cutover domain `colonyhub.id`.
