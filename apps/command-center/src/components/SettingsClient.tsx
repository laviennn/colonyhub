'use client';

import { useState } from 'react';
import type {
  AuthorRecord,
  CategoryRecord,
  RoleRecord,
  UserRecord,
} from '@colonyhub/db';
import {
  ADMIN_MENUS,
  emptyMenuPermission,
  type MenuAction,
  type MenuPermissionFlags,
} from '@colonyhub/db/menus';

const ALL_ACTIONS: readonly MenuAction[] = ['view', 'create', 'edit', 'publish', 'delete'];

function createEmptyMatrix(): Record<string, MenuPermissionFlags> {
  const out: Record<string, MenuPermissionFlags> = {};
  for (const menu of ADMIN_MENUS) {
    out[menu.key] = emptyMenuPermission();
  }
  return out;
}

export function SettingsClient({
  isSuperAdmin,
  initialRoles,
  initialAuthors,
  categories,
  initialUsers,
}: {
  isSuperAdmin: boolean;
  initialRoles: RoleRecord[];
  initialAuthors: AuthorRecord[];
  categories: CategoryRecord[];
  initialUsers: UserRecord[];
}) {
  const [roles, setRoles] = useState<RoleRecord[]>(initialRoles);
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialRoles[0]?.id ?? '');
  const [creatingRole, setCreatingRole] = useState(false);

  const selectedRole = roles.find((r) => r.id === selectedRoleId) ?? null;

  const [roleName, setRoleName] = useState(selectedRole?.name ?? '');
  const [roleDesc, setRoleDesc] = useState(selectedRole?.description ?? '');
  const [permDraft, setPermDraft] = useState<Record<string, MenuPermissionFlags>>(
    selectedRole?.permissions ?? createEmptyMatrix(),
  );
  const [roleSaving, setRoleSaving] = useState(false);
  const [roleFeedback, setRoleFeedback] = useState<string | null>(null);

  const [userFeedback, setUserFeedback] = useState<string | null>(null);

  const [authors, setAuthors] = useState(initialAuthors);
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('');
  const [savingAuthor, setSavingAuthor] = useState(false);
  const [authorFeedback, setAuthorFeedback] = useState<string | null>(null);

  const selectRole = (r: RoleRecord) => {
    setCreatingRole(false);
    setSelectedRoleId(r.id);
    setRoleName(r.name);
    setRoleDesc(r.description ?? '');
    setPermDraft(structuredClone(r.permissions));
    setRoleFeedback(null);
  };

  const startNewRole = () => {
    setCreatingRole(true);
    setSelectedRoleId('');
    setRoleName('');
    setRoleDesc('');
    setPermDraft(createEmptyMatrix());
    setRoleFeedback(null);
  };

  const togglePerm = (menuKey: string, action: MenuAction) => {
    setPermDraft((prev) => {
      const current = prev[menuKey] ?? emptyMenuPermission();
      const nextVal = !current[action];
      // Enabling any write/publish/delete action automatically enables `view` for that menu
      const nextFlags: MenuPermissionFlags = {
        ...current,
        [action]: nextVal,
        ...(action !== 'view' && nextVal ? { view: true } : {}),
        ...(action === 'view' && !nextVal
          ? { create: false, edit: false, publish: false, delete: false }
          : {}),
      };
      return { ...prev, [menuKey]: nextFlags };
    });
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roleSaving || !roleName.trim()) return;
    setRoleSaving(true);
    setRoleFeedback(null);

    try {
      const url = creatingRole ? '/api/roles' : `/api/roles/${selectedRole!.id}`;
      const method = creatingRole ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: roleName.trim(),
          description: roleDesc.trim() || null,
          permissions: permDraft,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        role?: RoleRecord;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.role) {
        setRoleFeedback(data.error || 'Failed to save role.');
        return;
      }

      if (creatingRole) {
        setRoles((prev) => [...prev, data.role!]);
        selectRole(data.role);
        setRoleFeedback(`Role "${data.role.name}" created.`);
      } else {
        setRoles((prev) => prev.map((r) => (r.id === data.role!.id ? data.role! : r)));
        setRoleFeedback(`Permissions saved for "${data.role.name}".`);
      }
    } finally {
      setRoleSaving(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole || selectedRole.isSystem || roleSaving) return;
    setRoleSaving(true);
    setRoleFeedback(null);
    try {
      const res = await fetch(`/api/roles/${selectedRole.id}`, { method: 'DELETE' });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setRoleFeedback(data.error || 'Could not delete role.');
        return;
      }
      const remaining = roles.filter((r) => r.id !== selectedRole.id);
      setRoles(remaining);
      if (remaining[0]) {
        selectRole(remaining[0]);
      }
      setRoleFeedback('Role deleted.');
    } finally {
      setRoleSaving(false);
    }
  };

  const handleAssignUserRole = async (userId: string, nextRoleId: string) => {
    setUserFeedback(null);
    const res = await fetch(`/api/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId: nextRoleId }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      user?: UserRecord;
      error?: string;
    };
    if (!res.ok || !data.ok || !data.user) {
      setUserFeedback(data.error || 'Failed to reassign role.');
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === data.user!.id ? data.user! : u)));
    setUserFeedback(`Updated ${data.user.displayName} → ${data.user.roleName}.`);
  };

  const handleAddAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingAuthor || !displayName.trim()) return;
    setSavingAuthor(true);
    setAuthorFeedback(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          role: role.trim() || undefined,
          consentApproved: true,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        author?: AuthorRecord;
        error?: string;
      };
      if (!res.ok || !data.ok || !data.author) {
        setAuthorFeedback(data.error || 'Failed to add author.');
        return;
      }
      setAuthors((prev) => [...prev, data.author!]);
      setDisplayName('');
      setRole('');
      setAuthorFeedback('Author added.');
    } finally {
      setSavingAuthor(false);
    }
  };

  const isEditingSystemSuperAdmin = Boolean(!creatingRole && selectedRole?.isSystem);

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* Dynamic Menu-Based RBAC Manager (Superadmin) */}
      <section className="cc-card" style={{ display: 'grid', gap: 18 }}>
        <div className="cc-card-head" style={{ marginBottom: 0 }}>
          <div>
            <h2 className="cc-card-title">Roles &amp; Menu Permissions (Dynamic RBAC)</h2>
            <p style={{ color: 'var(--cc-text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
              Permissions are generated automatically from the central menu registry (
              <span className="mono">{ADMIN_MENUS.length} menus</span>). New admin menus default to
              deny for custom roles until enabled here.
            </p>
          </div>
          {isSuperAdmin ? (
            <button type="button" className="cc-btn cc-btn--lime cc-btn--sm" onClick={startNewRole}>
              + Custom Role
            </button>
          ) : null}
        </div>

        <div className="cc-filters" role="tablist" aria-label="Roles">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={!creatingRole && selectedRole?.id === r.id}
              className="cc-pill"
              onClick={() => selectRole(r)}
            >
              {r.name}
              {r.isSystem ? ' ★' : ''}
            </button>
          ))}
        </div>

        <form onSubmit={handleSaveRole} style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            <div className="cc-field">
              <label htmlFor="rbac-role-name">Role Name</label>
              <input
                id="rbac-role-name"
                className="cc-input"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Editorial Lead, BD / Sales"
                disabled={!isSuperAdmin || isEditingSystemSuperAdmin}
                required
              />
            </div>
            <div className="cc-field">
              <label htmlFor="rbac-role-desc">Description</label>
              <input
                id="rbac-role-desc"
                className="cc-input"
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                placeholder="Short summary of what this role manages"
                disabled={!isSuperAdmin || isEditingSystemSuperAdmin}
              />
            </div>
          </div>

          {/* Menu Permission Matrix */}
          <div style={{ display: 'grid', gap: 10 }}>
            {ADMIN_MENUS.map((menu) => {
              const flags = permDraft[menu.key] ?? emptyMenuPermission();
              return (
                <div
                  key={menu.key}
                  style={{
                    border: '1px solid var(--cc-border)',
                    borderRadius: 'var(--cc-r-sm)',
                    padding: '14px 16px',
                    background: 'var(--cc-surface-subtle)',
                    display: 'grid',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <strong style={{ fontSize: '0.92rem' }}>{menu.label}</strong>
                      <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--cc-text-muted)', marginLeft: 8 }}>
                        {menu.href}
                      </span>
                    </div>
                    {isEditingSystemSuperAdmin ? (
                      <span className="cc-badge">Full access (*)</span>
                    ) : null}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    {ALL_ACTIONS.filter((a) => menu.actions.includes(a)).map((action) => (
                      <label
                        key={action}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: '0.84rem',
                          fontWeight: 500,
                          cursor: isSuperAdmin && !isEditingSystemSuperAdmin ? 'pointer' : 'default',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isEditingSystemSuperAdmin ? true : Boolean(flags[action])}
                          disabled={!isSuperAdmin || isEditingSystemSuperAdmin}
                          onChange={() => togglePerm(menu.key, action)}
                          style={{ width: 17, height: 17 }}
                        />
                        <span style={{ textTransform: 'capitalize' }}>{action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {isSuperAdmin && !isEditingSystemSuperAdmin ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              <button type="submit" className="cc-btn cc-btn--navy cc-btn--sm" disabled={roleSaving}>
                {roleSaving ? 'Saving...' : creatingRole ? 'Create Custom Role' : 'Save Permissions'}
              </button>
              {!creatingRole && selectedRole && !selectedRole.isSystem ? (
                <button
                  type="button"
                  className="cc-btn cc-btn--danger cc-btn--sm"
                  onClick={handleDeleteRole}
                  disabled={roleSaving}
                >
                  Delete Role
                </button>
              ) : null}
              {roleFeedback ? (
                <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--cc-accent-link)' }}>
                  {roleFeedback}
                </span>
              ) : null}
            </div>
          ) : null}
        </form>
      </section>

      {/* Team Accounts & Role Assignment */}
      <section className="cc-card" style={{ display: 'grid', gap: 14 }}>
        <div className="cc-card-head" style={{ marginBottom: 0 }}>
          <h2 className="cc-card-title">Team Accounts &amp; Assigned Roles</h2>
          {userFeedback ? (
            <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--cc-accent-link)' }}>
              {userFeedback}
            </span>
          ) : null}
        </div>
        <div className="cc-list">
          {users.map((u) => (
            <div key={u.id} className="cc-list-row" style={{ flexWrap: 'wrap' }}>
              <div className="cc-list-main">
                <div className="cc-list-title">{u.displayName}</div>
                <div className="cc-list-meta">
                  <span>{u.email}</span>
                </div>
              </div>
              {isSuperAdmin ? (
                <select
                  aria-label={`Role for ${u.displayName}`}
                  className="cc-select"
                  style={{ width: 'auto', minWidth: 170, minHeight: 38, padding: '6px 10px' }}
                  value={u.roleId}
                  onChange={(e) => handleAssignUserRole(u.id, e.target.value)}
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="cc-badge cc-badge--published">{u.roleName}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="cc-overview-grid">
        <section className="cc-card" style={{ display: 'grid', gap: 14 }}>
          <h2 className="cc-card-title">Editorial Authors ({authors.length})</h2>
          <div className="cc-list">
            {authors.map((a) => (
              <div key={a.id} className="cc-list-row">
                <div className="cc-list-main">
                  <div className="cc-list-title">{a.displayName}</div>
                  <div className="cc-list-meta">
                    <span>{a.role ?? 'Editorial'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleAddAuthor}
            style={{ display: 'grid', gap: 10, paddingTop: 12, borderTop: '1px solid var(--cc-border)' }}
          >
            <strong style={{ fontSize: '0.85rem' }}>Add Author</strong>
            <input
              className="cc-input"
              placeholder="Author display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <input
              className="cc-input"
              placeholder="Role (e.g. Strategy Lead)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="submit" className="cc-btn cc-btn--lime cc-btn--sm" disabled={savingAuthor}>
                {savingAuthor ? 'Adding...' : '+ Add Author'}
              </button>
              {authorFeedback ? (
                <span className="mono" style={{ fontSize: '0.78rem' }}>
                  {authorFeedback}
                </span>
              ) : null}
            </div>
          </form>
        </section>

        <section className="cc-card" style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
          <h2 className="cc-card-title">Insight Categories ({categories.length})</h2>
          <div className="cc-list">
            {categories.map((c) => (
              <div key={c.slug} className="cc-list-row">
                <div className="cc-list-main">
                  <div className="cc-list-title">{c.nameEn}</div>
                  <div className="cc-list-meta">
                    <span>{c.nameId}</span>
                    <span>slug: {c.slug}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
