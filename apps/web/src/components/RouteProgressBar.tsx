'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

function isInternalNavigationLink(anchor: HTMLAnchorElement, event: MouseEvent): boolean {
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

function RouteProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const delayTimerRef = useRef<number | undefined>(undefined);
  const trickleTimerRef = useRef<number | undefined>(undefined);
  const hideTimerRef = useRef<number | undefined>(undefined);
  const safetyTimerRef = useRef<number | undefined>(undefined);
  const activeRef = useRef(false);

  const clearAllTimers = () => {
    window.clearTimeout(delayTimerRef.current);
    window.clearInterval(trickleTimerRef.current);
    window.clearTimeout(hideTimerRef.current);
    window.clearTimeout(safetyTimerRef.current);
  };

  // Complete progress bar whenever the route finishes changing
  useEffect(() => {
    if (!activeRef.current) return;
    activeRef.current = false;
    clearAllTimers();
    setProgress(1);
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 220);
  }, [pathname, searchParams]);

  // Listen for internal link clicks
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || !isInternalNavigationLink(anchor, event)) return;

      clearAllTimers();
      activeRef.current = true;

      // Only show if navigation takes > 150ms so instant SSG routes never flash
      delayTimerRef.current = window.setTimeout(() => {
        if (!activeRef.current) return;
        setVisible(true);
        setProgress(0.24);
        trickleTimerRef.current = window.setInterval(() => {
          setProgress((prev) => (prev < 0.88 ? prev + (0.9 - prev) * 0.16 : prev));
        }, 220);
      }, 150);

      // Safety fallback in case navigation is cancelled
      safetyTimerRef.current = window.setTimeout(() => {
        activeRef.current = false;
        clearAllTimers();
        setVisible(false);
        setProgress(0);
      }, 8000);
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      clearAllTimers();
    };
  }, []);

  return (
    <div
      className={visible ? 'route-progress is-visible' : 'route-progress'}
      aria-hidden="true"
    >
      <span
        className="route-progress-bar"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

export function RouteProgressBar() {
  return (
    <Suspense fallback={null}>
      <RouteProgressBarInner />
    </Suspense>
  );
}
