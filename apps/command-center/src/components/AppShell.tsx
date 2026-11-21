'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import type { UserRecord } from '@colonyhub/db';
import { ADMIN_MENUS, hasMenuPermission } from '@colonyhub/db/menus';
import { ThemeToggle } from './ThemeToggle';

type AppShellProps = {
  user: UserRecord;
  reviewArticleCount?: number;
  children: React.ReactNode;
};

function renderMenuIcon(key: string): React.ReactNode {
  switch (key) {
    case 'overview':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'insights':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M5 4h11l3 3v13H5z" strokeLinejoin="round" />
          <path d="M9 11h6M9 15h6" strokeLinecap="round" />
        </svg>
      );
    case 'tracking':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M4 17l5-5 4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 8h4v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'changelog':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
  }
}

export function AppShell({
  user,
  reviewArticleCount = 0,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  // Dynamically rendered from ADMIN_MENUS filtered by the user's menu-based RBAC permissions
  const visibleMenus = ADMIN_MENUS.filter((menu) => hasMenuPermission(user, menu.key, 'view')).map(
    (menu) => ({
      ...menu,
      badge: menu.key === 'insights' && reviewArticleCount > 0 ? reviewArticleCount : undefined,
      icon: renderMenuIcon(menu.key),
    }),
  );

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  const activeNav = visibleMenus.find((item) => isActive(item.href)) ?? visibleMenus[0];

  return (
    <div className="cc-shell">
      {/* Desktop Sidebar */}
      <aside className="cc-sidebar" aria-label="Command Center navigation">
        <div>
          <Link href="/" className="cc-brand">
            <svg width="26" height="26" viewBox="0 0 36 36" aria-hidden="true">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#8A94F2"
                strokeWidth="3.5"
                strokeDasharray="68 20"
                strokeLinecap="round"
              />
              <circle cx="18" cy="18" r="4" fill="#C6F432" />
            </svg>
            <div>
              <span className="cc-brand-name">colonyhub</span>
              <span className="cc-brand-sub">Command Center</span>
            </div>
          </Link>

          <nav className="cc-nav">
            {visibleMenus.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="cc-nav-link"
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge ? <span className="cc-nav-badge">{item.badge}</span> : null}
              </Link>
            ))}
          </nav>
        </div>

        <div className="cc-sidebar-foot">
          <div className="cc-user-card">
            <div className="cc-user-name">{user.displayName}</div>
            <div className="cc-user-role">{user.roleName}</div>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <ThemeToggle />
            <button
              type="button"
              className="cc-signout-btn"
              onClick={handleLogout}
              disabled={signingOut}
            >
              {signingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Native Top App Bar */}
      <header className="cc-mobile-topbar">
        <div className="cc-mobile-topbar-title">
          <svg width="22" height="22" viewBox="0 0 36 36" aria-hidden="true">
            <circle
              cx="18"
              cy="18"
              r="14"
              fill="none"
              stroke="#8A94F2"
              strokeWidth="3.5"
              strokeDasharray="68 20"
              strokeLinecap="round"
            />
            <circle cx="18" cy="18" r="4" fill="#C6F432" />
          </svg>
          <span>{activeNav?.label ?? 'Overview'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="cc-badge cc-badge--published">{user.roleSlug}</span>
          <ThemeToggle compact />
          <button
            type="button"
            className="cc-mobile-exit-btn"
            onClick={handleLogout}
            disabled={signingOut}
          >
            Exit
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="cc-main">
        <div className="cc-container">{children}</div>
      </main>

      {/* Mobile Native Bottom Tab Bar */}
      <nav
        className="cc-mobile-tabbar"
        aria-label="Mobile navigation"
        style={{
          gridTemplateColumns: `repeat(${Math.max(1, visibleMenus.length)}, minmax(0, 1fr))`,
        }}
      >
        {visibleMenus.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="cc-tab-item"
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {item.icon}
            <span>{item.shortLabel}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
