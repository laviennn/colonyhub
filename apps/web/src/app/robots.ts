import type { MetadataRoute } from 'next';
import { PRODUCTION_ORIGIN } from '@colonyhub/content';

export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV === 'preview';

  if (isPreview) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${PRODUCTION_ORIGIN}/sitemap.xml`,
  };
}
