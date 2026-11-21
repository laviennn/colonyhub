import type { Metadata } from 'next';
import {
  ContactPageView,
  buildContactMetadata,
  type ContactSearchParams,
} from '@/views/ContactPageView';

export const metadata: Metadata = buildContactMetadata('id');

export default async function IdContactPage({
  searchParams,
}: {
  searchParams: Promise<ContactSearchParams>;
}) {
  return <ContactPageView locale="id" searchParams={await searchParams} />;
}
