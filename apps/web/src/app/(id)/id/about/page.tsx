import type { Metadata } from 'next';
import { AboutPageView, buildAboutMetadata } from '@/views/AboutPageView';

export const metadata: Metadata = buildAboutMetadata('id');

export default function IdAboutPage() {
  return <AboutPageView locale="id" />;
}
