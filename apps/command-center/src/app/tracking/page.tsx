import { getTrackingSettings, hasMenuPermission, listAllCmsArticles } from '@colonyhub/db';
import { AppShell } from '@/components/AppShell';
import { TrackingSettingsClient } from '@/components/TrackingSettingsClient';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function TrackingPage() {
  const user = await requireUser();

  if (!hasMenuPermission(user, 'tracking', 'view')) {
    return (
      <AppShell user={user}>
        <div className="cc-page-head">
          <div>
            <h1>Tracking</h1>
            <p className="cc-page-sub">Access restricted by your role permissions.</p>
          </div>
        </div>
        <div className="cc-card">
          <p style={{ color: 'var(--cc-text-muted)' }}>
            Your current role (<strong>{user.roleName}</strong>) does not have{' '}
            <span className="mono">tracking:view</span> permission.
          </p>
        </div>
      </AppShell>
    );
  }

  const [tracking, articles] = await Promise.all([
    getTrackingSettings(),
    hasMenuPermission(user, 'insights', 'view') ? listAllCmsArticles() : Promise.resolve([]),
  ]);
  const reviewCount = articles.filter((a) => a.status === 'review').length;

  return (
    <AppShell user={user} reviewArticleCount={reviewCount}>
      <div className="cc-page-head">
        <div>
          <h1>Tracking</h1>
          <p className="cc-page-sub">
            Configure Google Analytics 4, Google Tag Manager, and Meta Pixel IDs synced live to
            colonyhub.id.
          </p>
        </div>
      </div>

      <TrackingSettingsClient
        initialTracking={tracking}
        canEdit={hasMenuPermission(user, 'tracking', 'edit')}
      />
    </AppShell>
  );
}
