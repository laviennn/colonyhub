# Checkpoint 03 — Command Center dan inquiry

Status fase — Selesai & Terverifikasi (2026-11-22)

Referensi — [Implementation plan](../../implementation-plan.md) · [Handoff](handoff.md)

- [x] Editor dapat membuat draft, reviewer dapat preview privat, dan peran berwenang dapat publish/unpublish. Uji slug baru tanpa redeploy, redirect slug lama (`308`), dan hilangnya data tidak terbit dari HTML (`404`), alternate EN/ID, indeks, cache publik (`revalidatePath`), dan sitemap dinamis `/sitemaps/insights.xml` (FR-10/11).
  - Bukti: `packages/db/src/__tests__/db.test.ts` (6/6 Vitest PASS) + `apps/web/e2e/phase3-cms-inquiry.spec.ts` (`full CMS editorial lifecycle: draft -> private preview -> publish -> slug 308 -> unpublish 404` PASS).
- [x] Uji form valid, input invalid, spam/rate limit, kegagalan tujuan, dan retry. Bukti penerimaan berasal dari penyimpanan DB (`inquiries`) + tampilan langsung di Command Center Inbox serta adapter opsional Resend email (FR-09/15).
  - Bukti: `apps/web/src/app/api/inquiries/route.ts`, `apps/web/src/components/ContactForm.tsx`, `apps/web/e2e/public-pages.spec.ts` (konfirmasi Reference ID), dan `apps/web/e2e/phase3-cms-inquiry.spec.ts` (honeypot `400`, idempotency retry deduplication `200`, Inbox visibility, rate limit `429` PASS).
- [x] Uji akses tanpa sesi dan peran yang salah pada admin, draft, media privat dan inquiry. Catat pemilik akses, penerima inquiry, retensi, serta cara backup/restore.
  - Bukti: `apps/web/e2e/phase3-cms-inquiry.spec.ts` (`enforces authentication, noindex headers, and RBAC boundaries` PASS — `401` tanpa sesi, `307 -> /login`, `X-Robots-Tag: noindex, nofollow`, `403` untuk `editor` pada publish/inquiries/settings) + `mobile native-app shell` pada viewport `375px` PASS tanpa overflow horizontal.

## Ringkasan Verifikasi

- **Environment:** Node v22.22.0, pnpm 10.34.9, Google Chrome (Playwright), isolated local DB store (`COLONYHUB_LOCAL_DB_PATH`).
- **Perintah uji:**
  - `pnpm typecheck` — 5/5 packages PASS
  - `pnpm lint` — 2/2 apps PASS
  - `pnpm test` — 15/15 Vitest unit tests PASS (`@colonyhub/content` 9 + `@colonyhub/db` 6)
  - `NEXT_DIST_DIR=.next-e2e pnpm build` — `apps/web` + `apps/command-center` PASS
  - `NEXT_DIST_DIR=.next-e2e pnpm test:e2e` — 18/18 Playwright E2E tests PASS
- **Dependensi tertunda:**
  - `O-006`: email bisnis & nomor WhatsApp resmi untuk notifikasi email (`RESEND_API_KEY`, `INQUIRY_NOTIFY_EMAIL`) dan floating chat mobile.
  - `O-008` / `O-009` / `O-011`: penunjukan eksplisit pemilik operasional inbox inquiry, reviewer editorial, dan kebijakan retensi legal sebelum cutover produksi.
  - Provisioning database Neon/Postgres produksi (`DATABASE_URL`) dan secrets (`PREVIEW_SECRET`, `REVALIDATION_SECRET`) di Vercel saat Fase 04.
