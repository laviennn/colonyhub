'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@colonyhub/content';

type StatementSectionProps = {
  dict: Dictionary;
};

export function StatementSection({ dict }: StatementSectionProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const words = dict.st.text.trim().split(/\s+/);
  const [armed, setArmed] = useState(false);
  const [litCount, setLitCount] = useState(words.length);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setArmed(false);
      setLitCount(words.length);
      return;
    }

    setArmed(true);

    const onScroll = () => {
      const el = headingRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      setLitCount(Math.round(p * words.length));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [words.length]);

  return (
    <section className="statement" aria-labelledby="st-title">
      <div className="wrap st-inner">
        <p className="col-label col-label--dark">{dict.st.label}</p>
        <h2
          ref={headingRef}
          className={armed ? 'st-text is-armed' : 'st-text'}
          id="st-title"
          aria-label={dict.st.text}
        >
          {words.map((word, idx) => {
            const isKey = dict.st.keyWords.includes(word);
            const isLit = !armed || idx < litCount;
            const cls = `w${isKey ? ' key' : ''}${isLit ? ' is-lit' : ''}`;
            return (
              <span key={`${idx}-${word}`}>
                <span className={cls} aria-hidden="true">
                  {word}
                </span>
                {idx < words.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </h2>
      </div>
    </section>
  );
}
