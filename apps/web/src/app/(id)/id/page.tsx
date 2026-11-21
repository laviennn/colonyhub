import type { Metadata } from 'next';
import { HomePageView, buildHomeMetadata } from '@/views/HomePageView';

export const metadata: Metadata = buildHomeMetadata('id');

export default function IdHomePage() {
  return <HomePageView locale="id" />;
}
