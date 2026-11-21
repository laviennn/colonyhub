'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { COLONY_UNITS, localePath, type Dictionary, type Locale } from '@colonyhub/content';
import { HeroClock } from './HeroClock';

type HeroSectionProps = {
  locale: Locale;
  dict: Dictionary;
};

/* Mark geometry in the 100x100 symbol box: x, y, radius, depth (ported verbatim from prototype/hero-nodes.js) */
const MARK: readonly (readonly [number, number, number, number])[] = [
  [60, 18, 9.5, 0.04],
  [36, 30, 10, -0.02],
  [20, 54, 14, 0.0],
  [35, 78, 10, 0.03],
  [58, 88, 10.5, -0.03],
  [80, 79, 7.5, 0.02],
  [80, 26, 7, 0.05],
];
const CHAIN = [6, 0, 1, 2, 3, 4, 5] as const;
const DOTS = 6;

function buildFragmentShader(isMobile: boolean): string {
  return /* glsl */ `
  precision highp float;
  #define STEPS ${isMobile ? 32 : 40}
  uniform vec4 uNodes[7];
  uniform vec3 uDots[${DOTS}];
  uniform vec3 uMouse;
  uniform vec2 uCenter;
  uniform float uSize, uK, uBone, uDotR, uMouseR, uReveal;
  uniform vec3 uBound;

  const vec3 C_LIGHT = vec3(0.663, 0.690, 0.965);
  const vec3 C_MID   = vec3(0.353, 0.392, 0.816);
  const vec3 C_PERI  = vec3(0.541, 0.580, 0.949);
  const vec3 C_LIME  = vec3(0.776, 0.957, 0.196);
  const vec3 C_CLOUD = vec3(0.965, 0.957, 0.933);

  vec3 nodeCol(int i) {
    if (i == 6) return C_LIME;
    if (i == 1 || i == 3) return C_MID;
    if (i == 0 || i == 5) return C_LIGHT;
    return C_PERI;
  }

  float smin(float a, float b, float k) {
    if (k <= 0.0001) return min(a, b);
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }
  float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
  }

  vec3 gCol; float gGlow;

  float map(vec3 p, bool withColor) {
    float d = 1e5; vec3 cs = vec3(0.0); float ws = 0.0; float glow = 0.0;
    for (int i = 0; i < 7; i++) {
      float di = length(p - uNodes[i].xyz) - uNodes[i].w;
      d = smin(d, di, uK);
      if (withColor) { float w = exp(-max(di, 0.0) * 60.0) * (i == 6 ? 2.5 : 1.0); cs += nodeCol(i) * w; ws += w; }
    }
    if (uBone > 0.0001) {
      for (int k = 0; k < 6; k++) {
        int a = k == 0 ? 6 : k - 1;
        int b = k == 0 ? 0 : k;
        float db = sdCapsule(p, uNodes[a].xyz, uNodes[b].xyz, uBone);
        d = smin(d, db, uK * 0.8);
        if (withColor) { float w = exp(-max(db, 0.0) * 60.0) * 0.2; cs += C_MID * w; ws += w; }
      }
    }
    for (int j = 0; j < ${DOTS}; j++) {
      float dd = length(p - uDots[j]) - uDotR;
      d = smin(d, dd, 0.025);
      if (withColor) { float w = exp(-max(dd, 0.0) * 90.0) * 6.0; cs += C_LIME * w; ws += w; glow += w; }
    }
    float dm = length(p - uMouse) - uMouseR;
    d = smin(d, dm, 0.14);
    if (withColor) {
      float w = exp(-max(dm, 0.0) * 28.0) * 0.9; cs += C_CLOUD * w; ws += w;
      gCol = cs / max(ws, 1e-4); gGlow = glow;
    }
    return d;
  }

  vec3 calcNormal(vec3 p) {
    const vec2 e = vec2(0.0015, -0.0015);
    return normalize(e.xyy * map(p + e.xyy, false) + e.yyx * map(p + e.yyx, false) +
                     e.yxy * map(p + e.yxy, false) + e.xxx * map(p + e.xxx, false));
  }

  void main() {
    vec2 q = (gl_FragCoord.xy - uCenter) / uSize;
    vec3 ro = vec3(q * 1.0, 1.2);
    vec3 rd = normalize(vec3(q * 0.18, -1.0));
    ro.xy = q;
    if (length(q - uBound.xy) > uBound.z) discard;
    float t = 0.85, minD = 1e5; bool hit = false;
    for (int i = 0; i < STEPS; i++) {
      vec3 p = ro + rd * t;
      float d = map(p, false);
      minD = min(minD, d);
      if (d < 0.0008) { hit = true; break; }
      t += d;
      if (t > 2.6) break;
    }
    if (!hit) {
      float a = exp(-max(minD, 0.0) * 18.0) * 0.22 * uReveal;
      gl_FragColor = vec4(C_PERI, a);
      return;
    }
    vec3 p = ro + rd * t;
    map(p, true);
    vec3 n = calcNormal(p);
    vec3 L = normalize(vec3(-0.55, 0.65, 0.75));
    float diff = max(dot(n, L), 0.0);
    float amb = 0.38 + 0.25 * n.y;
    vec3 h = normalize(L - rd);
    float spec = pow(max(dot(n, h), 0.0), 48.0) * 0.55;
    float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    vec3 col = gCol * (amb + diff * 0.85) + spec + fres * vec3(0.78, 0.82, 1.0) * 0.45;
    col += C_LIME * min(gGlow, 1.0) * 0.35;
    gl_FragColor = vec4(col, uReveal);
  }
`;
}

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function shouldRunWebGL(): boolean {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (conn && (conn.saveData || /2g/.test(conn.effectiveType ?? ''))) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;
  try {
    if (!document.createElement('canvas').getContext('webgl2')) return false;
  } catch {
    return false;
  }
  return true;
}

