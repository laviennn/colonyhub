'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  COLONY_UNITS,
  localePath,
  type Dictionary,
  type Locale,
} from '@colonyhub/content';

type SiteHeaderProps = {
  locale: Locale;
  dict: Dictionary;
  /** Logical route path without locale prefix, e.g. '/', '/services', '/services/strategy' */
  currentPath?: string;
  /** Optional explicit href for the opposite locale (used by localized articles) */
  alternateLocaleHref?: string;
};

export function SiteHeader({
  locale,
  dict,
  currentPath = '/',
  alternateLocaleHref,
}: SiteHeaderProps) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const megaWrapRef = useRef<HTMLLIElement>(null);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimerRef = useRef<number | undefined>(undefined);
  const hoverOpenedAtRef = useRef<number>(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (megaWrapRef.current && !megaWrapRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    const menuEl = menuRef.current;
    if (menuEl) {
      menuEl.inert = !menuOpen;
    }
    document.body.classList.toggle('menu-open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    let focusTimer: number | undefined;
    if (menuOpen && menuEl) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const focusFirst = () => {
        const firstLink = menuEl.querySelector<HTMLAnchorElement>('a');
        firstLink?.focus({ preventScroll: true });
      };
      focusTimer = window.setTimeout(focusFirst, reduced ? 20 : 180);
    }

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (megaOpen) {
          setMegaOpen(false);
          megaTriggerRef.current?.focus();
        }
        if (menuOpen) {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }
      }
      if (e.key === 'Tab' && menuOpen && menuRef.current && toggleRef.current) {
        const focusables = [
          toggleRef.current,
          ...Array.from(menuRef.current.querySelectorAll<HTMLElement>('a, button')),
        ].filter((el) => el.offsetParent !== null);
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [megaOpen, menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1101px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const hoverEnabled = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const enHref =
    locale === 'en'
      ? localePath('en', currentPath)
      : (alternateLocaleHref ?? localePath('en', currentPath));
  const idHref =
    locale === 'id'
      ? localePath('id', currentPath)
      : (alternateLocaleHref ?? localePath('id', currentPath));

  const servicesHref = localePath(locale, '/services');
  const approachHref = localePath(locale, '/approach');
  const insightsHref = localePath(locale, '/insights');
  const aboutHref = localePath(locale, '/about');
  const contactHref = localePath(locale, '/contact');

  const isServicesActive = currentPath === '/services' || currentPath.startsWith('/services/');
  const isInsightsActive = currentPath === '/insights' || currentPath.startsWith('/insights/');

  return (
    <header className="site-header" data-header>
      <div className="header-inner">
        <Link className="logo" href={localePath(locale, '/')} aria-label={dict.a11y.logoHome}>
          <svg className="logo-mark mark-dark" aria-hidden="true">
            <use href="#hub-mark" />
          </svg>
          <span className="wordmark">
            colony<span>hub</span>
          </span>
        </Link>

        <nav className="primary-nav" aria-label={dict.a11y.primaryNav}>
          <ul>
            <li
              className="has-mega"
              ref={megaWrapRef}
              onMouseEnter={() => {
                if (hoverEnabled()) {
                  window.clearTimeout(hoverTimerRef.current);
                  if (!megaOpen) {
                    hoverOpenedAtRef.current = performance.now();
                    setMegaOpen(true);
                  }
                }
              }}
              onMouseLeave={() => {
                if (hoverEnabled()) {
                  hoverTimerRef.current = window.setTimeout(() => setMegaOpen(false), 160);
                }
              }}
              onBlur={(e) => {
                if (
                  megaWrapRef.current &&
                  !megaWrapRef.current.contains(e.relatedTarget as Node | null)
                ) {
                  setMegaOpen(false);
                }
              }}
            >
              <button
                ref={megaTriggerRef}
                type="button"
                className="nav-link"
                aria-expanded={megaOpen}
                aria-controls="mega"
                aria-current={isServicesActive ? 'page' : undefined}
                onClick={() => {
                  if (performance.now() - hoverOpenedAtRef.current < 350) {
                    setMegaOpen(true);
                    return;
                  }
                  setMegaOpen((prev) => !prev);
                }}
              >
                <span>{dict.nav.services}</span>
                <svg className="chev" viewBox="0 0 12 12" aria-hidden="true">
                  <path
                    d="M3 4.5 6 7.5 9 4.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div
                className="mega"
                id="mega"
                hidden={!megaOpen}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('a')) setMegaOpen(false);
                }}
              >
                <ul className="mega-lines">
                  {COLONY_UNITS.map((unit) => (
                    <li key={unit.slug}>
                      <Link
                        href={localePath(locale, `/services/${unit.slug}`)}
                        style={{ '--c': unit.color } as React.CSSProperties}
                      >
                        <span className="swatch" aria-hidden="true" />
                        <strong>{unit.officialName}</strong>
                        <small>{unit.sub[locale]}</small>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mega-side">
                  <p className="mega-title">{dict.mega.models}</p>
                  <Link href={`${servicesHref}#models`}>
                    <strong>Seed</strong>
                    <span>{dict.pkg.seed.kicker}</span>
                  </Link>
                  <Link href={`${servicesHref}#models`}>
                    <strong>Grow</strong>
                    <span>{dict.pkg.grow.kicker}</span>
                  </Link>
                  <Link href={`${servicesHref}#models`}>
                    <strong>Scale</strong>
                    <span>{dict.pkg.scale.kicker}</span>
                  </Link>
                  <Link href={servicesHref} style={{ marginTop: 6 }}>
                    <strong>{dict.nav.services} →</strong>
                  </Link>
                </div>
              </div>
            </li>
            <li>
              <Link
                className="nav-link"
                href={approachHref}
                aria-current={currentPath === '/approach' ? 'page' : undefined}
              >
                {dict.nav.approach}
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href={insightsHref}
                aria-current={isInsightsActive ? 'page' : undefined}
              >
                {dict.nav.insights}
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href={aboutHref}
                aria-current={currentPath === '/about' ? 'page' : undefined}
              >
                {dict.nav.about}
              </Link>
            </li>
            <li>
              <Link
                className="nav-link"
                href={contactHref}
                aria-current={currentPath === '/contact' ? 'page' : undefined}
              >
                {dict.ft.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className="lang" role="group" aria-label={dict.a11y.language}>
            <Link href={enHref} hrefLang="en" aria-current={locale === 'en' ? 'page' : undefined}>
              EN
            </Link>
            <Link href={idHref} hrefLang="id" aria-current={locale === 'id' ? 'page' : undefined}>
              ID
            </Link>
          </div>
          <Link
            className="btn btn--lime btn--sm header-cta"
            href={contactHref}
            data-cta-id="header_consultation_cta"
            data-cta-location="header"
          >
            {dict.cta.short}
          </Link>
          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span>{dict.nav.menu}</span>
            <span className="menu-icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={menuRef}
        className={menuOpen ? 'mobile-menu is-open' : 'mobile-menu'}
        id="mobile-menu"
        inert={!menuOpen}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('a')) setMenuOpen(false);
        }}
      >
        <nav className="wrap" aria-label={dict.a11y.mobileNav}>
          <Link
            className="m-link"
            style={{ '--k': 0 } as React.CSSProperties}
            href={servicesHref}
            aria-current={isServicesActive ? 'page' : undefined}
          >
            {dict.nav.services}
          </Link>
          <Link
            className="m-link"
            style={{ '--k': 1 } as React.CSSProperties}
            href={approachHref}
            aria-current={currentPath === '/approach' ? 'page' : undefined}
          >
            {dict.nav.approach}
          </Link>
          <Link
            className="m-link"
            style={{ '--k': 2 } as React.CSSProperties}
            href={`${servicesHref}#models`}
          >
            {dict.nav.models}
          </Link>
          <Link
            className="m-link"
            style={{ '--k': 3 } as React.CSSProperties}
            href={insightsHref}
            aria-current={isInsightsActive ? 'page' : undefined}
          >
            {dict.nav.insights}
          </Link>
          <Link
            className="m-link"
            style={{ '--k': 4 } as React.CSSProperties}
            href={aboutHref}
            aria-current={currentPath === '/about' ? 'page' : undefined}
          >
            {dict.nav.about}
          </Link>
          <Link
            className="m-link"
            style={{ '--k': 5 } as React.CSSProperties}
            href={contactHref}
            aria-current={currentPath === '/contact' ? 'page' : undefined}
          >
            {dict.ft.contact}
          </Link>
          <div className="m-foot" style={{ '--k': 6 } as React.CSSProperties}>
            <Link className="btn btn--lime" href={contactHref}>
              {dict.cta.long}
            </Link>
            <div className="lang" role="group" aria-label={dict.a11y.language}>
              <Link href={enHref} hrefLang="en" aria-current={locale === 'en' ? 'page' : undefined}>
                EN
              </Link>
              <Link href={idHref} hrefLang="id" aria-current={locale === 'id' ? 'page' : undefined}>
                ID
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
