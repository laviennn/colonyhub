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
  return buildInsightsMetadata('en', await searchParams);
}

export default async function EnInsightsPage({
  searchParams,
}: {
  searchParams: Promise<InsightsSearchParams>;
}) {
  return <InsightsPageView locale="en" searchParams={await searchParams} />;
}
