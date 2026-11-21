import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { and, desc, eq, gt } from 'drizzle-orm';
import {
  INSIGHT_CATEGORIES,
  type InsightCategorySlug,
  type Locale,
  type RichTextBlock,
} from '@colonyhub/content';
import { hashPassword, hashToken, verifyPassword, type UserRole } from './auth';
import { getPostgresDb, hasDatabaseUrl } from './client';
import {
  ADMIN_MENUS,
  normalizePermissionsForMenus,
  type AdminMenuDefinition,
  type MenuPermissionFlags,
} from './menus';
import {
  articleSlugRedirects,
  articles,
  authors,
  categories,
  inquiries,
  roleMenuPermissions,
  roles,
  sessions,
  siteSettings,
  users,
} from './schema';

export type PublishStatus = 'draft' | 'review' | 'published' | 'archived';
export type InquiryStatus = 'new' | 'contacted' | 'qualified' | 'archived';

export type RoleRecord = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: Record<string, MenuPermissionFlags>;
  createdAt: string;
  updatedAt: string;
};

export type UserRecord = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  roleId: string;
  roleSlug: string;
  roleName: string;
  isSuperAdmin: boolean;
  permissions: Record<string, MenuPermissionFlags>;
  mfaEnabled: boolean;
  createdAt: string;
};

export type AuthorRecord = {
  id: string;
  displayName: string;
  role: string | null;
  bio: string | null;
  consentApproved: boolean;
};

export type CategoryRecord = {
  slug: string;
  nameEn: string;
  nameId: string;
  sortOrder: number;
};

export type CmsArticle = {
  id: string;
  locale: Locale;
  translationGroupId: string;
  slug: string;
  title: string;
  dek: string;
  status: PublishStatus;
  categorySlug: InsightCategorySlug;
  authorId: string;
  authorName: string;
  authorRole: string;
  reviewerId: string | null;
  blocks: RichTextBlock[];
  references: { title: string; url: string }[];
  relatedServices: string[];
  featured: boolean;
  seo: { title?: string; description?: string };
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
};

export type InquiryRecord = {
  id: string;
  name: string;
  email: string;
  description: string;
  services: string[];
  company: string | null;
  budgetRange: string | null;
  timeline: string | null;
  locale: Locale;
  consent: boolean;
  status: InquiryStatus;
  internalNotes: string | null;
  idempotencyKey: string | null;
  submittedAt: string;
};

export type TrackingSettings = {
  enabled: boolean;
  ga4MeasurementId: string;
  gtmContainerId: string;
  metaPixelId: string;
  updatedAt: string;
};

type LocalUserRow = {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: UserRole;
  roleId?: string;
  mfaEnabled: boolean;
  createdAt: string;
};

type LocalStoreShape = {
  roles?: RoleRecord[];
  tracking?: TrackingSettings;
  users: LocalUserRow[];
  sessions: Array<{ id: string; userId: string; tokenHash: string; expiresAt: string }>;
  authors: AuthorRecord[];
  categories: CategoryRecord[];
  articles: Array<Omit<CmsArticle, 'authorName' | 'authorRole'>>;
  slugRedirects: Array<{ id: string; locale: Locale; oldSlug: string; articleId: string }>;
  inquiries: InquiryRecord[];
};

const SYSTEM_SUPERADMIN_ROLE_ID = '00000000-0000-4000-8000-000000000101';
const DEFAULT_REVIEWER_ROLE_ID = '00000000-0000-4000-8000-000000000102';
const DEFAULT_EDITOR_ROLE_ID = '00000000-0000-4000-8000-000000000103';

