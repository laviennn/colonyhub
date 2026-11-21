'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  COLONY_UNITS,
  STORY_SAMPLES,
  localePath,
  type Dictionary,
  type Locale,
  type StorySample,
} from '@colonyhub/content';

type StoriesSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

const STORY_DURATION_MS = 6000;

function StoryStickerView({ story, locale }: { story: StorySample; locale: Locale }) {
  const st = story.sticker;
  if (st.type === 'poll') {
    return (
      <div className="sf-sticker st-poll">
        {st.options[locale].map((opt) => (
          <span key={opt} className="opt">
            {opt}
          </span>
        ))}
      </div>
    );
  }
  if (st.type === 'quiz') {
    return (
      <div className="sf-sticker st-quiz">
        <p className="st-head">Quiz</p>
        <ol>
          {st.options[locale].map((opt, idx) => (
            <li key={opt} className="opt">
              <b>{'ABC'[idx]}</b>
              {opt}
            </li>
          ))}
        </ol>
      </div>
    );
  }
  if (st.type === 'slider') {
    return (
      <div className="sf-sticker st-slider">
        <p>{st.label[locale]}</p>
        <div className="st-track">
          <span className="st-thumb">
            <svg aria-hidden="true">
              <use href="#hub-mark" />
            </svg>
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="sf-sticker st-question">
      <p className="st-head">{st.label[locale]}</p>
      <p className="st-field">…</p>
    </div>
  );
}

function StoryFrame({
  story,
  locale,
  entering,
}: {
  story: StorySample;
  locale: Locale;
  entering?: boolean;
}) {
  const unit = COLONY_UNITS[story.unit] ?? { name: '', color: '#8A94F2' };
  return (
    <div
      className={entering ? 'story-frame is-entering' : 'story-frame'}
      style={
        {
          '--c': unit.color,
          backgroundImage: `url('${story.bg}')`,
        } as React.CSSProperties
      }
    >
      <div className="sf-top" aria-hidden="true">
        <div className="sf-bar">
          <i />
        </div>
        <div className="sf-who">
          <span className="sf-avatar">
            <svg>
              <use href="#hub-mark" />
            </svg>
          </span>
          colonyhub.id
          <span className="sf-unit">{unit.name}</span>
        </div>
      </div>
      <p className="sf-hook">{story.hook[locale]}</p>
      <StoryStickerView story={story} locale={locale} />
      <p className="sf-caption">{story.caption[locale]}</p>
    </div>
  );
}

export function StoriesSection({ locale, dict }: StoriesSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [swapTick, setSwapTick] = useState(0);
  const [isEntering, setIsEntering] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextBtnRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const timerRef = useRef<number | undefined>(undefined);
  const startedAtRef = useRef(0);
  const remainingRef = useRef(STORY_DURATION_MS);
  const holdTimerRef = useRef<number | undefined>(undefined);
  const heldRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const closeStory = useCallback(() => {
    window.clearTimeout(timerRef.current);
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
  }, []);

  const goNext = useCallback(() => {
    setOpenIndex((prev) => {
      if (prev === null) return null;
      if (prev < STORY_SAMPLES.length - 1) {
        setIsEntering(true);
        setSwapTick((t) => t + 1);
        return prev + 1;
      }
      closeStory();
      return prev;
    });
  }, [closeStory]);

  const goPrev = useCallback(() => {
    setOpenIndex((prev) => {
      if (prev === null) return null;
      setIsEntering(true);
      setSwapTick((t) => t + 1);
      return Math.max(prev - 1, 0);
    });
  }, []);

  // Manage timer whenever openIndex or swapTick changes
  useEffect(() => {
    window.clearTimeout(timerRef.current);
    if (openIndex === null || reducedMotion) return;

    remainingRef.current = STORY_DURATION_MS;
    startedAtRef.current = performance.now();
    setPaused(false);
    timerRef.current = window.setTimeout(goNext, STORY_DURATION_MS);

    return () => window.clearTimeout(timerRef.current);
  }, [openIndex, swapTick, reducedMotion, goNext]);

  const setViewerPaused = useCallback(
    (nextPaused: boolean) => {
      if (reducedMotion || nextPaused === paused || openIndex === null) return;
      setPaused(nextPaused);
      if (nextPaused) {
        window.clearTimeout(timerRef.current);
        remainingRef.current -= performance.now() - startedAtRef.current;
      } else {
        startedAtRef.current = performance.now();
        timerRef.current = window.setTimeout(goNext, Math.max(remainingRef.current, 0));
      }
    },
    [reducedMotion, paused, openIndex, goNext],
  );

  const openStory = (idx: number, triggerEl: HTMLButtonElement) => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    lastTriggerRef.current = triggerEl;
    setIsEntering(false);
    setOpenIndex(idx);
    setSwapTick((t) => t + 1);
    if (!dialog.open) {
      dialog.showModal();
    }
    document.body.classList.add('story-open');
    document.body.style.overflow = 'hidden';
    window.requestAnimationFrame(() => {
      nextBtnRef.current?.focus({ preventScroll: true });
    });
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(timerRef.current);
      window.clearTimeout(holdTimerRef.current);
      document.body.classList.remove('story-open');
      document.body.style.overflow = '';
    };
  }, []);

  const currentStory = openIndex !== null ? STORY_SAMPLES[openIndex] : null;
  const currentUnit = currentStory
    ? (COLONY_UNITS[currentStory.unit] ?? { name: '', color: '#8A94F2' })
    : { name: '', color: '#8A94F2' };

  return (
    <>
      <section className="stories" id="stories" aria-labelledby="stories-title">
        <div className="wrap">
          <div className="stories-head">
            <p className="col-label">{dict.stories.label}</p>
            <h2 id="stories-title">{dict.stories.title}</h2>
            <p className="stories-lead">{dict.stories.lead}</p>
            <Link className="link-quiet stories-follow" href={localePath(locale, '/contact?service=social')}>
              {dict.stories.follow}
            </Link>
          </div>
        </div>
        <ul className="story-rail" aria-label={dict.a11y.storyRail}>
          {STORY_SAMPLES.map((story, idx) => {
            const unit = COLONY_UNITS[story.unit] ?? { color: '#8A94F2' };
            return (
              <li key={story.id}>
                <button
                  type="button"
                  className="story-card"
                  style={{ '--c': unit.color } as React.CSSProperties}
                  aria-label={`${dict.stories.open}: ${story.hook[locale]}`}
                  onClick={(e) => openStory(idx, e.currentTarget)}
                >
                  <StoryFrame story={story} locale={locale} />
                  <span className="sf-ring" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <dialog
        ref={dialogRef}
        className={paused ? 'story-viewer is-paused' : 'story-viewer'}
        aria-label={dict.a11y.storyViewer}
        style={{ '--c': currentUnit.color } as React.CSSProperties}
        onClose={() => {
          window.clearTimeout(timerRef.current);
          window.clearTimeout(holdTimerRef.current);
          setOpenIndex(null);
          setPaused(false);
          document.body.classList.remove('story-open');
          document.body.style.overflow = '';
          lastTriggerRef.current?.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeStory();
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            goNext();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
          } else if (e.key === ' ' && (e.target as HTMLElement).closest('.sv-tap')) {
            e.preventDefault();
            setViewerPaused(!paused);
          }
        }}
      >
        <div
          className="sv-stage"
          onPointerDown={(e) => {
            if (!(e.target as HTMLElement).closest('.sv-tap')) return;
            holdTimerRef.current = window.setTimeout(() => {
              heldRef.current = true;
              setViewerPaused(true);
            }, 220);
          }}
          onPointerUp={() => {
            window.clearTimeout(holdTimerRef.current);
            if (heldRef.current) setViewerPaused(false);
          }}
          onPointerCancel={() => {
            window.clearTimeout(holdTimerRef.current);
            if (heldRef.current) setViewerPaused(false);
          }}
          onTouchStart={(e) => {
            touchStartYRef.current = e.touches[0]?.clientY ?? null;
          }}
          onTouchEnd={(e) => {
            const y0 = touchStartYRef.current;
            const y1 = e.changedTouches[0]?.clientY;
            if (y0 !== null && y1 !== undefined && y1 - y0 > 90) {
              closeStory();
            }
            touchStartYRef.current = null;
          }}
        >
          <div
            className="sv-bars"
            style={{ '--dur': `${STORY_DURATION_MS}ms` } as React.CSSProperties}
            aria-hidden="true"
          >
            {STORY_SAMPLES.map((story, idx) => {
              const cls =
                openIndex === null
                  ? ''
                  : idx < openIndex
                    ? 'done'
                    : idx === openIndex
                      ? 'now'
                      : '';
              return (
                <span key={`${story.id}-${idx === openIndex ? swapTick : 's'}`} className={cls}>
                  <i style={reducedMotion && idx === openIndex ? { width: '100%' } : undefined} />
                </span>
              );
            })}
          </div>

          <div className="sv-top">
            <span className="sv-avatar" aria-hidden="true">
              <svg className="mark-dark">
                <use href="#hub-mark" />
              </svg>
            </span>
            <span className="sv-handle">colonyhub.id</span>
            <span className="sv-unit mono">{currentUnit.name}</span>
            <button
              type="button"
              className="sv-btn sv-pause"
              aria-label={paused ? dict.a11y.play : dict.a11y.pause}
              onClick={() => setViewerPaused(!paused)}
            >
              <span aria-hidden="true" />
            </button>
            <button
              type="button"
              className="sv-btn sv-close"
              aria-label={dict.a11y.closeStories}
              onClick={closeStory}
            >
              <span aria-hidden="true" />
            </button>
          </div>

          <div className="sv-frame">
            {currentStory ? (
              <StoryFrame
                key={`${currentStory.id}-${swapTick}`}
                story={currentStory}
                locale={locale}
                entering={isEntering}
              />
            ) : null}
          </div>

          <button
            type="button"
            className="sv-tap sv-prev"
            aria-label={dict.a11y.prevStory}
            onClick={() => {
              if (heldRef.current) {
                heldRef.current = false;
                return;
              }
              goPrev();
            }}
          />
          <button
            ref={nextBtnRef}
            type="button"
            className="sv-tap sv-next"
            aria-label={dict.a11y.nextStory}
            onClick={() => {
              if (heldRef.current) {
                heldRef.current = false;
                return;
              }
              goNext();
            }}
          />

          <div className="sv-foot">
            <Link
              className="btn btn--lime btn--sm"
              href={localePath(locale, '/contact?service=social')}
              onPointerEnter={() => setViewerPaused(true)}
              onPointerLeave={() => setViewerPaused(false)}
              onClick={() => closeStory()}
            >
              <span>{dict.stories.answer}</span>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
