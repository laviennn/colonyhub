# Handoff 02 — Halaman publik dan navigasi

Status — **Selesai lokal (siap lanjut ke Fase 03 — Command Center dan inquiry)**

Referensi — [Checkpoint](checkpoint.md) · [Implementation plan](../../implementation-plan.md) · [SEO.md](../../../05-engineering/SEO.md)

- **Versi dan preview** — Working tree lokal (`main`, belum di-commit; `vercel.json` tetap menyajikan `prototype/`).
  - Menjalankan lokal: `pnpm dev:web` (`http://localhost:3000` EN, `http://localhost:3000/id` ID).
  - Rute publik aktif EN (dan padanan `/id/...`): `/`, `/services`, `/services/{strategy,creative,web-development,growth,social,data-analytics}`, `/approach`, `/about`, `/insights`, `/insights/[slug]`, `/contact`, `/privacy`, plus `/robots.txt`, `/sitemap.xml`, `/llms.txt`.
- **Yang diserahkan**
  - Konten terketik EN/ID & fixture preview Insights di `packages/content/src/{service-details,pages-content,insights-fixtures}.ts` + `buildBlogPostingJsonLd` di `seo.ts`.
  - Stylesheet halaman dalam di `packages/ui/src/styles/pages.css` (100% token baseline §3).
  - Komponen & view bersama di `apps/web/src/components/{SiteHeader,SiteFooter,Breadcrumbs,RichTextRenderer,ContactForm}.tsx` dan `apps/web/src/views/{Home,Services,ServiceDetail,Approach,About,Insights,ArticleDetail,Contact,Privacy}PageView.tsx`.
  - Kontrak data CMS siap tukar di Fase 03: `listPublishedArticles`, `getPublishedArticleBySlug`, `getArticleTranslation`, `getRelatedArticles` + `inquirySchema`.
  - Suite E2E Fase 02 (`apps/web/e2e/public-pages.spec.ts`, 14/14 lulus) + screenshot `apps/web/test-results/parity/service-strategy-1440.png`.
- **Keputusan dan batasan**
  - `/work` dan `/work/[slug]` tetap 404 & tidak muncul di navigasi/sitemap (`O-003`).
  - Artikel saat ini adalah fixture pratinjau bertanda eksplisit (*Preview sample* / *Contoh pratinjau*) dan sengaja belum dimasukkan ke `sitemap.xml` sampai konten nyata terbit dari CMS.
  - Konten menunggu finalisasi bisnis: email & WhatsApp resmi (`O-006`), bio/foto tim nyata (`O-012`), review legal privasi (`O-011`).
- **Pekerjaan berikutnya (Fase 03 — Command Center dan inquiry)**
  - Kunci provider DB (Postgres/Neon) & Auth (Auth.js / Better Auth + peran/MFA) di `O-007`.
  - Bangun CMS di `apps/command-center` (draft → review → preview privat `noindex` → publish/unpublish, slug unik per locale + redirect slug lama, relasi terjemahan, author, media/alt, SEO, dan revalidasi `apps/web` tanpa redeploy).
  - Hubungkan `ContactForm` ke Server Action / API dengan validasi server, anti-spam, rate limit, idempotency anti-duplikat, dan penyimpanan ke tabel `inquiries` / kanal tujuan yang disetujui (`O-008`).
