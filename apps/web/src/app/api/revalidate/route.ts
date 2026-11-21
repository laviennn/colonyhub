import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

const DEFAULT_DEV_REVALIDATE_SECRET = 'colonyhub-dev-revalidate-secret';

export async function POST(request: Request) {
  const expected = process.env.REVALIDATION_SECRET || DEFAULT_DEV_REVALIDATE_SECRET;
  const provided = request.headers.get('x-revalidation-secret');

  if (!provided || provided !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let paths: string[] = [];
  let revalidateLayout = false;
  try {
    const body = (await request.json()) as { paths?: unknown; layout?: unknown };
    if (Array.isArray(body.paths)) {
      paths = body.paths.filter((p): p is string => typeof p === 'string' && p.startsWith('/'));
    }
    revalidateLayout = Boolean(body.layout);
  } catch {
    // Allow empty body to revalidate default paths
  }

  if (revalidateLayout) {
    revalidatePath('/', 'layout');
  }

  const targets = new Set<string>([
    '/',
    '/id',
    '/insights',
    '/id/insights',
    '/sitemap.xml',
    '/sitemaps/insights.xml',
    ...paths,
  ]);

  for (const target of targets) {
    revalidatePath(target);
  }

  return NextResponse.json({
    ok: true,
    revalidated: Array.from(targets),
    layout: revalidateLayout,
  });
}
