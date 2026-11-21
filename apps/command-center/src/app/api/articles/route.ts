import { NextResponse } from 'next/server';
import {
  isInsightCategory,
  localePath,
  type InsightCategorySlug,
  type Locale,
  type RichTextBlock,
} from '@colonyhub/content';
import {
  hasMenuPermission,
  listAllCmsArticles,
  listAuthors,
  saveCmsArticle,
  type PublishStatus,
} from '@colonyhub/db';
import { revalidatePublicWeb } from '@/lib/revalidate-web';
import { getCurrentUser } from '@/lib/session';

const VALID_STATUSES: PublishStatus[] = ['draft', 'review', 'published', 'archived'];

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!hasMenuPermission(user, 'insights', 'view')) {
    return NextResponse.json({ ok: false, error: 'Forbidden: missing insights:view permission.' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get('locale');
  const statusParam = searchParams.get('status');

  const locale: Locale | undefined =
    localeParam === 'en' || localeParam === 'id' ? localeParam : undefined;
  const status: PublishStatus | undefined = VALID_STATUSES.includes(statusParam as PublishStatus)
    ? (statusParam as PublishStatus)
    : undefined;

  const items = await listAllCmsArticles({ locale, status });
  return NextResponse.json({ ok: true, items });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const locale: Locale = body.locale === 'id' ? 'id' : 'en';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
  const dek = typeof body.dek === 'string' ? body.dek.trim() : '';
  const status: PublishStatus = VALID_STATUSES.includes(body.status as PublishStatus)
    ? (body.status as PublishStatus)
    : 'draft';

  if (!title || !slug || !dek) {
    return NextResponse.json(
      { ok: false, error: 'Title, slug, and summary (dek) are required.' },
      { status: 400 },
    );
  }

  if (!hasMenuPermission(user, 'insights', 'create')) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: missing insights:create permission.' },
      { status: 403 },
    );
  }

  if ((status === 'published' || status === 'archived') && !hasMenuPermission(user, 'insights', 'publish')) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: missing insights:publish permission.' },
      { status: 403 },
    );
  }

  const categorySlug: InsightCategorySlug =
    typeof body.categorySlug === 'string' && isInsightCategory(body.categorySlug)
      ? body.categorySlug
      : 'strategy';

  const authors = await listAuthors();
  const authorId =
    typeof body.authorId === 'string' && body.authorId.trim()
      ? body.authorId.trim()
      : (authors[0]?.id ?? '');

  const blocks = Array.isArray(body.blocks) ? (body.blocks as RichTextBlock[]) : [];
  const references = Array.isArray(body.references)
    ? (body.references as Array<{ title: string; url: string }>)
    : [];
  const relatedServices = Array.isArray(body.relatedServices)
    ? body.relatedServices.filter((s): s is string => typeof s === 'string')
    : [];

  try {
    const { article } = await saveCmsArticle({
      translationGroupId:
        typeof body.translationGroupId === 'string' && body.translationGroupId.trim()
          ? body.translationGroupId.trim()
          : undefined,
      locale,
      slug,
      title,
      dek,
      status,
      categorySlug,
      authorId,
      reviewerId: status === 'published' ? user.id : null,
      blocks,
      references,
      relatedServices,
      featured: Boolean(body.featured),
      seo: {
        title: typeof body.seoTitle === 'string' ? body.seoTitle.trim() || undefined : undefined,
        description:
          typeof body.seoDescription === 'string'
            ? body.seoDescription.trim() || undefined
            : undefined,
      },
    });

    if (article.status === 'published') {
      await revalidatePublicWeb([localePath(article.locale, `/insights/${article.slug}`)]);
    }

    return NextResponse.json({ ok: true, article }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create article.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
