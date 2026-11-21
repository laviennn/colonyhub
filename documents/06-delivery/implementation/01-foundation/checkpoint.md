# Checkpoint 01 — Fondasi dan paritas homepage

Status fase — **PASS (siap lanjut ke Fase 02)**

Referensi — [Implementation plan](../../implementation-plan.md) · [Handoff](handoff.md) · [Decision log](../../decision-log.md)

- [x] **PASS** — Preview Next.js lokal (`apps/web`, `apps/command-center`) dan workflow CI (`.github/workflows/ci.yml`) berjalan. Rute EN (`/`) dan ID (`/id`) dimuat langsung, di-refresh, dan statically prerendered (SSG, 133 kB First Load JS); `/en` redirect 308 ke `/`; rute asing mengembalikan HTTP 404. Keputusan monorepo O-007 (Turborepo + pnpm, `apps/*`, `packages/*`) dicatat di [decision-log.md](../../decision-log.md). *Catatan:* Vercel Preview URL aktif setelah branch di-push atas izin user; `vercel.json` tetap menyajikan `prototype/` hingga cutover Fase 04.
- [x] **PASS** — Paritas §9 dibuktikan di **375, 768, 1280, 1440, dan 1920 px** (zero horizontal overflow di seluruh viewport; screenshot tersimpan di `apps/web/test-results/parity/home-{375,768,1280,1440,1920}.png` dan diverifikasi visual di 375 & 1440 px). Uji otomatis memverifikasi keyboard, Services mega menu (hover/click/Escape), mobile menu (class + `inert`, focus, Escape), 24 stop layanan + tooltip, mobile accordion (`inert` + swap), statement, Colony Stories (rail + `<dialog>` viewer + ArrowRight + Pause + Escape + focus return), dan floating chat (fallback `#contact` selama nomor WA O-006 kosong).
- [x] **PASS** — Hero WebGL (`three@0.160.0` di-import dinamis setelah `load` + `requestIdleCallback`) lulus uji fallback SVG statis, `prefers-reduced-motion: reduce`, dan `Save-Data`; guard `2g`, `hardwareConcurrency <= 2`, non-WebGL2, mode ponsel (0.5x scale, 32 steps, ~30 fps cap, auto-downscale), pause off-screen (`IntersectionObserver`) / hidden tab (`visibilitychange`), serta cleanup (`dispose` saat unmount & `pagehide`) terporting penuh.
- [x] **PASS** — Empat gap baseline diperbaiki dan diuji:
  1. **Fokus reduced motion:** `transition: none !important` di `@media (prefers-reduced-motion: reduce)` + fokus link pertama mobile menu yang andal (`toBeFocused()` + `opacity: 1` PASS).
  2. **Markup tanpa JS:** Uji Playwright `javaScriptEnabled: false` mengonfirmasi 24 stop SVG, 6 unit legend, 6 unit mega menu, 5 story card, serta copy & `aria-label` EN/ID penuh ter-render langsung dari SSR HTML.
  3. **Label aksesibel EN/ID:** Seluruh `aria-label`, `<desc>`, `<title>`, dan meta description dilokalisasi penuh untuk EN dan ID.
  4. **Kontras statement:** Sesuai keputusan user (2026-11-21 di [decision-log.md](../../decision-log.md)), warna pra-nyala `.st-text.is-armed .w` dipertahankan pada `#C9CBD6` (paritas 100% dengan prototype & baseline §5) agar efek redup → menyala tetap utuh; state baca aktif menyala penuh ke `#0B1230` (16.70:1) & `#3F4BB8` (6.56:1), sedangkan `prefers-reduced-motion` dan no-JS langsung tampil penuh.

## Bukti & lingkungan uji

- **Tanggal:** 2026-11-21
- **Environment:** macOS arm64, Node v22.22.0, pnpm 10.34.9, Next.js 15.5.29, Google Chrome (Playwright 1.65.1)
- **Perintah uji (semua lulus exit code 0):**
  - `pnpm typecheck` — 5/5 paket lulus (`@colonyhub/content`, `@colonyhub/db`, `@colonyhub/ui`, `@colonyhub/web`, `@colonyhub/command-center`)
  - `pnpm lint` — 2/2 aplikasi lulus tanpa warning/error
  - `pnpm test` — 8/8 unit test Vitest lulus (`packages/content/src/__tests__/content.test.ts`)
  - `pnpm build` — 2/2 Next.js production build lulus (`/` & `/id` SSG, `/robots.txt`, `/sitemap.xml`, `/llms.txt` static)
  - `pnpm test:e2e` — 11/11 uji Playwright lulus (`apps/web/e2e/parity.spec.ts`)
  - `python3 ~/.claude/skills/antislop-human/contrast-check.py "#F6F4EE" "#5A6178"` — `5.59:1` PASS
- **Skill yang dibaca & dipakai:** `composition-patterns`, `antislop-human` (termasuk `contrast-check.py`), `web-design-guidelines`, `threejs-shaders`, `threejs-performance`.
- **Dependensi tertunda (bukan blocker Fase 01):** `frontend-design` (paket lokal tidak tersedia), master SVG logo (`O-001`), email bisnis & nomor WhatsApp (`O-006`), pilihan DB/Auth provider & ruang lingkup fitur Command Center (`O-007` untuk Fase 03).
