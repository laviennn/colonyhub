'use client';

import { useEffect } from 'react';
import type { Locale } from '@colonyhub/content';
import {
  observeWebVitals,
  trackEvent,
  type AnalyticsEventName,
  type AnalyticsPayload,
} from '@/lib/analytics';

export function AnalyticsBridge({ locale }: { locale: Locale }) {
  useEffect(() => {
    const stopVitals = observeWebVitals();

    const handleClick = (event: MouseEvent) => {
      const el =
        event.target instanceof Element
          ? event.target.closest('a[href], button[data-cta-id]')
          : null;
      if (!el) return;

      const href = el.getAttribute('href') || '';
      const ctaId = el.getAttribute('data-cta-id') || '';
      const ctaLocation = el.getAttribute('data-cta-location') || 'page';
      const label = (el.textContent || '').trim().slice(0, 60);

      // 1. WhatsApp direct lead click
      if (href.startsWith('https://wa.me/')) {
        trackEvent('whatsapp_click', {
          locale,
          cta_id: ctaId || 'whatsapp_link',
          location: ctaLocation,
        });
        trackEvent('generate_lead', {
          locale,
          method: 'whatsapp',
          location: ctaLocation,
        });
        return;
      }

      // 2. Email direct lead click
      if (href.startsWith('mailto:')) {
        trackEvent('email_click', {
          locale,
          cta_id: ctaId || 'email_link',
          location: ctaLocation,
        });
        trackEvent('generate_lead', {
          locale,
          method: 'email',
          location: ctaLocation,
        });
        return;
      }

      // 3. Explicit CTA or /contact navigation button
      if (ctaId || href.includes('/contact')) {
        trackEvent('cta_click', {
          locale,
          cta_id: ctaId || 'contact_cta',
          cta_label: label,
          cta_location: ctaLocation,
          target_url: href,
        });
        if (href.includes('/contact')) {
          trackEvent('project_cta_click', {
            locale,
            cta_id: ctaId || 'contact_cta',
            target: href,
          });
        }
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => {
      stopVitals();
      document.removeEventListener('click', handleClick);
    };
  }, [locale]);

  return null;
}

export function TrackPageEvent({
  name,
  payload,
}: {
  name: Extract<AnalyticsEventName, 'service_view' | 'article_view'>;
  payload: AnalyticsPayload;
}) {
  const serialized = JSON.stringify(payload);
  useEffect(() => {
    trackEvent(name, JSON.parse(serialized) as AnalyticsPayload);
  }, [name, serialized]);

  return null;
}