function createDefaultRoles(now: string): RoleRecord[] {
  return [
    {
      id: SYSTEM_SUPERADMIN_ROLE_ID,
      slug: 'superadmin',
      name: 'Super Admin',
      description: 'Unrestricted access to all current and future menus, plus role management.',
      isSystem: true,
      permissions: normalizePermissionsForMenus(undefined, { isSuperAdmin: true }),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: DEFAULT_REVIEWER_ROLE_ID,
      slug: 'reviewer',
      name: 'Reviewer',
      description: 'Reviews & publishes Insights articles.',
      isSystem: false,
      permissions: normalizePermissionsForMenus(
        {
          overview: { view: true },
          insights: { view: true, create: true, edit: true, publish: true, delete: false },
          tracking: { view: false, edit: false },
          settings: { view: false, create: false, edit: false, delete: false },
        },
        { isSuperAdmin: false },
      ),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: DEFAULT_EDITOR_ROLE_ID,
      slug: 'editor',
      name: 'Editor',
      description: 'Drafts and submits Insights articles for editorial review.',
      isSystem: false,
      permissions: normalizePermissionsForMenus(
        {
          overview: { view: true },
          insights: { view: true, create: true, edit: true, publish: false, delete: false },
          tracking: { view: false, edit: false },
          settings: { view: false, create: false, edit: false, delete: false },
        },
        { isSuperAdmin: false },
      ),
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function legacyRoleToDefaultRoleId(role: UserRole): string {
  if (role === 'admin') return SYSTEM_SUPERADMIN_ROLE_ID;
  if (role === 'reviewer') return DEFAULT_REVIEWER_ROLE_ID;
  return DEFAULT_EDITOR_ROLE_ID;
}

function resolveLocalStorePath(): string {
  if (process.env.COLONYHUB_LOCAL_DB_PATH) {
    return process.env.COLONYHUB_LOCAL_DB_PATH;
  }
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(dir, 'pnpm-workspace.yaml'))) {
      return path.join(dir, '.colonyhub-local-data.json');
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.join(process.cwd(), '.colonyhub-local-data.json');
}

function createInitialLocalStore(): LocalStoreShape {
  const now = new Date().toISOString();
  const adminId = '00000000-0000-4000-8000-000000000001';
  const reviewerId = '00000000-0000-4000-8000-000000000002';
  const editorId = '00000000-0000-4000-8000-000000000003';
  const defaultAuthorId = '00000000-0000-4000-8000-000000000010';

  return {
    roles: createDefaultRoles(now),
    users: [
      {
        id: adminId,
        email: 'admin@colonyhub.local',
        passwordHash: hashPassword('colonyhub-admin-dev'),
        displayName: 'Colony Superadmin',
        role: 'admin',
        roleId: SYSTEM_SUPERADMIN_ROLE_ID,
        mfaEnabled: false,
        createdAt: now,
      },
      {
        id: reviewerId,
        email: 'reviewer@colonyhub.local',
        passwordHash: hashPassword('colonyhub-reviewer-dev'),
        displayName: 'Editorial Reviewer',
        role: 'reviewer',
        roleId: DEFAULT_REVIEWER_ROLE_ID,
        mfaEnabled: false,
        createdAt: now,
      },
      {
        id: editorId,
        email: 'editor@colonyhub.local',
        passwordHash: hashPassword('colonyhub-editor-dev'),
        displayName: 'Content Editor',
        role: 'editor',
        roleId: DEFAULT_EDITOR_ROLE_ID,
        mfaEnabled: false,
        createdAt: now,
      },
    ],
    sessions: [],
    authors: [
      {
        id: defaultAuthorId,
        displayName: 'colonyhub Editorial',
        role: 'Strategy & Build Units',
        bio: null,
        consentApproved: true,
      },
    ],
    categories: INSIGHT_CATEGORIES.map((c, idx) => ({
      slug: c.slug,
      nameEn: c.name.en,
      nameId: c.name.id,
      sortOrder: idx,
    })),
    articles: [],
    slugRedirects: [],
    inquiries: [],
  };
}

function ensureLocalRolesSynced(
  store: LocalStoreShape,
  menus: readonly AdminMenuDefinition[] = ADMIN_MENUS,
): { store: LocalStoreShape; mutated: boolean } {
  let mutated = false;
  const now = new Date().toISOString();

  if (!store.roles || store.roles.length === 0) {
    store.roles = createDefaultRoles(now);
    mutated = true;
  }

  // Ensure every role has normalized entries for EVERY menu in ADMIN_MENUS (auto-RBAC)
  for (const role of store.roles) {
    const isSuper = role.isSystem && role.slug === 'superadmin';
    const nextPerms = normalizePermissionsForMenus(role.permissions, { isSuperAdmin: isSuper }, menus);
    if (JSON.stringify(role.permissions) !== JSON.stringify(nextPerms)) {
      role.permissions = nextPerms;
      mutated = true;
    }
  }

  // Ensure every user has a valid roleId
  for (const user of store.users) {
    if (!user.roleId || !store.roles.some((r) => r.id === user.roleId)) {
      user.roleId = legacyRoleToDefaultRoleId(user.role);
      mutated = true;
    }
  }

  return { store, mutated };
}

function readLocalStore(): LocalStoreShape {
  const filePath = resolveLocalStorePath();
  if (!fs.existsSync(filePath)) {
    const initial = createInitialLocalStore();
    writeLocalStore(initial);
    return initial;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw) as LocalStoreShape;
  const { store, mutated } = ensureLocalRolesSynced(parsed);
  if (mutated) {
    writeLocalStore(store);
  }
  return store;
}

function hydrateLocalUser(store: LocalStoreShape, u: LocalUserRow): UserRecord {
  const roleRow =
    store.roles?.find((r) => r.id === u.roleId) ??
    store.roles?.find((r) => r.id === legacyRoleToDefaultRoleId(u.role)) ??
    createDefaultRoles(u.createdAt)[2]!;
  const isSuperAdmin = roleRow.isSystem && roleRow.slug === 'superadmin';
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    role: u.role,
    roleId: roleRow.id,
    roleSlug: roleRow.slug,
    roleName: roleRow.name,
    isSuperAdmin,
    permissions: normalizePermissionsForMenus(roleRow.permissions, { isSuperAdmin }),
    mfaEnabled: u.mfaEnabled,
    createdAt: u.createdAt,
  };
}

function writeLocalStore(data: LocalStoreShape): void {
  const filePath = resolveLocalStorePath();
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmpPath, filePath);
}

function hydrateLocalArticle(
  store: LocalStoreShape,
  row: LocalStoreShape['articles'][number],
): CmsArticle {
  const author = store.authors.find((a) => a.id === row.authorId);
  return {
    ...row,
    authorName: author?.displayName ?? 'colonyhub Editorial',
    authorRole: author?.role ?? 'Editorial',
  };
}

