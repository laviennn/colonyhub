import type { Metadata } from 'next';
import {
  ArticleDetailPageView,
  buildArticleMetadata,
} from '@/views/ArticleDetailPageView';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildArticleMetadata('id', slug);
}

export default async function IdArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleDetailPageView locale="id" slug={slug} />;
}
