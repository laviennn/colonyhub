# SEO, GEO, dan AEO untuk colonyhub.id

Acuan implementasi situs publik Next.js App Router dan Colony Command Center. Berlaku sejak fondasi, termasuk untuk artikel yang baru terbit setelah deploy. Lihat [PRD FR-07, FR-08, dan FR-11](../02-product/PRD.md), [IA](../02-product/information-architecture.md), [strategi Insights](../03-content/insights-editorial-strategy.md), dan [standar performa serta aksesibilitas](seo-performance-accessibility.md).

## 1. Domain, URL, dan bahasa

- Origin produksi adalah `https://colonyhub.id`. Simpan di satu konfigurasi produksi untuk `metadataBase`, URL canonical, sitemap, JSON-LD, dan Open Graph. Jangan membangun canonical dari header request atau host preview.
- EN default di `/`, ID di bawah `/id/`. Detail artikel memakai `/insights/[slug]` dan `/id/insights/[slug]`. Tetapkan satu aturan trailing slash di routing dan gunakan URL akhir yang sama di tautan, metadata, sitemap, serta redirect. Pertahankan slug pendek, stabil, dan sesuai bahasa.
- Tiap halaman indexable memakai self-canonical absolut. Padanan EN dan ID punya canonical masing-masing dan `<html lang="en">` atau `<html lang="id">`. Jika kedua versi sudah terbit dan benar-benar setara, sertakan `hreflang="en"` dan `hreflang="id"` yang timbal balik dan mencakup URL sendiri. Gunakan `x-default` bila ada tujuan fallback yang setara. Untuk artikel satu bahasa, jangan buat alternate ke listing atau artikel lain.
- Biarkan pengguna dan crawler membuka URL locale secara langsung. Switch bahasa menautkan padanan yang terbit. Bila padanan belum ada, beri pilihan kembali ke listing bahasa tujuan dengan label yang jelas. Hindari redirect otomatis berdasarkan IP atau bahasa browser.
- Pada cutover, redirect HTTP dan alias seperti `www` jika dikonfigurasi dalam satu hop ke HTTPS domain utama. Saat memensiunkan `colonyhub.vercel.app`, arahkan URL lama ke padanan nyata setelah domain utama berfungsi. Untuk URL atau slug lama tanpa padanan gunakan 404, atau 410 jika penghapusan permanen sengaja dinyatakan. Jangan arahkan semua URL yang hilang ke homepage. [Canonical](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) · [Hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions) · [Migrasi URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)

## 2. Metadata dan tautan tiap halaman

| Jenis | Metadata dan hubungan konten |
|---|---|
| Homepage | Judul bermerek, deskripsi layanan yang spesifik, canonical, OG image resmi, dan tautan HTML ke Services, Insights, About, dan konsultasi. |
| Services dan detail unit | Judul, deskripsi dan H1 sesuai unit dan intent. Jelaskan masalah, deliverables, proses, batas scope, dan layanan atau artikel terkait. |
| Insights index | Judul/deskripsi yang menjelaskan topik publikasi. Tampilkan artikel unggulan, terbaru, kategori, dan paginasi menggunakan tautan HTML. |
| Artikel | Hasilkan metadata dari satu record publik terlokalisasi yang juga dipakai untuk HTML, JSON-LD, dan URL sitemap. |
| Approach, About, Contact, Privacy | Metadata spesifik per halaman. Tampilkan informasi bisnis, tim, dan kontak yang telah diverifikasi. |

- Gunakan `generateMetadata` untuk data CMS dan metadata statis untuk halaman tetap. Sediakan judul, deskripsi, canonical, alternate yang valid, Open Graph dan kartu X. Untuk artikel tambahkan tipe OG `article`, tanggal terbit/perubahan jika tersedia, beserta gambar absolut dan alt. Judul SEO jatuh ke judul artikel dan deskripsi ke dek bila field SEO kosong. Jaga judul, H1, dan isi selaras. Tampilkan deskripsi yang unik dan faktual, tanpa target karakter yang kaku.
- Sajikan konten utama dan internal link dalam HTML dari server. Gunakan anchor dengan teks deskriptif. Parameter UTM tidak menghasilkan canonical baru. Paginasi seperti `?page=2` memiliki canonical sendiri dan URL yang bisa dikunjungi langsung. Normalisasi `?page=1` ke listing utama. Masukkan kategori ke indeks hanya jika punya URL stabil, isi yang cukup, dan tujuan pencarian yang jelas. Hindari indeksasi kombinasi filter, sort, atau pencarian internal.
- Pastikan title, canonical, alternate, dan OG terbaca oleh crawler dan pemeriksa social share. Uji respons HTML sesuai perilaku metadata streaming di versi Next.js yang dikunci. [Next.js Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) · [Paginasi dan crawl](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading)

