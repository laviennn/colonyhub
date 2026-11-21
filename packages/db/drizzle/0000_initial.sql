-- Initial PostgreSQL migration for Colony Command Center (Neon / Supabase / Postgres compatible)
DO $$ BEGIN
  CREATE TYPE "locale" AS ENUM ('en', 'id');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "publish_status" AS ENUM ('draft', 'review', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "project_kind" AS ENUM ('client', 'internal', 'concept');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "user_role" AS ENUM ('admin', 'editor', 'reviewer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "inquiry_status" AS ENUM ('new', 'contacted', 'qualified', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "display_name" text NOT NULL,
  "role" "user_role" NOT NULL DEFAULT 'editor',
  "mfa_enabled" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token_hash" text NOT NULL UNIQUE,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "authors" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "display_name" text NOT NULL,
  "role" text,
  "bio" text,
  "avatar_json" jsonb,
  "consent_approved" boolean NOT NULL DEFAULT false,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "categories" (
  "slug" text PRIMARY KEY,
  "name_en" text NOT NULL,
  "name_id" text NOT NULL,
  "description_en" text,
  "description_id" text,
  "sort_order" integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "articles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "locale" "locale" NOT NULL,
  "translation_group_id" uuid NOT NULL,
  "slug" text NOT NULL,
  "title" text NOT NULL,
  "dek" text NOT NULL,
  "status" "publish_status" NOT NULL DEFAULT 'draft',
  "category_slug" text NOT NULL REFERENCES "categories"("slug"),
  "tag_slugs" jsonb,
  "author_id" uuid NOT NULL REFERENCES "authors"("id"),
  "reviewer_id" uuid REFERENCES "authors"("id"),
  "hero_image_json" jsonb,
  "content_json" jsonb NOT NULL,
  "references_json" jsonb,
  "related_services" jsonb,
  "related_projects" jsonb,
  "featured" boolean NOT NULL DEFAULT false,
  "seo_json" jsonb,
  "published_at" timestamptz,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "articles_locale_slug_uidx" ON "articles" ("locale", "slug");

CREATE TABLE IF NOT EXISTS "article_slug_redirects" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "locale" "locale" NOT NULL,
  "old_slug" text NOT NULL,
  "article_id" uuid NOT NULL REFERENCES "articles"("id") ON DELETE CASCADE,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "article_slug_redirects_locale_old_slug_uidx" ON "article_slug_redirects" ("locale", "old_slug");

CREATE TABLE IF NOT EXISTS "inquiries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "email" text NOT NULL,
  "description" text NOT NULL,
  "services" jsonb,
  "company" text,
  "budget_range" text,
  "timeline" text,
  "locale" "locale" NOT NULL DEFAULT 'en',
  "consent" boolean NOT NULL DEFAULT false,
  "status" "inquiry_status" NOT NULL DEFAULT 'new',
  "internal_notes" text,
  "idempotency_key" text UNIQUE,
  "submitted_at" timestamptz NOT NULL DEFAULT now()
);
