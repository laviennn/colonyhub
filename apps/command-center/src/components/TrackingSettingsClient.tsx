'use client';

import { useState } from 'react';
import type { TrackingSettings } from '@colonyhub/db';

export function TrackingSettingsClient({
  initialTracking,
  canEdit,
}: {
  initialTracking: TrackingSettings;
  canEdit: boolean;
}) {
  const [enabled, setEnabled] = useState(initialTracking.enabled);
  const [ga4MeasurementId, setGa4MeasurementId] = useState(initialTracking.ga4MeasurementId);
  const [gtmContainerId, setGtmContainerId] = useState(initialTracking.gtmContainerId);
  const [metaPixelId, setMetaPixelId] = useState(initialTracking.metaPixelId);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const bothGoogleSet = Boolean(ga4MeasurementId.trim() && gtmContainerId.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit || saving) return;
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/tracking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled,
          ga4MeasurementId: ga4MeasurementId.trim(),
          gtmContainerId: gtmContainerId.trim(),
          metaPixelId: metaPixelId.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        tracking?: TrackingSettings;
        error?: string;
      };

      if (!res.ok || !data.ok || !data.tracking) {
        setFeedback({ kind: 'error', text: data.error || 'Failed to save tracking settings.' });
        return;
      }

      setEnabled(data.tracking.enabled);
      setGa4MeasurementId(data.tracking.ga4MeasurementId);
      setGtmContainerId(data.tracking.gtmContainerId);
      setMetaPixelId(data.tracking.metaPixelId);
      setFeedback({
        kind: 'ok',
        text: 'Tracking configuration saved and synced to the public site.',
      });
    } catch {
      setFeedback({ kind: 'error', text: 'Network error while saving.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
      {feedback ? (
        <div
          className={`cc-alert ${feedback.kind === 'error' ? 'cc-alert--error' : 'cc-alert--ok'}`}
          role="status"
        >
          {feedback.text}
        </div>
      ) : null}

      <section className="cc-card" style={{ display: 'grid', gap: 18 }}>
        <div className="cc-card-head" style={{ marginBottom: 0 }}>
          <div>
            <h2 className="cc-card-title">Tracking Master Switch</h2>
            <p style={{ color: 'var(--cc-text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
              All scripts use Strict Opt-in (Consent Mode v2): zero third-party tags load before a
              visitor accepts the corresponding cookie category.
            </p>
          </div>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: canEdit ? 'pointer' : 'default',
            }}
          >
            <input
              type="checkbox"
              checked={enabled}
              disabled={!canEdit}
              onChange={(e) => setEnabled(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span>{enabled ? 'Enabled' : 'Paused'}</span>
          </label>
        </div>
      </section>

      <section className="cc-card" style={{ display: 'grid', gap: 18 }}>
        <h2 className="cc-card-title">Analytics &amp; Marketing IDs</h2>

        <div className="cc-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <label htmlFor="trk-ga4">Google Analytics 4 (Measurement ID)</label>
            <span className={`cc-badge ${ga4MeasurementId.trim() ? 'cc-badge--published' : ''}`}>
              {ga4MeasurementId.trim() ? 'Configured' : 'Not set'}
            </span>
          </div>
          <input
            id="trk-ga4"
            className="cc-input mono"
            placeholder="G-XXXXXXXXXX"
            value={ga4MeasurementId}
            disabled={!canEdit}
            onChange={(e) => setGa4MeasurementId(e.target.value)}
          />
          <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--cc-text-muted)' }}>
            Receives CTA clicks (cta_click, whatsapp_click, email_click, generate_lead),
            service_view, and article_view once Analytics consent is granted.
          </span>
        </div>

        <div className="cc-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <label htmlFor="trk-gtm">Google Tag Manager (Container ID)</label>
            <span className={`cc-badge ${gtmContainerId.trim() ? 'cc-badge--published' : ''}`}>
              {gtmContainerId.trim() ? 'Configured' : 'Not set'}
            </span>
          </div>
          <input
            id="trk-gtm"
            className="cc-input mono"
            placeholder="GTM-XXXXXXX"
            value={gtmContainerId}
            disabled={!canEdit}
            onChange={(e) => setGtmContainerId(e.target.value)}
          />
          <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--cc-text-muted)' }}>
            Loads GTM with Consent Mode v2 signals and receives dataLayer events automatically.
          </span>
        </div>

        {bothGoogleSet ? (
          <div className="cc-alert" role="note">
            <strong>Double-tagging reminder:</strong> Both GA4 and GTM are set. Make sure your GTM
            container does not fire a second duplicate GA4 Configuration tag for the same
            Measurement ID.
          </div>
        ) : null}

        <div className="cc-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <label htmlFor="trk-meta">Meta Pixel ID</label>
            <span className={`cc-badge ${metaPixelId.trim() ? 'cc-badge--published' : ''}`}>
              {metaPixelId.trim() ? 'Configured' : 'Not set'}
            </span>
          </div>
          <input
            id="trk-meta"
            className="cc-input mono"
            placeholder="123456789012345"
            inputMode="numeric"
            value={metaPixelId}
            disabled={!canEdit}
            onChange={(e) => setMetaPixelId(e.target.value)}
          />
          <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--cc-text-muted)' }}>
            Digits only (8–20 digits). Loads strictly after Marketing consent is granted and tracks
            PageView, ViewContent, and Contact events.
          </span>
        </div>

        {canEdit ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 6 }}>
            <button type="submit" className="cc-btn cc-btn--lime" disabled={saving}>
              {saving ? 'Saving & syncing...' : 'Save Tracking Settings'}
            </button>
          </div>
        ) : null}
      </section>
    </form>
  );
}
