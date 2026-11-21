import { COLONY_UNITS, alternateUrls, canonicalUrl } from '@colonyhub/content';
import { renderUrlSet, xmlResponse, type SitemapUrlEntry } from '@/lib/sitemap-xml';

export const dynamic = 'force-static';

const LAST_MODIFIED = '2026-11-22T00:00:00.000Z';

export function GET() {
  const paths = ['/services', ...COLONY_UNITS.map((u) => `/services/${u.slug}`)];
  const entries: SitemapUrlEntry[] = [];

  for (const path of paths) {
    const alternates = alternateUrls(path);
    entries.push(
      { loc: canonicalUrl('en', path), lastmod: LAST_MODIFIED, alternates },
      { loc: canonicalUrl('id', path), lastmod: LAST_MODIFIED, alternates },
    );
  }

  return xmlResponse(renderUrlSet(entries));
}
