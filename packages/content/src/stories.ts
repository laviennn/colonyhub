import type { Locale } from './locales';

export type StorySticker =
  | { type: 'poll'; options: Record<Locale, readonly string[]> }
  | { type: 'quiz'; options: Record<Locale, readonly string[]> }
  | { type: 'slider'; label: Record<Locale, string> }
  | { type: 'question'; label: Record<Locale, string> };

export type StorySample = {
  id: string;
  unit: number;
  bg: string;
  hook: Record<Locale, string>;
  sticker: StorySticker;
  caption: Record<Locale, string>;
};

/**
 * Social content showcase — story-engagement formats colonyhub designs for client brands.
 * Ported verbatim from prototype/stories-data.js with root-relative SVG asset URLs.
 */
export const STORY_SAMPLES: readonly StorySample[] = [
  {
    id: 'social-poll',
    unit: 4,
    bg: '/assets/stories/story-social.svg',
    hook: {
      en: 'Where do your customers find you first?',
      id: 'Pelanggan kamu pertama kali nemu kamu di mana?',
    },
    sticker: {
      type: 'poll',
      options: { en: ['Instagram', 'Google'], id: ['Instagram', 'Google'] },
    },
    caption: { en: 'Poll · Social Unit', id: 'Poll · Social Unit' },
  },
  {
    id: 'growth-quiz',
    unit: 3,
    bg: '/assets/stories/story-growth.svg',
    hook: {
      en: 'New site, zero traffic. Fix first?',
      id: 'Website baru, traffic nol. Benahi yang mana dulu?',
    },
    sticker: {
      type: 'quiz',
      options: {
        en: ['Run ads', 'Fix SEO basics', 'Post more'],
        id: ['Pasang iklan', 'Benahi dasar SEO', 'Posting lebih sering'],
      },
    },
    caption: { en: 'Quiz · Growth Unit', id: 'Quiz · Growth Unit' },
  },
  {
    id: 'creative-slider',
    unit: 1,
    bg: '/assets/stories/story-creative.svg',
    hook: {
      en: 'Refresh the logo or keep it?',
      id: 'Logo lama: refresh atau pertahankan?',
    },
    sticker: {
      type: 'slider',
      label: {
        en: 'How ready is your brand for a refresh?',
        id: 'Seberapa siap brand kamu di-refresh?',
      },
    },
    caption: { en: 'Emoji slider · Creative Unit', id: 'Emoji slider · Creative Unit' },
  },
  {
    id: 'build-question',
    unit: 2,
    bg: '/assets/stories/story-build.svg',
    hook: {
      en: 'Ask us anything about your website.',
      id: 'Tanya apa saja soal website kamu.',
    },
    sticker: {
      type: 'question',
      label: { en: 'Your question', id: 'Pertanyaan kamu' },
    },
    caption: { en: 'Question box · Build Unit', id: 'Question box · Build Unit' },
  },
  {
    id: 'data-poll',
    unit: 5,
    bg: '/assets/stories/story-data.svg',
    hook: {
      en: 'Monthly report: dashboard or spreadsheet?',
      id: 'Laporan bulanan: dashboard atau spreadsheet?',
    },
    sticker: {
      type: 'poll',
      options: { en: ['Dashboard', 'Spreadsheet'], id: ['Dashboard', 'Spreadsheet'] },
    },
    caption: { en: 'This or that · Data Unit', id: 'This or that · Data Unit' },
  },
];
