import type { Metadata } from 'next';
import { ApproachPageView, buildApproachMetadata } from '@/views/ApproachPageView';

export const metadata: Metadata = buildApproachMetadata('en');

export default function EnApproachPage() {
  return <ApproachPageView locale="en" />;
}
