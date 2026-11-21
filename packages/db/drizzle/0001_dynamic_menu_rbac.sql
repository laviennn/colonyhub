-- Dynamic Menu-Based RBAC (technical-guidelines.md §2.1)
-- Managed by superadmin; new menus in ADMIN_MENUS auto-sync on boot.

CREATE TABLE IF NOT EXISTS "roles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "description" text,
  "is_system" boolean DEFAULT false NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "role_menu_permissions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "role_id" uuid NOT NULL REFERENCES "roles"("id") ON DELETE CASCADE,
  "menu_key" text NOT NULL,
  "can_view" boolean DEFAULT false NOT NULL,
  "can_create" boolean DEFAULT false NOT NULL,
  "can_edit" boolean DEFAULT false NOT NULL,
  "can_publish" boolean DEFAULT false NOT NULL,
  "can_delete" boolean DEFAULT false NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "role_menu_permissions_role_menu_uidx"
  ON "role_menu_permissions" ("role_id", "menu_key");

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "role_id" uuid REFERENCES "roles"("id") ON DELETE SET NULL;
