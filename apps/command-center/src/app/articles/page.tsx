import Link from 'next/link';
import { hasMenuPermission, listAllCmsArticles } from '@colonyhub/db';
import { AppShell } from '@/components/AppShell';
import { ArticlesListClient } from '@/components/ArticlesListClient';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const user = await requireUser();

  if (!hasMenuPermission(user, 'insights', 'view')) {
    return (
      <AppShell user={user}>
        <div className="cc-page-head">
          <div>
            <h1>Insights</h1>
            <p className="cc-page-sub">Access restricted by your role permissions.</p>
          </div>
        </div>
        <div className="cc-card">
          <p style={{ color: 'var(--cc-text-muted)' }}>
            Your current role (<strong>{user.roleName}</strong>) does not have{' '}
            <span className="mono">insights:view</span> permission.
          </p>
        </div>
      </AppShell>
    );
  }

  const articles = await listAllCmsArticles();
  const reviewCount = articles.filter((a) => a.status === 'review').length;
  const canCreate = hasMenuPermission(user, 'insights', 'create');

  return (
    <AppShell user={user} reviewArticleCount={reviewCount}>
      <div className="cc-page-head">
        <div>
          <h1>Insights</h1>
          <p className="cc-page-sub">
            Draft, review, and publish bilingual articles without redeploying the public site.
          </p>
        </div>
        {canCreate ? (
          <Link href="/articles/new" className="cc-btn cc-btn--lime">
            + New Article
          </Link>
        ) : null}
      </div>

      <ArticlesListClient initialArticles={articles} />
    </AppShell>
  );
}
