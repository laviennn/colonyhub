import Link from 'next/link';
import {
  getTrackingSettings,
  hasMenuPermission,
  listAllCmsArticles,
} from '@colonyhub/db';
import { AppShell } from '@/components/AppShell';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const user = await requireUser();
  const canViewInsights = hasMenuPermission(user, 'insights', 'view');
  const canCreateInsights = hasMenuPermission(user, 'insights', 'create');
  const canViewTracking = hasMenuPermission(user, 'tracking', 'view');

  const [articles, tracking] = await Promise.all([
    canViewInsights ? listAllCmsArticles() : Promise.resolve([]),
    canViewTracking ? getTrackingSettings() : Promise.resolve(null),
  ]);

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const reviewArticles = articles.filter((a) => a.status === 'review');

  const activeIntegrations = tracking && tracking.enabled
    ? [
        tracking.ga4MeasurementId ? 'GA4' : null,
        tracking.gtmContainerId ? 'GTM' : null,
        tracking.metaPixelId ? 'Meta Pixel' : null,
      ].filter((x): x is string => Boolean(x))
    : [];

  return (
    <AppShell user={user} reviewArticleCount={reviewArticles.length}>
      <div className="cc-page-head">
        <div>
          <h1>Overview</h1>
          <p className="cc-page-sub">
            Signed in as <strong>{user.displayName}</strong> ({user.roleName})
          </p>
        </div>
        {canCreateInsights ? (
          <Link href="/articles/new" className="cc-btn cc-btn--lime">
            + New Article
          </Link>
        ) : null}
      </div>

      <section className="cc-kpi-grid" aria-label="Workspace summary">
        <div className="cc-kpi">
          <span className="cc-kpi-label">Published</span>
          <span className="cc-kpi-value">{canViewInsights ? publishedCount : '—'}</span>
        </div>
        <div className="cc-kpi">
          <span className="cc-kpi-label">In Review</span>
          <span className="cc-kpi-value">{canViewInsights ? reviewArticles.length : '—'}</span>
        </div>
        <div className="cc-kpi">
          <span className="cc-kpi-label">Drafts</span>
          <span className="cc-kpi-value">{canViewInsights ? draftCount : '—'}</span>
        </div>
        <div className="cc-kpi">
          <span className="cc-kpi-label">Active Trackers</span>
          <span className="cc-kpi-value">{canViewTracking ? activeIntegrations.length : '—'}</span>
        </div>
      </section>

      <div className="cc-overview-grid">
        <section className="cc-card">
          <div className="cc-card-head">
            <h2 className="cc-card-title">Needs Review</h2>
            {canViewInsights ? (
              <Link href="/articles" className="mono" style={{ fontSize: '0.78rem', color: 'var(--cc-accent-link)' }}>
                View all →
              </Link>
            ) : null}
          </div>
          {!canViewInsights ? (
            <p style={{ color: 'var(--cc-text-muted)', fontSize: '0.9rem' }}>
              Your role does not have Insights menu access.
            </p>
          ) : reviewArticles.length === 0 ? (
            <p style={{ color: 'var(--cc-text-muted)', fontSize: '0.9rem' }}>
              No articles waiting for review right now.
            </p>
          ) : (
            <div className="cc-list">
              {reviewArticles.slice(0, 5).map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`} className="cc-list-row">
                  <div className="cc-list-main">
                    <div className="cc-list-title">{article.title}</div>
                    <div className="cc-list-meta">
                      <span>{article.locale.toUpperCase()}</span>
                      <span>/insights/{article.slug}</span>
                    </div>
                  </div>
                  <span className="cc-badge cc-badge--review">review</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="cc-card">
          <div className="cc-card-head">
            <h2 className="cc-card-title">Tracking Status</h2>
            {canViewTracking ? (
              <Link href="/tracking" className="mono" style={{ fontSize: '0.78rem', color: 'var(--cc-accent-link)' }}>
                Configure →
              </Link>
            ) : null}
          </div>
          {!canViewTracking ? (
            <p style={{ color: 'var(--cc-text-muted)', fontSize: '0.9rem' }}>
              Your role does not have Tracking menu access.
            </p>
          ) : activeIntegrations.length === 0 ? (
            <p style={{ color: 'var(--cc-text-muted)', fontSize: '0.9rem' }}>
              No tracking IDs configured yet. Add your GA4, GTM, or Meta Pixel ID in Tracking to
              sync live to colonyhub.id.
            </p>
          ) : (
            <div className="cc-list">
              {activeIntegrations.map((name) => (
                <div key={name} className="cc-list-row">
                  <div className="cc-list-main">
                    <div className="cc-list-title">{name}</div>
                    <div className="cc-list-meta">
                      <span>Consent-gated · synced to colonyhub.id</span>
                    </div>
                  </div>
                  <span className="cc-badge cc-badge--published">active</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
