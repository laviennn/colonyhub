'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

function isInternalAdminLink(anchor: HTMLAnchorElement, event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const target = anchor.getAttribute('target');
  if (target && target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;

  const rawHref = anchor.getAttribute('href');
  if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
    return false;
  }

  try {
    const nextUrl = new URL(anchor.href, window.location.href);
    const currentUrl = new URL(window.location.href);
    if (nextUrl.origin !== currentUrl.origin) return false;
    if (nextUrl.pathname === currentUrl.pathname && nextUrl.search === currentUrl.search) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function LoadingOverlayView({ label = 'Loading workspace...' }: { label?: string }) {
  return (
    <div className="cc-loading-overlay" role="status" aria-live="polite" aria-busy="true">
      <div className="cc-loading-card">
        <svg className="cc-loading-spinner" viewBox="0 0 40 40" aria-hidden="true">
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="var(--cc-border)"
            strokeWidth="3.2"
          />
          <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="var(--periwinkle)"
            strokeWidth="3.2"
            strokeDasharray="62 34"
            strokeLinecap="round"
            className="cc-loading-arc"
          />
          <circle cx="20" cy="20" r="4" fill="var(--lime)" />
        </svg>
        <span className="cc-loading-label mono">{label}</span>
      </div>
    </div>
  );
}

function NavigationLoadingOverlayInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  const delayRef = useRef<number | undefined>(undefined);
  const safetyRef = useRef<number | undefined>(undefined);
  const pendingRef = useRef(false);

  const clearTimers = () => {
    window.clearTimeout(delayRef.current);
    window.clearTimeout(safetyRef.current);
  };

  useEffect(() => {
    pendingRef.current = false;
    clearTimers();
    setVisible(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || !isInternalAdminLink(anchor, event)) return;

      clearTimers();
      pendingRef.current = true;

      // 120ms threshold so instant transitions stay flicker-free
      delayRef.current = window.setTimeout(() => {
        if (pendingRef.current) setVisible(true);
      }, 120);

      safetyRef.current = window.setTimeout(() => {
        pendingRef.current = false;
        setVisible(false);
      }, 10000);
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      clearTimers();
    };
  }, []);

  if (!visible) return null;
  return <LoadingOverlayView />;
}

export function NavigationLoadingOverlay() {
  return (
    <Suspense fallback={null}>
      <NavigationLoadingOverlayInner />
    </Suspense>
  );
}
