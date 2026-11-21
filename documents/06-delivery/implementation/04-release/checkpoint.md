# Checkpoint 04 — QA dan cutover

Status fase — **Pre-Cutover QA Selesai & Lulus (2026-11-22)**; menunggu izin & kredensial produksi user untuk cutover `colonyhub.id`.

Referensi — [Implementation plan](../../implementation-plan.md) · [Handoff](handoff.md)

- [x] **Audit teknis SEO lokal/build produksi lolos [checkpoint SEO](../../../05-engineering/SEO.md#8-checkpoint-sebelum-dan-sesudah-rilis):** 18 rute publik EN/ID terverifikasi HTTP 200, `<title>` unik, `<meta name="description">`, canonical `https://colonyhub.id`, `hreflang` simetris (`en`, `id`, `x-default`), JSON-LD valid, single `<h1>`, `/robots.txt`, `/llms.txt`, `/sitemap.xml` (Sitemap Index + sub-sitemaps + XSL), `/work` → 404, dan `noindex` di Command Center serta Draft Preview.
  - *Tertunda sampai cutover domain:* verifikasi HTTPS `colonyhub.id`, redirect domain, dan submit `https://colonyhub.id/sitemap.xml` + URL Inspection di Google Search Console.
- [x] **Lint, typecheck, unit tests, build produksi, E2E, audit WCAG 2.2 AA, dan pengukuran lab Core Web Vitals terekam (FR-12/13):**
  - `pnpm typecheck` — 5/5 packages PASS
  - `pnpm lint` — 2/2 apps PASS (0 error, 0 warning)
  - `pnpm test` — 17/17 Vitest unit tests PASS (`@colonyhub/content` 9 + `@colonyhub/db` 8)
  - `NEXT_DIST_DIR=.next-e2e pnpm build` — `apps/web` + `apps/command-center` PASS
  - `NEXT_DIST_DIR=.next-e2e pnpm test:e2e` — **23/23 Playwright E2E tests PASS** (termasuk `apps/web/e2e/phase4-qa-release.spec.ts`: WCAG 2.2 AA skip link/landmarks/alt/form labels, Command Center Light + Dark mode, serta pengukuran lab Chromium pada desktop `1440×900` & mobile `390×844` dengan `LCP <= 2500ms` dan `CLS <= 0.1`).
  - Pemantauan p75 Core Web Vitals (`LCP`, `CLS`) terpasang via `observeWebVitals()` di `apps/web/src/lib/analytics.ts`.
- [x] **Analytics & Event Tracking terverifikasi bebas PII (FR-14):**
  - `service_view`, `article_view`, `project_cta_click`, `inquiry_submit_success`, dan `inquiry_submit_error` terverifikasi di `apps/web/e2e/phase4-qa-release.spec.ts` dengan nol kebocoran email/nama/free-text, menghormati `Do Not Track` / consent, dan `work_detail_view` ditunda sesuai `O-003`.
- [ ] **Cutover produksi & post-launch smoke test:** Menunggu izin user untuk mengaktifkan `DATABASE_URL` (Neon/Postgres), mengarahkan Vercel ke `apps/web` & `apps/command-center`, dan verifikasi inquiry produksi + rollback test.