async function hydratePostgresUser(u: typeof users.$inferSelect): Promise<UserRecord> {
  const allRoles = await listRoles();
  const matched =
    (u.roleId ? allRoles.find((r) => r.id === u.roleId) : undefined) ??
    allRoles.find((r) => r.slug === (u.role === 'admin' ? 'superadmin' : u.role)) ??
    allRoles[0]!;
  const isSuperAdmin = matched.isSystem && matched.slug === 'superadmin';
  return {
    id: u.id,
    email: u.email,
    displayName: u.displayName,
    role: u.role,
    roleId: matched.id,
    roleSlug: matched.slug,
    roleName: matched.name,
    isSuperAdmin,
    permissions: normalizePermissionsForMenus(matched.permissions, { isSuperAdmin }),
    mfaEnabled: u.mfaEnabled,
    createdAt: u.createdAt.toISOString(),
  };
}

export async function listRoles(
  menus: readonly AdminMenuDefinition[] = ADMIN_MENUS,
): Promise<RoleRecord[]> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    let roleRows = await db.select().from(roles).orderBy(roles.createdAt);
    if (roleRows.length === 0) {
      const defaults = createDefaultRoles(new Date().toISOString());
      for (const r of defaults) {
        await db
          .insert(roles)
          .values({
            id: r.id,
            slug: r.slug,
            name: r.name,
            description: r.description,
            isSystem: r.isSystem,
          })
          .onConflictDoNothing();
        for (const menu of menus) {
          const flags = r.permissions[menu.key];
          await db
            .insert(roleMenuPermissions)
            .values({
              roleId: r.id,
              menuKey: menu.key,
              canView: Boolean(flags?.view),
              canCreate: Boolean(flags?.create),
              canEdit: Boolean(flags?.edit),
              canPublish: Boolean(flags?.publish),
              canDelete: Boolean(flags?.delete),
            })
            .onConflictDoNothing();
        }
      }
      roleRows = await db.select().from(roles).orderBy(roles.createdAt);
    }

    const permRows = await db.select().from(roleMenuPermissions);
    const byRole = new Map<string, Partial<Record<string, Partial<MenuPermissionFlags>>>>();
    for (const p of permRows) {
      const map = byRole.get(p.roleId) ?? {};
      map[p.menuKey] = {
        view: p.canView,
        create: p.canCreate,
        edit: p.canEdit,
        publish: p.canPublish,
        delete: p.canDelete,
      };
      byRole.set(p.roleId, map);
    }

    // Auto-sync any newly added menu in ADMIN_MENUS to role_menu_permissions (fail-closed for non-superadmin)
    const out: RoleRecord[] = [];
    for (const r of roleRows) {
      const isSuperAdmin = r.isSystem && r.slug === 'superadmin';
      const existingMap = byRole.get(r.id) ?? {};
      for (const menu of menus) {
        if (!existingMap[menu.key]) {
          const normalized = normalizePermissionsForMenus(undefined, { isSuperAdmin }, [menu])[menu.key]!;
          await db
            .insert(roleMenuPermissions)
            .values({
              roleId: r.id,
              menuKey: menu.key,
              canView: normalized.view,
              canCreate: normalized.create,
              canEdit: normalized.edit,
              canPublish: normalized.publish,
              canDelete: normalized.delete,
            })
            .onConflictDoNothing();
          existingMap[menu.key] = normalized;
        }
      }
      out.push({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        isSystem: r.isSystem,
        permissions: normalizePermissionsForMenus(existingMap, { isSuperAdmin }, menus),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      });
    }
    return out;
  }

  const store = readLocalStore();
  const { store: synced, mutated } = ensureLocalRolesSynced(store, menus);
  if (mutated) writeLocalStore(synced);
  return synced.roles ?? [];
}

