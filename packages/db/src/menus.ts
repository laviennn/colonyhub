export type MenuAction = 'view' | 'create' | 'edit' | 'publish' | 'delete';

export type MenuPermissionFlags = {
  view: boolean;
  create: boolean;
  edit: boolean;
  publish: boolean;
  delete: boolean;
};

export type AdminMenuDefinition = {
  key: string;
  label: string;
  shortLabel: string;
  href: string;
  description: string;
  actions: readonly MenuAction[];
};

/**
 * Single Menu Registry (technical-guidelines.md §2.1).
 * Adding a new menu here automatically registers its RBAC permissions:
 * - `superadmin` automatically receives full access (`*`).
 * - All custom roles default to deny (fail-closed) until `superadmin` enables permissions.
 */
export const ADMIN_MENUS: readonly AdminMenuDefinition[] = [
  {
    key: 'overview',
    label: 'Overview',
    shortLabel: 'Overview',
    href: '/',
    description: 'Workspace summary, review queue, and recent activity.',
    actions: ['view'],
  },
  {
    key: 'insights',
    label: 'Insights',
    shortLabel: 'Insights',
    href: '/articles',
    description: 'Bilingual editorial articles, private preview, and publishing.',
    actions: ['view', 'create', 'edit', 'publish', 'delete'],
  },
  {
    key: 'tracking',
    label: 'Tracking',
    shortLabel: 'Tracking',
    href: '/tracking',
    description: 'Google Analytics 4, Google Tag Manager, and Meta Pixel IDs synced to the public site.',
    actions: ['view', 'edit'],
  },
  {
    key: 'changelog',
    label: 'Changelog',
    shortLabel: 'Log',
    href: '/changelog',
    description: 'Release history and verified changes shipped across colonyhub.id and Command Center.',
    actions: ['view'],
  },
  {
    key: 'settings',
    label: 'Settings',
    shortLabel: 'Settings',
    href: '/settings',
    description: 'Roles & menu permissions, team accounts, authors, and categories.',
    actions: ['view', 'create', 'edit', 'delete'],
  },
] as const;

export type MenuKey = (typeof ADMIN_MENUS)[number]['key'];

export type PermissionSubject = {
  isSuperAdmin: boolean;
  permissions: Record<string, MenuPermissionFlags>;
};

/**
 * Authoritative Menu-Based RBAC check (browser & server safe).
 * - `superadmin` always returns true (including for newly registered menus).
 * - Custom roles are fail-closed (false) unless explicitly granted by superadmin.
 */
export function hasMenuPermission(
  subject: PermissionSubject | null | undefined,
  menuKey: string,
  action: MenuAction,
): boolean {
  if (!subject) return false;
  if (subject.isSuperAdmin) return true;
  return Boolean(subject.permissions[menuKey]?.[action]);
}

export function emptyMenuPermission(): MenuPermissionFlags {
  return {
    view: false,
    create: false,
    edit: false,
    publish: false,
    delete: false,
  };
}

export function fullMenuPermission(menu?: AdminMenuDefinition): MenuPermissionFlags {
  if (!menu) {
    return { view: true, create: true, edit: true, publish: true, delete: true };
  }
  return {
    view: menu.actions.includes('view'),
    create: menu.actions.includes('create'),
    edit: menu.actions.includes('edit'),
    publish: menu.actions.includes('publish'),
    delete: menu.actions.includes('delete'),
  };
}

/**
 * Normalizes a role's permission map against `ADMIN_MENUS`.
 * Any menu newly added to `ADMIN_MENUS` is automatically present:
 * - `true` for `superadmin`
 * - `false` (fail-closed) for every other role until granted by `superadmin`.
 */
export function normalizePermissionsForMenus(
  input: Partial<Record<string, Partial<MenuPermissionFlags>>> | undefined,
  options: { isSuperAdmin: boolean },
  menus: readonly AdminMenuDefinition[] = ADMIN_MENUS,
): Record<string, MenuPermissionFlags> {
  const result: Record<string, MenuPermissionFlags> = {};
  for (const menu of menus) {
    if (options.isSuperAdmin) {
      result[menu.key] = fullMenuPermission(menu);
      continue;
    }
    const raw = input?.[menu.key];
    result[menu.key] = {
      view: menu.actions.includes('view') && Boolean(raw?.view),
      create: menu.actions.includes('create') && Boolean(raw?.create),
      edit: menu.actions.includes('edit') && Boolean(raw?.edit),
      publish: menu.actions.includes('publish') && Boolean(raw?.publish),
      delete: menu.actions.includes('delete') && Boolean(raw?.delete),
    };
  }
  return result;
}
