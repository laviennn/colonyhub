import type { Metadata } from 'next';
import {
  InsightsPageView,
  buildInsightsMetadata,
  type InsightsSearchParams,
} from '@/views/InsightsPageView';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<InsightsSearchParams>;
}): Promise<Metadata> {
  return buildInsightsMetadata('id', await searchParams);
}

export default async function IdInsightsPage({
  searchParams,
}: {
  searchParams: Promise<InsightsSearchParams>;
}) {
  return <InsightsPageView locale="id" searchParams={await searchParams} />;
}