## 3. Artikel dinamis dari Command Center

### Kontrak data publik

Siapkan dynamic segment `[slug]` untuk kedua locale di fase halaman publik. Pakai renderer dan fungsi query server yang sama untuk kedua bahasa. Fixture untuk preview boleh dipakai sebelum CMS terhubung. Kontrak data mengikuti [content models](content-models.md).

| Data | Aturan |
|---|---|
| `id`, `locale`, `slug`, `translationGroupId` | ID stabil, slug unik per locale untuk artikel, dan ID kelompok untuk memasangkan terjemahan. Slug antarlocale boleh berbeda. Simpan riwayat slug publik. |
| `title`, `dek`, `content`, kategori, referensi | Wajib untuk isi utama dan kategori. Render rich text tervalidasi dengan dukungan heading, tabel, quote, kode, gambar, dan referensi. Gunakan referensi saat membuat klaim yang bisa diverifikasi. |
| `authorId`, `reviewerId`, `publishedAt`, `updatedAt` | Byline nyata. Tanggal terbit stabil dan bertimezone. Tampilkan perubahan substansial sebagai tanggal revisi. Tracking edit internal boleh terpisah dari tanggal yang ditampilkan. |
| `heroImage`, `seo.title`, `seo.description`, `seo.ogImage` | Media punya izin, URL publik stabil, dimensi, dan alt yang sesuai. Gunakan gambar artikel sebagai OG fallback dan gambar brand yang sah bila artikel tidak punya gambar. Gambar brand generik tidak otomatis menjadi gambar pada schema artikel. |
| Status dan visibilitas | `draft → review → published → archived`. Query publik memfilter status, tanggal terbit yang sudah berlaku, dan locale. Anggap setiap terjemahan memiliki status sendiri. Canonical diturunkan dari rute. Override dan noindex editorial dibatasi pada kasus yang jelas dan ditinjau. |

### Siklus rendering dan publikasi

