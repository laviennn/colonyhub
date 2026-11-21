import type { Metadata } from 'next';
import { ServicesPageView, buildServicesMetadata } from '@/views/ServicesPageView';

export const metadata: Metadata = buildServicesMetadata('en');

export default function EnServicesPage() {
  return <ServicesPageView locale="en" />;
}