function slugifyRoleName(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export async function createRole(input: {
  name: string;
  slug?: string;
  description?: string | null;
  permissions?: Partial<Record<string, Partial<MenuPermissionFlags>>>;
}): Promise<RoleRecord> {
  const name = input.name.trim();
  const slug = slugifyRoleName(input.slug || name);
  if (!name || !slug) throw new Error('Role name is required.');
  if (slug === 'superadmin') throw new Error('The superadmin role slug is reserved.');

  const permissions = normalizePermissionsForMenus(input.permissions, { isSuperAdmin: false });
  const now = new Date();

  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const id = crypto.randomUUID();
    await db.insert(roles).values({
      id,
      slug,
      name,
      description: input.description?.trim() || null,
      isSystem: false,
      createdAt: now,
      updatedAt: now,
    });
    for (const menu of ADMIN_MENUS) {
      const flags = permissions[menu.key]!;
      await db.insert(roleMenuPermissions).values({
        roleId: id,
        menuKey: menu.key,
        canView: flags.view,
        canCreate: flags.create,
        canEdit: flags.edit,
        canPublish: flags.publish,
        canDelete: flags.delete,
        updatedAt: now,
      });
    }
    const all = await listRoles();
    return all.find((r) => r.id === id)!;
  }

  const store = readLocalStore();
  if (store.roles!.some((r) => r.slug === slug)) {
    throw new Error(`Role "${slug}" already exists.`);
  }
  const created: RoleRecord = {
    id: crypto.randomUUID(),
    slug,
    name,
    description: input.description?.trim() || null,
    isSystem: false,
    permissions,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  store.roles!.push(created);
  writeLocalStore(store);
  return created;
}

export async function updateRole(
  roleId: string,
  input: {
    name?: string;
    description?: string | null;
    permissions?: Partial<Record<string, Partial<MenuPermissionFlags>>>;
  },
): Promise<RoleRecord | null> {
  const all = await listRoles();
  const existing = all.find((r) => r.id === roleId);
  if (!existing) return null;
  if (existing.isSystem && existing.slug === 'superadmin') {
    throw new Error('The system superadmin role cannot be restricted or modified.');
  }

  const nextName = input.name?.trim() || existing.name;
  const nextDesc =
    input.description === undefined ? existing.description : input.description?.trim() || null;
  const nextPerms = input.permissions
    ? normalizePermissionsForMenus(input.permissions, { isSuperAdmin: false })
    : existing.permissions;
  const now = new Date();

  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    await db
      .update(roles)
      .set({ name: nextName, description: nextDesc, updatedAt: now })
      .where(eq(roles.id, roleId));
    for (const menu of ADMIN_MENUS) {
      const flags = nextPerms[menu.key]!;
      await db
        .insert(roleMenuPermissions)
        .values({
          roleId,
          menuKey: menu.key,
          canView: flags.view,
          canCreate: flags.create,
          canEdit: flags.edit,
          canPublish: flags.publish,
          canDelete: flags.delete,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [roleMenuPermissions.roleId, roleMenuPermissions.menuKey],
          set: {
            canView: flags.view,
            canCreate: flags.create,
            canEdit: flags.edit,
            canPublish: flags.publish,
            canDelete: flags.delete,
            updatedAt: now,
          },
        });
    }
    const refreshed = await listRoles();
    return refreshed.find((r) => r.id === roleId) ?? null;
  }

  const store = readLocalStore();
  const idx = store.roles!.findIndex((r) => r.id === roleId);
  if (idx < 0) return null;
  const updated: RoleRecord = {
    ...store.roles![idx]!,
    name: nextName,
    description: nextDesc,
    permissions: nextPerms,
    updatedAt: now.toISOString(),
  };
  store.roles![idx] = updated;
  writeLocalStore(store);
  return updated;
}

export async function deleteRole(roleId: string): Promise<boolean> {
  const all = await listRoles();
  const existing = all.find((r) => r.id === roleId);
  if (!existing) return false;
  if (existing.isSystem) {
    throw new Error('System roles cannot be deleted.');
  }

  const allUsers = await listUsers();
  if (allUsers.some((u) => u.roleId === roleId)) {
    throw new Error('Reassign users away from this role before deleting it.');
  }

  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    await db.delete(roles).where(eq(roles.id, roleId));
    return true;
  }

  const store = readLocalStore();
  store.roles = store.roles!.filter((r) => r.id !== roleId);
  writeLocalStore(store);
  return true;
}

export async function assignUserRole(userId: string, roleId: string): Promise<UserRecord | null> {
  const allRoles = await listRoles();
  const targetRole = allRoles.find((r) => r.id === roleId);
  if (!targetRole) throw new Error('Target role not found.');

  const allUsers = await listUsers();
  const targetUser = allUsers.find((u) => u.id === userId);
  if (!targetUser) return null;

  const superAdminUsers = allUsers.filter((u) => u.isSuperAdmin);
  if (
    targetUser.isSuperAdmin &&
    !(targetRole.isSystem && targetRole.slug === 'superadmin') &&
    superAdminUsers.length <= 1
  ) {
    throw new Error('Cannot demote the last Super Admin account.');
  }

  const legacyRole: UserRole =
    targetRole.slug === 'superadmin'
      ? 'admin'
      : targetRole.slug === 'reviewer'
        ? 'reviewer'
        : 'editor';

  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const [updated] = await db
      .update(users)
      .set({ roleId: targetRole.id, role: legacyRole, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated ? hydratePostgresUser(updated) : null;
  }

  const store = readLocalStore();
  const idx = store.users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;
  store.users[idx] = {
    ...store.users[idx]!,
    roleId: targetRole.id,
    role: legacyRole,
  };
  writeLocalStore(store);
  return hydrateLocalUser(store, store.users[idx]!);
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<UserRecord | null> {
  const normalized = email.trim().toLowerCase();
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const rows = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
    const u = rows[0];
    if (!u || !verifyPassword(password, u.passwordHash)) return null;
    return hydratePostgresUser(u);
  }

  const store = readLocalStore();
  const u = store.users.find((x) => x.email.toLowerCase() === normalized);
  if (!u || !verifyPassword(password, u.passwordHash)) return null;
  return hydrateLocalUser(store, u);
}

export async function createSession(userId: string, tokenHash: string, ttlDays = 7): Promise<void> {
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    await db.insert(sessions).values({ userId, tokenHash, expiresAt });
    return;
  }
  const store = readLocalStore();
  store.sessions = store.sessions.filter((s) => Date.parse(s.expiresAt) > Date.now());
  store.sessions.push({
    id: crypto.randomUUID(),
    userId,
    tokenHash,
    expiresAt: expiresAt.toISOString(),
  });
  writeLocalStore(store);
}

