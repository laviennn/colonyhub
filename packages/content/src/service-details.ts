import type { Locale } from './locales';
import type { FaqItem } from './pages-content';

export type ServiceDetailContent = {
  slug: string;
  seoTitle: Record<Locale, string>;
  seoDescription: Record<Locale, string>;
  headline: Record<Locale, string>;
  intro: Record<Locale, string>;
  directAnswer: Record<Locale, string>;
  problems: Record<Locale, readonly string[]>;
  deliverables: Record<Locale, readonly string[]>;
  exclusions: Record<Locale, readonly string[]>;
  workflowNote: Record<Locale, string>;
  faq: Record<Locale, readonly FaqItem[]>;
  relatedSlugs: readonly string[];
};

/**
 * Detailed service pages for all six official Colony Units (Brand Identity Guidelines p.4).
 * Copy follows antislop-copywriting & AEO clarity: concrete scope, explicit boundaries, truthful Q&As, zero fabricated claims.
 */
export const SERVICE_DETAILS: readonly ServiceDetailContent[] = [
  {
    slug: 'strategy',
    seoTitle: {
      en: 'Strategy Unit: Brand & Digital Roadmap | colonyhub',
      id: 'Strategy Unit: Brand & Roadmap Digital | colonyhub',
    },
    seoDescription: {
      en: 'Brand strategy, market research, positioning, and 3 to 12 month digital roadmaps in Indonesia so every team works from one shared brief.',
      id: 'Brand strategy, riset pasar, positioning, dan roadmap digital 3 hingga 12 bulan agar seluruh tim bekerja dari satu brief yang sama.',
    },
    headline: {
      en: 'Decide where the business is going before spending on design or ads.',
      id: 'Tentukan arah bisnis sebelum mengeluarkan biaya untuk desain atau iklan.',
    },
    intro: {
      en: 'Strategy Unit turns scattered goals into a written positioning brief and a sequenced 3 to 12 month plan that creative, build, and growth teams can execute.',
      id: 'Strategy Unit merapikan tujuan yang terpencar menjadi dokumen positioning dan rencana 3 hingga 12 bulan yang bisa langsung dijalankan tim kreatif, build, dan growth.',
    },
    directAnswer: {
      en: 'colonyhub Strategy Unit helps businesses in Indonesia clarify brand positioning, buyer research, and quarterly digital priorities before design or development begins. Teams start here when messaging varies across decks, websites, and campaigns, or when budgets need a clear order of execution.',
      id: 'Strategy Unit colonyhub membantu bisnis di Indonesia merumuskan positioning brand, riset calon pembeli, dan prioritas digital per kuartal sebelum desain atau development dimulai. Tim biasanya mulai dari sini saat pesan brand berbeda di tiap kanal atau anggaran butuh urutan eksekusi yang jelas.',
    },
    problems: {
      en: [
        'Your team explains the business differently depending on who writes the deck, website, or ad.',
        'Previous campaigns generated clicks without a clear picture of who the best buyers are.',
        'You have a long list of website and marketing requests with no agreed order of priority.',
      ],
      id: [
        'Tim Anda menjelaskan bisnis secara berbeda tergantung siapa yang menulis deck, website, atau iklan.',
        'Kampanye sebelumnya membawa klik tetapi belum memberi gambaran jelas siapa pembeli utamanya.',
        'Daftar kebutuhan website dan pemasaran menumpuk tanpa urutan prioritas yang disepakati.',
      ],
    },
    deliverables: {
      en: [
        'Written brand strategy covering audience, promise, messaging pillars, and voice rules',
        'Market research summary from stakeholder interviews, competitor review, and search demand',
        'Positioning statement and differentiation map you can test in sales and marketing',
        'Sequenced 3 to 12 month digital roadmap with owners, dependencies, and review checkpoints',
      ],
      id: [
        'Dokumen brand strategy berisi audiens, janji brand, pilar pesan, dan panduan gaya bahasa',
        'Ringkasan riset pasar dari wawancara stakeholder, pemetaan kompetitor, dan data pencarian',
        'Rumusan positioning dan peta diferensiasi yang siap dipakai di materi penjualan dan pemasaran',
        'Roadmap digital 3 hingga 12 bulan lengkap dengan urutan kerja, ketergantungan, dan titik review',
      ],
    },
    exclusions: {
      en: [
        'Visual logo production and UI screens (handled by Creative Unit)',
        'Software implementation and CMS setup (handled by Build Unit)',
        'Revenue forecasts or guaranteed market share targets',
      ],
      id: [
        'Pembuatan logo visual dan desain antarmuka (ditangani Creative Unit)',
        'Implementasi software dan setup CMS (ditangani Build Unit)',
        'Proyeksi pendapatan pasti atau jaminan pangsa pasar',
      ],
    },
    workflowNote: {
      en: 'We start with stakeholder interviews and a review of existing channels, validate findings in a working session, then lock the roadmap before production begins.',
      id: 'Kami mulai dengan wawancara stakeholder dan tinjauan kanal yang ada, memvalidasi temuan dalam sesi kerja bersama, lalu mengunci roadmap sebelum produksi dimulai.',
    },
    faq: {
      en: [
        {
          question: 'When should a business invest in Strategy Unit before building a website?',
          answer:
            'Start with Strategy Unit when founders, sales, and marketing describe your offer differently, or when you are entering a new market segment. Locking positioning and search demand first prevents costly website rewrites later.',
        },
        {
          question: 'Can our internal team execute the roadmap without hiring other Colony Units?',
          answer:
            'Yes. Every strategy document and digital roadmap is delivered as plain, actionable documentation that your internal team or any external partner can run, or you can hand it directly to Creative and Build Units.',
        },
      ],
      id: [
        {
          question: 'Kapan bisnis sebaiknya memulai dari Strategy Unit sebelum membuat website?',
          answer:
            'Mulailah dari Strategy Unit saat founder, tim sales, dan marketing menjelaskan penawaran secara berbeda, atau saat bisnis masuk ke segmen pasar baru. Mengunci positioning dan data pencarian di awal mencegah revisi website berulang.',
        },
        {
          question: 'Apakah tim internal kami bisa menjalankan roadmap tanpa memakai unit colonyhub lain?',
          answer:
            'Bisa. Seluruh dokumen strategi dan roadmap digital diserahkan dalam format siap pakai agar bisa dijalankan tim internal Anda, atau langsung dilanjutkan ke Creative dan Build Unit kami.',
        },
      ],
    },
    relatedSlugs: ['creative', 'web-development', 'growth'],
  },
  {
    slug: 'creative',
    seoTitle: {
      en: 'Creative Unit: Brand Identity & Motion | colonyhub',
      id: 'Creative Unit: Identitas Brand & Motion | colonyhub',
    },
    seoDescription: {
      en: 'Visual identity systems, graphic design, interface motion, and short-form video built to hold up across web, decks, and social channels.',
      id: 'Sistem identitas visual, desain grafis, motion antarmuka, dan video pendek yang konsisten di website, deck, dan kanal sosial.',
    },
    headline: {
      en: 'Make the brand recognizable across every screen and format.',
      id: 'Buat brand Anda mudah dikenali di setiap layar dan format.',
    },
    intro: {
      en: 'Creative Unit builds visual identity systems, campaign graphics, motion assets, and short-form content with clear usage rules so your team does not reinvent the look each week.',
      id: 'Creative Unit membangun sistem identitas visual, grafis kampanye, aset motion, dan konten pendek lengkap dengan aturan pakainya agar tim Anda tidak merancang ulang tampilan tiap minggu.',
    },
    directAnswer: {
      en: 'colonyhub Creative Unit designs cohesive brand identity kits, campaign templates, interface motion, and short-form video with practical usage guidelines. It is built for brands whose website, sales decks, and social feeds currently look disconnected.',
      id: 'Creative Unit colonyhub merancang sistem identitas brand, template kampanye, motion antarmuka, dan video pendek lengkap dengan panduan pemakaian praktis. Unit ini tepat saat website, pitch deck, dan konten sosial Anda belum terlihat seragam.',
    },
    problems: {
      en: [
        'Your website, pitch deck, and social posts look like they come from three different companies.',
        'You have a logo file without color contrast rules, a typography scale, or reusable templates.',
        'Complex products or services are hard to explain in static text alone.',
      ],
      id: [
        'Website, pitch deck, dan konten sosial terlihat seperti berasal dari tiga perusahaan berbeda.',
        'Anda sudah punya file logo tetapi belum punya aturan kontras warna, skala tipografi, atau template siap pakai.',
        'Produk atau layanan yang cukup kompleks sulit dijelaskan hanya lewat teks statis.',
      ],
    },
    deliverables: {
      en: [
        'Brand identity kit: logo lockups, color palette with accessibility pairings, typography, and usage rules',
        'Graphic design templates for social feeds, stories, sales decks, and campaign banners',
        'Motion assets: animated brand marks, product explainers, and interface transition specs',
        'Short-form video and photo content from concept and script to final edit',
      ],
      id: [
        'Kit identitas brand: varian logo, palet warna dengan pasangan kontras, tipografi, dan aturan pakai',
        'Template desain grafis untuk feed sosial, story, deck penjualan, dan banner kampanye',
        'Aset motion: animasi logo, video penjelas produk, dan spesifikasi transisi antarmuka',
        'Produksi video pendek dan foto dari konsep, naskah, hingga editing akhir',
      ],
    },
    exclusions: {
      en: [
        'Production web engineering and hosting setup (handled by Build Unit)',
        'Paid ad media buying and targeting (handled by Growth Unit)',
        'Daily community moderation (handled by Social Unit)',
      ],
      id: [
        'Engineering website produksi dan setup hosting (ditangani Build Unit)',
        'Pembelian media iklan berbayar dan targeting (ditangani Growth Unit)',
        'Moderasi komunitas harian (ditangani Social Unit)',
      ],
    },
    workflowNote: {
      en: 'We align on visual references and brand constraints first, present one focused direction per review stop, and hand over organized source files and rules.',
      id: 'Kami menyepakati referensi visual dan batasan brand di awal, mempresentasikan satu arah yang fokus di tiap titik review, lalu menyerahkan file sumber yang rapi beserta panduannya.',
    },
    faq: {
      en: [
        {
          question: 'Do we receive editable source files and brand guidelines after completion?',
          answer:
            'Yes. Every Creative Unit engagement ends with organized master files (SVG logos, Figma component libraries, template files, and export specs) plus clear color contrast and typography rules.',
        },
        {
          question: 'Can Creative Unit refresh our visual system without replacing our existing logo?',
          answer:
            'Yes. If your logo already has market recognition, we can keep the mark intact and build an updated color system, typography hierarchy, deck templates, and motion guidelines around it.',
        },
      ],
      id: [
        {
          question: 'Apakah kami mendapatkan file sumber yang bisa diedit dan panduan brand?',
          answer:
            'Ya. Setiap proyek Creative Unit ditutup dengan serah terima file master yang rapi (logo SVG, library Figma, file template, dan spesifikasi ekspor) beserta panduan kontras warna dan tipografi.',
        },
        {
          question: 'Bisakah Creative Unit menyegarkan tampilan visual tanpa mengganti logo lama?',
          answer:
            'Bisa. Jika logo lama sudah dikenal pelanggan, kami dapat mempertahankannya sambil membangun sistem warna, skala tipografi, template deck, dan aturan motion yang lebih konsisten.',
        },
      ],
    },
    relatedSlugs: ['strategy', 'web-development', 'social'],
  },
  {
    slug: 'web-development',
    seoTitle: {
      en: 'Build Unit: Websites & Web Applications | colonyhub',
      id: 'Build Unit: Website & Aplikasi Web | colonyhub',
    },
    seoDescription: {
      en: 'Fast, accessible websites, landing pages, e-commerce stores, custom web apps, and workflow automation engineered for clean editing.',
      id: 'Website cepat dan aksesibel, landing page, e-commerce, aplikasi web custom, dan otomasi alur kerja yang mudah dikelola tim Anda.',
    },
    headline: {
      en: 'Websites and digital products that stay fast after launch.',
      id: 'Website dan produk digital yang tetap cepat setelah diluncurkan.',
    },
    intro: {
      en: 'Build Unit pairs editorial front-end craft with typed engineering to ship company sites, landing pages, online stores, web applications, and operational automation.',
      id: 'Build Unit memadukan ketelitian front-end dengan engineering terstruktur untuk membangun website perusahaan, landing page, toko online, aplikasi web, dan otomasi operasional.',
    },
    directAnswer: {
      en: 'colonyhub Build Unit engineers responsive company websites, campaign landing pages, e-commerce storefronts, and custom web apps with clean Core Web Vitals, WCAG 2.2 AA accessibility, and editor-friendly CMS workflows. Every build ships with server-rendered HTML and technical SEO baked in.',
      id: 'Build Unit colonyhub membangun website perusahaan responsif, landing page kampanye, toko online e-commerce, dan aplikasi web custom dengan performa Core Web Vitals, aksesibilitas WCAG 2.2 AA, dan alur CMS yang ramah editor. Setiap proyek sudah dilengkapi HTML server-rendered dan dasar SEO teknis.',
    },
    problems: {
      en: [
        'Your current site is slow on mobile, hard to edit without a developer, or breaks when new pages are added.',
        'Campaign landing pages take weeks to ship because design and engineering sit in separate silos.',
        'Leads from website forms still have to be copied manually between email, spreadsheets, and CRM.',
      ],
      id: [
        'Website saat ini lambat di ponsel, sulit diedit tanpa developer, atau berantakan saat halaman baru ditambahkan.',
        'Landing page kampanye butuh berminggu-minggu karena desain dan engineering berjalan terpisah.',
        'Lead dari formulir website masih harus disalin manual antara email, spreadsheet, dan CRM.',
      ],
    },
    deliverables: {
      en: [
        'Responsive company websites and campaign landing pages with semantic HTML and WCAG 2.2 AA focus',
        'Editorial CMS setup with preview, structured fields, and clean publishing workflow',
        'E-commerce storefronts with catalog structure, checkout flow, and payment integration',
        'Custom web applications and workflow automation connecting forms, CRM, and internal tools',
      ],
      id: [
        'Website perusahaan dan landing page responsif dengan HTML semantik serta perhatian WCAG 2.2 AA',
        'Setup CMS editorial lengkap dengan pratinjau, field terstruktur, dan alur publikasi yang rapi',
        'Toko online e-commerce dengan struktur katalog, alur checkout, dan integrasi pembayaran',
        'Aplikasi web khusus dan otomasi alur kerja yang menghubungkan form, CRM, dan tools internal',
      ],
    },
    exclusions: {
      en: [
        'Ongoing SEO content writing and paid media management (handled by Growth Unit)',
        'Third-party hosting fees, domain renewals, or paid SaaS licenses',
        '24/7 on-call SLA unless defined in a dedicated Scale agreement',
      ],
      id: [
        'Penulisan konten SEO rutin dan pengelolaan iklan berbayar (ditangani Growth Unit)',
        'Biaya hosting pihak ketiga, perpanjangan domain, atau lisensi SaaS berbayar',
        'SLA siaga 24/7 kecuali disepakati secara khusus dalam kontrak Scale',
      ],
    },
    workflowNote: {
      en: 'We lock architecture and content contracts before coding, ship weekly preview builds you can test on real phones, and verify performance, SEO, and accessibility before cutover.',
      id: 'Kami mengunci arsitektur dan kontrak konten sebelum mulai coding, merilis preview mingguan yang bisa Anda uji langsung di ponsel, lalu memverifikasi performa, SEO, dan aksesibilitas sebelum cutover.',
    },
    faq: {
      en: [
        {
          question: 'Will our marketing team be able to publish pages and articles without a developer?',
          answer:
            'Yes. We design structured CMS fields, draft preview links, and role permissions around how your editors actually publish, so routine content and SEO updates happen without code deploys.',
        },
        {
          question: 'How do you verify website speed and SEO readiness before launch?',
          answer:
            'Before production cutover, we check mobile and desktop Core Web Vitals, keyboard navigation, canonical URLs, hreflang tags, XML sitemaps, and structured data against real preview deployments.',
        },
      ],
      id: [
        {
          question: 'Apakah tim marketing kami bisa menerbitkan halaman dan artikel tanpa bantuan developer?',
          answer:
            'Bisa. Kami merancang field CMS terstruktur, tautan pratinjau draft, dan hak akses peran sesuai alur kerja editor Anda agar pembaruan konten dan SEO rutin berjalan tanpa deploy kode.',
        },
        {
          question: 'Bagaimana colonyhub menguji kecepatan dan kesiapan SEO sebelum website tayang?',
          answer:
            'Sebelum cutover produksi, kami memeriksa Core Web Vitals di ponsel dan desktop, navigasi keyboard, URL canonical, tag hreflang, sitemap XML, dan structured data langsung pada build preview.',
        },
      ],
    },
    relatedSlugs: ['creative', 'growth', 'data-analytics'],
  },
  {
    slug: 'growth',
    seoTitle: {
      en: 'Growth Unit: SEO, GEO & Performance Ads | colonyhub',
      id: 'Growth Unit: SEO, GEO & Iklan Performa | colonyhub',
    },
    seoDescription: {
      en: 'Technical SEO, Generative Engine Optimization (GEO), practical content marketing, and tracked performance ads on Google and Meta.',
      id: 'SEO teknis, Generative Engine Optimization (GEO), content marketing berbasis pertanyaan pembeli, dan iklan performa terukur di Google serta Meta.',
    },
    headline: {
      en: 'Build search and paid demand you can actually trace.',
      id: 'Bangun permintaan dari pencarian dan iklan yang bisa dilacak jelas.',
    },
    intro: {
      en: 'Growth Unit aligns technical SEO, Generative Engine Optimization (GEO), editorial content, and paid campaigns so search engines, AI answer tools, and prospective buyers find accurate answers.',
      id: 'Growth Unit menyelaraskan SEO teknis, Generative Engine Optimization (GEO), konten editorial, dan iklan berbayar agar mesin pencari, mesin jawaban AI, dan calon pembeli menemukan jawaban yang akurat.',
    },
    directAnswer: {
      en: 'colonyhub Growth Unit combines technical SEO, Generative Engine Optimization (GEO), buyer-intent content marketing, and Google or Meta performance ads under one measurement framework. Every channel is tied to tracked consultations and lead quality rather than raw impressions.',
      id: 'Growth Unit colonyhub menggabungkan SEO teknis, Generative Engine Optimization (GEO), content marketing berbasis intent pembeli, dan iklan performa Google serta Meta dalam satu kerangka pengukuran. Setiap kanal dihubungkan ke konsultasi dan kualitas lead yang terlacak.',
    },
    problems: {
      en: [
        'Your site has pages online but barely shows up when buyers search for what you sell.',
        'Ad spend runs every month while it remains unclear which campaigns bring qualified inquiries.',
        'Published blog posts repeat generic definitions instead of answering real buying questions.',
      ],
      id: [
        'Website sudah tayang tetapi hampir tidak muncul saat calon pembeli mencari layanan Anda.',
        'Anggaran iklan berjalan tiap bulan namun belum jelas kampanye mana yang menghasilkan inquiry relevan.',
        'Artikel yang terbit hanya mengulang definisi umum dan belum menjawab pertanyaan nyata pembeli.',
      ],
    },
    deliverables: {
      en: [
        'Technical SEO audits and fixes covering crawlability, metadata, canonical URLs, sitemaps, and structured data',
        'GEO content structure so factual pages and guides are clear for both search engines and AI answer engines',
        'Content marketing calendar and source-checked articles mapped to buyer intent',
        'Google and Meta performance ad setup, creative testing, and conversion tracking',
      ],
      id: [
        'Audit dan perbaikan SEO teknis mencakup crawlability, metadata, URL canonical, sitemap, dan structured data',
        'Struktur konten GEO agar halaman faktual dan panduan mudah dibaca mesin pencari maupun mesin jawaban AI',
        'Kalender content marketing dan artikel terverifikasi sumber yang dipetakan ke intent pembeli',
        'Setup iklan performa Google dan Meta, pengujian kreatif, serta pelacakan konversi',
      ],
    },
    exclusions: {
      en: [
        'Guaranteed first-page rankings or promised AI citations (no ethical agency controls third-party algorithms)',
        'Ad media budget paid directly to Google or Meta',
        'Mass auto-generated thin pages or link-scheme tactics',
      ],
      id: [
        'Jaminan peringkat halaman pertama atau janji sitasi AI (tidak ada agency yang mengendalikan algoritma pihak ketiga)',
        'Anggaran belanja iklan yang dibayarkan langsung ke Google atau Meta',
        'Pembuatan halaman massal tipis otomatis atau praktik skema tautan',
      ],
    },
    workflowNote: {
      en: 'We fix technical indexation and tracking baselines first, publish high-signal content on a sustainable cadence, and review search and ad performance every month.',
      id: 'Kami membenahi indeksasi teknis dan dasar tracking terlebih dahulu, menerbitkan konten bernilai tinggi dengan ritme terjaga, lalu meninjau performa pencarian dan iklan setiap bulan.',
    },
    faq: {
      en: [
        {
          question: 'How does GEO differ from traditional technical SEO?',
          answer:
            'Traditional SEO focuses on crawlability, indexation, and search rankings. GEO builds on that same technical base by adding clear entity definitions, direct answers, verifiable sources, and structured data so AI search tools like ChatGPT Search, Perplexity, and Gemini can cite your pages accurately.',
        },
        {
          question: 'Is ad spend included in Growth Unit retainer fees?',
          answer:
            'No. Your Google Ads and Meta Ads media spend is paid directly through your own ad accounts so billing stays 100% transparent and you always own your campaign history and pixel data.',
        },
      ],
      id: [
        {
          question: 'Apa perbedaan GEO dibandingkan SEO teknis tradisional?',
          answer:
            'SEO tradisional fokus pada crawlability, indeksasi, dan peringkat pencarian. GEO berdiri di atas fondasi teknis yang sama dengan menambahkan definisi entitas jelas, jawaban langsung, sumber terverifikasi, dan structured data agar mesin jawaban AI seperti ChatGPT Search, Perplexity, dan Gemini dapat mengutip halaman Anda secara akurat.',
        },
        {
          question: 'Apakah biaya iklan sudah termasuk dalam biaya retainer Growth Unit?',
          answer:
            'Tidak. Anggaran media Google Ads dan Meta Ads dibayarkan langsung melalui akun iklan milik Anda sendiri sehingga tagihan transparan dan riwayat kampanye serta data piksel tetap sepenuhnya milik Anda.',
        },
      ],
    },
    relatedSlugs: ['web-development', 'data-analytics', 'strategy'],
  },
  {
    slug: 'social',
    seoTitle: {
      en: 'Social Unit: Social Media & Community | colonyhub',
      id: 'Social Unit: Social Media & Komunitas | colonyhub',
    },
    seoDescription: {
      en: 'Editorial social media management, interactive story formats, community care, and creator partnerships aligned with your brand.',
      id: 'Manajemen social media, format story interaktif, pengelolaan komunitas, dan kerja sama kreator yang selaras dengan brand Anda.',
    },
    headline: {
      en: 'Turn brand accounts into conversations people respond to.',
      id: 'Ubah akun brand menjadi percakapan yang benar-benar dijawab audiens.',
    },
    intro: {
      en: 'Social Unit plans, produces, and moderates brand channels, interactive story formats, and creator collaborations that reinforce your wider marketing plan.',
      id: 'Social Unit merencanakan, memproduksi, dan mengelola kanal sosial brand, format story interaktif, serta kolaborasi kreator yang selaras dengan rencana pemasaran Anda.',
    },
    directAnswer: {
      en: 'colonyhub Social Unit runs monthly content calendars, interactive story formats (polls, quizzes, sliders, Q&A), community moderation, and KOL coordination for brands in Indonesia. Everything pairs directly with Creative Unit design and Data Unit reporting.',
      id: 'Social Unit colonyhub mengelola kalender konten bulanan, format story interaktif (poll, kuis, slider, tanya-jawab), moderasi komunitas, dan koordinasi KOL untuk brand di Indonesia. Eksekusinya terhubung langsung dengan desain Creative Unit dan pelaporan Data Unit.',
    },
    problems: {
      en: [
        'Posting stops whenever your internal team gets busy with operations.',
        'Content gets passive views without starting replies, saves, or qualified DMs.',
        'Creator partnerships are chosen by follower count alone without clear briefs or measurement.',
      ],
      id: [
        'Jadwal posting berhenti setiap kali tim internal sibuk mengurus operasional.',
        'Konten hanya mendapat tayangan pasif tanpa memicu balasan, simpanan, atau DM yang relevan.',
        'Kolaborasi kreator dipilih hanya berdasarkan jumlah pengikut tanpa brief atau pengukuran yang jelas.',
      ],
    },
    deliverables: {
      en: [
        'Monthly content plan across feeds, short video, and interactive story formats (polls, quizzes, sliders, Q&A)',
        'Copywriting, publishing calendar, and consistent visual production with Creative Unit',
        'Community reply guidelines, comment moderation, and DM escalation routing',
        'KOL and influencer shortlisting, briefing, coordination, and post-campaign summary',
      ],
      id: [
        'Rencana konten bulanan mencakup feed, video pendek, dan format story interaktif (poll, kuis, slider, tanya-jawab)',
        'Copywriting, kalender publikasi, dan produksi visual yang konsisten bersama Creative Unit',
        'Panduan balasan komunitas, moderasi komentar, dan alur eskalasi DM',
        'Seleksi KOL dan influencer, penyusunan brief, koordinasi, dan ringkasan pascakampanye',
      ],
    },
    exclusions: {
      en: [
        'Purchased followers, fake engagement pods, or vanity metric guarantees',
        'Creator talent fees and paid boosting budgets (billed transparently at cost)',
        'Customer support ticketing outside agreed social moderation hours',
      ],
      id: [
        'Pembelian pengikut, rekayasa interaksi, atau jaminan angka viral',
        'Honor kreator dan anggaran boost berbayar (ditagihkan transparan sesuai biaya aktual)',
        'Layanan keluhan pelanggan di luar jam moderasi sosial yang disepakati',
      ],
    },
    workflowNote: {
      en: 'Each month starts with a shared calendar review, moves into weekly production sprints, and closes with a plain report on what earned replies and clicks.',
      id: 'Setiap bulan dimulai dengan review kalender bersama, dilanjutkan sprint produksi mingguan, dan ditutup laporan ringkas tentang konten yang memicu respons dan klik.',
    },
    faq: {
      en: [
        {
          question: 'How do you handle brand voice and approvals before posts go live?',
          answer:
            'We prepare the monthly content plan and weekly asset batches ahead of schedule so your team approves copy, visuals, and story scripts before anything is published.',
        },
        {
          question: 'How are KOL and creator partnerships measured?',
          answer:
            'We evaluate creators by audience fit, content quality, and tracked outcomes such as profile visits, link clicks, replies, or promo codes instead of raw follower counts.',
        },
      ],
      id: [
        {
          question: 'Bagaimana alur persetujuan dan penjagaan gaya bahasa brand sebelum konten tayang?',
          answer:
            'Kami menyiapkan rencana konten bulanan dan batch aset mingguan lebih awal agar tim Anda dapat meninjau copy, visual, dan naskah story sebelum dipublikasikan.',
        },
        {
          question: 'Bagaimana efektivitas kerja sama KOL dan kreator diukur?',
          answer:
            'Kami menilai kreator dari kecocokan audiens, kualitas konten, serta hasil terlacak seperti kunjungan profil, klik tautan, balasan, atau kode promo, bukan sekadar jumlah pengikut.',
        },
      ],
    },
    relatedSlugs: ['creative', 'growth', 'data-analytics'],
  },
  {
    slug: 'data-analytics',
    seoTitle: {
      en: 'Data Unit: Analytics, CRM & Reporting | colonyhub',
      id: 'Data Unit: Analytics, CRM & Laporan | colonyhub',
    },
    seoDescription: {
      en: 'Clean GA4/GTM event tracking, live business dashboards, CRM pipeline setup, and clear monthly reporting so decisions rely on trusted numbers.',
      id: 'Setup tracking GA4/GTM yang rapi, dashboard bisnis live, alur CRM, dan laporan bulanan yang jelas agar keputusan bertumpu pada angka tepercaya.',
    },
    headline: {
      en: 'Know which channels bring real business and what to adjust next.',
      id: 'Tahu kanal mana yang menghasilkan bisnis nyata dan apa yang perlu diperbaiki.',
    },
    intro: {
      en: 'Data Unit sets up reliable tracking, connects your lead pipeline to CRM, builds transparent dashboards, and writes concise monthly reports you can read in five minutes.',
      id: 'Data Unit menata tracking yang andal, menghubungkan alur lead ke CRM, membangun dashboard transparan, dan menyusun laporan bulanan ringkas yang bisa dibaca dalam lima menit.',
    },
    directAnswer: {
      en: 'colonyhub Data Unit audits and implements privacy-aware GA4, Google Tag Manager, Meta Pixel, live KPI dashboards, and CRM pipelines with zero PII leakage. Teams bring us in when ad platforms, analytics, and sales numbers disagree.',
      id: 'Data Unit colonyhub mengaudit dan memasang GA4, Google Tag Manager, Meta Pixel yang patuh privasi, dashboard KPI live, serta pipeline CRM tanpa kebocoran data pribadi. Tim biasanya menghubungi kami saat data iklan, analytics, dan penjualan tidak cocok.',
    },
    problems: {
      en: [
        'Ad platforms, web analytics, and sales spreadsheets show conflicting numbers.',
        'Monthly reports are 40-slide screenshots with no clear answer on what to do next.',
        'Leads arrive from website CTAs, WhatsApp, and email without a shared record of follow-up status.',
      ],
      id: [
        'Platform iklan, analytics website, dan spreadsheet penjualan menampilkan angka yang saling bertentangan.',
        'Laporan bulanan berupa puluhan slide tangkapan layar tanpa rekomendasi langkah berikutnya.',
        'Lead masuk dari CTA website, WhatsApp, dan email tanpa pencatatan status tindak lanjut yang terpusat.',
      ],
    },
    deliverables: {
      en: [
        'Analytics and conversion tracking audit and implementation with privacy-aware event naming',
        'Live dashboard showing agreed KPIs across web, search, ads, and consultation volume',
        'CRM lead-stage setup connecting website CTAs, WhatsApp/email touchpoints, and follow-up workflows',
        'Monthly executive report summarizing what happened, why it shifted, and next-month actions',
      ],
      id: [
        'Audit dan implementasi tracking analytics serta konversi dengan penamaan event yang menghormati privasi',
        'Dashboard live menampilkan KPI yang disepakati dari web, pencarian, iklan, dan volume konsultasi',
        'Setup tahapan lead di CRM yang menghubungkan CTA website, kontak WhatsApp/email, dan alur tindak lanjut',
        'Laporan eksekutif bulanan merangkum apa yang terjadi, penyebab perubahan, dan aksi bulan berikutnya',
      ],
    },
    exclusions: {
      en: [
        'Enterprise data warehouse engineering outside marketing and web operations',
        'Collecting sensitive personal data without legal basis or user consent',
        'Vanity metrics presented without business context',
      ],
      id: [
        'Engineering data warehouse skala korporasi di luar operasi web dan pemasaran',
        'Pengumpulan data pribadi sensitif tanpa dasar hukum atau persetujuan pengguna',
        'Metrik hiasan yang disajikan tanpa konteks bisnis',
      ],
    },
    workflowNote: {
      en: 'We audit current tags and lead sources first, define a short list of metrics tied to your goals, verify event accuracy, and establish a steady monthly reporting rhythm.',
      id: 'Kami mengaudit tag dan sumber lead yang ada terlebih dahulu, menyepakati daftar metrik ringkas sesuai tujuan Anda, memverifikasi akurasi event, lalu menjalankan ritme laporan bulanan.',
    },
    faq: {
      en: [
        {
          question: 'How does Data Unit keep tracking compliant with Indonesia UU PDP?',
          answer:
            'We configure Consent Mode v2 with strict opt-in defaults and strip personal identifiers (names, emails, phone numbers) from analytics events so GA4, GTM, and Meta Pixel record only consented interaction metadata.',
        },
        {
          question: 'Will we have direct access to our dashboards and GA4 properties?',
          answer:
            'Yes. All analytics properties, tag containers, and live dashboards stay under your company ownership with full read/admin visibility.',
        },
      ],
      id: [
        {
          question: 'Bagaimana Data Unit menjaga tracking tetap patuh pada UU PDP Indonesia?',
          answer:
            'Kami menerapkan Consent Mode v2 dengan default opt-in ketat serta memastikan tidak ada data pribadi (nama, email, nomor telepon) yang dikirim ke event analitik GA4, GTM, maupun Meta Pixel.',
        },
        {
          question: 'Apakah kami mendapat akses penuh ke dashboard dan properti GA4 kami sendiri?',
          answer:
            'Ya. Seluruh properti analytics, kontainer GTM, dan dashboard live tetap berada di bawah kepemilikan perusahaan Anda dengan akses penuh.',
        },
      ],
    },
    relatedSlugs: ['growth', 'web-development', 'strategy'],
  },
];

export function getServiceDetailBySlug(slug: string): ServiceDetailContent | undefined {
  return SERVICE_DETAILS.find((s) => s.slug === slug);
}
