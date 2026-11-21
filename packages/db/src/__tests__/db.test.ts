import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ADMIN_MENUS,
  assignUserRole,
  authenticateUser,
  canManageInquiries,
  canManageSettings,
  canPublish,
  createInquiryRecord,
  createRole,
  deleteRole,
  getCmsArticleByLocaleSlug,
  getTrackingSettings,
  hasMenuPermission,
  hashPassword,
  listAuthors,
  listRoles,
  listUsers,
  saveCmsArticle,
  saveTrackingSettings,
  signPreviewToken,
  updateRole,
  verifyPassword,
  verifyPreviewToken,
} from '../index';

let tempFile = '';

beforeEach(() => {
  tempFile = path.join(os.tmpdir(), `colonyhub-db-test-${Date.now()}-${Math.random()}.json`);
  process.env.COLONYHUB_LOCAL_DB_PATH = tempFile;
  delete process.env.DATABASE_URL;
});

afterEach(() => {
  if (tempFile && fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
  delete process.env.COLONYHUB_LOCAL_DB_PATH;
});

describe('auth, RBAC & preview tokens', () => {
  it('hashes and verifies passwords with scrypt', () => {
    const hash = hashPassword('strong-secret-123');
    expect(verifyPassword('strong-secret-123', hash)).toBe(true);
    expect(verifyPassword('wrong-password', hash)).toBe(false);
  });

  it('enforces role boundaries accurately', () => {
    expect(canPublish('admin')).toBe(true);
    expect(canPublish('reviewer')).toBe(true);
    expect(canPublish('editor')).toBe(false);

    expect(canManageInquiries('admin')).toBe(true);
    expect(canManageInquiries('reviewer')).toBe(true);
    expect(canManageInquiries('editor')).toBe(false);

    expect(canManageSettings('admin')).toBe(true);
    expect(canManageSettings('reviewer')).toBe(false);
    expect(canManageSettings('editor')).toBe(false);
  });

  it('signs and verifies time-limited preview tokens', () => {
    const token = signPreviewToken({ locale: 'en', slug: 'my-draft', ttlSeconds: 120 });
    const verified = verifyPreviewToken(token);
    expect(verified?.locale).toBe('en');
    expect(verified?.slug).toBe('my-draft');

    const expired = signPreviewToken({ locale: 'en', slug: 'my-draft', ttlSeconds: -10 });
    expect(verifyPreviewToken(expired)).toBeNull();
    expect(verifyPreviewToken(`${token}tampered`)).toBeNull();
  });

  it('authenticates seeded local admin and rejects invalid credentials', async () => {
    const user = await authenticateUser('admin@colonyhub.local', 'colonyhub-admin-dev');
    expect(user?.role).toBe('admin');
    expect(await authenticateUser('admin@colonyhub.local', 'wrong')).toBeNull();
  });
});

describe('CMS article lifecycle & inquiry idempotency', () => {
  it('supports draft -> publish -> slug rename redirect -> unpublish cleanly', async () => {
    const authors = await listAuthors();
    const authorId = authors[0]!.id;

    // 1. Draft is hidden from public lookup, visible in draft mode
    const { article: draft } = await saveCmsArticle({
      locale: 'en',
      slug: 'cms-live-test',
      title: 'CMS Live Test',
      dek: 'Testing live CMS publishing without redeploy.',
      status: 'draft',
      categorySlug: 'engineering',
      authorId,
      blocks: [{ type: 'p', text: 'Draft body.' }],
      references: [],
      relatedServices: ['web-development'],
      featured: false,
      seo: {},
    });

    expect((await getCmsArticleByLocaleSlug('en', 'cms-live-test')).article).toBeNull();
    expect(
      (await getCmsArticleByLocaleSlug('en', 'cms-live-test', { includeDrafts: true })).article?.id,
    ).toBe(draft.id);

    // 2. Publish makes it publicly visible
    await saveCmsArticle({
      id: draft.id,
      locale: 'en',
      translationGroupId: draft.translationGroupId,
      slug: 'cms-live-test',
      title: 'CMS Live Test',
      dek: 'Testing live CMS publishing without redeploy.',
      status: 'published',
      categorySlug: 'engineering',
      authorId,
      blocks: [{ type: 'p', text: 'Published body.' }],
      references: [],
      relatedServices: ['web-development'],
      featured: false,
      seo: {},
    });
    expect((await getCmsArticleByLocaleSlug('en', 'cms-live-test')).article?.status).toBe(
      'published',
    );

    // 3. Renaming slug records old-slug redirect
    await saveCmsArticle({
      id: draft.id,
      locale: 'en',
      translationGroupId: draft.translationGroupId,
      slug: 'cms-live-test-renamed',
      title: 'CMS Live Test Renamed',
      dek: 'Testing slug redirect.',
      status: 'published',
      categorySlug: 'engineering',
      authorId,
      blocks: [{ type: 'p', text: 'Published body.' }],
      references: [],
      relatedServices: ['web-development'],
      featured: false,
      seo: {},
    });
    const oldLookup = await getCmsArticleByLocaleSlug('en', 'cms-live-test');
    expect(oldLookup.article).toBeNull();
    expect(oldLookup.redirectToSlug).toBe('cms-live-test-renamed');

    // 4. Unpublish removes both new slug and redirect
    await saveCmsArticle({
      id: draft.id,
      locale: 'en',
      translationGroupId: draft.translationGroupId,
      slug: 'cms-live-test-renamed',
      title: 'CMS Live Test Renamed',
      dek: 'Testing unpublish.',
      status: 'archived',
      categorySlug: 'engineering',
      authorId,
      blocks: [{ type: 'p', text: 'Archived body.' }],
      references: [],
      relatedServices: ['web-development'],
      featured: false,
      seo: {},
    });
    expect((await getCmsArticleByLocaleSlug('en', 'cms-live-test-renamed')).article).toBeNull();
    expect((await getCmsArticleByLocaleSlug('en', 'cms-live-test')).redirectToSlug).toBeUndefined();
  });

  it('deduplicates retried inquiries via idempotencyKey', async () => {
    const first = await createInquiryRecord({
      name: 'Siti',
      email: 'siti@example.com',
      description: 'Need help with website rebuild and technical SEO.',
      locale: 'id',
      consent: true,
      idempotencyKey: 'req-abc-123',
    });
    expect(first.deduplicated).toBe(false);

    const retry = await createInquiryRecord({
      name: 'Siti',
      email: 'siti@example.com',
      description: 'Need help with website rebuild and technical SEO.',
      locale: 'id',
      consent: true,
      idempotencyKey: 'req-abc-123',
    });
    expect(retry.deduplicated).toBe(true);
    expect(retry.inquiry.id).toBe(first.inquiry.id);
  });
});

describe('Dynamic Menu-Based RBAC (Superadmin & Auto-Menu Sync)', () => {
  it('auto-registers RBAC permissions when a new menu is added to ADMIN_MENUS (superadmin allow, custom fail-closed)', async () => {
    const extendedMenus = [
      ...ADMIN_MENUS,
      {
        key: 'projects',
        label: 'Projects',
        shortLabel: 'Projects',
        href: '/projects',
        description: 'Future portfolio showcase module.',
        actions: ['view', 'create', 'edit', 'publish', 'delete'] as const,
      },
    ];

    const syncedRoles = await listRoles(extendedMenus);
    const superadmin = syncedRoles.find((r) => r.slug === 'superadmin');
    const editor = syncedRoles.find((r) => r.slug === 'editor');

    expect(ADMIN_MENUS.some((m) => m.key === 'changelog')).toBe(true);
    expect(superadmin?.permissions.changelog?.view).toBe(true);
    expect(editor?.permissions.changelog?.view).toBe(false);

    expect(superadmin?.permissions.projects?.view).toBe(true);
    expect(superadmin?.permissions.projects?.publish).toBe(true);

    // Fail-closed: custom roles default to deny on newly added menus until granted
    expect(editor?.permissions.projects?.view).toBe(false);
    expect(editor?.permissions.projects?.create).toBe(false);
    expect(editor?.permissions.projects?.publish).toBe(false);
  });

  it('allows superadmin to create, customize, assign, and delete custom roles while protecting superadmin', async () => {
    const marketingRole = await createRole({
      name: 'Growth / Tracking',
      description: 'Views Overview and configures Tracking IDs.',
      permissions: {
        overview: { view: true },
        tracking: { view: true, edit: true },
      },
    });

    expect(marketingRole.slug).toBe('growth-tracking');
    expect(marketingRole.permissions.tracking?.view).toBe(true);
    expect(marketingRole.permissions.tracking?.edit).toBe(true);
    expect(marketingRole.permissions.insights?.view).toBe(false);
    expect(marketingRole.permissions.settings?.view).toBe(false);

    // Assign custom role to editor account
    const allUsers = await listUsers();
    const editorUser = allUsers.find((u) => u.email === 'editor@colonyhub.local')!;
    const reassigned = await assignUserRole(editorUser.id, marketingRole.id);
    expect(reassigned?.roleSlug).toBe('growth-tracking');
    expect(hasMenuPermission(reassigned, 'tracking', 'view')).toBe(true);
    expect(hasMenuPermission(reassigned, 'insights', 'view')).toBe(false);

    // Cannot delete role while assigned to a user
    await expect(deleteRole(marketingRole.id)).rejects.toThrow(/Reassign users/);

    // Update role permissions dynamically
    const updatedRole = await updateRole(marketingRole.id, {
      permissions: {
        overview: { view: true },
        tracking: { view: true, edit: true },
        insights: { view: true },
      },
    });
    expect(updatedRole?.permissions.insights?.view).toBe(true);

    // System superadmin role cannot be restricted or deleted
    const roles = await listRoles();
    const superRole = roles.find((r) => r.slug === 'superadmin')!;
    await expect(updateRole(superRole.id, { name: 'Hacked' })).rejects.toThrow(/superadmin/i);
    await expect(deleteRole(superRole.id)).rejects.toThrow(/System roles/);

    // Last superadmin cannot be demoted
    const superUser = allUsers.find((u) => u.isSuperAdmin)!;
    await expect(assignUserRole(superUser.id, marketingRole.id)).rejects.toThrow(/last Super Admin/i);

    // Reassign editor back, then delete custom role succeeds
    const editorRole = roles.find((r) => r.slug === 'editor')!;
    await assignUserRole(editorUser.id, editorRole.id);
    expect(await deleteRole(marketingRole.id)).toBe(true);
  });

  it('validates and persists GA4, GTM, and Meta Pixel IDs while rejecting malformed/XSS input', async () => {
    const initial = await getTrackingSettings();
    expect(initial.ga4MeasurementId).toBe('');

    const saved = await saveTrackingSettings(
      {
        enabled: true,
        ga4MeasurementId: 'g-abc1234567',
        gtmContainerId: 'gtm-xyz1234',
        metaPixelId: '123456789012345',
      },
      'admin@colonyhub.local',
    );
    expect(saved.ga4MeasurementId).toBe('G-ABC1234567');
    expect(saved.gtmContainerId).toBe('GTM-XYZ1234');
    expect(saved.metaPixelId).toBe('123456789012345');

    await expect(
      saveTrackingSettings({ ga4MeasurementId: '<script>alert(1)</script>' }),
    ).rejects.toThrow(/Invalid GA4/);
    await expect(saveTrackingSettings({ gtmContainerId: 'BAD-123' })).rejects.toThrow(/Invalid Google Tag Manager/);
    await expect(saveTrackingSettings({ metaPixelId: 'not-digits' })).rejects.toThrow(/Invalid Meta Pixel/);
  });
});
