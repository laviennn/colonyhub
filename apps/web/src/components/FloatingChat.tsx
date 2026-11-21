'use client';

import { useEffect, useRef, useState } from 'react';
import { CONTACT_WHATSAPP_DIGITS, type Dictionary } from '@colonyhub/content';

type FloatingChatProps = {
  dict: Dictionary;
};

/**
 * Floating chat (mobile only): opens WhatsApp with a language-aware default message.
 * Uses verified official WhatsApp number (+62 896-7529-3838, O-006 resolved 2026-11-22),
 * overridable via NEXT_PUBLIC_WHATSAPP_NUMBER.
 */
export function FloatingChat({ dict }: FloatingChatProps) {
  const [shown, setShown] = useState(false);
  const [compact, setCompact] = useState(false);
  const compactTimerRef = useRef<number | undefined>(undefined);
  const wasShownRef = useRef(false);

  const whatsappNumber = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || CONTACT_WHATSAPP_DIGITS
  ).replace(/\D/g, '');
  const hasNumber = whatsappNumber.length > 0;
  const href = hasNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(dict.chat.defaultMessage)}`
    : '#contact';

  useEffect(() => {
    const heroEl = document.querySelector('.hero');
    const contactEl = document.getElementById('contact');
    const footerEl = document.querySelector('.site-footer');
    if (!heroEl) return;

    let pastHero = false;
    let nearEnd = false;
    const endTargets = [contactEl, footerEl].filter((el): el is Element => el !== null);

    const sync = () => {
      const nextShown = pastHero && !nearEnd;
      if (nextShown && !wasShownRef.current) {
        setCompact(false);
        window.clearTimeout(compactTimerRef.current);
        compactTimerRef.current = window.setTimeout(() => setCompact(true), 3200);
      }
      wasShownRef.current = nextShown;
      setShown(nextShown);
    };

    const heroObs = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      sync();
    });
    heroObs.observe(heroEl);

    const endObs = new IntersectionObserver((entries) => {
      nearEnd =
        entries.some((e) => e.isIntersecting) ||
        endTargets.some((t) => t.getBoundingClientRect().top < window.innerHeight);
      sync();
    });
    endTargets.forEach((t) => endObs.observe(t));

    return () => {
      heroObs.disconnect();
      endObs.disconnect();
      window.clearTimeout(compactTimerRef.current);
    };
  }, []);

  return (
    <a
      className={`chat-fab${shown ? ' is-shown' : ''}${compact ? ' is-compact' : ''}`}
      href={href}
      target={hasNumber ? '_blank' : undefined}
      rel={hasNumber ? 'noopener noreferrer' : undefined}
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      aria-label={hasNumber ? dict.a11y.chatWhatsApp : dict.a11y.chatFallback}
      data-cta-id="floating_whatsapp_fab"
      data-cta-location="floating_fab"
    >
      <span className="chat-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path
            d="M4.5 18.5 5.6 15A7.5 7.5 0 1 1 9 18.4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9 10.5h6M9 13.5h3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        <i className="chat-dot" />
      </span>
      <span className="chat-label">
        <span>{dict.chat.label}</span>
      </span>
    </a>
  );
}
