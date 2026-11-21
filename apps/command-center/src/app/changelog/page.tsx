import { hasMenuPermission, listAllCmsArticles } from '@colonyhub/db';
import { AppShell } from '@/components/AppShell';
import { ChangelogClient } from '@/components/ChangelogClient';
import { CHANGELOG_ENTRIES } from '@/lib/changelog-data';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function ChangelogPage() {
  const user = await requireUser();

  if (!hasMenuPermission(user, 'changelog', 'view')) {
    return (
      <AppShell user={user}>
        <div className="cc-page-head">
          <div>
            <h1>Changelog</h1>
            <p className="cc-page-sub">Access restricted by your role permissions.</p>
          </div>
        </div>
        <div className="cc-card">
          <p style={{ color: 'var(--cc-text-muted)' }}>
            Your current role (<strong>{user.roleName}</strong>) does not have{' '}
            <span className="mono">changelog:view</span> permission.
          </p>
        </div>
      </AppShell>
    );
  }

  const articles = hasMenuPermission(user, 'insights', 'view') ? await listAllCmsArticles() : [];
  const reviewCount = articles.filter((a) => a.status === 'review').length;

  return (
    <AppShell user={user} reviewArticleCount={reviewCount}>
      <div className="cc-page-head">
        <div>
          <h1>Changelog</h1>
          <p className="cc-page-sub">
            Concise record of verified changes shipped across colonyhub.id and Colony Command
            Center.
          </p>
        </div>
      </div>

      <ChangelogClient entries={CHANGELOG_ENTRIES} />
    </AppShell>
  );
}
