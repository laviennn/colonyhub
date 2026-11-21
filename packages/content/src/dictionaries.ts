import type { Locale } from './locales';

export type Dictionary = {
  seo: {
    homeTitle: string;
    homeDescription: string;
  };
  skip: string;
  nav: {
    services: string;
    approach: string;
    insights: string;
    about: string;
    menu: string;
    models: string;
  };
  mega: {
    models: string;
  };
  cta: {
    short: string;
    long: string;
    l1: string;
    l2: string;
    lead: string;
  };
  hero: {
    l1: string;
    l2: string;
    lead: string;
    card: {
      t: string;
      s: string;
      cta: string;
    };
  };
  net: {
    label: string;
    title: string;
    lead: string;
    hint: string;
  };
  st: {
    label: string;
    text: string;
    keyWords: readonly string[];
  };
  route: {
    label: string;
    title: string;
    lead: string;
    out: string;
    steps: readonly {
      name: string;
      body: string;
      output: string;
      live?: boolean;
    }[];
  };
  tk: {
    label: string;
    title: string;
    lines: string;
    term: string;
    project: string;
    monthly: string;
    ongoing: string;
    all: string;
    note: string;
  };
  pkg: {
    seed: { kicker: string; body: string; cta: string };
    grow: { kicker: string; body: string; cta: string };
    scale: { kicker: string; body: string; cta: string };
  };
  stories: {
    label: string;
    title: string;
    lead: string;
    follow: string;
    answer: string;
    open: string;
  };
  ins: {
    label: string;
    title: string;
    all: string;
    ph: string;
    items: readonly {
      category: string;
      title: string;
      art: 'a' | 'b' | 'c';
    }[];
  };
  about: {
    label: string;
    title: string;
    lead: string;
    values: readonly {
      name: string;
      body: string;
    }[];
  };
  ft: {
    company: string;
    contact: string;
    legal: string;
    privacy: string;
    proto: string;
  };
  chat: {
    label: string;
    defaultMessage: string;
  };
  a11y: {
    logoHome: string;
    primaryNav: string;
    mobileNav: string;
    language: string;
    colonyUnits: string;
    jakartaTime: string;
    mapDesc: string;
    serviceLines: string;
    storyRail: string;
    storyViewer: string;
    pause: string;
    play: string;
    closeStories: string;
    prevStory: string;
    nextStory: string;
    chatWhatsApp: string;
    chatFallback: string;
  };
  notFound: {
    title: string;
    body: string;
    home: string;
  };
};

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    seo: {
      homeTitle: 'colonyhub | Integrated digital agency in Indonesia',
      homeDescription:
        'colonyhub is a digital agency in Indonesia. Strategy, design, websites, SEO, social and data are planned by one team, under one brief, with one report.',
    },
    skip: 'Skip to content',
    nav: {
      services: 'Services',
      approach: 'Approach',
      insights: 'Insights',
      about: 'About',
      menu: 'Menu',
      models: 'Seed · Grow · Scale',
    },
    mega: {
      models: 'Ways to work with us',
    },
    cta: {
      short: 'Free consultation',
      long: 'Start a free consultation',
      l1: 'tell us where',
      l2: "you're headed.",
      lead: "The first consultation is free. Bring the problem, not a finished brief: we'll map the route together.",
    },
    hero: {
      l1: 'Six disciplines.',
      l2: 'One team, moving as one.',
      lead: 'colonyhub is a digital agency in Indonesia. Strategy, design, websites, SEO, social and data are planned by one team, under one brief, with one report.',
      card: {
        t: 'Free first consultation',
        s: 'Bring the problem, not a finished brief.',
        cta: 'Start a chat',
      },
    },
    net: {
      label: 'Services',
      title: 'Six lines. One interchange.',
      lead: "Every unit runs its own line of specialists. All six meet at one hub, so your brand, website and marketing share a single plan instead of three vendors' plans.",
      hint: 'Hover or tab to a stop to see what it covers',
    },
    st: {
      label: 'Why one hub',
      text: 'Most growth problems live between vendors. One agency runs the ads, another built the site, and nobody owns the report. We put every discipline on one line, with one person you can call.',
      keyWords: ['between', 'vendors.', 'one', 'line,'],
    },
    route: {
      label: 'Approach',
      title: 'The route every project takes.',
      lead: 'Weekly sprints, review stops you agree on in advance, and a report you can read in five minutes.',
      out: 'You get',
      steps: [
        {
          name: 'Discover',
          body: 'We learn your business, audience and what already exists. You share goals, access and limits.',
          output: 'a shared brief',
        },
        {
          name: 'Define',
          body: 'We agree on priorities, scope and how success is measured, before anything is produced.',
          output: 'a plan and roadmap',
        },
        {
          name: 'Create',
          body: 'Strategy, design and build move in weekly sprints, with your review at every agreed stop.',
          output: 'working deliverables',
        },
        {
          name: 'Improve',
          body: 'We measure, report and adjust. Launch is a stop on the line, not the end of it.',
          output: 'monthly reports',
          live: true,
        },
      ],
    },
    tk: {
      label: 'Ways to work with us',
      title: 'Pick the ticket that fits the trip.',
      lines: 'Lines',
      term: 'Term',
      project: 'Project',
      monthly: 'Monthly',
      ongoing: 'Ongoing',
      all: 'All six',
      note: 'Scope and price are set together after the free consultation.',
    },
    pkg: {
      seed: {
        kicker: 'Digital foundations',
        body: 'Brand, website and the basic setup, for a business putting its foundation down.',
        cta: 'Ask about Seed',
      },
      grow: {
        kicker: 'Monthly growth retainer',
        body: 'Content, SEO and ads that keep running, planned and reviewed with you every month.',
        cta: 'Ask about Grow',
      },
      scale: {
        kicker: 'Dedicated integrated team',
        body: 'A team from every unit working next to yours while you move into new channels or markets.',
        cta: 'Ask about Scale',
      },
    },
    stories: {
      label: 'Social content',
      title: 'Stories people answer, not just watch.',
      lead: 'Story formats our Social and Creative units design for brands: polls, quizzes, sliders and question boxes that start a conversation with your audience. The samples here are set in our own brand.',
      follow: 'Plan your social content',
      answer: 'Get stories like this',
      open: 'View sample story',
    },
    ins: {
      label: 'Insights',
      title: 'Notes from the work.',
      all: 'All articles',
      ph: 'Placeholder',
      items: [
        {
          category: 'Strategy',
          title: 'Separating business problems from website feature requests',
          art: 'a',
        },
        {
          category: 'Engineering',
          title: 'Choosing a CMS for your editors, not for the framework trend',
          art: 'b',
        },
        {
          category: 'Growth',
          title: 'Technical SEO vs. writing for AI answer engines',
          art: 'c',
        },
      ],
    },
    about: {
      label: 'About',
      title: 'A colony gets more done than any one member.',
      lead: 'We built colonyhub the same way: specialists who work from one hub. Five habits keep the line running.',
      values: [
        {
          name: 'Together',
          body: 'One cross-functional team on your account, not separate departments.',
        },
        {
          name: 'Precision',
          body: 'Decisions based on data, and QA before anything ships.',
        },
        {
          name: 'Momentum',
          body: 'Weekly sprints and a regular report.',
        },
        {
          name: 'Craft',
          body: 'The same design and code standards on every project.',
        },
        {
          name: 'Openness',
          body: 'Dashboards you can open, and straight answers.',
        },
      ],
    },
    ft: {
      company: 'Company',
      contact: 'Contact',
      legal: 'Legal',
      privacy: 'Privacy policy',
      proto: 'Jakarta, Indonesia · WIB (UTC+7)',
    },
    chat: {
      label: 'Chat on WhatsApp',
      defaultMessage: "Hi colonyhub, I'd like a free consultation. My business is: ",
    },
    a11y: {
      logoHome: 'colonyhub, home',
      primaryNav: 'Primary',
      mobileNav: 'Mobile',
      language: 'Language',
      colonyUnits: 'Colony Units',
      jakartaTime: 'Jakarta local time',
      mapDesc:
        'A transit-style map: six service lines, Strategy, Creative, Build, Growth, Social and Data, each with its services as stops, all meeting at the colonyhub interchange.',
      serviceLines: 'Service lines',
      storyRail: 'Story format samples',
      storyViewer: 'Story viewer',
      pause: 'Pause',
      play: 'Play',
      closeStories: 'Close stories',
      prevStory: 'Previous story',
      nextStory: 'Next story',
      chatWhatsApp: 'Chat with colonyhub on WhatsApp (opens WhatsApp)',
      chatFallback: 'Chat with colonyhub: go to free consultation',
    },
    notFound: {
      title: '404: Page not found',
      body: 'The page you asked for is not here. Head back to the homepage or browse our services.',
      home: 'Back to home',
    },
  },
  id: {
    seo: {
      homeTitle: 'colonyhub | Digital agency terintegrasi di Indonesia',
      homeDescription:
        'colonyhub adalah digital agency di Indonesia. Strategi, desain, website, SEO, social, dan data direncanakan oleh satu tim, dari satu brief, dengan satu laporan.',
    },
    skip: 'Langsung ke konten',
    nav: {
      services: 'Layanan',
      approach: 'Cara kerja',
      insights: 'Insight',
      about: 'Tentang',
      menu: 'Menu',
      models: 'Seed · Grow · Scale',
    },
    mega: {
      models: 'Model kerja sama',
    },
    cta: {
      short: 'Konsultasi gratis',
      long: 'Mulai konsultasi gratis',
      l1: 'ceritakan ke mana',
      l2: 'bisnis Anda menuju.',
      lead: 'Konsultasi pertama gratis. Bawa masalahnya, bukan brief yang sudah jadi: rutenya kita petakan bersama.',
    },
    hero: {
      l1: 'Enam disiplin.',
      l2: 'Satu tim, gerak serempak.',
      lead: 'colonyhub adalah digital agency di Indonesia. Strategi, desain, website, SEO, social, dan data direncanakan oleh satu tim, dari satu brief, dengan satu laporan.',
      card: {
        t: 'Konsultasi pertama gratis',
        s: 'Bawa masalahnya, bukan brief yang sudah jadi.',
        cta: 'Mulai obrolan',
      },
    },
    net: {
      label: 'Layanan',
      title: 'Enam jalur. Satu titik temu.',
      lead: 'Setiap unit punya jalur spesialisnya sendiri. Keenamnya bertemu di satu hub, jadi brand, website, dan pemasaran Anda mengikuti satu rencana, bukan rencana tiga vendor berbeda.',
      hint: 'Arahkan kursor atau tab ke stasiun untuk melihat isinya',
    },
    st: {
      label: 'Kenapa satu hub',
      text: 'Banyak masalah pertumbuhan muncul di antara vendor. Satu agency pegang iklan, yang lain bikin website, dan tidak ada yang bertanggung jawab atas laporannya. Kami taruh semua disiplin di satu jalur, dengan satu orang yang bisa Anda hubungi.',
      keyWords: ['di', 'antara', 'vendor.', 'satu', 'jalur,'],
    },
    route: {
      label: 'Cara kerja',
      title: 'Rute yang dilalui setiap proyek.',
      lead: 'Sprint mingguan, titik review yang disepakati di awal, dan laporan yang bisa dibaca dalam lima menit.',
      out: 'Anda dapat',
      steps: [
        {
          name: 'Discover',
          body: 'Kami mempelajari bisnis, audiens, dan aset yang sudah ada. Anda berbagi tujuan, akses, dan batasan.',
          output: 'brief bersama',
        },
        {
          name: 'Define',
          body: 'Kami sepakati prioritas, cakupan, dan cara mengukur keberhasilan sebelum produksi dimulai.',
          output: 'rencana dan roadmap',
        },
        {
          name: 'Create',
          body: 'Strategi, desain, dan development berjalan dalam sprint mingguan, dengan review Anda di setiap titik yang disepakati.',
          output: 'deliverable yang berjalan',
        },
        {
          name: 'Improve',
          body: 'Kami mengukur, melapor, dan menyesuaikan. Peluncuran hanyalah satu stasiun, bukan akhir jalur.',
          output: 'laporan bulanan',
          live: true,
        },
      ],
    },
    tk: {
      label: 'Model kerja sama',
      title: 'Pilih tiket yang sesuai perjalanan Anda.',
      lines: 'Jalur',
      term: 'Durasi',
      project: 'Per proyek',
      monthly: 'Bulanan',
      ongoing: 'Berkelanjutan',
      all: 'Keenamnya',
      note: 'Cakupan dan harga disusun bersama setelah konsultasi gratis.',
    },
    pkg: {
      seed: {
        kicker: 'Fondasi digital',
        body: 'Brand, website, dan setup dasar, untuk bisnis yang sedang meletakkan fondasinya.',
        cta: 'Tanya soal Seed',
      },
      grow: {
        kicker: 'Retainer bulanan',
        body: 'Konten, SEO, dan iklan yang terus berjalan, direncanakan dan dievaluasi bersama Anda tiap bulan.',
        cta: 'Tanya soal Grow',
      },
      scale: {
        kicker: 'Tim terintegrasi khusus',
        body: 'Tim dari setiap unit yang bekerja di samping tim Anda saat masuk ke channel atau pasar baru.',
        cta: 'Tanya soal Scale',
      },
    },
    stories: {
      label: 'Konten sosial',
      title: 'Story yang dijawab, bukan cuma ditonton.',
      lead: 'Format story yang dirancang Social dan Creative Unit kami untuk brand: poll, kuis, slider, dan question box yang membuka percakapan dengan audiens Anda. Contoh di sini memakai brand kami sendiri.',
      follow: 'Rencanakan konten sosial Anda',
      answer: 'Buat story seperti ini',
      open: 'Lihat contoh story',
    },
    ins: {
      label: 'Insight',
      title: 'Catatan dari pekerjaan.',
      all: 'Semua artikel',
      ph: 'Placeholder',
      items: [
        {
          category: 'Strategy',
          title: 'Memisahkan masalah bisnis dari daftar fitur website',
          art: 'a',
        },
        {
          category: 'Engineering',
          title: 'Memilih CMS untuk editor Anda, bukan karena tren framework',
          art: 'b',
        },
        {
          category: 'Growth',
          title: 'SEO teknis vs. menulis untuk mesin jawaban AI',
          art: 'c',
        },
      ],
    },
    about: {
      label: 'Tentang',
      title: 'Koloni menyelesaikan lebih banyak daripada satu anggotanya.',
      lead: 'colonyhub dibangun dengan cara yang sama: para spesialis bekerja dari satu hub. Lima kebiasaan menjaga jalurnya tetap jalan.',
      values: [
        {
          name: 'Together',
          body: 'Satu tim lintas disiplin untuk akun Anda, bukan departemen terpisah.',
        },
        {
          name: 'Precision',
          body: 'Keputusan berbasis data, dan QA sebelum apa pun dirilis.',
        },
        {
          name: 'Momentum',
          body: 'Sprint mingguan dan laporan rutin.',
        },
        {
          name: 'Craft',
          body: 'Standar desain dan kode yang sama di setiap proyek.',
        },
        {
          name: 'Openness',
          body: 'Dashboard yang bisa Anda buka, dan jawaban apa adanya.',
        },
      ],
    },
    ft: {
      company: 'Perusahaan',
      contact: 'Kontak',
      legal: 'Legal',
      privacy: 'Kebijakan privasi',
      proto: 'Jakarta, Indonesia · WIB (UTC+7)',
    },
    chat: {
      label: 'Chat via WhatsApp',
      defaultMessage: 'Halo colonyhub, saya ingin konsultasi gratis. Bisnis saya: ',
    },
    a11y: {
      logoHome: 'colonyhub, beranda',
      primaryNav: 'Navigasi utama',
      mobileNav: 'Navigasi seluler',
      language: 'Bahasa',
      colonyUnits: 'Colony Unit',
      jakartaTime: 'Waktu lokal Jakarta',
      mapDesc:
        'Peta gaya transit: enam jalur layanan, Strategy, Creative, Build, Growth, Social, dan Data, masing-masing dengan layanannya sebagai stasiun, semuanya bertemu di titik temu colonyhub.',
      serviceLines: 'Jalur layanan',
      storyRail: 'Contoh format story',
      storyViewer: 'Penampil story',
      pause: 'Jeda',
      play: 'Putar',
      closeStories: 'Tutup story',
      prevStory: 'Story sebelumnya',
      nextStory: 'Story berikutnya',
      chatWhatsApp: 'Chat dengan colonyhub di WhatsApp (membuka WhatsApp)',
      chatFallback: 'Chat dengan colonyhub: ke bagian konsultasi gratis',
    },
    notFound: {
      title: '404: Halaman tidak ditemukan',
      body: 'Halaman yang Anda cari tidak tersedia. Anda bisa kembali ke beranda atau melihat daftar layanan kami.',
      home: 'Kembali ke beranda',
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
