'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { COLONY_UNITS, type ColonyUnit, type Dictionary, type Locale } from '@colonyhub/content';

type NetworkSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

type StopGeometry = {
  name: string;
  desc: string;
  x: number;
  y: number;
  below: boolean;
};

type TipState = {
  unitName: string;
  color: string;
  name: string;
  desc: string;
  x: number;
  y: number;
  below: boolean;
};

function computeStops(unit: ColonyUnit, locale: Locale): StopGeometry[] {
  const path = unit.path;
  const rawA = path[path.length - 2]!;
  const b = path[path.length - 1]!;
  const a: readonly [number, number] =
    path.length === 2 ? [rawA[0] + Math.sign(b[0] - rawA[0]) * 70, rawA[1]] : rawA;
  const stops = unit.stops[locale];
  const below = b[1] > 300;
  return stops.map(([name, desc], k) => {
    const t = (k + 1) / (stops.length + 1);
    return {
      name,
      desc,
      x: a[0] + (b[0] - a[0]) * t,
      y: a[1] + (b[1] - a[1]) * t,
      below,
    };
  });
}

export function NetworkSection({ locale, dict }: NetworkSectionProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);
  const [pinnedIdx, setPinnedIdx] = useState<number>(-1);
  const [openIdx, setOpenIdx] = useState<number>(0);
  const [instantAccordion, setInstantAccordion] = useState<boolean>(true);
  const [tip, setTip] = useState<TipState | null>(null);
  const [tipPos, setTipPos] = useState<{ left: number; top: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const mapWrapRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const legendRef = useRef<HTMLUListElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const holdRafRef = useRef<number>(0);

  const activeIdx = hoveredIdx >= 0 ? hoveredIdx : pinnedIdx;

  // Keep DOM `inert` synced for closed mobile accordion panels
  useEffect(() => {
    panelRefs.current.forEach((panel, idx) => {
      if (panel) {
        panel.inert = idx !== openIdx;
      }
    });
  }, [openIdx]);

  useEffect(() => {
    return () => window.cancelAnimationFrame(holdRafRef.current);
  }, []);

  // Position tooltip cleanly inside map bounds once rendered
  useLayoutEffect(() => {
    if (!tip || !svgRef.current || !mapWrapRef.current || !tipRef.current) {
      setTipPos(null);
      return;
    }
    const r = svgRef.current.getBoundingClientRect();
    const w = mapWrapRef.current.getBoundingClientRect();
    const s = r.width / 1200;
    const px = r.left - w.left + tip.x * s;
    const py = r.top - w.top + tip.y * s;
    const tw = tipRef.current.offsetWidth;
    const th = tipRef.current.offsetHeight;
    const left = Math.min(Math.max(px - tw / 2, 8), w.width - tw - 8);
    const top = tip.below ? py - th - 22 : py + 22;
    setTipPos({ left, top });
  }, [tip]);

  const isMobileViewport = () =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

  const openAccordion = (index: number, shouldOpen: boolean, anchorBtn: HTMLButtonElement | null) => {
    const startTop = anchorBtn ? anchorBtn.getBoundingClientRect().top : 0;
    setInstantAccordion(false);
    setOpenIdx(shouldOpen ? index : -1);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!anchorBtn || reduced || !legendRef.current) return;

    window.cancelAnimationFrame(holdRafRef.current);
    const legendEl = legendRef.current;
    const t0 = performance.now();
    let lastH = -1;
    let still = 0;

    const hold = () => {
      const drift = anchorBtn.getBoundingClientRect().top - startTop;
      if (Math.abs(drift) > 0.5) {
        window.scrollBy({ top: drift, behavior: 'instant' as ScrollBehavior });
      }
      const h = legendEl.offsetHeight;
      still = h === lastH ? still + 1 : 0;
      lastH = h;
      const elapsed = performance.now() - t0;
      if ((elapsed < 300 || still < 4) && elapsed < 2000) {
        holdRafRef.current = window.requestAnimationFrame(hold);
      }
    };
    holdRafRef.current = window.requestAnimationFrame(hold);
  };

  const showStopTip = (unitIdx: number, unit: ColonyUnit, stop: StopGeometry) => {
    setHoveredIdx(unitIdx);
    setTip({
      unitName: unit.officialName,
      color: unit.color,
      name: stop.name,
      desc: stop.desc,
      x: stop.x,
      y: stop.y,
      below: stop.below,
    });
  };

  const hideTip = () => setTip(null);

  return (
    <section className="network" id="network" aria-labelledby="net-title">
      <div className="wrap">
        <div className="net-head">
          <p className="col-label">{dict.net.label}</p>
          <h2 id="net-title">{dict.net.title}</h2>
          <p className="net-lead">{dict.net.lead}</p>
        </div>

        <div
          ref={mapWrapRef}
          className="net-map"
          data-net-map
          data-active={activeIdx >= 0 ? activeIdx : undefined}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 1200 600"
            role="img"
            aria-labelledby="map-desc"
            data-map
            onMouseLeave={() => {
              setHoveredIdx(-1);
              hideTip();
            }}
          >
            <desc id="map-desc">{dict.a11y.mapDesc}</desc>

            {COLONY_UNITS.map((unit, i) => {
              const d = `M${unit.path.map((p) => p.join(' ')).join(' L')}`;
              const stops = computeStops(unit, locale);
              const end = unit.path[unit.path.length - 1]!;
              const right = end[0] > 600;
              const isOn = activeIdx === i;

              return (
                <g
                  key={unit.slug}
                  className={isOn ? 'grp is-on' : 'grp'}
                  data-i={i}
                  style={{ '--c': unit.color } as React.CSSProperties}
                  onMouseEnter={() => setHoveredIdx(i)}
                >
                  <path className="line" d={d} />
                  <path className="hit" d={d} />

                  {stops.map((stop) => (
                    <g
                      key={stop.name}
                      className="st"
                      tabIndex={0}
                      role="button"
                      aria-label={`${stop.name}: ${stop.desc}`}
                      onMouseEnter={() => showStopTip(i, unit, stop)}
                      onFocus={() => showStopTip(i, unit, stop)}
                      onClick={() => showStopTip(i, unit, stop)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          showStopTip(i, unit, stop);
                        } else if (e.key === 'Escape') {
                          hideTip();
                        }
                      }}
                      onMouseLeave={hideTip}
                      onBlur={hideTip}
                    >
                      <circle className="st-hit" cx={stop.x} cy={stop.y} r={18} />
                      <circle className="stop" cx={stop.x} cy={stop.y} r={7} />
                      <text
                        className="stop-label"
                        x={stop.x + 6}
                        y={stop.y + (stop.below ? 26 : -18)}
                        transform={`rotate(${stop.below ? 32 : -32} ${stop.x} ${stop.y})`}
                      >
                        {stop.name}
                      </text>
                    </g>
                  ))}

                  <circle className="term" cx={end[0]} cy={end[1]} r={13} />
                  <circle cx={end[0]} cy={end[1]} r={5} fill="#0B1230" />
                  <text
                    className="term-label"
                    x={end[0] + (right ? 26 : -26)}
                    y={end[1] + 9}
                    textAnchor={right ? 'start' : 'end'}
                  >
                    {unit.name}
                  </text>
                </g>
              );
            })}

            <g className="hub">
              <circle className="hub-ring" cx={600} cy={300} r={46} />
              <use
                href="#hub-mark"
                x={572}
                y={272}
                width={56}
                height={56}
                className="mark-dark"
              />
              <text className="hub-label" x={600} y={372}>
                COLONYHUB
              </text>
            </g>
          </svg>

          <div
            ref={tipRef}
            className="stop-tip"
            role="tooltip"
            hidden={!tip}
            style={
              tip
                ? ({
                    '--c': tip.color,
                    left: tipPos ? `${tipPos.left}px` : undefined,
                    top: tipPos ? `${tipPos.top}px` : undefined,
                  } as React.CSSProperties)
                : undefined
            }
          >
            <p className="tip-unit mono">{tip?.unitName ?? ''}</p>
            <p className="tip-name">{tip?.name ?? ''}</p>
            <p className="tip-desc">{tip?.desc ?? ''}</p>
          </div>
          <p className="map-hint mono">{dict.net.hint}</p>
        </div>

        <ul
          ref={legendRef}
          className="legend"
          aria-label={dict.a11y.serviceLines}
          onMouseLeave={() => setHoveredIdx(-1)}
          onBlur={(e) => {
            if (
              legendRef.current &&
              !legendRef.current.contains(e.relatedTarget as Node | null)
            ) {
              setHoveredIdx(-1);
            }
          }}
        >
          {COLONY_UNITS.map((unit, i) => {
            const isOpen = openIdx === i;
            const isPinned = pinnedIdx === i;
            return (
              <li key={unit.slug} style={{ '--c': unit.color } as React.CSSProperties}>
                <button
                  type="button"
                  className="lg-btn"
                  aria-pressed={isPinned}
                  aria-expanded={isOpen}
                  aria-controls={`lg-p${i}`}
                  onMouseEnter={() => {
                    if (!isMobileViewport()) setHoveredIdx(i);
                  }}
                  onFocus={() => {
                    if (!isMobileViewport()) setHoveredIdx(i);
                  }}
                  onClick={(e) => {
                    if (isMobileViewport()) {
                      openAccordion(i, !isOpen, e.currentTarget);
                    } else {
                      setPinnedIdx((prev) => (prev === i ? -1 : i));
                    }
                  }}
                >
                  <span className="swatch" aria-hidden="true" />
                  <span className="lg-text">
                    <strong>{unit.officialName}</strong>
                    <span className="sub">{unit.sub[locale]}</span>
                  </span>
                  <span className="lg-chev" aria-hidden="true" />
                </button>
                <div
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className={`lg-panel${isOpen ? ' is-open' : ''}${instantAccordion ? ' no-anim' : ''}`}
                  id={`lg-p${i}`}
                  inert={!isOpen}
                >
                  <div className="lg-inner">
                    <ol className="m-stops">
                      {unit.stops[locale].map(([name, desc], k) => (
                        <li key={name} style={{ '--k': k } as React.CSSProperties}>
                          <strong>{name}</strong>
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