1. **Baca artikel di server.** Gunakan lookup publik berdasarkan `(locale, slug)` dan baca record yang sama di page dan `generateMetadata`. Body menampilkan breadcrumb, H1, dek, penulis, tanggal, estimasi baca, isi, sumber dan artikel terkait. Pastikan semua bagian utama muncul tanpa JavaScript.
2. **Sajikan artikel terbit.** Gunakan Server Components dan cache/ISR yang didukung versi Next.js pilihan. `generateStaticParams` opsional untuk pre-render slug yang sudah terbit. Lookup tetap harus menerima slug baru setelah build. Uji deploy dengan katalog kosong, publish artikel pertama, lalu akses URL-nya tanpa deploy ulang.
3. **Pisahkan preview.** Draft Mode atau jalur preview harus dilindungi sesi editor atau token terbatas waktu dan ruang lingkup. Verifikasi hak baca sebelum mengambil draft. Pakai cache privat atau `no-store`, `noindex`, dan hindari sitemap, listing publik, atau feed untuk draft.
4. **Perbarui setelah transaksi CMS sukses.** Invalidasi detail, index dan kategori terkait, homepage Insights, metadata dan gambar sosial yang berubah, alternate kedua locale, serta sitemap. Pakai mekanisme revalidasi sesuai versi Next.js yang dikunci. Uji retry jika invalidasi gagal. Untuk unpublish, pastikan payload lama tidak tetap tersedia karena cache stale-while-revalidate. Invalidation harus mencakup semua permukaan publik terkait.
5. **Tangani URL lama dan kegagalan.** Setelah slug berubah, URL lama redirect permanen ke padanan baru. Untuk slug asing, draft, atau artikel ditarik tanpa padanan, kembalikan 404. Pastikan keberadaan artikel ditentukan sebelum respons streaming mengirim header jika status 404 diperlukan. Gangguan CMS adalah error server dan perlu dipantau. Jangan perlakukan gangguan itu sebagai artikel hilang. [Generate Static Params](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) · [Draft Mode](https://nextjs.org/docs/app/guides/draft-mode) · [Revalidasi](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) · [Not Found dan streaming](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

## 4. Structured data JSON-LD

| Penempatan | Tipe dan field |
|---|---|
| Homepage | `Organization`, dengan `@id: https://colonyhub.id/#organization`, `name: colonyhub`, dan `url`. Tambahkan `logo` setelah aset master tersedia dan `sameAs` hanya untuk profil resmi yang terverifikasi. |
| Detail layanan | `Service` dengan `@id` berbasis canonical, `url`, nama unit, `serviceType`, deskripsi, dan `provider` yang merujuk ID Organization. Tambahkan `areaServed` bila memang didukung cakupan bisnis. |
| Detail Insights | `BlogPosting` sebagai tipe artikel editorial. Gunakan `@id` berbasis canonical, `mainEntityOfPage`, `headline`, `description`, `inLanguage`, gambar representatif, `datePublished`, `dateModified` jika relevan, `author` yang cocok dengan byline, dan `publisher` yang merujuk Organization. Sertakan URL author jika profil asli tersedia. |
| Halaman bertingkat | `BreadcrumbList` dari breadcrumb yang terlihat. Setiap `ListItem` memiliki posisi, label lokal, dan URL canonical yang sesuai. |

Render JSON-LD di server dari data yang sama dengan halaman. Serialisasikan dengan aman saat menyisipkan field CMS, termasuk escape karakter `<` pada JSON di dalam tag script. Semua fakta harus cocok dengan isi yang terlihat. Hindari review, harga, rating, alamat, FAQ, atau data klien rekaan. Validasi markup schema.org dengan [Schema Markup Validator](https://validator.schema.org/) dan cek tipe yang didukung Google di [Rich Results Test](https://search.google.com/test/rich-results). Validitas `Service` menyatakan makna layanan dan tidak menjamin fitur rich result. [Article](https://developers.google.com/search/docs/appearance/structured-data/article) · [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization) · [Service](https://schema.org/Service) · [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) · [JSON-LD di Next.js](https://nextjs.org/docs/app/guides/json-ld)

## 5. Sitemap, robots, dan kontrol indeks

- Implementasikan `app/sitemap.ts` menjadi `/sitemap.xml`. Gabungkan registri rute tetap dan query publik CMS. Masukkan URL canonical yang merespons 200 dan diizinkan diindeks, untuk masing-masing locale yang terbit. Keluarkan URL redirect, Work yang ditunda, draft, noindex, preview, filter internal, dan halaman error. Hasilkan `lastModified` dari perubahan nyata. Gunakan aturan alternate yang sama bila `hreflang` juga ditulis di XML. [Sitemap Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) · [Sitemap Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- Implementasikan `app/robots.ts` menjadi `/robots.txt`. Di produksi izinkan crawl halaman publik beserta aset yang dibutuhkan untuk render. Tambahkan baris `Sitemap: https://colonyhub.id/sitemap.xml`. Tambahkan aturan untuk endpoint nonpublik yang benar-benar ada. Jika memakai grup user-agent khusus, pastikan proteksi path yang sama tercakup dalam aturan yang diterima bot tersebut. Uji masing-masing host karena robots berlaku per host. [Robots Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- Gunakan autentikasi atau deployment protection untuk Command Center dan preview Vercel. Tambahkan meta robots atau `X-Robots-Tag: noindex` sesuai jenis respons nonproduksi yang dapat diakses. `Disallow` mencegah crawl. Bot perlu bisa membaca respons untuk memproses `noindex` pada URL publik. Bungkus perlindungan akses di server sehingga draft tidak terbuka jika pengaturan crawl berubah. [Noindex Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing)

Contoh keluaran minimum `robots.txt` untuk host publik setelah cutover.

```text
User-agent: *
Allow: /
Sitemap: https://colonyhub.id/sitemap.xml
```

## 6. Editorial, GEO, dan AEO

- Mulai dari satu pertanyaan pembaca. Beri jawaban langsung di bagian awal bila topik cocok, lalu uraikan konteks, cara kerja, trade-off, dan sumber. Tampilkan pengalaman praktis, screenshot yang berizin, data dengan metodologi, dan kutipan yang bisa diperiksa. Pakai heading deskriptif, langkah atau tabel bila membantu, dan cantumkan penulis serta tanggal yang nyata. Review EN dan ID secara terpisah.
- Bangun artikel terkait layanan yang memang ditawarkan colonyhub. Tautkan ke unit yang relevan dan gunakan CTA konsultasi pada konteks yang tepat. Hindari halaman massal dengan isi tipis, FAQ generik, serta janji ranking atau sitasi.
- Untuk Google AI Overviews dan AI Mode, prioritaskan halaman yang dapat diindeks, layak tampil sebagai snippet, dan punya konten yang jelas. Untuk ChatGPT Search, cek akses `OAI-SearchBot` ke halaman publik dan periksa apakah CDN memblokir request yang sah. Pengaturan GPTBot untuk pelatihan adalah kebijakan tersendiri yang perlu keputusan pemilik. [Google AI features](https://developers.google.com/search/docs/appearance/ai-features) · [OpenAI crawlers](https://developers.openai.com/api/docs/bots)
- Siapkan `/llms.txt` sesuai brand guide sebagai daftar ringkas tautan canonical ke layanan dan Insights terkurasi. Sumber daftar dari konten publik atau jadwalkan review agar tidak basi. `llms.txt` adalah format usulan untuk membantu pembacaan mesin dan tidak menjadi syarat indeks atau jaminan sitasi. [Proposal llms.txt](https://llmstxt.org/) · [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)

## 7. Skill yang relevan

| Skill | Gunakan untuk | Status dan batas penggunaan |
|---|---|---|
| `seo-geo-aeo` | Audit URL preview atau produksi, lalu cek HTML, metadata, crawlability, konten dan keterbacaan jawaban. | Paket lokal ditemukan di `~/.claude/skills`. Gunakan temuan yang dapat diuji dan cocokkan saran crawler serta schema dengan dokumentasi resmi. |
| `seo-audit` | Audit teknis yang fokus pada canonical, redirect, hreflang, indeksasi, CWV, dan isu per template. | Kandidat opsional jika audit lokal perlu pendalaman. [Sumber skill](https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/seo-audit/SKILL.md) |
| `schema` | Memilih tipe JSON-LD, audit field, dan validasi markup per template. | Kandidat opsional untuk review implementasi. Nama folder upstream saat ditinjau adalah `skills/schema`. [Sumber skill](https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/schema/SKILL.md) |
| `ai-seo` | Menyusun uji visibilitas, membedakan mention, sitasi dan trafik rujukan, serta mengaudit konten yang layak dirujuk. | Kandidat opsional setelah situs publik bisa diuji. Pakai sampel kueri EN/ID yang bisa diulang. [Sumber skill](https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/ai-seo/SKILL.md) |

Gunakan skill lokal yang sudah tersedia sebagai audit pertama. Jika agen membutuhkan kandidat eksternal, pasang skill yang dipilih dari sumber upstream yang terverifikasi, pin ref yang sudah ditinjau, dan baca dependensinya. Gunakan `skill-installer` pada Codex sesuai [setup skill di implementation plan](../06-delivery/implementation-plan.md#setup-skill-untuk-agen). Terapkan rekomendasi eksternal setelah dicocokkan dengan keputusan proyek dan sumber primer.

## 8. Checkpoint sebelum dan sesudah rilis

- [ ] Cek domain, HTTPS, alias, canonical dan status langsung dengan HTTP. Crawl homepage, setiap template, kedua locale, serta 404. Sitemap hanya berisi URL yang semestinya tampil di pencarian.
- [ ] Uji artikel berpasangan EN/ID, artikel satu bahasa, paginasi, slug baru setelah deploy, perubahan slug, update SEO, publish dan unpublish. Cek respons normal tanpa login setelah setiap perubahan.
- [ ] Cek draft, auth, preview noindex, dan aturan robots per host. Verifikasi bahwa preview tidak pernah masuk sitemap atau alternate publik. Validasi JSON-LD dan OG, termasuk fallback media.
- [ ] Uji keyboard, alt, heading, dan link. Jalankan Lighthouse pada template utama dan pasang pemantauan CWV p75 setelah trafik tersedia. Target LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 pada mobile dan desktop. [Web Vitals](https://web.dev/articles/vitals)
- [ ] Verifikasi properti domain di Search Console, kirim sitemap, dan inspeksi URL EN/ID serta satu artikel baru. Pantau indeksasi, canonical yang dipilih mesin pencari, impresi, klik, dan lead yang relevan. Untuk GEO/AEO, simpan tanggal, kueri, bahasa, mesin, sumber yang disebut dan URL yang dikutip. Ukur referral bila datanya tersedia.
