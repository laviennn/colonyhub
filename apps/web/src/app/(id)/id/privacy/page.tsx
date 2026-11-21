import type { Metadata } from 'next';
import { PrivacyPageView, buildPrivacyMetadata } from '@/views/PrivacyPageView';

export const metadata: Metadata = buildPrivacyMetadata('id');

export default function IdPrivacyPage() {
  return <PrivacyPageView locale="id" />;
}
