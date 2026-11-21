import type { Metadata } from 'next';
import { ApproachPageView, buildApproachMetadata } from '@/views/ApproachPageView';

export const metadata: Metadata = buildApproachMetadata('id');

export default function IdApproachPage() {
  return <ApproachPageView locale="id" />;
}