export async function getSessionUser(rawToken: string | undefined): Promise<UserRecord | null> {
  if (!rawToken) return null;
  const tokenHash = hashToken(rawToken);
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const rows = await db
      .select({ user: users })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
      .limit(1);
    const u = rows[0]?.user;
    if (!u) return null;
    return hydratePostgresUser(u);
  }

  const store = readLocalStore();
  const sess = store.sessions.find(
    (s) => s.tokenHash === tokenHash && Date.parse(s.expiresAt) > Date.now(),
  );
  if (!sess) return null;
  const u = store.users.find((x) => x.id === sess.userId);
  if (!u) return null;
  return hydrateLocalUser(store, u);
}

export async function deleteSession(rawToken: string | undefined): Promise<void> {
  if (!rawToken) return;
  const tokenHash = hashToken(rawToken);
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    await db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
    return;
  }
  const store = readLocalStore();
  store.sessions = store.sessions.filter((s) => s.tokenHash !== tokenHash);
  writeLocalStore(store);
}

export async function listUsers(): Promise<UserRecord[]> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const rows = await db.select().from(users).orderBy(users.createdAt);
    return Promise.all(rows.map((u) => hydratePostgresUser(u)));
  }
  const store = readLocalStore();
  return store.users.map((u) => hydrateLocalUser(store, u));
}

export async function listAuthors(): Promise<AuthorRecord[]> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const rows = await db.select().from(authors).orderBy(authors.displayName);
    return rows.map((a) => ({
      id: a.id,
      displayName: a.displayName,
      role: a.role,
      bio: a.bio,
      consentApproved: a.consentApproved,
    }));
  }
  return readLocalStore().authors;
}

export async function createAuthor(input: {
  displayName: string;
  role?: string;
  consentApproved: boolean;
}): Promise<AuthorRecord> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const [row] = await db
      .insert(authors)
      .values({
        displayName: input.displayName,
        role: input.role ?? null,
        consentApproved: input.consentApproved,
      })
      .returning();
    return {
      id: row!.id,
      displayName: row!.displayName,
      role: row!.role,
      bio: row!.bio,
      consentApproved: row!.consentApproved,
    };
  }
  const store = readLocalStore();
  const created: AuthorRecord = {
    id: crypto.randomUUID(),
    displayName: input.displayName,
    role: input.role ?? null,
    bio: null,
    consentApproved: input.consentApproved,
  };
  store.authors.push(created);
  writeLocalStore(store);
  return created;
}

export async function listCategories(): Promise<CategoryRecord[]> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const rows = await db.select().from(categories).orderBy(categories.sortOrder);
    return rows.map((c) => ({
      slug: c.slug,
      nameEn: c.nameEn,
      nameId: c.nameId,
      sortOrder: c.sortOrder,
    }));
  }
  return readLocalStore().categories;
}

export type SaveArticleInput = {
  id?: string;
  locale: Locale;
  translationGroupId?: string;
  slug: string;
  title: string;
  dek: string;
  status: PublishStatus;
  categorySlug: InsightCategorySlug;
  authorId: string;
  reviewerId?: string | null;
  blocks: RichTextBlock[];
  references: { title: string; url: string }[];
  relatedServices: string[];
  featured: boolean;
  seo: { title?: string; description?: string };
};

export async function listAllCmsArticles(filter?: {
  locale?: Locale;
  status?: PublishStatus;
}): Promise<CmsArticle[]> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const conditions = [];
    if (filter?.locale) conditions.push(eq(articles.locale, filter.locale));
    if (filter?.status) conditions.push(eq(articles.status, filter.status));
    const rows = await db
      .select({ article: articles, author: authors })
      .from(articles)
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(articles.updatedAt));

    return rows.map(({ article: a, author }) => ({
      id: a.id,
      locale: a.locale,
      translationGroupId: a.translationGroupId,
      slug: a.slug,
      title: a.title,
      dek: a.dek,
      status: a.status,
      categorySlug: a.categorySlug as InsightCategorySlug,
      authorId: a.authorId,
      authorName: author?.displayName ?? 'colonyhub Editorial',
      authorRole: author?.role ?? 'Editorial',
      reviewerId: a.reviewerId ?? null,
      blocks: (a.contentJson as RichTextBlock[]) ?? [],
      references: (a.referencesJson as { title: string; url: string }[]) ?? [],
      relatedServices: a.relatedServices ?? [],
      featured: a.featured,
      seo: (a.seoJson as { title?: string; description?: string }) ?? {},
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      updatedAt: a.updatedAt.toISOString(),
      createdAt: a.createdAt.toISOString(),
    }));
  }

  const store = readLocalStore();
  return store.articles
    .filter((a) => {
      if (filter?.locale && a.locale !== filter.locale) return false;
      if (filter?.status && a.status !== filter.status) return false;
      return true;
    })
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .map((a) => hydrateLocalArticle(store, a));
}

