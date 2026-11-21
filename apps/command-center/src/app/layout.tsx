import type { Metadata, Viewport } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@colonyhub/ui/styles/tokens.css';
import '@colonyhub/ui/styles/base.css';
import './command-center.css';
import { NavigationLoadingOverlay } from '@/components/FullLoadingOverlay';

export const metadata: Metadata = {
  title: 'Colony Command Center | colonyhub',
  description: 'Internal editorial CMS and inquiry management for colonyhub.',
  robots: { index: false, follow: false },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Command Center',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B1230',
};

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('colonyhub_cc_theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default function CommandCenterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <NavigationLoadingOverlay />
        {children}
      </body>
    </html>
  );
}
