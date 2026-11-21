'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { COLONY_UNITS, type Locale, type RichTextBlock } from '@colonyhub/content';
import type {
  AuthorRecord,
  CategoryRecord,
  CmsArticle,
  PublishStatus,
} from '@colonyhub/db';

type ArticleEditorProps = {
  mode: 'create' | 'edit';
  canPublish: boolean;
  authors: AuthorRecord[];
  categories: CategoryRecord[];
  initialArticle?: CmsArticle;
  initialLocale?: Locale;
  initialTranslationGroupId?: string;
  pairedTranslation?: { id: string; locale: Locale; slug: string; status: PublishStatus } | null;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

export function ArticleEditorClient({
  mode,
  canPublish,
  authors,
  categories,
  initialArticle,
  initialLocale = 'en',
  initialTranslationGroupId,
  pairedTranslation,
}: ArticleEditorProps) {
  const router = useRouter();

  const [mobileTab, setMobileTab] = useState<'write' | 'meta'>('write');
  const [locale, setLocale] = useState<Locale>(initialArticle?.locale ?? initialLocale);
  const [title, setTitle] = useState(initialArticle?.title ?? '');
  const [slug, setSlug] = useState(initialArticle?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [dek, setDek] = useState(initialArticle?.dek ?? '');
  const [categorySlug, setCategorySlug] = useState(
    initialArticle?.categorySlug ?? categories[0]?.slug ?? 'strategy',
  );
  const [authorId, setAuthorId] = useState(initialArticle?.authorId ?? authors[0]?.id ?? '');
  const [featured, setFeatured] = useState(initialArticle?.featured ?? false);
  const [relatedServices, setRelatedServices] = useState<string[]>(
    initialArticle?.relatedServices ?? [],
  );
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seo?.title ?? '');
  const [seoDescription, setSeoDescription] = useState(initialArticle?.seo?.description ?? '');
  const [blocks, setBlocks] = useState<RichTextBlock[]>(
    initialArticle?.blocks && initialArticle.blocks.length > 0
      ? initialArticle.blocks
      : [{ type: 'p', text: '' }],
  );
  const [references, setReferences] = useState<Array<{ title: string; url: string }>>(
    initialArticle?.references ?? [],
  );

  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugTouched) {
      setSlug(slugify(val));
    }
  };

  const toggleService = (s: string) => {
    setRelatedServices((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s],
    );
  };

  const addBlock = (type: RichTextBlock['type']) => {
    if (type === 'h2') setBlocks((b) => [...b, { type: 'h2', text: '' }]);
    else if (type === 'h3') setBlocks((b) => [...b, { type: 'h3', text: '' }]);
    else if (type === 'p') setBlocks((b) => [...b, { type: 'p', text: '' }]);
    else if (type === 'ul') setBlocks((b) => [...b, { type: 'ul', items: [''] }]);
    else if (type === 'quote') setBlocks((b) => [...b, { type: 'quote', text: '', cite: '' }]);
    else if (type === 'code') setBlocks((b) => [...b, { type: 'code', language: 'ts', code: '' }]);
    else if (type === 'figure') setBlocks((b) => [...b, { type: 'figure', src: '', alt: '', caption: '', width: 1200, height: 675 }]);
  };

  const updateBlock = (index: number, next: RichTextBlock) => {
    setBlocks((prev) => prev.map((item, i) => (i === index ? next : item)));
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const saveArticle = async (targetStatus: PublishStatus) => {
    if (saving) return;
    setMessage(null);

    const cleanSlug = slugify(slug || title);
    if (!title.trim() || !cleanSlug || !dek.trim()) {
      setMessage({ kind: 'error', text: 'Title, slug, and summary (dek) are required.' });
      return;
    }

    // Enforce alt text on any figure block (accessibility bar)
    for (const block of blocks) {
      if (block.type === 'figure' && (!block.src.trim() || !block.alt.trim())) {
        setMessage({ kind: 'error', text: 'Every image figure block requires both URL and alt text.' });
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        translationGroupId: initialArticle?.translationGroupId ?? initialTranslationGroupId,
        locale,
        slug: cleanSlug,
        title: title.trim(),
        dek: dek.trim(),
        categorySlug,
        authorId: authorId || null,
        featured,
        relatedServices,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
        blocks,
        references: references.filter((r) => r.title.trim() && r.url.trim()),
        status: targetStatus,
      };

      const url = mode === 'create' ? '/api/articles' : `/api/articles/${initialArticle!.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        article?: CmsArticle;
      };

      if (!res.ok || !data.ok || !data.article) {
        setMessage({ kind: 'error', text: data.error || 'Failed to save article.' });
        return;
      }

      setMessage({
        kind: 'ok',
        text: `Saved (${data.article.status.toUpperCase()}) — /insights/${data.article.slug}`,
      });

      if (mode === 'create') {
        router.push(`/articles/${data.article.id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch {
      setMessage({ kind: 'error', text: 'Network error while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenPreview = async () => {
    if (!initialArticle || previewLoading) return;
    setPreviewLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/articles/${initialArticle.id}/preview`, {
        method: 'POST',
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        previewUrl?: string;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.previewUrl) {
        setMessage({ kind: 'error', text: data.error || 'Could not create preview link.' });
        return;
      }
      setPreviewUrl(data.previewUrl);
    } catch {
      setMessage({ kind: 'error', text: 'Network error creating preview link.' });
    } finally {
      setPreviewLoading(false);
    }
  };

  const otherLocale: Locale = locale === 'en' ? 'id' : 'en';

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Action Header */}
      <div className="cc-page-head">
        <div>
          <Link
            href="/articles"
            className="mono"
            style={{ fontSize: '0.78rem', color: 'var(--indigo)', display: 'inline-block', marginBottom: 6 }}
          >
            ← Back to Insights
          </Link>
          <h1>{mode === 'create' ? 'New Insight Article' : title || 'Edit Article'}</h1>
          {initialArticle ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span className={`cc-badge cc-badge--${initialArticle.status}`}>
                {initialArticle.status}
              </span>
              <span className="cc-badge">{initialArticle.locale.toUpperCase()}</span>
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>
                /insights/{initialArticle.slug}
              </span>
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {mode === 'edit' ? (
            <button
              type="button"
              className="cc-btn cc-btn--ghost"
              onClick={handleOpenPreview}
              disabled={previewLoading}
            >
              {previewLoading ? 'Generating...' : 'Private Preview'}
            </button>
          ) : null}

          <button
            type="button"
            className="cc-btn cc-btn--ghost"
            onClick={() => saveArticle('draft')}
            disabled={saving}
          >
            Save Draft
          </button>

          <button
            type="button"
            className="cc-btn cc-btn--navy"
            onClick={() => saveArticle('review')}
            disabled={saving}
          >
            Submit Review
          </button>

          {canPublish ? (
            <button
              type="button"
              className="cc-btn cc-btn--lime"
              onClick={() => saveArticle('published')}
              disabled={saving}
            >
              Publish Live
            </button>
          ) : null}

          {canPublish && initialArticle?.status === 'published' ? (
            <button
              type="button"
              className="cc-btn cc-btn--danger"
              onClick={() => saveArticle('archived')}
              disabled={saving}
            >
              Unpublish
            </button>
          ) : null}
        </div>
      </div>

      {message ? (
        <div
          className={`cc-alert ${message.kind === 'error' ? 'cc-alert--error' : 'cc-alert--ok'}`}
          role="status"
        >
          {message.text}
        </div>
      ) : null}

      {previewUrl ? (
        <div className="cc-alert cc-alert--ok" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span>Signed private preview link ready (valid 30 min, noindex).</span>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cc-btn cc-btn--navy cc-btn--sm"
          >
            Open Private Preview ↗
          </a>
        </div>
      ) : null}

      {/* Mobile Native Segmented Control */}
      <div className="cc-editor-mobile-tabs" role="tablist" aria-label="Editor sections">
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'write'}
          className={`cc-btn cc-btn--sm ${mobileTab === 'write' ? 'cc-btn--navy' : 'cc-btn--ghost'}`}
          onClick={() => setMobileTab('write')}
        >
          Write Content
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'meta'}
          className={`cc-btn cc-btn--sm ${mobileTab === 'meta' ? 'cc-btn--navy' : 'cc-btn--ghost'}`}
          onClick={() => setMobileTab('meta')}
        >
          Metadata & SEO
        </button>
      </div>

      <div className="cc-editor-grid">
        {/* Left Column: Writing Canvas */}
        <div
          className={`cc-card ${mobileTab === 'meta' ? 'cc-editor-panel--hidden-mobile' : ''}`}
          style={{ display: 'grid', gap: 18 }}
        >
          <div className="cc-field">
            <label htmlFor="ed-title">Title *</label>
            <input
              id="ed-title"
              className="cc-input"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Clear, specific headline in sentence case"
            />
          </div>

          <div className="cc-field">
            <label htmlFor="ed-dek">Summary (Dek) *</label>
            <textarea
              id="ed-dek"
              className="cc-textarea"
              style={{ minHeight: 84 }}
              value={dek}
              onChange={(e) => setDek(e.target.value)}
              placeholder="2-sentence executive summary shown on cards and top of article."
            />
          </div>

          {/* Structured Content Blocks */}
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <strong style={{ fontSize: '0.875rem' }}>Content Blocks ({blocks.length})</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(['h2', 'h3', 'p', 'ul', 'quote', 'code', 'figure'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="cc-btn cc-btn--ghost cc-btn--sm"
                    onClick={() => addBlock(t)}
                  >
                    + {t.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {blocks.map((block, index) => (
              <div key={index} className="cc-block-card">
                <div className="cc-block-head">
                  <span className="cc-badge">{block.type}</span>
                  <button
                    type="button"
                    className="cc-btn cc-btn--danger cc-btn--sm"
                    onClick={() => removeBlock(index)}
                  >
                    Remove
                  </button>
                </div>

                {block.type === 'h2' || block.type === 'h3' ? (
                  <input
                    className="cc-input"
                    value={block.text}
                    onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                    placeholder={block.type === 'h2' ? 'Section heading (H2)' : 'Subheading (H3)'}
                  />
                ) : null}

                {block.type === 'p' ? (
                  <textarea
                    className="cc-textarea"
                    value={block.text}
                    onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                    placeholder="Write paragraph..."
                  />
                ) : null}

                {block.type === 'ul' ? (
                  <textarea
                    className="cc-textarea"
                    value={block.items.join('\n')}
                    onChange={(e) =>
                      updateBlock(index, {
                        type: 'ul',
                        items: e.target.value.split('\n'),
                      })
                    }
                    placeholder="One bullet point per line"
                  />
                ) : null}

                {block.type === 'quote' ? (
                  <div style={{ display: 'grid', gap: 8 }}>
                    <textarea
                      className="cc-textarea"
                      style={{ minHeight: 72 }}
                      value={block.text}
                      onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                      placeholder="Pull quote text"
                    />
                    <input
                      className="cc-input"
                      value={block.cite ?? ''}
                      onChange={(e) => updateBlock(index, { ...block, cite: e.target.value })}
                      placeholder="Citation / attribution (optional)"
                    />
                  </div>
                ) : null}

                {block.type === 'code' ? (
                  <div style={{ display: 'grid', gap: 8 }}>
                    <input
                      className="cc-input"
                      value={block.language ?? ''}
                      onChange={(e) => updateBlock(index, { ...block, language: e.target.value })}
                      placeholder="Language (e.g. ts, sql, bash)"
                    />
                    <textarea
                      className="cc-textarea mono"
                      value={block.code}
                      onChange={(e) => updateBlock(index, { ...block, code: e.target.value })}
                      placeholder="Code snippet..."
                    />
                  </div>
                ) : null}

                {block.type === 'figure' ? (
                  <div style={{ display: 'grid', gap: 8 }}>
                    <input
                      className="cc-input"
                      value={block.src}
                      onChange={(e) => updateBlock(index, { ...block, src: e.target.value })}
                      placeholder="Image URL (https://... or /images/...)"
                    />
                    <input
                      className="cc-input"
                      value={block.alt}
                      onChange={(e) => updateBlock(index, { ...block, alt: e.target.value })}
                      placeholder="Descriptive alt text (required for WCAG AA)"
                    />
                    <input
                      className="cc-input"
                      value={block.caption ?? ''}
                      onChange={(e) => updateBlock(index, { ...block, caption: e.target.value })}
                      placeholder="Caption (optional)"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* References */}
          <div style={{ display: 'grid', gap: 10, paddingTop: 12, borderTop: '1px solid var(--mist)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.875rem' }}>Sources & References</strong>
              <button
                type="button"
                className="cc-btn cc-btn--ghost cc-btn--sm"
                onClick={() => setReferences((r) => [...r, { title: '', url: '' }])}
              >
                + Add Source
              </button>
            </div>
            {references.map((ref, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8 }}>
                <input
                  className="cc-input"
                  value={ref.title}
                  onChange={(e) =>
                    setReferences((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, title: e.target.value } : item)),
                    )
                  }
                  placeholder="Source title"
                />
                <input
                  className="cc-input"
                  value={ref.url}
                  onChange={(e) =>
                    setReferences((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, url: e.target.value } : item)),
                    )
                  }
                  placeholder="https://..."
                />
                <button
                  type="button"
                  className="cc-btn cc-btn--danger cc-btn--sm"
                  onClick={() => setReferences((prev) => prev.filter((_, i) => i !== idx))}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Metadata, Translation Pairing & SEO */}
        <aside
          className={`cc-card ${mobileTab === 'write' ? 'cc-editor-panel--hidden-mobile' : ''}`}
          style={{ display: 'grid', gap: 16 }}
        >
          <h2 className="cc-card-title">Publishing & SEO</h2>

          <div className="cc-field">
            <label htmlFor="ed-locale">Locale</label>
            <select
              id="ed-locale"
              className="cc-select"
              value={locale}
              disabled={mode === 'edit'}
              onChange={(e) => setLocale(e.target.value === 'id' ? 'id' : 'en')}
            >
              <option value="en">English (EN)</option>
              <option value="id">Bahasa Indonesia (ID)</option>
            </select>
          </div>

          <div className="cc-field">
            <label htmlFor="ed-slug">URL Slug *</label>
            <input
              id="ed-slug"
              className="cc-input mono"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="article-url-slug"
            />
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--slate)' }}>
              Changing a published slug automatically records a 308 redirect.
            </span>
          </div>

          <div className="cc-field">
            <label htmlFor="ed-category">Category</label>
            <select
              id="ed-category"
              className="cc-select"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value as typeof categorySlug)}
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.nameEn} / {cat.nameId}
                </option>
              ))}
            </select>
          </div>

          <div className="cc-field">
            <label htmlFor="ed-author">Author</label>
            <select
              id="ed-author"
              className="cc-select"
              value={authorId}
              onChange={(e) => setAuthorId(e.target.value)}
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.displayName}
                </option>
              ))}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              style={{ width: 18, height: 18 }}
            />
            <span>Feature on Insights index</span>
          </label>

          {/* Translation Pairing */}
          {mode === 'edit' && initialArticle ? (
            <div
              style={{
                padding: 12,
                borderRadius: 'var(--r-sm)',
                background: 'var(--cloud)',
                border: '1px solid var(--mist)',
                display: 'grid',
                gap: 8,
              }}
            >
              <strong style={{ fontSize: '0.8125rem' }}>
                {otherLocale.toUpperCase()} Translation
              </strong>
              {pairedTranslation ? (
                <Link
                  href={`/articles/${pairedTranslation.id}`}
                  className="cc-btn cc-btn--ghost cc-btn--sm"
                >
                  Open {pairedTranslation.locale.toUpperCase()} ({pairedTranslation.status}) →
                </Link>
              ) : (
                <Link
                  href={`/articles/new?locale=${otherLocale}&group=${encodeURIComponent(initialArticle.translationGroupId)}`}
                  className="cc-btn cc-btn--navy cc-btn--sm"
                >
                  + Create {otherLocale.toUpperCase()} Translation
                </Link>
              )}
            </div>
          ) : null}

          <div className="cc-field">
            <label>Related Colony Units</label>
            <div style={{ display: 'grid', gap: 6 }}>
              {COLONY_UNITS.map((unit) => (
                <label
                  key={unit.slug}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}
                >
                  <input
                    type="checkbox"
                    checked={relatedServices.includes(unit.slug)}
                    onChange={() => toggleService(unit.slug)}
                  />
                  <span>{unit.officialName}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="cc-field" style={{ paddingTop: 10, borderTop: '1px solid var(--mist)' }}>
            <label htmlFor="ed-seo-title">SEO Title Override</label>
            <input
              id="ed-seo-title"
              className="cc-input"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Defaults to: Article Title | colonyhub"
            />
          </div>

          <div className="cc-field">
            <label htmlFor="ed-seo-desc">Meta Description Override</label>
            <textarea
              id="ed-seo-desc"
              className="cc-textarea"
              style={{ minHeight: 80 }}
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Defaults to article summary (dek)"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