export async function getCmsArticleById(id: string): Promise<CmsArticle | null> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const rows = await db
      .select({ article: articles, author: authors })
      .from(articles)
      .leftJoin(authors, eq(articles.authorId, authors.id))
      .where(eq(articles.id, id))
      .limit(1);
    const row = rows[0];
    if (!row) return null;
    const a = row.article;
    return {
      id: a.id,
      locale: a.locale,
      translationGroupId: a.translationGroupId,
      slug: a.slug,
      title: a.title,
      dek: a.dek,
      status: a.status,
      categorySlug: a.categorySlug as InsightCategorySlug,
      authorId: a.authorId,
      authorName: row.author?.displayName ?? 'colonyhub Editorial',
      authorRole: row.author?.role ?? 'Editorial',
      reviewerId: a.reviewerId ?? null,
      blocks: (a.contentJson as RichTextBlock[]) ?? [],
      references: (a.referencesJson as { title: string; url: string }[]) ?? [],
      relatedServices: a.relatedServices ?? [],
      featured: a.featured,
      seo: (a.seoJson as { title?: string; description?: string }) ?? {},
      publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
      updatedAt: a.updatedAt.toISOString(),
      createdAt: a.createdAt.toISOString(),
    };
  }

  const store = readLocalStore();
  const found = store.articles.find((a) => a.id === id);
  return found ? hydrateLocalArticle(store, found) : null;
}

export async function getCmsArticleByLocaleSlug(
  locale: Locale,
  slug: string,
  options?: { includeDrafts?: boolean },
): Promise<{ article: CmsArticle | null; redirectToSlug?: string }> {
  const all = await listAllCmsArticles({ locale });
  const direct = all.find(
    (a) => a.slug === slug && (options?.includeDrafts || a.status === 'published'),
  );
  if (direct) return { article: direct };

  // Check historical slug redirects (SEO.md §3.5)
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const redir = await db
      .select({ target: articles })
      .from(articleSlugRedirects)
      .innerJoin(articles, eq(articleSlugRedirects.articleId, articles.id))
      .where(
        and(eq(articleSlugRedirects.locale, locale), eq(articleSlugRedirects.oldSlug, slug)),
      )
      .limit(1);
    const target = redir[0]?.target;
    if (target && target.status === 'published' && target.slug !== slug) {
      return { article: null, redirectToSlug: target.slug };
    }
    return { article: null };
  }

  const store = readLocalStore();
  const redir = store.slugRedirects.find((r) => r.locale === locale && r.oldSlug === slug);
  if (redir) {
    const target = store.articles.find((a) => a.id === redir.articleId);
    if (target && target.status === 'published' && target.slug !== slug) {
      return { article: null, redirectToSlug: target.slug };
    }
  }
  return { article: null };
}

export async function getCmsArticleTranslation(
  translationGroupId: string,
  targetLocale: Locale,
  options?: { includeDrafts?: boolean },
): Promise<CmsArticle | null> {
  const all = await listAllCmsArticles({ locale: targetLocale });
  return (
    all.find(
      (a) =>
        a.translationGroupId === translationGroupId &&
        (options?.includeDrafts || a.status === 'published'),
    ) ?? null
  );
}

