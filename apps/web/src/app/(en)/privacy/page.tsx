import type { Metadata } from 'next';
import { PrivacyPageView, buildPrivacyMetadata } from '@/views/PrivacyPageView';

export const metadata: Metadata = buildPrivacyMetadata('en');

export default function EnPrivacyPage() {
  return <PrivacyPageView locale="en" />;
}
