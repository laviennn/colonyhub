# Implementation plan — prototype ke produksi

Migrasikan homepage v0.4 ke **Next.js App Router + TypeScript di Vercel**, lengkapi halaman publik, dan hubungkan ke **Colony Command Center**, CMS internal terautentikasi. Gunakan [decision log](decision-log.md) untuk keputusan rilis, [PRD](../02-product/PRD.md) untuk acceptance criteria, dan [baseline](../04-design/ui-ux-baseline.md) untuk paritas homepage. Work dan case study (FR-03/04) tetap tersembunyi sampai ada materi yang disetujui. Origin produksi `https://colonyhub.id`, EN default di `/`, ID di `/id/`. Ikuti [SEO.md](../05-engineering/SEO.md) sejak fondasi hingga cutover.

## Setup skill untuk agen

Sebelum mulai fase, cek katalog skill runtime, folder skill proyek, lalu folder skill pengguna. Buka `SKILL.md` dan referensi yang diperlukannya. Skill di bawah ditemukan di `~/.claude/skills` pada mesin ini. `antislop-copywriting` juga ada di Codex.

| Fase | Skill dan penggunaan |
|---|---|
| 01–02 | `vercel-composition-patterns` (folder `composition-patterns`) untuk API komponen bersama. |
| 01–02 | `impeccable`, `design-taste-frontend` untuk review UI. `antislop-human` dan `web-design-guidelines` untuk kontras, fokus, dan keyboard. |
| 01 | `threejs-shaders`, `threejs-animation`, `threejs-interaction`, `threejs-performance` khusus hero. Pertahankan r160, shader, timing, dan fallback saat port. |
| 02 | `antislop-copywriting` untuk copy halaman baru EN/ID. Ikuti voice brand dan pertahankan copy homepage sesuai baseline. |
| 03–04 | `code-review-skill` untuk review perubahan CMS dan inquiry. `seo-geo-aeo` untuk audit preview berdasarkan ketentuan SEO proyek. |

Jika skill yang diperlukan belum aktif, agen memasangnya sebelum mengerjakan bagian terkait. Gunakan paket lokal tim yang sudah tersedia beserta referensi dan script-nya, atau sumber tim yang terverifikasi. Di Codex, gunakan `skill-installer` untuk sumber GitHub dan muat ulang sesi bila diperlukan. Di Claude Code, pasang paket lengkap di folder skill yang dikenali runtime. Sertakan `antislop.md` dari paket sumber jika versi skill merujuknya. Instalasi lokal `impeccable` hanya berisi panduan dan referensi. Ikuti panduan lokal dan uji di browser.

`frontend-design` disebut di [CLAUDE.md](../../CLAUDE.md), tetapi paket lokalnya belum ditemukan. Pasang dari sumber tim yang terverifikasi bila dipakai. Jika paket atau dependensinya belum bisa diperoleh, catat di checkpoint dan lanjutkan bagian independen. Catat skill yang benar-benar dibaca. Aturan brand dan baseline tetap berlaku untuk semua skill.

## 01 — Fondasi dan paritas homepage

- Siapkan Next.js, CI, Vercel Preview, routing EN/ID dan layout bersama. Gunakan [technical guidelines](../05-engineering/technical-guidelines.md) §2 untuk opsi struktur dan provider. Catat pilihan O-007 yang memengaruhi implementasi sebelum mengunci skema atau provisioning.
- Port `prototype/` berurutan dari token, layout, komponen, motion, sampai hero WebGL. Gunakan data layanan dan Stories serta copy EN/ID yang ada. Ambil screenshot acuan dan pertahankan perilaku menu, map dan accordion, statement, showcase, dan floating chat.
- Verifikasi paritas sebelum refactor. Perbaiki gap fokus reduced motion, markup layanan dan Stories saat JS mati, label aksesibel EN/ID, serta kontras statement. Jika perbaikan mengubah visual atau motion baseline, catat keputusan dan perbarui baseline setelah disetujui.

[Checkpoint 01](implementation/01-foundation/checkpoint.md) · [Handoff 01](implementation/01-foundation/handoff.md)

## 02 — Halaman publik dan navigasi

Gunakan [IA](../02-product/information-architecture.md), [blueprints](../03-content/page-content-blueprints.md), [wireframe](../04-design/wireframe-specs.md), dan [design system](../04-design/design-system.md). Pakai pola homepage untuk layout, tipografi, dan motion halaman baru.

