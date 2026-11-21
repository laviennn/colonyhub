import type { Locale } from './locales';

export type FaqItem = {
  question: string;
  answer: string;
};

export type PublicPagesContent = {
  breadcrumbs: {
    home: string;
    services: string;
    approach: string;
    about: string;
    insights: string;
    contact: string;
    privacy: string;
  };
  servicesPage: {
    seoTitle: string;
    seoDescription: string;
    label: string;
    title: string;
    lead: string;
    exploreUnit: string;
    modelsLabel: string;
    modelsTitle: string;
    modelsLead: string;
    compareTitle: string;
    compareHeaders: readonly [string, string, string, string];
    compareRows: readonly {
      model: string;
      units: string;
      cadence: string;
      bestFor: string;
    }[];
    faqLabel: string;
    faqTitle: string;
    faq: readonly FaqItem[];
    ctaTitle: string;
    ctaLead: string;
    ctaButton: string;
  };
  serviceDetail: {
    capabilitiesHeading: string;
    scopeHeading: string;
    problemsTitle: string;
    deliverablesTitle: string;
    exclusionsTitle: string;
    workflowTitle: string;
    relatedHeading: string;
    relatedTitle: string;
    faqLabel: string;
    faqHeading: string;
    ctaButtonPrefix: string;
    allServices: string;
    stopsLabel: string;
  };
  approachPage: {
    seoTitle: string;
    seoDescription: string;
    label: string;
    title: string;
    lead: string;
    principleLabel: string;
    principleTitle: string;
    principleBody: string;
    stagesLabel: string;
    stagesTitle: string;
    inputLabel: string;
    checkpointLabel: string;
    outputLabel: string;
    stages: readonly {
      step: string;
      name: string;
      summary: string;
      clientInput: string;
      checkpoint: string;
      output: string;
      live?: boolean;
    }[];
    note: string;
    faqLabel: string;
    faqTitle: string;
    faq: readonly FaqItem[];
    ctaTitle: string;
    ctaLead: string;
    ctaButton: string;
  };
  aboutPage: {
    seoTitle: string;
    seoDescription: string;
    label: string;
    title: string;
    lead: string;
    purposeLabel: string;
    purposeTitle: string;
    purposeBody: string;
    visionTitle: string;
    visionBody: string;
    missionTitle: string;
    missionItems: readonly string[];
    whoLabel: string;
    whoTitle: string;
    audiences: readonly {
      title: string;
      body: string;
    }[];
    valuesLabel: string;
    valuesTitle: string;
    teamLabel: string;
    teamTitle: string;
    teamBody: string;
    ctaTitle: string;
    ctaLead: string;
    ctaButton: string;
  };
  insightsPage: {
    seoTitle: string;
    seoDescription: string;
    label: string;
    title: string;
    lead: string;
    allCategories: string;
    featuredBadge: string;
    previewBadge: string;
    readArticle: string;
    minRead: string;
    emptyTitle: string;
    emptyBody: string;
    emptyReset: string;
    prevPage: string;
    nextPage: string;
    pageOf: string;
  };
  articlePage: {
    previewNotice: string;
    publishedLabel: string;
    updatedLabel: string;
    authorLabel: string;
    referencesTitle: string;
    relatedArticlesTitle: string;
    relatedServicesTitle: string;
    singleLangNotice: string;
    singleLangAction: string;
    ctaTitle: string;
    ctaLead: string;
    ctaButton: string;
    backToInsights: string;
  };
  contactPage: {
    seoTitle: string;
    seoDescription: string;
    label: string;
    title: string;
    lead: string;
    locationLabel: string;
  };
  privacyPage: {
    seoTitle: string;
    seoDescription: string;
    label: string;
    title: string;
    lead: string;
    draftNotice: string;
    cookieTableTitle: string;
    cookieTableHeaders: readonly [string, string, string, string];
    cookieRows: readonly {
      category: string;
      providers: string;
      purpose: string;
      basis: string;
    }[];
    manageConsentButton: string;
    sections: readonly {
      heading: string;
      body: string;
    }[];
  };
};

