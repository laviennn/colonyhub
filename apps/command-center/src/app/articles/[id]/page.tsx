import { notFound } from 'next/navigation';
import {
  getCmsArticleById,
  hasMenuPermission,
  listAllCmsArticles,
  listAuthors,
  listCategories,
} from '@colonyhub/db';
import { AppShell } from '@/components/AppShell';
import { ArticleEditorClient } from '@/components/ArticleEditorClient';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();

  if (!hasMenuPermission(user, 'insights', 'edit')) {
    return (
      <AppShell user={user}>
        <div className="cc-card">
          <p style={{ color: 'var(--cc-text-muted)' }}>
            Your role (<strong>{user.roleName}</strong>) does not have{' '}
            <span className="mono">insights:edit</span> permission.
          </p>
        </div>
      </AppShell>
    );
  }

  const { id } = await params;

  const [article, authors, categories, allArticles] = await Promise.all([
    getCmsArticleById(id),
    listAuthors(),
    listCategories(),
    listAllCmsArticles(),
  ]);

  if (!article) {
    notFound();
  }

  const otherLocale = article.locale === 'en' ? 'id' : 'en';
  const paired = allArticles.find(
    (a) => a.translationGroupId === article.translationGroupId && a.locale === otherLocale,
  );

  return (
    <AppShell user={user}>
      <ArticleEditorClient
        mode="edit"
        canPublish={hasMenuPermission(user, 'insights', 'publish')}
        authors={authors}
        categories={categories}
        initialArticle={article}
        pairedTranslation={
          paired
            ? {
                id: paired.id,
                locale: paired.locale,
                slug: paired.slug,
                status: paired.status,
              }
            : null
        }
      />
    </AppShell>
  );
}
