import {
  hasMenuPermission,
  listAuthors,
  listCategories,
  listRoles,
  listUsers,
} from '@colonyhub/db';
import { AppShell } from '@/components/AppShell';
import { SettingsClient } from '@/components/SettingsClient';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await requireUser();

  if (!hasMenuPermission(user, 'settings', 'view')) {
    return (
      <AppShell user={user}>
        <div className="cc-page-head">
          <div>
            <h1>Settings</h1>
            <p className="cc-page-sub">Access restricted by your role permissions.</p>
          </div>
        </div>
        <div className="cc-card">
          <p style={{ color: 'var(--cc-text-muted)' }}>
            Your current role (<strong>{user.roleName}</strong>) does not have{' '}
            <span className="mono">settings:view</span> permission. Contact a Super Admin to update
            role permissions.
          </p>
        </div>
      </AppShell>
    );
  }

  const [roles, authors, categories, users] = await Promise.all([
    listRoles(),
    listAuthors(),
    listCategories(),
    listUsers(),
  ]);

  return (
    <AppShell user={user}>
      <div className="cc-page-head">
        <div>
          <h1>Settings</h1>
          <p className="cc-page-sub">
            Manage custom roles, menu-based permissions, team accounts, and editorial taxonomy.
          </p>
        </div>
      </div>

      <SettingsClient
        isSuperAdmin={user.isSuperAdmin}
        initialRoles={roles}
        initialAuthors={authors}
        categories={categories}
        initialUsers={users}
      />
    </AppShell>
  );
}
