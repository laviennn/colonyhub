import {
  COLONY_UNITS,
  CONTACT_EMAIL,
  CONTACT_INSTAGRAM_HANDLE,
  CONTACT_INSTAGRAM_URL,
  CONTACT_WHATSAPP_DISPLAY,
  PRODUCTION_ORIGIN,
  canonicalUrl,
} from '@colonyhub/content';
import { listAllCmsArticles } from '@colonyhub/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const unitLinesEn = COLONY_UNITS.map(
    (u) =>
      `- [${u.officialName}](${PRODUCTION_ORIGIN}/services/${u.slug}): ${u.sub.en} (${u.stops.en.map(([name]) => name).join(', ')})`,
  ).join('\n');

  const unitLinesId = COLONY_UNITS.map(
    (u) =>
      `- [${u.officialName} (ID)](${PRODUCTION_ORIGIN}/id/services/${u.slug}): ${u.sub.id} (${u.stops.id.map(([name]) => name).join(', ')})`,
  ).join('\n');

  const publishedArticles = await listAllCmsArticles({ status: 'published' });
  const insightsLines =
    publishedArticles.length > 0
      ? publishedArticles
          .slice(0, 20)
          .map(
            (a) =>
              `- [${a.title} (${a.locale.toUpperCase()})](${canonicalUrl(a.locale, `/insights/${a.slug}`)}): ${a.dek}`,
          )
          .join('\n')
      : `- [Insights Index (EN)](${PRODUCTION_ORIGIN}/insights)\n- [Daftar Insight (ID)](${PRODUCTION_ORIGIN}/id/insights)`;

  const body = [
    '# colonyhub',
    '',
    '> Integrated digital agency in Indonesia (Jakarta, WIB / UTC+7) uniting strategy, creative, web engineering, SEO/GEO, social media, and data analytics in one connected team. Tagline: Grow together. Move as one.',
    '',
    '## Direct Contact',
    `- Email: ${CONTACT_EMAIL}`,
    `- WhatsApp: ${CONTACT_WHATSAPP_DISPLAY}`,
    `- Instagram: ${CONTACT_INSTAGRAM_HANDLE} (${CONTACT_INSTAGRAM_URL})`,
    '- Location: Jakarta, Indonesia (WIB / UTC+7)',
    '',
    '## Main Pages (English)',
    `- [Homepage](${PRODUCTION_ORIGIN})`,
    `- [Services & Colony Units](${PRODUCTION_ORIGIN}/services)`,
    `- [Approach (Discover, Define, Create, Improve)](${PRODUCTION_ORIGIN}/approach)`,
    `- [Insights](${PRODUCTION_ORIGIN}/insights)`,
    `- [About colonyhub](${PRODUCTION_ORIGIN}/about)`,
    `- [Free Consultation / Contact](${PRODUCTION_ORIGIN}/contact)`,
    `- [Privacy & Cookie Policy](${PRODUCTION_ORIGIN}/privacy)`,
    '',
    '## Halaman Utama (Bahasa Indonesia)',
    `- [Beranda](${PRODUCTION_ORIGIN}/id)`,
    `- [Layanan & Colony Unit](${PRODUCTION_ORIGIN}/id/services)`,
    `- [Cara Kerja](${PRODUCTION_ORIGIN}/id/approach)`,
    `- [Insight](${PRODUCTION_ORIGIN}/id/insights)`,
    `- [Tentang colonyhub](${PRODUCTION_ORIGIN}/id/about)`,
    `- [Konsultasi Gratis / Kontak](${PRODUCTION_ORIGIN}/id/contact)`,
    `- [Kebijakan Privasi & Cookie](${PRODUCTION_ORIGIN}/id/privacy)`,
    '',
    '## Colony Units (English)',
    unitLinesEn,
    '',
    '## Colony Units (Bahasa Indonesia)',
    unitLinesId,
    '',
    '## Collaboration Models',
    '- Seed: Digital foundations (Strategy, Creative, Build) on a fixed-scope project basis',
    '- Grow: Monthly growth retainer (Growth, Social, Data) for SEO, GEO, content, social media, and tracked ads',
    '- Scale: Dedicated integrated team across all six Colony Units for ongoing expansion',
    '',
    '## Curated Published Insights',
    insightsLines,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
