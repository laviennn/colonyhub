import type { Metadata, Viewport } from 'next';
import { LocaleShell } from '@/components/LocaleShell';
import { buildBaseLayoutMetadata } from '@/views/HomePageView';

export const viewport: Viewport = { themeColor: '#0B1230' };
export const metadata: Metadata = buildBaseLayoutMetadata();

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <LocaleShell locale="en">{children}</LocaleShell>;
}
