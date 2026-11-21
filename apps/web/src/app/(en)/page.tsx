import type { Metadata } from 'next';
import { HomePageView, buildHomeMetadata } from '@/views/HomePageView';

export const metadata: Metadata = buildHomeMetadata('en');

export default function EnHomePage() {
  return <HomePageView locale="en" />;
}
