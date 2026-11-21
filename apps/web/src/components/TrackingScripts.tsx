'use client';

import { useEffect } from 'react';
import {
  CONSENT_CHANGED_EVENT,
  readConsent,
  type ConsentPreferences,
} from '@/lib/consent';

export type PublicTrackingConfig = {
  enabled: boolean;
  ga4MeasurementId: string;
  gtmContainerId: string;
  metaPixelId: string;
};

function ensureGtagStub(): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    // Google Consent Mode v2 default: everything denied before explicit opt-in
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });
  }
}

function injectScriptOnce(id: string, src: string): void {
  if (document.getElementById(id)) return;
  const s = document.createElement('script');
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function applyTrackingConsent(
  config: PublicTrackingConfig,
  consent: ConsentPreferences | null,
): void {
  if (!config.enabled) return;
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return;

  const analyticsGranted = Boolean(consent?.analytics);
  const marketingGranted = Boolean(consent?.marketing);

  // Google Consent Mode v2 + GA4 / GTM (Strict Opt-in: scripts load only after analytics consent)
  if (config.ga4MeasurementId || config.gtmContainerId) {
    ensureGtagStub();
    if (consent) {
      window.gtag?.('consent', 'update', {
        analytics_storage: analyticsGranted ? 'granted' : 'denied',
        ad_storage: marketingGranted ? 'granted' : 'denied',
        ad_user_data: marketingGranted ? 'granted' : 'denied',
        ad_personalization: marketingGranted ? 'granted' : 'denied',
      });
    }

    if (analyticsGranted) {
      if (config.ga4MeasurementId && !document.getElementById('colonyhub-ga4-script')) {
        injectScriptOnce(
          'colonyhub-ga4-script',
          `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`,
        );
        window.gtag?.('js', new Date());
        window.gtag?.('config', config.ga4MeasurementId, {
          anonymize_ip: true,
        });
      }

      if (config.gtmContainerId && !document.getElementById('colonyhub-gtm-script')) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
        injectScriptOnce(
          'colonyhub-gtm-script',
          `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(config.gtmContainerId)}`,
        );
      }
    }
  }

  // Meta Pixel (Strict Opt-in: script loads only after marketing consent)
  if (config.metaPixelId) {
    if (marketingGranted) {
      if (typeof window.fbq !== 'function') {
        const queue: unknown[][] = [];
        const fbqStub = (...args: unknown[]) => {
          queue.push(args);
        };
        (fbqStub as unknown as { queue?: unknown[][]; loaded?: boolean; version?: string }).queue =
          queue;
        (fbqStub as unknown as { loaded?: boolean }).loaded = true;
        (fbqStub as unknown as { version?: string }).version = '2.0';
        window.fbq = fbqStub;
      }
      if (!document.getElementById('colonyhub-meta-pixel-script')) {
        injectScriptOnce(
          'colonyhub-meta-pixel-script',
          'https://connect.facebook.net/en_US/fbevents.js',
        );
        window.fbq('consent', 'grant');
        window.fbq('init', config.metaPixelId);
        window.fbq('track', 'PageView');
      } else {
        window.fbq('consent', 'grant');
      }
    } else if (typeof window.fbq === 'function') {
      window.fbq('consent', 'revoke');
    }
  }
}

export function TrackingScripts({ config }: { config: PublicTrackingConfig }) {
  useEffect(() => {
    applyTrackingConsent(config, readConsent());

    const onConsentChange = (e: Event) => {
      const detail = (e as CustomEvent<ConsentPreferences>).detail ?? readConsent();
      applyTrackingConsent(config, detail);
    };

    window.addEventListener(CONSENT_CHANGED_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onConsentChange);
  }, [config]);

  return null;
}
