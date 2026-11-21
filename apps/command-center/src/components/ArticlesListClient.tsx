'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { CmsArticle, PublishStatus } from '@colonyhub/db';

const STATUS_FILTERS: Array<{ value: 'all' | PublishStatus; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'review', label: 'Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export function ArticlesListClient({ initialArticles }: { initialArticles: CmsArticle[] }) {
  const [statusFilter, setStatusFilter] = useState<'all' | PublishStatus>('all');
  const [localeFilter, setLocaleFilter] = useState<'all' | 'en' | 'id'>('all');

  const filtered = initialArticles.filter((article) => {
    if (statusFilter !== 'all' && article.status !== statusFilter) return false;
    if (localeFilter !== 'all' && article.locale !== localeFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
        <div className="cc-filters" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className="cc-pill"
              aria-pressed={statusFilter === opt.value}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="cc-filters" role="group" aria-label="Filter by language">
          {(['all', 'en', 'id'] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              className="cc-pill"
              aria-pressed={localeFilter === loc}
              onClick={() => setLocaleFilter(loc)}
            >
              {loc === 'all' ? 'EN + ID' : loc.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="cc-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ color: 'var(--slate)', marginBottom: 16 }}>
            No articles match the selected filter yet.
          </p>
          <Link href="/articles/new" className="cc-btn cc-btn--lime">
            + Create first article
          </Link>
        </div>
      ) : (
        <div className="cc-list">
          {filtered.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`} className="cc-list-row">
              <div className="cc-list-main">
                <div className="cc-list-title">{article.title}</div>
                <div className="cc-list-meta">
                  <span>{article.locale.toUpperCase()}</span>
                  <span>/insights/{article.slug}</span>
                  <span>{article.categorySlug}</span>
                  <span>
                    Updated{' '}
                    {new Date(article.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span className={`cc-badge cc-badge--${article.status}`}>{article.status}</span>
                <span aria-hidden="true" style={{ color: 'var(--slate)' }}>
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
