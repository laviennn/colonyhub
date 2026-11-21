import { getDictionary, type Locale } from '@colonyhub/content';
import { getTrackingSettings } from '@colonyhub/db';
import { HubMarkDefs, PageRules } from '@colonyhub/ui';
import { AnalyticsBridge } from '@/components/AnalyticsBridge';
import { CookieConsent } from '@/components/CookieConsent';
import { TrackingScripts } from '@/components/TrackingScripts';
import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@colonyhub/ui/styles/tokens.css';
import '@colonyhub/ui/styles/base.css';
import '@colonyhub/ui/styles/homepage.css';
import '@colonyhub/ui/styles/pages.css';

export async function LocaleShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const tracking = await getTrackingSettings();

  return (
    <html lang={locale}>
      <body>
        <HubMarkDefs />
        <PageRules />
        <a className="skip-link" href="#main">
          {dict.skip}
        </a>
        <TrackingScripts
          config={{
            enabled: tracking.enabled,
            ga4MeasurementId: tracking.ga4MeasurementId,
            gtmContainerId: tracking.gtmContainerId,
            metaPixelId: tracking.metaPixelId,
          }}
        />
        <AnalyticsBridge locale={locale} />
        {children}
        <CookieConsent locale={locale} />
      </body>
    </html>
  );
}
