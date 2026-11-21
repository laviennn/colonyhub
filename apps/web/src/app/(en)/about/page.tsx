import type { Metadata } from 'next';
import { AboutPageView, buildAboutMetadata } from '@/views/AboutPageView';

export const metadata: Metadata = buildAboutMetadata('en');

export default function EnAboutPage() {
  return <AboutPageView locale="en" />;
}