export function HeroSection({ locale, dict }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!hero || !panel || !canvas || !fallback) return;
    if (!shouldRunWebGL()) return;

    let cancelled = false;
    let cleanupFn: (() => void) | null = null;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const init = async () => {
      const THREE = await import('three');
      if (cancelled) return;

      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
        premultipliedAlpha: false,
      });
      renderer.setClearColor(0x000000, 0);
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const U = {
        uNodes: { value: MARK.map(() => new THREE.Vector4()) },
        uDots: { value: Array.from({ length: DOTS }, () => new THREE.Vector3(9, 9, 0)) },
        uMouse: { value: new THREE.Vector3(9, 9, 0) },
        uCenter: { value: new THREE.Vector2() },
        uSize: { value: 1 },
        uBound: { value: new THREE.Vector3(0, 0, 9) },
        uK: { value: 0 },
        uBone: { value: 0 },
        uDotR: { value: 0.016 },
        uMouseR: { value: 0.07 },
        uReveal: { value: 0 },
      };

      const material = new THREE.ShaderMaterial({
        uniforms: U,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
        fragmentShader: buildFragmentShader(isMobile),
      });
      const geometry = new THREE.PlaneGeometry(2, 2);
      const quad = new THREE.Mesh(geometry, material);
      scene.add(quad);

      const rand = (a: number, b: number) => a + Math.random() * (b - a);
      const nodes = MARK.map(([x, y, r, z]) => ({
        to: [(x - 50) / 100, -(y - 53) / 100, z] as const,
        r: r / 100,
        from: [rand(-1.1, 1.1), rand(-0.7, 0.7), rand(-0.2, 0.2)] as const,
        phase: rand(0, 6.28),
      }));

      let pr = 1;
      let prScale = isMobile ? 0.5 : 0.8;
      const perf = { start: 0, frames: 0, done: false };

      const layout = () => {
        const rect = canvas.getBoundingClientRect();
        pr = Math.min(window.devicePixelRatio || 1, 2) * prScale;
        renderer.setPixelRatio(pr);
        renderer.setSize(rect.width, rect.height, false);
        const fb = fallback.getBoundingClientRect();
        const size = Math.min(fb.width, fb.height || fb.width);
        U.uSize.value = size * pr * 1.3;
        U.uCenter.value.set(
          (fb.left + fb.width / 2 - rect.left) * pr,
          (rect.bottom - (fb.top + fb.height / 2)) * pr,
        );
      };

      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const easeIO = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
      const INTRO = 2200;
      const mouse = { x: 9, y: 9, tx: 9, ty: 9 };
      let t0 = 0;
      let raf = 0;
      let running = false;
      let visible = true;
      let last = 0;

      const chainPoint = (s: number): [number, number, number] => {
        const segs = CHAIN.length - 1;
        const f = (((s % 1) + 1) % 1) * segs;
        const i = Math.floor(f);
        const u = f - i;
        const A = U.uNodes.value[CHAIN[i]!]!;
        const B = U.uNodes.value[CHAIN[i + 1]!]!;
        return [A.x + (B.x - A.x) * u, A.y + (B.y - A.y) * u, (A.z + B.z) / 2 + 0.01];
      };

      const frame = (now: number) => {
        if (isMobile && now - last < 31) {
          if (running) raf = window.requestAnimationFrame(frame);
          return;
        }
        last = now;
        if (!t0) t0 = now;
        const el = now - t0;
        const time = now / 1000;
        const k = clamp01(el / INTRO);

        nodes.forEach((n, i) => {
          const kk = easeIO(clamp01((k - i * 0.04) / (1 - 6 * 0.04)));
          const bob = Math.sin(time * 0.9 + n.phase) * 0.006 * kk;
          const v = U.uNodes.value[i]!;
          v.set(
            n.from[0] + (n.to[0] - n.from[0]) * kk,
            n.from[1] + (n.to[1] - n.from[1]) * kk + bob,
            n.from[2] + (n.to[2] - n.from[2]) * kk,
            n.r * (0.55 + 0.45 * kk) * (1 + Math.sin(time * 1.3 + n.phase) * 0.025 * kk),
          );
        });
        U.uK.value = 0.075 * ease(clamp01((k - 0.15) / 0.85));
        U.uBone.value = 0.028 * ease(clamp01((k - 0.45) / 0.55));
        U.uReveal.value = ease(clamp01(el / 500));

        const dotsOn = clamp01((el - INTRO * 0.85) / 600);
        U.uDots.value.forEach((d, j) => {
          if (dotsOn <= 0) {
            d.set(9, 9, 0);
            return;
          }
          const p = chainPoint(time * 0.045 + j / DOTS);
          d.set(p[0], p[1], p[2]);
        });
        U.uDotR.value = 0.016 * dotsOn;

        let bx = 0;
        let by = 0;
        let br = 0;
        const pts: [number, number, number][] = U.uNodes.value.map((v) => [v.x, v.y, v.w]);
        if (mouse.x < 5) pts.push([mouse.x, mouse.y, U.uMouseR.value]);
        for (const p of pts) {
          bx += p[0];
          by += p[1];
        }
        bx /= pts.length;
        by /= pts.length;
        for (const p of pts) {
          br = Math.max(br, Math.hypot(p[0] - bx, p[1] - by) + p[2]);
        }
        U.uBound.value.set(bx, by, br + 0.2);

        mouse.x += (mouse.tx - mouse.x) * 0.12;
        mouse.y += (mouse.ty - mouse.y) * 0.12;
        U.uMouse.value.set(mouse.x, mouse.y, 0.02);

        renderer.render(scene, camera);
        perf.frames++;
        if (!perf.done && el > INTRO + 1200) {
          perf.done = true;
          const fps = perf.frames / ((el - perf.start) / 1000);
          if (fps < (isMobile ? 24 : 40)) {
            prScale = Math.max(0.35, prScale - 0.2);
            layout();
          }
        } else if (!perf.start && el > INTRO + 200) {
          perf.start = el;
          perf.frames = 0;
        }
        if (running) raf = window.requestAnimationFrame(frame);
      };

      const play = () => {
        if (!running && visible && !document.hidden) {
          running = true;
          raf = window.requestAnimationFrame(frame);
        }
      };
      const pause = () => {
        running = false;
        window.cancelAnimationFrame(raf);
      };

      layout();
      hero.classList.add('has-webgl');
      play();

      const onPointerMove = (e: PointerEvent) => {
        const fb = fallback.getBoundingClientRect();
        const size = Math.min(fb.width, fb.height || fb.width) * 1.3;
        const mx = (e.clientX - (fb.left + fb.width / 2)) / size;
        const my = -(e.clientY - (fb.top + fb.height / 2)) / size;
        const near = Math.hypot(mx, my) < 0.95;
        mouse.tx = near ? mx : 9;
        mouse.ty = near ? my : 9;
        if (mouse.x > 5 && near) {
          mouse.x = mx * 1.4;
          mouse.y = my * 1.4;
        }
      };
      const onPointerLeave = () => {
        mouse.tx = 9;
        mouse.ty = 9;
      };
      panel.addEventListener('pointermove', onPointerMove);
      panel.addEventListener('pointerleave', onPointerLeave);

      const io = new IntersectionObserver(([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible) play();
        else pause();
      });
      io.observe(panel);

      const onVis = () => {
        if (document.hidden) pause();
        else play();
      };
      document.addEventListener('visibilitychange', onVis);

      let resizeTimer: number | undefined;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          layout();
          if (!running) frame(performance.now());
        }, 150);
      };
      window.addEventListener('resize', onResize);

      let disposed = false;
      const teardown = () => {
        if (disposed) return;
        disposed = true;
        pause();
        io.disconnect();
        window.clearTimeout(resizeTimer);
        panel.removeEventListener('pointermove', onPointerMove);
        panel.removeEventListener('pointerleave', onPointerLeave);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVis);
        window.removeEventListener('pagehide', teardown);
        hero.classList.remove('has-webgl');
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };

      window.addEventListener('pagehide', teardown, { once: true });
      cleanupFn = teardown;
    };

    const scheduleInit = () => {
      const idleCb = (window as Partial<Window>).requestIdleCallback;
      if (typeof idleCb === 'function') {
        idleId = idleCb(
          () => {
            init().catch((err) => console.warn('[hero] WebGL enhancement skipped:', err));
          },
          { timeout: 1500 },
        );
      } else {
        timeoutId = window.setTimeout(() => {
          init().catch((err) => console.warn('[hero] WebGL enhancement skipped:', err));
        }, 200);
      }
    };

    if (document.readyState === 'complete') {
      scheduleInit();
    } else {
      window.addEventListener('load', scheduleInit, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', scheduleInit);
      const cancelIdle = (window as Partial<Window>).cancelIdleCallback;
      if (idleId !== undefined && typeof cancelIdle === 'function') {
        cancelIdle(idleId);
      }
      window.clearTimeout(timeoutId);
      cleanupFn?.();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero" id="top" aria-labelledby="hero-title">
      <div className="wrap">
        <p className="hero-word" aria-hidden="true">
          <span className="hw-a">colony</span>
          <span className="hw-b">hub</span>
        </p>

        <div ref={panelRef} className="hero-panel">
          <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" data-hero-canvas />
          <div className="hp-grid" aria-hidden="true" />

          <nav className="hp-tabs" aria-label={dict.a11y.colonyUnits}>
            {COLONY_UNITS.map((unit, idx) => (
              <Link key={unit.slug} href={localePath(locale, `/services/${unit.slug}`)}>
                <span className="mono">{String(idx + 1).padStart(2, '0')}</span> {unit.name}
              </Link>
            ))}
          </nav>

          <div className="hp-mark" aria-hidden="true">
            <svg ref={fallbackRef} className="mark-dark" data-hero-fallback>
              <use href="#hub-mark" />
            </svg>
          </div>

          <HeroClock ariaLabel={dict.a11y.jakartaTime} />

          <div className="hp-copy">
            <h1 className="hero-title" id="hero-title">
              <span>{dict.hero.l1}</span>
              <span>{dict.hero.l2}</span>
            </h1>
            <p className="hero-lead">{dict.hero.lead}</p>
          </div>

          <div className="hp-card">
            <svg className="hp-card-mark mark-dark" aria-hidden="true">
              <use href="#hub-mark" />
            </svg>
            <div>
              <p className="hp-card-title">{dict.hero.card.t}</p>
              <p className="hp-card-sub">{dict.hero.card.s}</p>
            </div>
            <Link className="btn btn--lime" href={localePath(locale, '/contact')}>
              <span>{dict.hero.card.cta}</span>
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
      </div>
    </section>
  );
}