| Rute EN dan padanan ID | Cakupan |
|---|---|
| `/services`, `/services/[slug]` | Overview, enam detail unit dengan masalah, deliverables, proses dan CTA. Tampilkan Seed/Grow/Scale tanpa harga publik. |
| `/approach`, `/about` | Empat tahap kerja beserta input, review dan output. Nilai brand serta cerita dan profil tim yang sudah disetujui. |
| `/insights`, `/insights/[slug]` | Listing crawlable dan detail dinamis dari data terlokalisasi. Body, metadata dan JSON-LD berbagi data publik. |
| `/contact`, `/privacy`, 404 | Form konsultasi dan seluruh state, kebijakan privasi yang disetujui, serta 404 lokal dengan status HTTP 404. |

Sambungkan header, footer, switch locale, breadcrumb, dan CTA ke rute atau aksi yang tepat. Route CTA akhir ke form konsultasi. Pertahankan fallback WhatsApp sesuai baseline sampai nomor bisnis diverifikasi. Tambahkan state kosong, error, loading, dan fallback gambar. Gunakan fixture hanya di preview hingga konten nyata tersedia.

[Checkpoint 02](implementation/02-public-pages/checkpoint.md) · [Handoff 02](implementation/02-public-pages/handoff.md)

## 03 — Command Center dan inquiry

- Finalkan provider, akses per peran, dan ruang lingkup CMS untuk rilis. Implementasikan draft → review → preview privat → publish/unpublish, slug unik per locale, relasi terjemahan, author, media/alt, dan SEO. Gunakan [content models](../05-engineering/content-models.md) sebagai titik awal. Uji slug baru tanpa deploy ulang, lalu pastikan unpublish menghapus artikel dari rute, cache, sitemap, dan tautan terkait.
- Hubungkan form ke tujuan yang disetujui. Validasi di klien dan server, tambahkan anti-spam dan rate limit, terapkan consent sesuai kebijakan, dan tampilkan sukses setelah server mengonfirmasi inquiry diterima. Uji kegagalan dan pengiriman ulang agar retry tidak menggandakan inquiry.
- Tetapkan pemilik akses, pemilik inquiry, dan retensi. Uji bahwa pengguna publik tidak bisa membuka admin, preview privat, draft, atau data inquiry. Batasi fitur operasional di luar CMS pada cakupan yang sudah disetujui.

[Checkpoint 03](implementation/03-cms-inquiry/checkpoint.md) · [Handoff 03](implementation/03-cms-inquiry/handoff.md)

## 04 — QA dan cutover

- Isi konten nyata yang siap terbit, hubungkan domain dan kontak terverifikasi, lalu jalankan [launch QA](qa-acceptance-checklist.md) sesuai keputusan rilis dan cek [SEO, performa, aksesibilitas](../05-engineering/seo-performance-accessibility.md). Pastikan canonical, `hreflang`, sitemap, robots, JSON-LD faktual, dan `llms.txt` sesuai konten publik.
- Uji dari preview dengan peran editor dan pengunjung. Validasi analytics dan consent tanpa data pribadi di event, jalankan lint/typecheck/build dan E2E, lalu rekam audit WCAG 2.2 AA dan hasil performa mobile/desktop. Pantau target CWV p75 setelah data lapangan tersedia.
- Setelah gate rilis terpenuhi, pindahkan konfigurasi Vercel ke build Next.js pada cutover yang diotorisasi. Verifikasi rollback, smoke-test domain produksi dan inquiry, lalu serahkan monitor error, Search Console, dan jadwal pengukuran ke pemiliknya.

[Checkpoint 04](implementation/04-release/checkpoint.md) · [Handoff 04](implementation/04-release/handoff.md)

## Cara menutup fase

Isi checkpoint dengan hasil dan bukti uji. Tandai setiap butir `PASS`, `FAIL`, `BLOCKED`, atau `N/A` dengan alasan. Isi handoff dengan perubahan, cara reproduksi, keputusan, dan pekerjaan berikutnya beserta pemiliknya. Mulai pekerjaan independen jika ada blocker. Tutup fase setelah checkpoint wajib lulus dan handoff terisi. Catat keputusan yang mengubah cakupan atau baseline di decision log.
