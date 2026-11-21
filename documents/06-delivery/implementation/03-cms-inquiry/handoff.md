# Handoff 03 — Command Center dan inquiry

Status — Selesai (2026-11-22), siap menuju Fase 04 (QA & Cutover)

Referensi — [Checkpoint](checkpoint.md) · [Implementation plan](../../implementation-plan.md)

## Versi dan preview

- **Branch:** `main` (belum di-commit/push sesuai instruksi; `prototype/` dan `vercel.json` belum diubah).
- **Cara menjalankan lokal (tanpa Postgres):**
  - Terminal 1 (Public Web): `pnpm dev:web` → `http://localhost:3000`
  - Terminal 2 (Command Center): `pnpm dev:command-center` → `http://localhost:3001`
  - Keduanya otomatis berbagi store lokal `.colonyhub-local-data.json` saat `DATABASE_URL` tidak disetel.
- **Akun dev lokal (hanya aktif saat `DATABASE_URL` kosong — bukan secret produksi):**
  - Admin: `admin@colonyhub.local` / `colonyhub-admin-dev`
  - Reviewer: `reviewer@colonyhub.local` / `colonyhub-reviewer-dev`
  - Editor: `editor@colonyhub.local` / `colonyhub-editor-dev`

## Yang diserahkan

- **Migrasi DB (Postgres / Neon via Drizzle):**
  - Schema: `packages/db/src/schema.ts` (`users`, `sessions`, `authors`, `categories`, `articles`, `article_slug_redirects`, `inquiries`).
  - SQL migrasi awal: `packages/db/drizzle/0000_initial.sql`.
  - Jalankan migrasi ke Neon/Postgres: setel `DATABASE_URL`, lalu jalankan `pnpm --filter @colonyhub/db db:push` (atau terapkan `0000_initial.sql`).
- **Matriks peran (RBAC — ditegakkan di server):**
  - `editor`: membuat & mengedit draft, mengajukan review, membuka Private Preview. Ditolak (`403`) untuk publish/unpublish/archive, melihat Inquiries Inbox, dan mengakses Settings.
  - `reviewer`: semua izin editor + publish/unpublish/archive artikel, mengubah slug (otomatis mencatat redirect `308`), dan mengelola Inquiries Inbox. Ditolak (`403`) untuk Settings.
  - `admin`: akses penuh termasuk Settings (daftar akun/role, tambah Author, lihat kategori).
- **Alur editorial & preview:**
  - `draft` → Private Preview (`POST /api/articles/[id]/preview` → token HMAC berbatas waktu → `apps/web/api/preview` mengaktifkan Next.js Draft Mode + banner `DRAFT PREVIEW` + `noindex`) → `review` → `published` (memicu `POST /api/revalidate` secara otomatis) → rename slug (redirect `308`) → `archived` (`404` & hilang dari `/sitemaps/insights.xml`).
- **Tujuan inquiry & proteksi:**
  - `POST /api/inquiries` di `apps/web`: validasi Zod server-side + consent wajib, honeypot spam (`website`), sliding-window rate limit per IP (`429`), deduplikasi retry via `x-idempotency-key`, simpan ke tabel `inquiries` (tampil langsung di Command Center `/inquiries`), dan adapter opsional Resend jika `RESEND_API_KEY` + `INQUIRY_NOTIFY_EMAIL` dikonfigurasi.
- **UI/UX Backoffice:**
  - Desktop: 248px Hub Navy sidebar + Cloud White workspace, 2-column split editor, master-detail inquiry inbox.
  - Mobile (`<= 768px`): pengalaman native app dengan fixed 56px top app bar, fixed 64px + safe-area bottom tab bar (4 tab), segmented tabs di editor, full-screen detail di inbox, dan `manifest.webmanifest`.
- **Tata kelola, retensi & pemulihan (backup/restore):**
  - **Pemilik akses:** Admin colonyhub (role `admin` di `users`; ganti seluruh akun dev sebelum produksi).
  - **Penerima inquiry:** Tim reviewer/admin via Command Center `/inquiries` (+ email tujuan saat `O-006`/`O-008` final).
  - **Retensi data:** Inquiry aktif disimpan selama masa follow-up bisnis; inquiry berstatus `archived` dievaluasi untuk penghapusan berkala sesuai kebijakan privasi final (`O-011`).
  - **Backup & restore:** Gunakan Point-in-Time Recovery (PITR) + snapshot harian otomatis dari penyedia Postgres (Neon/Vercel Postgres), dilengkapi ekspor `pg_dump` terenkripsi sebelum migrasi skema besar. Restore diuji terlebih dahulu ke branch database staging sebelum cutover.

## Keputusan dan batasan

- Semua perubahan terverifikasi lewat `pnpm typecheck`, `pnpm lint`, `pnpm test` (15/15), `NEXT_DIST_DIR=.next-e2e pnpm build`, dan `NEXT_DIST_DIR=.next-e2e pnpm test:e2e` (18/18).
- `/work` tetap `404` sesuai `O-003`; tidak ada data klien/metrik palsu.
- **Perubahan arsitektur RBAC (2026-11-22):** User menetapkan migrasi dari static role (`admin`/`reviewer`/`editor`) ke **Superadmin-managed Dynamic Menu-Based RBAC** dengan single `ADMIN_MENUS` registry yang otomatis mendaftarkan permission RBAC setiap ada menu admin baru (lihat `decision-log.md` & `technical-guidelines.md` §2.1).

## Pekerjaan berikutnya (Upgrade RBAC + Fase 04 — QA & Cutover)

1. Implementasikan **Dynamic Menu-Based RBAC** (`roles`, `role_menu_permissions`, `ADMIN_MENUS` auto-sync, UI kelola Role & Permission khusus `superadmin`, dan guard server-side per menu).
2. Audit Lighthouse/Core Web Vitals, aksesibilitas keyboard/kontras, dan SEO penuh di build produksi.
3. Siapkan environment variables produksi di Vercel (`DATABASE_URL`, `PREVIEW_SECRET`, `REVALIDATION_SECRET`, `PUBLIC_WEB_URL`, dan opsional `RESEND_API_KEY` + `INQUIRY_NOTIFY_EMAIL` setelah `O-006` tersedia).
4. Cutover `vercel.json` dan domain `colonyhub.id` setelah persetujuan user.
