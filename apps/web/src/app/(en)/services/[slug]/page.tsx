import type { Metadata } from 'next';
import { COLONY_UNITS } from '@colonyhub/content';
import {
  ServiceDetailPageView,
  buildServiceDetailMetadata,
} from '@/views/ServiceDetailPageView';

export function generateStaticParams() {
  return COLONY_UNITS.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildServiceDetailMetadata('en', slug);
}

export default async function EnServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ServiceDetailPageView locale="en" slug={slug} />;
}
