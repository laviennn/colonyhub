import { NextResponse } from 'next/server';
import { getCmsArticleById, signPreviewToken } from '@colonyhub/db';
import { getPublicWebUrl } from '@/lib/revalidate-web';
import { getCurrentUser } from '@/lib/session';

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const article = await getCmsArticleById(id);
  if (!article) {
    return NextResponse.json({ ok: false, error: 'Article not found.' }, { status: 404 });
  }

  const token = signPreviewToken({
    locale: article.locale,
    slug: article.slug,
  });

  const previewUrl = `${getPublicWebUrl()}/api/preview?token=${encodeURIComponent(token)}`;
  return NextResponse.json({ ok: true, previewUrl });
}
