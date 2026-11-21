import { readConsent } from '@/lib/consent';

export type AnalyticsEventName =
  | 'cta_click'
  | 'project_cta_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'generate_lead'
  | 'service_view'
  | 'article_view';

export type AnalyticsPayload = Record<string, string | number | boolean>;

export type RecordedAnalyticsEvent = {
  name: AnalyticsEventName;
  payload: AnalyticsPayload;
  timestamp: string;
};

export type WebVitalsSnapshot = {
  lcpMs?: number;
  cls?: number;
  inpMs?: number;
};

declare global {
  interface Window {
    __colonyhubEvents?: RecordedAnalyticsEvent[];
    __colonyhubVitals?: WebVitalsSnapshot;
    __colonyhubConsent?: boolean;
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    va?: (command: 'event', options: { name: string; data?: AnalyticsPayload }) => void;
  }
}

function isAnalyticsConsented(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.__colonyhubConsent === false) return false;
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return false;
  const saved = readConsent();
  return Boolean(saved?.analytics);
}

function isMarketingConsented(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.__colonyhubConsent === false) return false;
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return false;
  const saved = readConsent();
  return Boolean(saved?.marketing);
}

/**
 * Privacy-first, consent-gated event emitter for GA4 (gtag), GTM (dataLayer), and Meta Pixel (fbq).
 * Never pass user emails, names, phone numbers, or free-text message content.
 */
export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload): void {
  if (typeof window === 'undefined') return;

  const entry: RecordedAnalyticsEvent = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  // Internal QA/debug buffer (zero PII)
  window.__colonyhubEvents = window.__colonyhubEvents ?? [];
  window.__colonyhubEvents.push(entry);

  if (isAnalyticsConsented()) {
    // GA4 direct gtag event
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, payload);
    }
    // Google Tag Manager dataLayer push
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: name, ...payload });
    }
    // Vercel Web Analytics (if enabled)
    if (typeof window.va === 'function') {
      window.va('event', { name, data: payload });
    }
  }

  // Meta Pixel standard event mapping (strictly gated behind Marketing consent)
  if (isMarketingConsented() && typeof window.fbq === 'function') {
    if (name === 'whatsapp_click') {
      window.fbq('track', 'Contact', { content_name: 'whatsapp' });
    } else if (name === 'email_click') {
      window.fbq('track', 'Contact', { content_name: 'email' });
    } else if (name === 'service_view') {
      window.fbq('track', 'ViewContent', {
        content_category: 'service',
        content_name: String(payload.service_slug ?? ''),
      });
    } else if (name === 'article_view') {
      window.fbq('track', 'ViewContent', {
        content_category: 'article',
        content_name: String(payload.article_slug ?? ''),
      });
    }
  }
}

/**
 * Lightweight native PerformanceObserver for Core Web Vitals p75 monitoring (FR-13).
 */
export function observeWebVitals(): () => void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  window.__colonyhubVitals = window.__colonyhubVitals ?? { cls: 0 };
  const observers: PerformanceObserver[] = [];

  try {
    const lcpObs = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last && window.__colonyhubVitals) {
        window.__colonyhubVitals.lcpMs = Math.round(last.startTime);
      }
    });
    lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
    observers.push(lcpObs);
  } catch {
    // Browser does not support LCP observer
  }

  try {
    let clsValue = 0;
    const clsObs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as Array<
        PerformanceEntry & { value?: number; hadRecentInput?: boolean }
      >) {
        if (!entry.hadRecentInput && typeof entry.value === 'number') {
          clsValue += entry.value;
          if (window.__colonyhubVitals) {
            window.__colonyhubVitals.cls = Number(clsValue.toFixed(4));
          }
        }
      }
    });
    clsObs.observe({ type: 'layout-shift', buffered: true });
    observers.push(clsObs);
  } catch {
    // Browser does not support CLS observer
  }

  return () => {
    for (const obs of observers) obs.disconnect();
  };
}
