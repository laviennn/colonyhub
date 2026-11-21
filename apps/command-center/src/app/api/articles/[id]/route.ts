import { NextResponse } from 'next/server';
import {
  isInsightCategory,
  localePath,
  type InsightCategorySlug,
  type RichTextBlock,
} from '@colonyhub/content';
import {
  getCmsArticleById,
  hasMenuPermission,
  saveCmsArticle,
  type PublishStatus,
} from '@colonyhub/db';
import { revalidatePublicWeb } from '@/lib/revalidate-web';
import { getCurrentUser } from '@/lib/session';

const VALID_STATUSES: PublishStatus[] = ['draft', 'review', 'published', 'archived'];

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!hasMenuPermission(user, 'insights', 'view')) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const article = await getCmsArticleById(id);
  if (!article) {
    return NextResponse.json({ ok: false, error: 'Article not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, article });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getCmsArticleById(id);
  if (!existing) {
    return NextResponse.json({ ok: false, error: 'Article not found.' }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const nextStatus: PublishStatus =
    typeof body.status === 'string' && VALID_STATUSES.includes(body.status as PublishStatus)
      ? (body.status as PublishStatus)
      : existing.status;

  if (!hasMenuPermission(user, 'insights', 'edit')) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: missing insights:edit permission.' },
      { status: 403 },
    );
  }

  const involvesPublishBoundary =
    nextStatus === 'published' ||
    nextStatus === 'archived' ||
    existing.status === 'published';

  if (involvesPublishBoundary && !hasMenuPermission(user, 'insights', 'publish')) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: missing insights:publish permission.' },
      { status: 403 },
    );
  }

  const categorySlug: InsightCategorySlug =
    typeof body.categorySlug === 'string' && isInsightCategory(body.categorySlug)
      ? body.categorySlug
      : existing.categorySlug;

  try {
    const { article: updated, previousSlug } = await saveCmsArticle({
      id: existing.id,
      locale: existing.locale,
      translationGroupId: existing.translationGroupId,
      slug: typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : existing.slug,
      title:
        typeof body.title === 'string' && body.title.trim() ? body.title.trim() : existing.title,
      dek: typeof body.dek === 'string' && body.dek.trim() ? body.dek.trim() : existing.dek,
      status: nextStatus,
      categorySlug,
      authorId:
        typeof body.authorId === 'string' && body.authorId.trim()
          ? body.authorId.trim()
          : existing.authorId,
      reviewerId: nextStatus === 'published' ? user.id : existing.reviewerId,
      blocks: Array.isArray(body.blocks) ? (body.blocks as RichTextBlock[]) : existing.blocks,
      references: Array.isArray(body.references)
        ? (body.references as Array<{ title: string; url: string }>)
        : existing.references,
      relatedServices: Array.isArray(body.relatedServices)
        ? body.relatedServices.filter((s): s is string => typeof s === 'string')
        : existing.relatedServices,
      featured: typeof body.featured === 'boolean' ? body.featured : existing.featured,
      seo: {
        title:
          body.seoTitle === null
            ? undefined
            : typeof body.seoTitle === 'string'
              ? body.seoTitle.trim() || undefined
              : existing.seo.title,
        description:
          body.seoDescription === null
            ? undefined
            : typeof body.seoDescription === 'string'
              ? body.seoDescription.trim() || undefined
              : existing.seo.description,
      },
    });

    if (
      existing.status === 'published' ||
      updated.status === 'published' ||
      Boolean(previousSlug)
    ) {
      const paths = [
        localePath(updated.locale, `/insights/${updated.slug}`),
        ...(previousSlug ? [localePath(existing.locale, `/insights/${previousSlug}`)] : []),
      ];
      await revalidatePublicWeb(paths);
    }

    return NextResponse.json({ ok: true, article: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update article.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