export async function saveCmsArticle(
  input: SaveArticleInput,
): Promise<{ article: CmsArticle; previousSlug?: string }> {
  const now = new Date();
  const cleanSlug = input.slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!cleanSlug) {
    throw new Error('Invalid slug');
  }

  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    if (input.id) {
      const existing = await getCmsArticleById(input.id);
      if (!existing) throw new Error('Article not found');
      const previousSlug = existing.slug !== cleanSlug ? existing.slug : undefined;

      const publishedAt =
        input.status === 'published'
          ? existing.publishedAt
            ? new Date(existing.publishedAt)
            : now
          : existing.publishedAt
            ? new Date(existing.publishedAt)
            : null;

      await db
        .update(articles)
        .set({
          locale: input.locale,
          translationGroupId: input.translationGroupId ?? existing.translationGroupId,
          slug: cleanSlug,
          title: input.title.trim(),
          dek: input.dek.trim(),
          status: input.status,
          categorySlug: input.categorySlug,
          authorId: input.authorId,
          reviewerId: input.reviewerId ?? null,
          contentJson: input.blocks,
          referencesJson: input.references,
          relatedServices: input.relatedServices,
          featured: input.featured,
          seoJson: input.seo,
          publishedAt,
          updatedAt: now,
        })
        .where(eq(articles.id, input.id));

      if (previousSlug && (existing.status === 'published' || input.status === 'published')) {
        await db
          .insert(articleSlugRedirects)
          .values({ locale: input.locale, oldSlug: previousSlug, articleId: input.id })
          .onConflictDoNothing();
      }
      const saved = await getCmsArticleById(input.id);
      return { article: saved!, previousSlug };
    }

    const id = crypto.randomUUID();
    const translationGroupId = input.translationGroupId ?? crypto.randomUUID();
    await db.insert(articles).values({
      id,
      locale: input.locale,
      translationGroupId,
      slug: cleanSlug,
      title: input.title.trim(),
      dek: input.dek.trim(),
      status: input.status,
      categorySlug: input.categorySlug,
      authorId: input.authorId,
      reviewerId: input.reviewerId ?? null,
      contentJson: input.blocks,
      referencesJson: input.references,
      relatedServices: input.relatedServices,
      featured: input.featured,
      seoJson: input.seo,
      publishedAt: input.status === 'published' ? now : null,
      updatedAt: now,
      createdAt: now,
    });
    const saved = await getCmsArticleById(id);
    return { article: saved! };
  }

  // Local shared store mode
  const store = readLocalStore();
  const conflict = store.articles.find(
    (a) => a.locale === input.locale && a.slug === cleanSlug && a.id !== input.id,
  );
  if (conflict) {
    throw new Error(`Slug "${cleanSlug}" already exists for locale "${input.locale}"`);
  }

  if (input.id) {
    const idx = store.articles.findIndex((a) => a.id === input.id);
    if (idx < 0) throw new Error('Article not found');
    const existing = store.articles[idx]!;
    const previousSlug = existing.slug !== cleanSlug ? existing.slug : undefined;

    const updated: LocalStoreShape['articles'][number] = {
      ...existing,
      locale: input.locale,
      translationGroupId: input.translationGroupId ?? existing.translationGroupId,
      slug: cleanSlug,
      title: input.title.trim(),
      dek: input.dek.trim(),
      status: input.status,
      categorySlug: input.categorySlug,
      authorId: input.authorId,
      reviewerId: input.reviewerId ?? null,
      blocks: input.blocks,
      references: input.references,
      relatedServices: input.relatedServices,
      featured: input.featured,
      seo: input.seo,
      publishedAt:
        input.status === 'published'
          ? (existing.publishedAt ?? now.toISOString())
          : existing.publishedAt,
      updatedAt: now.toISOString(),
    };
    store.articles[idx] = updated;

    if (previousSlug && (existing.status === 'published' || input.status === 'published')) {
      const already = store.slugRedirects.find(
        (r) => r.locale === input.locale && r.oldSlug === previousSlug,
      );
      if (!already) {
        store.slugRedirects.push({
          id: crypto.randomUUID(),
          locale: input.locale,
          oldSlug: previousSlug,
          articleId: input.id,
        });
      }
    }
    writeLocalStore(store);
    return { article: hydrateLocalArticle(store, updated), previousSlug };
  }

  const created: LocalStoreShape['articles'][number] = {
    id: crypto.randomUUID(),
    locale: input.locale,
    translationGroupId: input.translationGroupId ?? crypto.randomUUID(),
    slug: cleanSlug,
    title: input.title.trim(),
    dek: input.dek.trim(),
    status: input.status,
    categorySlug: input.categorySlug,
    authorId: input.authorId,
    reviewerId: input.reviewerId ?? null,
    blocks: input.blocks,
    references: input.references,
    relatedServices: input.relatedServices,
    featured: input.featured,
    seo: input.seo,
    publishedAt: input.status === 'published' ? now.toISOString() : null,
    updatedAt: now.toISOString(),
    createdAt: now.toISOString(),
  };
  store.articles.push(created);
  writeLocalStore(store);
  return { article: hydrateLocalArticle(store, created) };
}

export async function createInquiryRecord(input: {
  name: string;
  email: string;
  description: string;
  services?: string[];
  company?: string;
  budgetRange?: string;
  timeline?: string;
  locale: Locale;
  consent: boolean;
  idempotencyKey?: string;
}): Promise<{ inquiry: InquiryRecord; deduplicated: boolean }> {
  const key = input.idempotencyKey?.trim() || null;

  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    if (key) {
      const existing = await db
        .select()
        .from(inquiries)
        .where(eq(inquiries.idempotencyKey, key))
        .limit(1);
      if (existing[0]) {
        const r = existing[0];
        return {
          deduplicated: true,
          inquiry: {
            id: r.id,
            name: r.name,
            email: r.email,
            description: r.description,
            services: r.services ?? [],
            company: r.company,
            budgetRange: r.budgetRange,
            timeline: r.timeline,
            locale: r.locale,
            consent: r.consent,
            status: r.status,
            internalNotes: r.internalNotes,
            idempotencyKey: r.idempotencyKey,
            submittedAt: r.submittedAt.toISOString(),
          },
        };
      }
    }

    const [inserted] = await db
      .insert(inquiries)
      .values({
        name: input.name,
        email: input.email,
        description: input.description,
        services: input.services ?? [],
        company: input.company ?? null,
        budgetRange: input.budgetRange ?? null,
        timeline: input.timeline ?? null,
        locale: input.locale,
        consent: input.consent,
        status: 'new',
        idempotencyKey: key,
      })
      .returning();

    const r = inserted!;
    return {
      deduplicated: false,
      inquiry: {
        id: r.id,
        name: r.name,
        email: r.email,
        description: r.description,
        services: r.services ?? [],
        company: r.company,
        budgetRange: r.budgetRange,
        timeline: r.timeline,
        locale: r.locale,
        consent: r.consent,
        status: r.status,
        internalNotes: r.internalNotes,
        idempotencyKey: r.idempotencyKey,
        submittedAt: r.submittedAt.toISOString(),
      },
    };
  }

  const store = readLocalStore();
  if (key) {
    const existing = store.inquiries.find((i) => i.idempotencyKey === key);
    if (existing) {
      return { inquiry: existing, deduplicated: true };
    }
  }

  const created: InquiryRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    description: input.description,
    services: input.services ?? [],
    company: input.company ?? null,
    budgetRange: input.budgetRange ?? null,
    timeline: input.timeline ?? null,
    locale: input.locale,
    consent: input.consent,
    status: 'new',
    internalNotes: null,
    idempotencyKey: key,
    submittedAt: new Date().toISOString(),
  };
  store.inquiries.unshift(created);
  writeLocalStore(store);
  return { inquiry: created, deduplicated: false };
}

