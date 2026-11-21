import type { Metadata } from 'next';
import { ServicesPageView, buildServicesMetadata } from '@/views/ServicesPageView';

export const metadata: Metadata = buildServicesMetadata('id');

export default function IdServicesPage() {
  return <ServicesPageView locale="id" />;
}
