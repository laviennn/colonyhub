import type { Locale } from '@colonyhub/content';
import { hasMenuPermission, listAuthors, listCategories } from '@colonyhub/db';
import { AppShell } from '@/components/AppShell';
import { ArticleEditorClient } from '@/components/ArticleEditorClient';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string; group?: string }>;
}) {
  const user = await requireUser();

  if (!hasMenuPermission(user, 'insights', 'create')) {
    return (
      <AppShell user={user}>
        <div className="cc-card">
          <p style={{ color: 'var(--cc-text-muted)' }}>
            Your role (<strong>{user.roleName}</strong>) does not have{' '}
            <span className="mono">insights:create</span> permission.
          </p>
        </div>
      </AppShell>
    );
  }

  const params = await searchParams;
  const initialLocale: Locale = params.locale === 'id' ? 'id' : 'en';
  const initialGroup =
    typeof params.group === 'string' && params.group.trim() ? params.group.trim() : undefined;

  const [authors, categories] = await Promise.all([listAuthors(), listCategories()]);

  return (
    <AppShell user={user}>
      <ArticleEditorClient
        mode="create"
        canPublish={hasMenuPermission(user, 'insights', 'publish')}
        authors={authors}
        categories={categories}
        initialLocale={initialLocale}
        initialTranslationGroupId={initialGroup}
      />
    </AppShell>
  );
}
