# Checkpoint 02 — Halaman publik dan navigasi

Status fase — **PASS (siap lanjut ke Fase 03)**

Referensi — [Implementation plan](../../implementation-plan.md) · [Handoff](handoff.md) · [SEO.md](../../../05-engineering/SEO.md)

- [x] **PASS** — Seluruh rute EN & padanan ID dibangun mengikuti IA, blueprint, dan design system: `/services`, enam detail `/services/[slug]` (`strategy`, `creative`, `web-development`, `growth`, `social`, `data-analytics`), `/approach`, `/about`, `/insights`, `/insights/[slug]`, `/contact`, `/privacy`, serta 404 lokal. Breadcrumb (`BreadcrumbList` JSON-LD), `Service` JSON-LD, tautan konsultasi (termasuk pre-select `?service=` / `?package=`), dan switch locale dari halaman dalam (`/services/strategy` ↔ `/id/services/strategy`) lulus uji E2E (FR-01/05/06).
- [x] **PASS** — Insights lulus uji filter kategori (`?category=engineering`), empty state + tombol pemulihan (`?category=design`), dan detail dinamis EN/ID yang merender rich text (heading, paragraf, daftar, tabel, quote, code block, figure dengan fallback gambar, referensi), `generateMetadata`, serta `BlogPosting` JSON-LD dari satu record publik yang sama sesuai [SEO.md](../../../05-engineering/SEO.md). Artikel berpasangan menghasilkan `hreflang` timbal balik dan switch ke slug terjemahan; artikel satu bahasa tidak mengeluarkan `hreflang` ke listing dan switch locale mengarah ke `/id/insights`. Homepage mengambil 3 artikel terbaru dari adapter publik yang sama (FR-07/08/11).
- [x] **PASS** — UI form konsultasi (`/contact`, `/id/contact`), halaman privasi (`/privacy`, `/id/privacy`), dan 404 lokal tersedia di kedua locale. Uji E2E memverifikasi status HTTP 404 untuk rute asing & slug artikel asing, validasi klien + pesan error terikat `aria-describedby` tanpa menghapus input, pre-select layanan, dan status pratinjau jujur tanpa mengklaim pengiriman server sebelum Fase 03 terhubung (FR-09/12/15).
- [x] **PASS** — `/work`, `/work/sample`, dan `/id/work` mengembalikan HTTP 404, tidak muncul di navigasi, footer, maupun `/sitemap.xml` (FR-03/04 tetap ditunda sesuai `O-003`). Konten yang masih menunggu persetujuan dicatat di handoff: profil/foto tim nyata (`O-012`), email bisnis & nomor WhatsApp (`O-006`), review legal kebijakan privasi (`O-011`), dan artikel nyata CMS (Fase 03).

## Bukti & lingkungan uji

- **Tanggal:** 2026-11-21
- **Environment:** macOS arm64, Node v22.22.0, pnpm 10.34.9, Next.js 15.5.29, Google Chrome (Playwright 1.65.1)
- **Perintah uji (semua lulus exit code 0):**
  - `pnpm typecheck` — 5/5 paket lulus
  - `pnpm lint` — 2/2 aplikasi lulus
  - `pnpm test` — 9/9 unit test Vitest lulus (`packages/content/src/__tests__/content.test.ts`)
  - `NEXT_DIST_DIR=.next-e2e pnpm --filter @colonyhub/web build` — 32/32 halaman statis/SSG + rute dinamis lulus (125–134 kB First Load JS)
  - `NEXT_DIST_DIR=.next-e2e pnpm test:e2e` — 14/14 uji Playwright lulus (`parity.spec.ts` + `public-pages.spec.ts`), zero horizontal overflow di 375px untuk semua halaman publik, screenshot diverifikasi di `apps/web/test-results/parity/service-strategy-1440.png`
- **Skill yang dibaca & dipakai:** `antislop-copywriting` (copy EN/ID halaman baru tanpa klaim/angka fiktif, tanpa buzzword, tanpa em dash), `composition-patterns`, `antislop-human`.
