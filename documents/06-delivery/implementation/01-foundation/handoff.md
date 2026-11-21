# Handoff 01 — Fondasi dan paritas homepage

Status — **Selesai lokal (siap review & lanjut ke Fase 02)**

Referensi — [Checkpoint](checkpoint.md) · [Implementation plan](../../implementation-plan.md) · [Decision log](../../decision-log.md)

- **Versi dan preview** — Working tree lokal pada branch `main` (belum di-commit/push sesuai aturan repo; `vercel.json` tetap menyajikan `prototype/` sampai cutover Fase 04).
  - Menjalankan lokal: `pnpm install && pnpm dev:web` (`http://localhost:3000` EN, `http://localhost:3000/id` ID) atau `pnpm dev:cc` (`http://localhost:3001` Command Center scaffold).
  - Menjalankan verifikasi penuh: `pnpm typecheck && pnpm lint && pnpm test && pnpm build && pnpm test:e2e`.
- **Yang diserahkan**
  - Monorepo Turborepo + pnpm: `apps/web`, `apps/command-center`, `packages/config`, `packages/content`, `packages/db`, `packages/ui`, plus CI workflow `.github/workflows/ci.yml`.
  - Token & CSS baseline di `packages/ui/src/styles/{tokens,base,homepage}.css` + self-hosted fonts `@fontsource/{sora,inter,jetbrains-mono}`.
  - Data & kontrak terketik di `packages/content/src/{locales,dictionaries,services,stories,schemas,seo}.ts` (6 Colony Units, 24 stop EN/ID, 5 story samples, Organization/Service/Breadcrumb JSON-LD helper).
  - Routing bilingual native tanpa overhead middleware: `apps/web/src/app/(en)/*` (`/`) dan `apps/web/src/app/(id)/id/*` (`/id`), ditambah `robots.ts`, `sitemap.ts`, dan `llms.txt/route.ts`.
  - Bukti paritas: 11/11 uji Playwright E2E + screenshot 375/768/1280/1440/1920 px (`apps/web/test-results/parity/`).
- **Keputusan dan batasan**
  - `O-007` struktur monorepo dikonfirmasi user (2026-11-21). Provider Postgres & Auth untuk Command Center masih terbuka untuk Fase 03.
  - `O-006` email bisnis & nomor WhatsApp menyusul; floating chat tetap fallback aman ke `#contact`.
  - Keputusan user (2026-11-21): warna pra-nyala statement tetap `#C9CBD6` sesuai prototype v0.4 & baseline §5 (tahap dekoratif pra-scroll; penuh `#0B1230`/`#3F4BB8` saat dibaca, reduced motion, dan no-JS).
- **Pekerjaan berikutnya (Fase 02 — Halaman publik dan navigasi)**
  - Bangun rute EN & ID untuk `/services`, `/services/[slug]` (6 Colony Units + Seed/Grow/Scale tanpa harga), `/approach`, `/about` (berdasarkan Brand Identity PDF tanpa bio/foto fiktif), `/insights`, `/insights/[slug]` (dinamis dengan fixture preview), `/contact` (UI form + seluruh state), dan `/privacy` (draft struktur menunggu review legal), serta sambungkan seluruh tautan header, footer, breadcrumb, dan switch locale di halaman dalam.
  - Tetap jaga `/work` dan `/work/[slug]` tidak publik (FR-03/04 ditunda sesuai `O-003`).
