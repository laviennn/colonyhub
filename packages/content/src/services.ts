import type { Locale } from './locales';

export type UnitStop = readonly [name: string, description: string];

export type ColonyUnit = {
  slug: string;
  name: 'Strategy' | 'Creative' | 'Build' | 'Growth' | 'Social' | 'Data';
  officialName:
    | 'Strategy Unit'
    | 'Creative Unit'
    | 'Build Unit'
    | 'Growth Unit'
    | 'Social Unit'
    | 'Data Unit';
  color: string;
  path: readonly (readonly [number, number])[];
  sub: Record<Locale, string>;
  stops: Record<Locale, readonly UnitStop[]>;
};

/**
 * Colony Units and their services (official scopes: Brand Identity Guidelines p.4).
 * Ported verbatim from prototype/services-data.js; explanations describe the work, never promise results.
 */
export const COLONY_UNITS: readonly ColonyUnit[] = [
  {
    slug: 'strategy',
    name: 'Strategy',
    officialName: 'Strategy Unit',
    color: '#8A94F2',
    path: [
      [600, 300],
      [470, 170],
      [190, 170],
    ],
    sub: {
      en: 'Find the right direction',
      id: 'Menemukan arah yang tepat',
    },
    stops: {
      en: [
        [
          'Brand strategy',
          'Who you are for, what you promise and how you sound, written down so every team uses it.',
        ],
        [
          'Market research',
          'Interviews, competitor scans and search data that show what your buyers actually need.',
        ],
        ['Positioning', 'The one reason to choose you over the alternatives, stated plainly.'],
        [
          'Digital roadmap',
          'A sequenced plan of what to build, launch and measure over the next 3 to 12 months.',
        ],
      ],
      id: [
        [
          'Brand strategy',
          'Untuk siapa brand Anda, apa janjinya, dan bagaimana ia berbicara, tertulis supaya semua tim memakainya.',
        ],
        [
          'Riset pasar',
          'Wawancara, pemetaan kompetitor, dan data pencarian yang menunjukkan kebutuhan pembeli yang sebenarnya.',
        ],
        [
          'Positioning',
          'Satu alasan kuat memilih Anda dibanding alternatif lain, dirumuskan dengan jelas.',
        ],
        [
          'Roadmap digital',
          'Rencana berurutan tentang apa yang dibangun, diluncurkan, dan diukur dalam 3–12 bulan ke depan.',
        ],
      ],
    },
  },
  {
    slug: 'creative',
    name: 'Creative',
    officialName: 'Creative Unit',
    color: '#FF6B4A',
    path: [
      [600, 300],
      [730, 170],
      [1010, 170],
    ],
    sub: {
      en: 'Make the idea visible',
      id: 'Mewujudkan ide jadi visual',
    },
    stops: {
      en: [
        ['Brand identity', 'Logo, colour, type and the rules for using them across every channel.'],
        [
          'Graphic design',
          'Social posts, decks, print and campaign visuals in one consistent style.',
        ],
        ['Motion', 'Animated logos, explainers and interface motion that show how things work.'],
        ['Content & video', 'Short-form video and photo content, from script to final edit.'],
      ],
      id: [
        ['Identitas brand', 'Logo, warna, tipografi, dan aturan pemakaiannya di semua channel.'],
        [
          'Desain grafis',
          'Konten sosial, deck, materi cetak, dan visual kampanye dalam satu gaya yang konsisten.',
        ],
        [
          'Motion',
          'Logo animasi, video penjelas, dan motion antarmuka yang memperlihatkan cara sesuatu bekerja.',
        ],
        ['Konten & video', 'Konten video pendek dan foto, dari naskah sampai editing akhir.'],
      ],
    },
  },
  {
    slug: 'web-development',
    name: 'Build',
    officialName: 'Build Unit',
    color: '#C6F432',
    path: [
      [600, 300],
      [1040, 300],
    ],
    sub: {
      en: 'Websites and digital products',
      id: 'Website dan produk digital',
    },
    stops: {
      en: [
        [
          'Websites',
          'Company sites built for speed, search visibility and easy editing by your team.',
        ],
        [
          'Landing pages',
          'Single-purpose pages for one campaign or offer, built around one action.',
        ],
        ['E-commerce', 'Online stores with catalogue, checkout and payments set up.'],
        [
          'Web apps',
          'Custom tools such as client portals, booking systems or internal dashboards.',
        ],
        [
          'Automation',
          'Connecting your forms, CRM and tools so repetitive work runs on its own.',
        ],
      ],
      id: [
        [
          'Website',
          'Website perusahaan yang cepat, mudah ditemukan di mesin pencari, dan mudah diedit tim Anda.',
        ],
        [
          'Landing page',
          'Halaman dengan satu tujuan untuk satu kampanye atau penawaran, dibangun di sekitar satu aksi.',
        ],
        ['E-commerce', 'Toko online lengkap dengan katalog, checkout, dan pembayaran.'],
        [
          'Aplikasi web',
          'Tools khusus seperti portal klien, sistem booking, atau dashboard internal.',
        ],
        [
          'Otomasi',
          'Menghubungkan form, CRM, dan tools Anda supaya pekerjaan berulang berjalan sendiri.',
        ],
      ],
    },
  },
  {
    slug: 'growth',
    name: 'Growth',
    officialName: 'Growth Unit',
    color: '#B7BDF8',
    path: [
      [600, 300],
      [730, 430],
      [1010, 430],
    ],
    sub: {
      en: 'Get found by people and AI search',
      id: 'Ditemukan orang dan mesin pencari AI',
    },
    stops: {
      en: [
        ['SEO', 'Technical fixes and content so people find you on Google.'],
        [
          'GEO',
          'Generative Engine Optimization: structuring content so AI answers, like ChatGPT or Gemini, can cite you.',
        ],
        [
          'Content marketing',
          'Articles and guides that answer your buyers’ questions and lead them to you.',
        ],
        ['Performance ads', 'Paid campaigns on Google and Meta, tracked through to leads and sales.'],
      ],
      id: [
        ['SEO', 'Perbaikan teknis dan konten supaya Anda ditemukan di Google.'],
        [
          'GEO',
          'Generative Engine Optimization: menyusun konten agar jawaban AI, seperti ChatGPT atau Gemini, bisa mengutip Anda.',
        ],
        [
          'Content marketing',
          'Artikel dan panduan yang menjawab pertanyaan calon pembeli dan membawa mereka ke Anda.',
        ],
        [
          'Iklan performa',
          'Iklan berbayar di Google dan Meta, dilacak sampai ke lead dan penjualan.',
        ],
      ],
    },
  },
  {
    slug: 'social',
    name: 'Social',
    officialName: 'Social Unit',
    color: '#F6F4EE',
    path: [
      [600, 300],
      [470, 430],
      [190, 430],
    ],
    sub: {
      en: 'Build the conversation',
      id: 'Membangun percakapan',
    },
    stops: {
      en: [
        ['Social media', 'Planning, posting and monthly reporting for your brand accounts.'],
        ['Community', 'Replying, moderating and looking after the people who follow you.'],
        [
          'KOL & influencers',
          'Finding the right creators, briefing them and measuring what they deliver.',
        ],
      ],
      id: [
        ['Social media', 'Perencanaan, posting, dan laporan bulanan untuk akun brand Anda.'],
        ['Komunitas', 'Membalas, memoderasi, dan merawat orang-orang yang mengikuti Anda.'],
        [
          'KOL & influencer',
          'Mencari kreator yang tepat, memberi brief, dan mengukur hasil kerjanya.',
        ],
      ],
    },
  },
  {
    slug: 'data-analytics',
    name: 'Data',
    officialName: 'Data Unit',
    color: '#6C76E0',
    path: [
      [600, 300],
      [160, 300],
    ],
    sub: {
      en: "Know what's working",
      id: 'Tahu mana yang berhasil',
    },
    stops: {
      en: [
        ['Analytics', 'Tracking set up correctly, so the numbers can be trusted.'],
        ['Dashboards', 'One live view of the metrics that matter to your business.'],
        ['CRM', 'A system that follows every lead from first contact to closed deal.'],
        ['Reports', 'A monthly summary: what happened, why, and what we do next.'],
      ],
      id: [
        ['Analytics', 'Pemasangan tracking yang benar, supaya angkanya bisa dipercaya.'],
        ['Dashboard', 'Satu tampilan live untuk metrik yang penting bagi bisnis Anda.'],
        ['CRM', 'Sistem yang mengikuti setiap lead dari kontak pertama sampai deal.'],
        ['Laporan', 'Ringkasan bulanan: apa yang terjadi, kenapa, dan langkah berikutnya.'],
      ],
    },
  },
];