export const PUBLIC_PAGES: Record<Locale, PublicPagesContent> = {
  en: {
    breadcrumbs: {
      home: 'Home',
      services: 'Services',
      approach: 'Approach',
      about: 'About',
      insights: 'Insights',
      contact: 'Contact',
      privacy: 'Privacy policy',
    },
    servicesPage: {
      seoTitle: 'Digital Agency Services & Colony Units | colonyhub',
      seoDescription:
        'Explore colonyhub services across Strategy, Creative, Build, Growth, Social, and Data Units, plus Seed, Grow, and Scale collaboration models.',
      label: 'Services',
      title: 'What we do, together.',
      lead: 'Six specialist units working under one brief and one shared report. Start with one unit or combine several as your needs grow.',
      exploreUnit: 'View unit scope',
      modelsLabel: 'Collaboration models',
      modelsTitle: 'Seed, Grow, and Scale.',
      modelsLead:
        'We match team structure to your stage. Scope and pricing are agreed together after a free first consultation.',
      compareTitle: 'How do Seed, Grow, and Scale compare?',
      compareHeaders: ['Model', 'Units involved', 'Cadence', 'Best fit'],
      compareRows: [
        {
          model: 'Seed',
          units: 'Strategy, Creative, Build',
          cadence: 'Fixed-scope project',
          bestFor: 'Businesses setting up brand positioning, visual identity, website, and core tracking.',
        },
        {
          model: 'Grow',
          units: 'Growth, Social, Data',
          cadence: 'Monthly retainer',
          bestFor: 'Teams with a live site that need steady SEO, GEO, content, social media, and paid ads.',
        },
        {
          model: 'Scale',
          units: 'All six Colony Units',
          cadence: 'Ongoing dedicated team',
          bestFor: 'Organizations expanding into new products, channels, or regional markets with one cross-functional squad.',
        },
      ],
      faqLabel: 'Common questions',
      faqTitle: 'Questions clients ask before starting',
      faq: [
        {
          question: 'Can we start with just one Colony Unit instead of all six?',
          answer:
            'Yes. Many clients begin with a single priority, such as Build Unit for a website rebuild or Strategy Unit for positioning, then add Growth or Data Units once the foundation is live.',
        },
        {
          question: 'How are scope and pricing determined for Seed, Grow, and Scale?',
          answer:
            'We do not publish flat package prices because scope depends on your current assets, channels, and timeline. After a free first consultation, we write a clear scope proposal with deliverables, milestones, and fixed or monthly fees.',
        },
        {
          question: 'Do we need a finished brief before contacting colonyhub?',
          answer:
            'No. Bring the business goal or bottleneck you want to solve. During our free consultation and the Discover stage, we help turn open questions into a shared written brief.',
        },
        {
          question: 'Does colonyhub guarantee first-page Google rankings or AI citations?',
          answer:
            'No ethical agency controls search or AI algorithms. We focus on technical crawlability, clear structured data, accurate content, and transparent monthly reporting so you can trace real business outcomes.',
        },
      ],
      ctaTitle: 'Not sure which unit comes first?',
      ctaLead:
        'Bring the business problem to a free first consultation. We will map the right starting scope together.',
      ctaButton: 'Start a free consultation',
    },
    serviceDetail: {
      capabilitiesHeading: 'What capabilities are on this line?',
      scopeHeading: 'What problems does this unit solve, and what is included?',
      problemsTitle: 'Where this unit helps',
      deliverablesTitle: 'What is included',
      exclusionsTitle: 'Outside this unit scope',
      workflowTitle: 'How we run it',
      relatedHeading: 'Which Colony Units pair closely with this?',
      relatedTitle: 'Units that pair closely',
      faqLabel: 'Unit questions',
      faqHeading: 'Common questions about this unit',
      ctaButtonPrefix: 'Discuss',
      allServices: 'All six units',
      stopsLabel: 'Capabilities on this line',
    },
    approachPage: {
      seoTitle: 'How We Work: 4-Stage Delivery Approach | colonyhub',
      seoDescription:
        'See how colonyhub collaborates through Discover, Define, Create, and Improve: client inputs, review checkpoints, and expected outputs.',
      label: 'Approach',
      title: 'A clearer way to work together.',
      lead: 'Strategy, design, engineering, and growth share one cadence: weekly sprints, agreed review stops, and a monthly report you can read in five minutes.',
      principleLabel: 'Working principle',
      principleTitle: 'One accountable team across every handoff.',
      principleBody:
        'When brand, website, and ads are split across separate vendors, decisions get lost between teams. We keep one cross-functional team on your brief with shared visibility from day one.',
      stagesLabel: 'Four stages',
      stagesTitle: 'How Discover, Define, Create, and Improve work.',
      inputLabel: 'What you bring',
      checkpointLabel: 'Review checkpoint',
      outputLabel: 'What you get',
      stages: [
        {
          step: '01',
          name: 'Discover',
          summary:
            'We examine your business goals, target buyers, and existing digital assets before proposing any work.',
          clientInput: 'Business objectives, decision makers, existing brand/site assets, and constraints.',
          checkpoint: 'Shared alignment call to confirm findings and open risks.',
          output: 'A concise shared brief everyone agrees on.',
        },
        {
          step: '02',
          name: 'Define',
          summary:
            'We turn findings into clear priorities, concrete deliverables, and the metrics we will use to evaluate progress.',
          clientInput: 'Feedback on priorities, budget boundaries, and approval owners.',
          checkpoint: 'Scope and roadmap sign-off before production starts.',
          output: 'Prioritized plan, timeline, and measurement setup.',
        },
        {
          step: '03',
          name: 'Create',
          summary:
            'Relevant Colony Units produce strategy, visual assets, code, and campaigns in weekly sprints.',
          clientInput: 'Timely review at scheduled checkpoints and required product or business facts.',
          checkpoint: 'Weekly sprint demos and pre-launch QA review.',
          output: 'Working, tested deliverables ready to publish.',
        },
        {
          step: '04',
          name: 'Improve',
          summary:
            'After launch, we stay accountable for performance. We review real traffic and lead data each month and adjust the next sprint.',
          clientInput: 'Sales and lead quality feedback from your team.',
          checkpoint: 'Monthly review session covering results and next priorities.',
          output: 'Transparent monthly report and updated next-sprint backlog.',
          live: true,
        },
      ],
      note: 'Exact review cadence and approval roles are tailored to your team during the Discover stage.',
      faqLabel: 'Process questions',
      faqTitle: 'How day-to-day collaboration works',
      faq: [
        {
          question: 'How often do we review work during a sprint?',
          answer:
            'We hold weekly sprint demos and agree on formal approval checkpoints during the Define stage, so your team sees real progress early instead of waiting until launch week.',
        },
        {
          question: 'Who is our main point of contact at colonyhub?',
          answer:
            'You get one accountable lead who coordinates all Colony Units assigned to your brief, while keeping direct access to the strategists, designers, and engineers doing the work.',
        },
        {
          question: 'What happens after a website or campaign goes live?',
          answer:
            'For Seed projects, we hand over clean documentation, CMS access, and analytics baselines. For Grow and Scale engagements, we move directly into monthly Improve cycles with live dashboards and five-minute executive reports.',
        },
      ],
      ctaTitle: 'Ready to map your route?',
      ctaLead:
        'Start with a free consultation. You do not need a finished RFP to have a useful first conversation.',
      ctaButton: 'Start a free consultation',
    },
    aboutPage: {
      seoTitle: 'About Us: Integrated Digital Agency | colonyhub',
      seoDescription:
        'Learn why colonyhub exists in Indonesia, our purpose, vision, mission, and five operating values across strategy, creative, build, growth, social, and data.',
      label: 'About',
      title: 'Different minds. One direction.',
      lead: 'colonyhub is an integrated digital agency in Indonesia. Our strategy, creative, engineering, growth, social, and data specialists work from one brief and one shared plan.',
      purposeLabel: 'Brand foundation',
      purposeTitle: 'Why we built colonyhub',
      purposeBody:
        'We started colonyhub to make digital growth structured and measurable for growing teams, with every specialist connected to the same business goal.',
      visionTitle: 'Vision',
      visionBody:
        'To become the digital hub of choice for businesses in Indonesia and Southeast Asia growing with unified strategy, creativity, and technology.',
      missionTitle: 'Mission',
      missionItems: [
        'Unite strategy, creative, technology, and data in one integrated team.',
        'Turn every campaign into a measurable growth system.',
        'Build long-term client partnerships that continue improving after launch.',
        'Work with open dashboards, weekly sprints, and direct access to specialists.',
      ],
      whoLabel: 'Who we work with',
      whoTitle: 'Built for teams that need clarity and execution.',
      audiences: [
        {
          title: 'Indonesian SMEs and local brands',
          body: 'Businesses ready to sharpen their brand identity, website, and digital marketing with tidy, efficient execution.',
        },
        {
          title: 'Growth-stage startups',
          body: 'Product and founder teams needing a fast external partner that understands performance and steady iteration.',
        },
        {
          title: 'B2B companies and corporates',
          body: 'Organizations strengthening credibility, technical SEO, content engines, and qualified lead generation.',
        },
      ],
      valuesLabel: 'Core values',
      valuesTitle: 'Five habits that keep the work grounded.',
      teamLabel: 'People',
      teamTitle: 'Meet the colony',
      teamBody:
        'Individual team profiles and behind-the-scenes photography are being prepared with consent and will be published here once finalized. We never publish placeholder bios or stock team photos.',
      ctaTitle: 'Want to see how our team can support yours?',
      ctaLead:
        'Start a free first consultation and talk directly with the people who plan and build the work.',
      ctaButton: 'Start a free consultation',
    },
    insightsPage: {
      seoTitle: 'Insights on Design, Engineering & SEO | colonyhub',
      seoDescription:
        'Practical articles and field notes from colonyhub on strategy, design systems, web engineering, SEO, GEO, and digital growth.',
      label: 'Insights',
      title: 'Notes from the work.',
      lead: 'Practical breakdowns of how strategy, design, engineering, and growth decisions get made.',
      allCategories: 'All topics',
      featuredBadge: 'Featured',
      previewBadge: 'Preview sample',
      readArticle: 'Read article',
      minRead: 'min read',
      emptyTitle: 'No articles in this category yet.',
      emptyBody:
        'We publish slowly and only when we have firsthand notes worth sharing. Try another topic or view all available articles.',
      emptyReset: 'View all articles',
      prevPage: 'Previous',
      nextPage: 'Next',
      pageOf: 'Page',
    },
    articlePage: {
      previewNotice:
        'Preview fixture: this sample article validates the dynamic editorial layout, metadata, and JSON-LD before Colony Command Center publishing goes live.',
      publishedLabel: 'Published',
      updatedLabel: 'Updated',
      authorLabel: 'Author',
      referencesTitle: 'References',
      relatedArticlesTitle: 'Related reading',
      relatedServicesTitle: 'Related Colony Units',
      singleLangNotice: 'This article is currently published in English only.',
      singleLangAction: 'Browse Indonesian Insights',
      ctaTitle: 'Working through a similar decision?',
      ctaLead:
        'Bring your current constraints to a free consultation and we will walk through practical trade-offs together.',
      ctaButton: 'Start a free consultation',
      backToInsights: 'All Insights',
    },
    contactPage: {
      seoTitle: 'Contact & Free Consultation | colonyhub',
      seoDescription:
        'Start a free consultation with colonyhub in Jakarta, Indonesia via WhatsApp, email (hello@colonyhub.id), or Instagram (@colonyhub.id).',
      label: 'Contact',
      title: "Tell us what you're working on.",
      lead: 'Start with context and goals. You do not need a finished brief to start a free first consultation.',
      locationLabel: 'Jakarta, Indonesia · WIB (UTC+7)',
    },
    privacyPage: {
      seoTitle: 'Privacy & Cookie Policy | colonyhub',
      seoDescription:
        'How colonyhub handles direct contact, cookies, GA4, GTM, and Meta Pixel under Indonesia UU PDP No. 27/2022 and Consent Mode v2.',
      label: 'Legal & Privacy',
      title: 'Privacy & cookie policy',
      lead: 'How colonyhub handles direct contact communications, cookies, and optional analytics or marketing measurement on colonyhub.id.',
      draftNotice:
        'Effective November 22, 2026 · Governed by Indonesia Law No. 27 of 2022 on Personal Data Protection (UU PDP). Privacy contact: hello@colonyhub.id.',
      cookieTableTitle: 'Cookies & tracking technologies we use',
      cookieTableHeaders: ['Category', 'Providers / storage', 'Purpose', 'Legal basis'],
      cookieRows: [
        {
          category: 'Necessary',
          providers: 'colonyhub (colonyhub_consent_v1)',
          purpose: 'Stores your cookie consent choice and language preference so the site works reliably.',
          basis: 'Strictly necessary',
        },
        {
          category: 'Analytics',
          providers: 'Google Analytics 4 (_ga, _ga_*), Google Tag Manager',
          purpose: 'Measures page views, navigation paths, and CTA click performance (without collecting personal form text).',
          basis: 'Explicit consent (Opt-in)',
        },
        {
          category: 'Marketing',
          providers: 'Meta Platforms, Inc. (Meta Pixel / _fbp)',
          purpose: 'Measures campaign effectiveness and conversion attribution for Meta advertisements.',
          basis: 'Explicit consent (Opt-in)',
        },
      ],
      manageConsentButton: 'Manage cookie preferences',
      sections: [
        {
          heading: '1. Data controller & contact',
          body: 'colonyhub (https://colonyhub.id) is the Personal Data Controller responsible for data processed through this website. For any privacy inquiry, data access, or deletion request, contact hello@colonyhub.id.',
        },
        {
          heading: '2. Information we collect',
          body: 'We do not run embedded contact forms on this website. When you voluntarily reach out via email (hello@colonyhub.id) or WhatsApp, we receive the contact details and project context you choose to share. Separately, if you grant cookie consent, we collect pseudonymous technical and usage data such as page views, CTA button interactions, device/browser type, and referral source.',
        },
        {
          heading: '3. Legal basis for processing (UU PDP Article 20)',
          body: 'We process direct email or WhatsApp messages to respond to your pre-contractual consultation request. We load non-essential Analytics (Google Analytics 4, Google Tag Manager) and Marketing (Meta Pixel) scripts strictly on the basis of your explicit opt-in consent. Before you consent, Google Consent Mode v2 defaults to denied and Meta Pixel remains blocked.',
        },
        {
          heading: '4. Third-party subprocessors & cross-border transfers',
          body: 'To operate this website and measure consented traffic, we work with trusted subprocessors including Vercel Inc. (hosting & edge delivery), Google LLC (Google Analytics 4 & Google Tag Manager), and Meta Platforms, Inc. (Meta Pixel). These providers may process technical data on servers outside Indonesia subject to their respective data protection frameworks and safeguards.',
        },
        {
          heading: '5. Zero PII in analytics events',
          body: 'Our CTA and page-view events track only non-personal interaction metadata (such as button ID, page slug, and locale). We never transmit your name, email address, phone number, or private message contents to analytics or advertising pixels.',
        },
        {
          heading: '6. Data retention & security',
          body: 'Direct email and WhatsApp conversations are retained only as long as needed to handle your inquiry, ongoing project work, or legal obligations. All traffic to colonyhub.id is encrypted via HTTPS/TLS, and internal administrative access is protected by session authentication and role-based access control.',
        },
        {
          heading: '7. Your rights & withdrawing consent (UU PDP Articles 5–13)',
          body: 'You have the right to access, correct, update, or request deletion of your personal data, and to withdraw your cookie consent at any time without affecting basic access to this website. You can change your cookie preferences immediately using the button below or the "Cookie settings" link in the footer, or email hello@colonyhub.id for personal data requests.',
        },
      ],
    },
  },
  id: {
    breadcrumbs: {
      home: 'Beranda',
      services: 'Layanan',
      approach: 'Cara kerja',
      about: 'Tentang',
      insights: 'Insight',
      contact: 'Kontak',
      privacy: 'Kebijakan privasi',
    },
    servicesPage: {
      seoTitle: 'Layanan Digital Agency & Colony Unit | colonyhub',
      seoDescription:
        'Jelajahi layanan colonyhub di Strategy, Creative, Build, Growth, Social, dan Data Unit, beserta model kerja sama Seed, Grow, dan Scale.',
      label: 'Layanan',
      title: 'Yang kami kerjakan, bersama.',
      lead: 'Enam unit spesialis yang bekerja dari satu brief dan satu laporan bersama. Anda bisa mulai dari satu unit atau menggabungkan beberapa unit sesuai kebutuhan.',
      exploreUnit: 'Lihat cakupan unit',
      modelsLabel: 'Model kerja sama',
      modelsTitle: 'Seed, Grow, dan Scale.',
      modelsLead:
        'Struktur tim disesuaikan dengan tahap bisnis Anda. Cakupan dan harga disepakati bersama setelah konsultasi pertama gratis.',
      compareTitle: 'Apa perbedaan Seed, Grow, dan Scale?',
      compareHeaders: ['Model', 'Unit yang terlibat', 'Ritme kerja', 'Paling cocok untuk'],
      compareRows: [
        {
          model: 'Seed',
          units: 'Strategy, Creative, Build',
          cadence: 'Proyek cakupan tetap',
          bestFor: 'Bisnis yang menyiapkan positioning brand, identitas visual, website, dan dasar tracking.',
        },
        {
          model: 'Grow',
          units: 'Growth, Social, Data',
          cadence: 'Retainer bulanan',
          bestFor: 'Tim dengan website aktif yang butuh SEO, GEO, konten, social media, dan iklan performa rutin.',
        },
        {
          model: 'Scale',
          units: 'Keenam Colony Unit',
          cadence: 'Tim terintegrasi berkelanjutan',
          bestFor: 'Organisasi yang memperluas produk, kanal, atau pasar baru bersama satu tim lintas disiplin.',
        },
      ],
      faqLabel: 'Pertanyaan umum',
      faqTitle: 'Pertanyaan yang sering diajukan sebelum mulai',
      faq: [
        {
          question: 'Apakah kami bisa mulai dari satu Colony Unit saja, tidak langsung enam?',
          answer:
            'Bisa. Banyak klien memulai dari satu prioritas utama, misalnya Build Unit untuk membangun ulang website atau Strategy Unit untuk merapikan positioning, lalu menambah Growth atau Data Unit setelah fondasinya siap.',
        },
        {
          question: 'Bagaimana cakupan dan biaya Seed, Grow, dan Scale ditentukan?',
          answer:
            'Kami tidak memasang harga paket seragam karena ruang lingkup bergantung pada aset yang sudah ada, target kanal, dan lini masa. Setelah konsultasi pertama gratis, kami menyusun proposal cakupan beserta deliverable, milestone, dan biaya yang jelas.',
        },
        {
          question: 'Apakah kami harus membawa brief yang sudah rapi sebelum menghubungi colonyhub?',
          answer:
            'Tidak perlu. Bawa saja tujuan bisnis atau kendala utama yang ingin dibereskan. Pada sesi konsultasi gratis dan tahap Discover, kita menyusun brief bersama secara tertulis.',
        },
        {
          question: 'Apakah colonyhub menjamin peringkat #1 Google atau sitasi AI?',
          answer:
            'Tidak ada agency yang bisa mengendalikan algoritma mesin pencari atau AI. Kami fokus pada crawlability teknis, structured data faktual, konten akurat, dan laporan bulanan transparan agar hasil bisnisnya bisa dilacak.',
        },
      ],
      ctaTitle: 'Belum yakin harus mulai dari unit mana?',
      ctaLead:
        'Bawa masalah bisnisnya ke konsultasi pertama gratis. Kita petakan ruang lingkup awal yang paling masuk akal bersama.',
      ctaButton: 'Mulai konsultasi gratis',
    },
    serviceDetail: {
      capabilitiesHeading: 'Apa saja kapabilitas di jalur ini?',
      scopeHeading: 'Masalah apa yang diselesaikan dan apa saja cakupannya?',
      problemsTitle: 'Masalah yang ditangani unit ini',
      deliverablesTitle: 'Yang termasuk dalam cakupan',
      exclusionsTitle: 'Di luar cakupan unit ini',
      workflowTitle: 'Cara kami menjalankannya',
      relatedHeading: 'Colony Unit mana yang sering berjalan beriringan?',
      relatedTitle: 'Unit yang sering berjalan beriringan',
      faqLabel: 'Pertanyaan unit',
      faqHeading: 'Pertanyaan umum tentang unit ini',
      ctaButtonPrefix: 'Diskusikan kebutuhan',
      allServices: 'Semua enam unit',
      stopsLabel: 'Kapabilitas pada jalur ini',
    },
    approachPage: {
      seoTitle: 'Cara Kerja: Alur Proyek 4 Tahap | colonyhub',
      seoDescription:
        'Lihat bagaimana colonyhub bekerja lewat tahap Discover, Define, Create, dan Improve: masukan klien, titik review, dan output tiap tahap.',
      label: 'Cara kerja',
      title: 'Cara kerja yang lebih jelas sejak awal.',
      lead: 'Strategi, desain, engineering, dan growth mengikuti satu ritme yang sama: sprint mingguan, titik review yang disepakati di depan, dan laporan bulanan yang bisa dibaca dalam lima menit.',
      principleLabel: 'Prinsip kolaborasi',
      principleTitle: 'Satu tim bertanggung jawab di setiap tahap serah terima.',
      principleBody:
        'Saat brand, website, dan iklan dipegang vendor terpisah, keputusan sering hilang di tengah jalan. Kami menaruh tim lintas disiplin pada satu brief dengan visibilitas terbuka sejak hari pertama.',
      stagesLabel: 'Empat tahap',
      stagesTitle: 'Bagaimana Discover, Define, Create, dan Improve berjalan.',
      inputLabel: 'Yang Anda siapkan',
      checkpointLabel: 'Titik review',
      outputLabel: 'Yang Anda dapat',
      stages: [
        {
          step: '01',
          name: 'Discover',
          summary:
            'Kami mempelajari tujuan bisnis, calon pembeli, dan aset digital yang sudah ada sebelum mengusulkan pekerjaan apa pun.',
          clientInput: 'Tujuan bisnis, pengambil keputusan, akses aset brand/website, dan batasan yang ada.',
          checkpoint: 'Sesi penyelarasan bersama untuk memvalidasi temuan dan risiko terbuka.',
          output: 'Brief bersama yang ringkas dan disepakati semua pihak.',
        },
        {
          step: '02',
          name: 'Define',
          summary:
            'Temuan diubah menjadi urutan prioritas, deliverable konkret, dan metrik yang dipakai untuk menilai hasil.',
          clientInput: 'Masukan atas prioritas, batasan anggaran, dan penanggung jawab persetujuan.',
          checkpoint: 'Persetujuan cakupan dan roadmap sebelum produksi dimulai.',
          output: 'Rencana prioritas, lini masa, dan rancangan pengukuran.',
        },
        {
          step: '03',
          name: 'Create',
          summary:
            'Colony Unit yang relevan memproduksi strategi, aset visual, kode, dan kampanye dalam sprint mingguan.',
          clientInput: 'Umpan balik tepat waktu pada titik review serta fakta bisnis atau produk yang dibutuhkan.',
          checkpoint: 'Demo sprint mingguan dan review QA sebelum tayang.',
          output: 'Deliverable yang berjalan, teruji, dan siap dipublikasikan.',
        },
        {
          step: '04',
          name: 'Improve',
          summary:
            'Setelah tayang, kami tetap mendampingi performanya. Setiap bulan kami meninjau data trafik dan lead nyata lalu menyusun penyesuaian sprint berikutnya.',
          clientInput: 'Masukan kualitas lead dan penjualan dari tim Anda.',
          checkpoint: 'Sesi evaluasi bulanan membahas hasil dan prioritas bulan depan.',
          output: 'Laporan bulanan transparan dan backlog sprint berikutnya.',
          live: true,
        },
      ],
      note: 'Ritme review dan peran persetujuan disesuaikan dengan kapasitas tim Anda pada tahap Discover.',
      faqLabel: 'Pertanyaan alur kerja',
      faqTitle: 'Bagaimana kolaborasi harian berjalan',
      faq: [
        {
          question: 'Seberapa sering progres pekerjaan ditinjau selama sprint?',
          answer:
            'Kami mengadakan demo sprint mingguan dan menyepakati titik persetujuan sejak tahap Define, sehingga tim Anda melihat hasil kerja secara bertahap tanpa menunggu minggu peluncuran.',
        },
        {
          question: 'Siapa kontak utama kami setelah proyek berjalan?',
          answer:
            'Anda memiliki satu penanggung jawab utama yang mengoordinasikan seluruh Colony Unit pada brief Anda, sekaligus akses langsung ke strategist, desainer, dan engineer yang mengerjakan proyeknya.',
        },
        {
          question: 'Apa yang terjadi setelah website atau kampanye diluncurkan?',
          answer:
            'Untuk proyek Seed, kami menyerahkan dokumentasi rapi, akses CMS, dan baseline analytics. Untuk kerja sama Grow dan Scale, kami langsung masuk ke siklus Improve bulanan dengan dashboard live dan laporan ringkas lima menit.',
        },
      ],
      ctaTitle: 'Siap memetakan rute proyek Anda?',
      ctaLead:
        'Mulai dari konsultasi gratis. Anda tidak perlu menunggu dokumen brief yang sempurna untuk memulai percakapan yang berguna.',
      ctaButton: 'Mulai konsultasi gratis',
    },
    aboutPage: {
      seoTitle: 'Tentang Kami: Tim Digital Terintegrasi | colonyhub',
      seoDescription:
        'Kenali tujuan, visi, misi, dan lima nilai kerja colonyhub di Indonesia yang menyatukan strategi, kreatif, teknologi, dan data dalam satu tim.',
      label: 'Tentang',
      title: 'Beragam keahlian. Satu arah.',
      lead: 'colonyhub adalah digital agency terintegrasi di Indonesia. Spesialis strategi, kreatif, engineering, growth, social, dan data kami bekerja dari satu brief dan satu rencana bersama.',
      purposeLabel: 'Fondasi brand',
      purposeTitle: 'Kenapa kami ada',
      purposeBody:
        'Kami membangun colonyhub agar pertumbuhan digital berjalan terstruktur dan terukur bagi tim yang sedang bertumbuh, dengan setiap spesialis tertuju pada sasaran bisnis yang sama.',
      visionTitle: 'Visi',
      visionBody:
        'Menjadi hub digital pilihan bisnis Indonesia dan Asia Tenggara yang ingin tumbuh dengan strategi, kreativitas, dan teknologi yang menyatu.',
      missionTitle: 'Misi',
      missionItems: [
        'Menyatukan strategi, kreatif, teknologi, dan data dalam satu tim terintegrasi.',
        'Mengubah setiap kampanye menjadi sistem pertumbuhan yang bisa diukur.',
        'Menjalin kemitraan jangka panjang yang terus berlanjut dan membaik setelah peluncuran.',
        'Bekerja dengan dashboard terbuka, sprint mingguan, dan akses langsung ke para spesialis.',
      ],
      whoLabel: 'Untuk siapa kami bekerja',
      whoTitle: 'Disiapkan untuk tim yang butuh kejelasan dan eksekusi.',
      audiences: [
        {
          title: 'UMKM dan brand lokal',
          body: 'Bisnis yang ingin merapikan identitas brand, website, dan pemasaran digital dengan eksekusi yang efisien.',
        },
        {
          title: 'Startup dan perusahaan tahap growth',
          body: 'Tim produk dan founder yang membutuhkan mitra eksternal gesit, paham performa, dan siap diajak iterasi.',
        },
        {
          title: 'Perusahaan B2B dan korporasi',
          body: 'Organisasi yang membangun kredibilitas, SEO teknis, content engine, dan sistem lead generation.',
        },
      ],
      valuesLabel: 'Nilai inti',
      valuesTitle: 'Lima kebiasaan yang menjaga standar kerja kami.',
      teamLabel: 'Tim',
      teamTitle: 'Kenali koloninya',
      teamBody:
        'Profil anggota tim dan dokumentasi foto kerja nyata sedang disiapkan dengan persetujuan masing-masing dan akan tayang di sini setelah final. Kami tidak memasang bio fiktif atau foto stok.',
      ctaTitle: 'Ingin melihat bagaimana tim kami bisa membantu tim Anda?',
      ctaLead:
        'Mulai konsultasi pertama gratis dan berdiskusi langsung dengan orang-orang yang merencanakan serta mengerjakan proyeknya.',
      ctaButton: 'Mulai konsultasi gratis',
    },
    insightsPage: {
      seoTitle: 'Insight Desain, Engineering & SEO | colonyhub',
      seoDescription:
        'Artikel praktis dan catatan lapangan dari colonyhub mengenai strategi, desain, web engineering, SEO, GEO, dan pertumbuhan digital.',
      label: 'Insight',
      title: 'Catatan dari pekerjaan.',
      lead: 'Ulasan praktis tentang bagaimana keputusan strategi, desain, engineering, dan pertumbuhan diambil.',
      allCategories: 'Semua topik',
      featuredBadge: 'Unggulan',
      previewBadge: 'Contoh pratinjau',
      readArticle: 'Baca artikel',
      minRead: 'menit baca',
      emptyTitle: 'Belum ada artikel di kategori ini.',
      emptyBody:
        'Kami menerbitkan artikel saat ada catatan kerja nyata yang layak dibagikan. Pilih topik lain atau lihat semua artikel yang tersedia.',
      emptyReset: 'Lihat semua artikel',
      prevPage: 'Sebelumnya',
      nextPage: 'Berikutnya',
      pageOf: 'Halaman',
    },
    articlePage: {
      previewNotice:
        'Fixture pratinjau: artikel contoh ini memvalidasi tampilan editorial dinamis, metadata, dan JSON-LD sebelum publikasi Colony Command Center aktif.',
      publishedLabel: 'Terbit',
      updatedLabel: 'Diperbarui',
      authorLabel: 'Penulis',
      referencesTitle: 'Referensi',
      relatedArticlesTitle: 'Bacaan terkait',
      relatedServicesTitle: 'Colony Unit terkait',
      singleLangNotice: 'Artikel ini saat ini baru tersedia dalam bahasa Inggris.',
      singleLangAction: 'Lihat daftar Insight Bahasa Indonesia',
      ctaTitle: 'Sedang menghadapi keputusan serupa?',
      ctaLead:
        'Bawa konteks dan batasan bisnis Anda ke konsultasi gratis agar kita bisa membedah trade-off-nya bersama.',
      ctaButton: 'Mulai konsultasi gratis',
      backToInsights: 'Semua Insight',
    },
    contactPage: {
      seoTitle: 'Kontak & Konsultasi Gratis | colonyhub',
      seoDescription:
        'Mulai konsultasi gratis dengan colonyhub di Jakarta, Indonesia melalui WhatsApp, email (hello@colonyhub.id), atau Instagram (@colonyhub.id).',
      label: 'Kontak',
      title: 'Ceritakan apa yang sedang Anda kerjakan.',
      lead: 'Mulai dari konteks dan tujuan. Anda belum harus membawa brief yang sempurna untuk memulai konsultasi pertama gratis.',
      locationLabel: 'Jakarta, Indonesia · WIB (UTC+7)',
    },
    privacyPage: {
      seoTitle: 'Kebijakan Privasi & Cookie | colonyhub',
      seoDescription:
        'Bagaimana colonyhub memproses kontak langsung, cookie, GA4, GTM, dan Meta Pixel sesuai UU PDP No. 27/2022 dan Consent Mode v2.',
      label: 'Legal & Privasi',
      title: 'Kebijakan privasi & cookie',
      lead: 'Bagaimana colonyhub menangani komunikasi kontak langsung, cookie, serta pengukuran analitik dan pemasaran berbasis persetujuan di colonyhub.id.',
      draftNotice:
        'Berlaku sejak 22 November 2026 · Mengacu pada Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP). Kontak privasi: hello@colonyhub.id.',
      cookieTableTitle: 'Kategori cookie & teknologi pelacakan',
      cookieTableHeaders: ['Kategori', 'Penyedia / penyimpanan', 'Tujuan', 'Dasar hukum'],
      cookieRows: [
        {
          category: 'Esensial',
          providers: 'colonyhub (colonyhub_consent_v1)',
          purpose: 'Menyimpan pilihan persetujuan cookie dan preferensi bahasa agar situs berjalan semestinya.',
          basis: 'Wajib / esensial',
        },
        {
          category: 'Analitik',
          providers: 'Google Analytics 4 (_ga, _ga_*), Google Tag Manager',
          purpose: 'Mengukur kunjungan halaman, alur navigasi, dan efektivitas klik tombol CTA (tanpa teks pribadi).',
          basis: 'Persetujuan eksplisit (Opt-in)',
        },
        {
          category: 'Pemasaran',
          providers: 'Meta Platforms, Inc. (Meta Pixel / _fbp)',
          purpose: 'Mengukur efektivitas kampanye dan atribusi konversi iklan Meta.',
          basis: 'Persetujuan eksplisit (Opt-in)',
        },
      ],
      manageConsentButton: 'Atur preferensi cookie',
      sections: [
        {
          heading: '1. Pengendali data pribadi & kontak',
          body: 'colonyhub (https://colonyhub.id) bertindak sebagai Pengendali Data Pribadi atas pemrosesan data melalui situs ini. Untuk pertanyaan privasi, akses data, atau permintaan penghapusan data, hubungi hello@colonyhub.id.',
        },
        {
          heading: '2. Informasi yang kami kumpulkan',
          body: 'Situs ini tidak menggunakan formulir inquiry tertanam. Saat Anda menghubungi kami secara sukarela melalui email (hello@colonyhub.id) atau WhatsApp, kami menerima informasi kontak dan konteks proyek yang Anda bagikan. Secara terpisah, jika Anda memberikan persetujuan cookie, kami mengumpulkan data teknis dan penggunaan seperti halaman yang dilihat, interaksi tombol CTA, tipe perangkat/browser, dan sumber rujukan.',
        },
        {
          heading: '3. Dasar hukum pemrosesan (Pasal 20 UU PDP)',
          body: 'Kami memproses pesan email atau WhatsApp langsung untuk menanggapi permintaan konsultasi pra-kontrak Anda. Skrip non-esensial seperti Analitik (Google Analytics 4, Google Tag Manager) dan Pemasaran (Meta Pixel) hanya dimuat berdasarkan persetujuan eksplisit (opt-in) Anda. Sebelum Anda menyetujui, Google Consent Mode v2 disetel default denied dan Meta Pixel tetap diblokir.',
        },
        {
          heading: '4. Pihak ketiga & transfer data lintas batas',
          body: 'Untuk mengoperasikan situs dan mengukur trafik yang telah disetujui, kami menggunakan penyedia layanan tepercaya yaitu Vercel Inc. (hosting & infrastruktur), Google LLC (Google Analytics 4 & Google Tag Manager), dan Meta Platforms, Inc. (Meta Pixel). Penyedia tersebut dapat memproses data teknis pada server di luar wilayah Indonesia sesuai kerangka perlindungan data yang berlaku.',
        },
        {
          heading: '5. Tanpa data pribadi (PII) di event analitik',
          body: 'Event klik CTA dan kunjungan halaman hanya mencatat metadata interaksi non-pribadi (seperti ID tombol, slug halaman, dan bahasa). Kami tidak pernah mengirimkan nama, alamat email, nomor telepon, atau isi pesan pribadi Anda ke sistem analitik maupun piksel iklan.',
        },
        {
          heading: '6. Retensi data & keamanan',
          body: 'Komunikasi langsung melalui email dan WhatsApp disimpan seperlunya selama masa tindak lanjut konsultasi, kolaborasi proyek, atau kewajiban hukum. Seluruh akses ke colonyhub.id dienkripsi melalui HTTPS/TLS dan sistem internal dilindungi autentikasi sesi serta kontrol akses berbasis peran.',
        },
        {
          heading: '7. Hak subjek data & penarikan persetujuan (Pasal 5–13 UU PDP)',
          body: 'Anda berhak mengakses, memperbaiki, memperbarui, atau meminta penghapusan data pribadi Anda, serta menarik persetujuan cookie kapan saja tanpa memengaruhi akses dasar situs. Anda dapat mengubah preferensi cookie langsung melalui tombol di bawah atau tautan "Pengaturan cookie" di footer, atau mengirim permintaan ke hello@colonyhub.id.',
        },
      ],
    },
  },
};

export function getPublicPagesContent(locale: Locale): PublicPagesContent {
  return PUBLIC_PAGES[locale];
}