export async function listInquiries(): Promise<InquiryRecord[]> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const rows = await db.select().from(inquiries).orderBy(desc(inquiries.submittedAt));
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      description: r.description,
      services: r.services ?? [],
      company: r.company,
      budgetRange: r.budgetRange,
      timeline: r.timeline,
      locale: r.locale,
      consent: r.consent,
      status: r.status,
      internalNotes: r.internalNotes,
      idempotencyKey: r.idempotencyKey,
      submittedAt: r.submittedAt.toISOString(),
    }));
  }
  return readLocalStore().inquiries;
}

export async function updateInquiryStatus(
  id: string,
  input: { status: InquiryStatus; internalNotes?: string | null },
): Promise<InquiryRecord | null> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const [r] = await db
      .update(inquiries)
      .set({ status: input.status, internalNotes: input.internalNotes ?? null })
      .where(eq(inquiries.id, id))
      .returning();
    if (!r) return null;
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      description: r.description,
      services: r.services ?? [],
      company: r.company,
      budgetRange: r.budgetRange,
      timeline: r.timeline,
      locale: r.locale,
      consent: r.consent,
      status: r.status,
      internalNotes: r.internalNotes,
      idempotencyKey: r.idempotencyKey,
      submittedAt: r.submittedAt.toISOString(),
    };
  }
  const store = readLocalStore();
  const idx = store.inquiries.findIndex((i) => i.id === id);
  if (idx < 0) return null;
  const updated: InquiryRecord = {
    ...store.inquiries[idx]!,
    status: input.status,
    internalNotes: input.internalNotes ?? store.inquiries[idx]!.internalNotes,
  };
  store.inquiries[idx] = updated;
  writeLocalStore(store);
  return updated;
}

const GA4_ID_RE = /^G-[A-Z0-9]{6,14}$/i;
const GTM_ID_RE = /^GTM-[A-Z0-9]{5,12}$/i;
const META_PIXEL_ID_RE = /^\d{8,20}$/;

const DEFAULT_TRACKING_SETTINGS: TrackingSettings = {
  enabled: true,
  ga4MeasurementId: '',
  gtmContainerId: '',
  metaPixelId: '',
  updatedAt: '2026-11-22T00:00:00.000Z',
};

export function validateTrackingInput(input: {
  enabled?: boolean;
  ga4MeasurementId?: string;
  gtmContainerId?: string;
  metaPixelId?: string;
}): TrackingSettings {
  const ga4 = (input.ga4MeasurementId ?? '').trim().toUpperCase();
  const gtm = (input.gtmContainerId ?? '').trim().toUpperCase();
  const meta = (input.metaPixelId ?? '').trim();

  if (ga4 && !GA4_ID_RE.test(ga4)) {
    throw new Error('Invalid GA4 Measurement ID. Expected format like G-XXXXXXXXXX.');
  }
  if (gtm && !GTM_ID_RE.test(gtm)) {
    throw new Error('Invalid Google Tag Manager ID. Expected format like GTM-XXXXXXX.');
  }
  if (meta && !META_PIXEL_ID_RE.test(meta)) {
    throw new Error('Invalid Meta Pixel ID. Expected 8 to 20 digits only.');
  }

  return {
    enabled: input.enabled ?? true,
    ga4MeasurementId: ga4,
    gtmContainerId: gtm,
    metaPixelId: meta,
    updatedAt: new Date().toISOString(),
  };
}

export async function getTrackingSettings(): Promise<TrackingSettings> {
  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const rows = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, 'tracking'))
      .limit(1);
    const val = rows[0]?.valueJson as Partial<TrackingSettings> | undefined;
    if (!val) return DEFAULT_TRACKING_SETTINGS;
    return {
      enabled: typeof val.enabled === 'boolean' ? val.enabled : true,
      ga4MeasurementId: typeof val.ga4MeasurementId === 'string' ? val.ga4MeasurementId : '',
      gtmContainerId: typeof val.gtmContainerId === 'string' ? val.gtmContainerId : '',
      metaPixelId: typeof val.metaPixelId === 'string' ? val.metaPixelId : '',
      updatedAt: rows[0]!.updatedAt.toISOString(),
    };
  }

  const store = readLocalStore();
  return store.tracking ?? DEFAULT_TRACKING_SETTINGS;
}

export async function saveTrackingSettings(
  input: {
    enabled?: boolean;
    ga4MeasurementId?: string;
    gtmContainerId?: string;
    metaPixelId?: string;
  },
  updatedBy?: string,
): Promise<TrackingSettings> {
  const validated = validateTrackingInput(input);

  if (hasDatabaseUrl()) {
    const db = getPostgresDb();
    const now = new Date();
    await db
      .insert(siteSettings)
      .values({
        key: 'tracking',
        valueJson: validated,
        updatedBy: updatedBy ?? null,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: {
          valueJson: validated,
          updatedBy: updatedBy ?? null,
          updatedAt: now,
        },
      });
    return { ...validated, updatedAt: now.toISOString() };
  }

  const store = readLocalStore();
  store.tracking = validated;
  writeLocalStore(store);
  return validated;
}
