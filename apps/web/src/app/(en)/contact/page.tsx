import type { Metadata } from 'next';
import {
  ContactPageView,
  buildContactMetadata,
  type ContactSearchParams,
} from '@/views/ContactPageView';

export const metadata: Metadata = buildContactMetadata('en');

export default async function EnContactPage({
  searchParams,
}: {
  searchParams: Promise<ContactSearchParams>;
}) {
  return <ContactPageView locale="en" searchParams={await searchParams} />;
}
