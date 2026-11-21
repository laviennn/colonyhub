import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * Postgres schema for Colony Command Center & Public Site (Phase 03).
 * Compatible with Neon, Vercel Postgres, Supabase, and standard PostgreSQL.
 */
export const localeEnum = pgEnum('locale', ['en', 'id']);
export const publishStatusEnum = pgEnum('publish_status', [
  'draft',
  'review',
  'published',
  'archived',
]);
export const projectKindEnum = pgEnum('project_kind', ['client', 'internal', 'concept']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'editor', 'reviewer']);
export const inquiryStatusEnum = pgEnum('inquiry_status', [
  'new',
  'contacted',
  'qualified',
  'archived',
]);

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  isSystem: boolean('is_system').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const roleMenuPermissions = pgTable(
  'role_menu_permissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    menuKey: text('menu_key').notNull(),
    canView: boolean('can_view').notNull().default(false),
    canCreate: boolean('can_create').notNull().default(false),
    canEdit: boolean('can_edit').notNull().default(false),
    canPublish: boolean('can_publish').notNull().default(false),
    canDelete: boolean('can_delete').notNull().default(false),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('role_menu_permissions_role_menu_uidx').on(table.roleId, table.menuKey),
  ],
);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name').notNull(),
  role: userRoleEnum('role').notNull().default('editor'),
  roleId: uuid('role_id').references(() => roles.id, { onDelete: 'set null' }),
  mfaEnabled: boolean('mfa_enabled').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const authors = pgTable('authors', {
  id: uuid('id').defaultRandom().primaryKey(),
  displayName: text('display_name').notNull(),
  role: text('role'),
  bio: text('bio'),
  avatarJson: jsonb('avatar_json'),
  consentApproved: boolean('consent_approved').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  slug: text('slug').primaryKey(),
  nameEn: text('name_en').notNull(),
  nameId: text('name_id').notNull(),
  descriptionEn: text('description_en'),
  descriptionId: text('description_id'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const articles = pgTable(
  'articles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    locale: localeEnum('locale').notNull(),
    translationGroupId: uuid('translation_group_id').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    dek: text('dek').notNull(),
    status: publishStatusEnum('status').notNull().default('draft'),
    categorySlug: text('category_slug')
      .notNull()
      .references(() => categories.slug),
    tagSlugs: jsonb('tag_slugs').$type<string[]>(),
    authorId: uuid('author_id')
      .notNull()
      .references(() => authors.id),
    reviewerId: uuid('reviewer_id').references(() => authors.id),
    heroImageJson: jsonb('hero_image_json'),
    contentJson: jsonb('content_json').notNull(),
    referencesJson: jsonb('references_json'),
    relatedServices: jsonb('related_services').$type<string[]>(),
    relatedProjects: jsonb('related_projects').$type<string[]>(),
    featured: boolean('featured').notNull().default(false),
    seoJson: jsonb('seo_json'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('articles_locale_slug_uidx').on(table.locale, table.slug)],
);

export const articleSlugRedirects = pgTable(
  'article_slug_redirects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    locale: localeEnum('locale').notNull(),
    oldSlug: text('old_slug').notNull(),
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('article_slug_redirects_locale_old_slug_uidx').on(table.locale, table.oldSlug),
  ],
);

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  status: publishStatusEnum('status').notNull().default('draft'),
  kind: projectKindEnum('kind').notNull().default('client'),
  clientName: text('client_name'),
  year: integer('year'),
  summary: text('summary').notNull(),
  heroImageJson: jsonb('hero_image_json'),
  serviceSlugs: jsonb('service_slugs').$type<string[]>(),
  bodyJson: jsonb('body_json'),
  permissionsApproved: boolean('permissions_approved').notNull().default(false),
  featured: boolean('featured').notNull().default(false),
  seoJson: jsonb('seo_json'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const inquiries = pgTable('inquiries', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  description: text('description').notNull(),
  services: jsonb('services').$type<string[]>(),
  company: text('company'),
  budgetRange: text('budget_range'),
  timeline: text('timeline'),
  locale: localeEnum('locale').notNull().default('en'),
  consent: boolean('consent').notNull().default(false),
  status: inquiryStatusEnum('status').notNull().default('new'),
  internalNotes: text('internal_notes'),
  idempotencyKey: text('idempotency_key').unique(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
});

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  valueJson: jsonb('value_json').notNull(),
  updatedBy: text('updated_by'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
