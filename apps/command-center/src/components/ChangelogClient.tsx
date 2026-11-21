'use client';

import { useState } from 'react';
import type { ChangelogEntry, ChangelogScope } from '@/lib/changelog-data';

type FilterOption = {
  value: 'all' | ChangelogScope;
  label: string;
};

const FILTERS: readonly FilterOption[] = [
  { value: 'all', label: 'All releases' },
  { value: 'public-site', label: 'Public Site' },
  { value: 'command-center', label: 'Command Center' },
  { value: 'seo-analytics', label: 'SEO & Analytics' },
];

function badgeClassForScope(scope: ChangelogScope): string {
  switch (scope) {
    case 'seo-analytics':
      return 'cc-badge cc-badge--published';
    case 'command-center':
      return 'cc-badge cc-badge--contacted';
    case 'public-site':
      return 'cc-badge cc-badge--review';
  }
}

export function ChangelogClient({ entries }: { entries: readonly ChangelogEntry[] }) {
  const [scopeFilter, setScopeFilter] = useState<'all' | ChangelogScope>('all');

  const filtered =
    scopeFilter === 'all' ? entries : entries.filter((entry) => entry.scope === scopeFilter);

  const totalItems = entries.reduce((sum, entry) => sum + entry.changes.length, 0);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className="cc-changelog-summary">
        <div className="cc-kpi">
          <span className="cc-kpi-label">Latest release</span>
          <span className="cc-kpi-value">{entries[0]?.version ?? 'v0.1'}</span>
        </div>
        <div className="cc-kpi">
          <span className="cc-kpi-label">Milestones shipped</span>
          <span className="cc-kpi-value">{entries.length}</span>
        </div>
        <div className="cc-kpi">
          <span className="cc-kpi-label">Logged changes</span>
          <span className="cc-kpi-value">{totalItems}</span>
        </div>
      </div>

      <div className="cc-filters" role="group" aria-label="Filter changelog by area">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className="cc-pill"
            aria-pressed={scopeFilter === filter.value}
            onClick={() => setScopeFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="cc-changelog-list">
        {filtered.map((entry) => (
          <article key={entry.version} className="cc-card cc-changelog-card">
            <header className="cc-changelog-head">
              <div className="cc-changelog-meta">
                <span className="cc-changelog-version mono">{entry.version}</span>
                <time dateTime={entry.date} className="cc-changelog-date mono">
                  {entry.dateLabel}
                </time>
                <span className={badgeClassForScope(entry.scope)}>{entry.scopeLabel}</span>
              </div>
              <h2 className="cc-changelog-title">{entry.title}</h2>
              <p className="cc-changelog-summary-text">{entry.summary}</p>
            </header>

            <ul className="cc-changelog-bullets">
              {entry.changes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
