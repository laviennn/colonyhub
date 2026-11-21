/* colonyhub hero — "living colony"
   The Hub Mark rendered as raymarched SDF spheres that melt together (smooth union) into the C,
   joined by liquid bridges instead of lines. Lime "colonists" travel the bridges toward the hub,
   and the cursor is one more drop that merges into the colony when it comes close.

   Rules (decision log 2026-11-21): static SVG renders first (LCP); this loads after first paint;
   skipped on reduced motion, save-data, low-end devices, narrow screens; paused off-screen or in a
   hidden tab; rendered at reduced resolution; disposed on pagehide. */

const hero = document.querySelector('.hero');
const canvas = document.querySelector('[data-hero-canvas]');
const fallback = document.querySelector('[data-hero-fallback]');

function shouldRun() {
  if (!hero || !canvas || !fallback) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const c = navigator.connection;
  if (c && (c.saveData || /2g/.test(c.effectiveType || ''))) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return false;
  try { if (!document.createElement('canvas').getContext('webgl2')) return false; } catch (_) { return false; }
  return true;
}

const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
if (shouldRun()) {
  const start = () => idle(() => init().catch((err) => console.warn('[hero] WebGL enhancement skipped:', err)), { timeout: 1500 });
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start, { once: true });
}

/* Mark geometry in the 100×100 symbol box: x, y, radius, depth */
const MARK = [
  [60, 18, 9.5, 0.04], [36, 30, 10, -0.02], [20, 54, 14, 0.0], [35, 78, 10, 0.03],
  [58, 88, 10.5, -0.03], [80, 79, 7.5, 0.02], [80, 26, 7, 0.05]
];
const CHAIN = [6, 0, 1, 2, 3, 4, 5]; // the path a colonist walks: lime tip → top → hub → bottom
const DOTS = 6;

const IS_MOBILE = window.matchMedia('(max-width: 767px)').matches;
const FRAG = /* glsl */ `
  precision highp float;
  #define STEPS ${IS_MOBILE ? 32 : 40}
  uniform vec4 uNodes[7];
  uniform vec3 uDots[${DOTS}];
  uniform vec3 uMouse;
  uniform vec2 uCenter;
  uniform float uSize, uK, uBone, uDotR, uMouseR, uReveal;
  uniform vec3 uBound; // xy centre, z radius of everything drawn (mark space)

  const vec3 C_LIGHT = vec3(0.663, 0.690, 0.965);   // #A9B0F6
  const vec3 C_MID   = vec3(0.353, 0.392, 0.816);   // #5A64D0
  const vec3 C_PERI  = vec3(0.541, 0.580, 0.949);   // #8A94F2
  const vec3 C_LIME  = vec3(0.776, 0.957, 0.196);   // #C6F432
  const vec3 C_CLOUD = vec3(0.965, 0.957, 0.933);   // #F6F4EE

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
    vec2 q = (gl_FragCoord.xy - uCenter) / uSize;          // mark space, 1 unit = mark box
    vec3 ro = vec3(q * 1.0, 1.2);
    vec3 rd = normalize(vec3(q * 0.18, -1.0));              // slight perspective for depth
    ro.xy = q;
    if (length(q - uBound.xy) > uBound.z) discard;          // nothing out here: skip the march
    float t = 0.85, minD = 1e5; bool hit = false;            // all shapes sit near z = 0
    for (int i = 0; i < STEPS; i++) {
      vec3 p = ro + rd * t;
      float d = map(p, false);
      minD = min(minD, d);
      if (d < 0.0008) { hit = true; break; }
      t += d;
      if (t > 2.6) break;
    }
    if (!hit) {
      // soft halo where the colony is close: light, never a hard outline
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
    col += C_LIME * min(gGlow, 1.0) * 0.35;                  // colonists glow a little
    gl_FragColor = vec4(col, uReveal);
  }
`;

async function init() {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power', premultipliedAlpha: false });
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
    uK: { value: 0 }, uBone: { value: 0 }, uDotR: { value: 0.016 }, uMouseR: { value: 0.07 }, uReveal: { value: 0 }
  };
  const material = new THREE.ShaderMaterial({
    uniforms: U, transparent: true, depthTest: false, depthWrite: false,
    vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: FRAG
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(quad);

  // Node targets in mark space (centre of the box = origin, y up), plus scattered starts.
  const rand = (a, b) => a + Math.random() * (b - a);
  const nodes = MARK.map(([x, y, r, z]) => ({
    to: [(x - 50) / 100, -(y - 53) / 100, z], r: r / 100,
    from: [rand(-1.1, 1.1), rand(-0.7, 0.7), rand(-0.2, 0.2)], phase: rand(0, 6.28)
  }));

  let pr = 1, prScale = IS_MOBILE ? 0.5 : 0.8;   // phones: lighter raymarch
  const perf = { start: 0, frames: 0, done: false };
  function layout() {
    const rect = canvas.getBoundingClientRect();
    pr = Math.min(window.devicePixelRatio || 1, 2) * prScale;   // reduced-resolution raymarch
    renderer.setPixelRatio(pr);
    renderer.setSize(rect.width, rect.height, false);
    const fb = fallback.getBoundingClientRect();
    const size = Math.min(fb.width, fb.height || fb.width);
    U.uSize.value = size * pr * 1.3; // render the colony a little larger than the static mark box
    U.uCenter.value.set((fb.left + fb.width / 2 - rect.left) * pr, (rect.bottom - (fb.top + fb.height / 2)) * pr);
  }

  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const INTRO = 2200;
  const mouse = { x: 9, y: 9, tx: 9, ty: 9 };
  let t0 = 0, raf = 0, running = false, visible = true;

  // Chain polyline length (for colonists walking it at constant speed)
  function chainPoint(s) {
    const segs = CHAIN.length - 1, f = ((s % 1) + 1) % 1 * segs;
    const i = Math.floor(f), u = f - i;
    const A = U.uNodes.value[CHAIN[i]], B = U.uNodes.value[CHAIN[i + 1]];
    return [A.x + (B.x - A.x) * u, A.y + (B.y - A.y) * u, (A.z + B.z) / 2 + 0.01];
  }

  let last = 0;
  function frame(now) {
    if (IS_MOBILE && now - last < 31) { if (running) raf = requestAnimationFrame(frame); return; } // cap ~30fps on phones
    last = now;
    if (!t0) t0 = now;
    const el = now - t0, time = now / 1000;
    const k = clamp01(el / INTRO);

    nodes.forEach((n, i) => {
      const kk = easeIO(clamp01((k - i * 0.04) / (1 - 6 * 0.04)));
      const bob = Math.sin(time * 0.9 + n.phase) * 0.006 * kk;
      const v = U.uNodes.value[i];
      v.set(
        n.from[0] + (n.to[0] - n.from[0]) * kk,
        n.from[1] + (n.to[1] - n.from[1]) * kk + bob,
        n.from[2] + (n.to[2] - n.from[2]) * kk,
        n.r * (0.55 + 0.45 * kk) * (1 + Math.sin(time * 1.3 + n.phase) * 0.025 * kk)
      );
    });
    U.uK.value = 0.075 * ease(clamp01((k - 0.15) / 0.85));              // melt together
    U.uBone.value = 0.028 * ease(clamp01((k - 0.45) / 0.55));           // liquid bridges grow
    U.uReveal.value = ease(clamp01(el / 500));

    const dotsOn = clamp01((el - INTRO * 0.85) / 600);
    U.uDots.value.forEach((d, j) => {
      if (dotsOn <= 0) { d.set(9, 9, 0); return; }
      const p = chainPoint(time * 0.045 + j / DOTS);
      d.set(p[0], p[1], p[2]);
    });
    U.uDotR.value = 0.016 * dotsOn;

    // bounding circle of everything on screen (nodes + drop), plus halo margin
    let bx = 0, by = 0, br = 0;
    const pts = U.uNodes.value.map((v) => [v.x, v.y, v.w]);
    if (mouse.x < 5) pts.push([mouse.x, mouse.y, U.uMouseR.value]);
    pts.forEach((p) => { bx += p[0]; by += p[1]; }); bx /= pts.length; by /= pts.length;
    pts.forEach((p) => { br = Math.max(br, Math.hypot(p[0] - bx, p[1] - by) + p[2]); });
    U.uBound.value.set(bx, by, br + 0.2);

    mouse.x += (mouse.tx - mouse.x) * 0.12;
    mouse.y += (mouse.ty - mouse.y) * 0.12;
    U.uMouse.value.set(mouse.x, mouse.y, 0.02);

    renderer.render(scene, camera);
    perf.frames++;
    if (!perf.done && el > INTRO + 1200) {
      perf.done = true;
      const fps = perf.frames / ((el - perf.start) / 1000);
      if (fps < (IS_MOBILE ? 24 : 40)) { prScale = Math.max(0.35, prScale - 0.2); layout(); }
    } else if (!perf.start && el > INTRO + 200) { perf.start = el; perf.frames = 0; }
    if (running) raf = requestAnimationFrame(frame);
  }

  const play = () => { if (!running && visible && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } };
  const pause = () => { running = false; cancelAnimationFrame(raf); };

  layout();
  hero.classList.add('has-webgl');
  play();

  const panel = canvas.parentElement;
  panel.addEventListener('pointermove', (e) => {
    const fb = fallback.getBoundingClientRect();
    const size = Math.min(fb.width, fb.height || fb.width) * 1.3;
    const mx = (e.clientX - (fb.left + fb.width / 2)) / size;
    const my = -(e.clientY - (fb.top + fb.height / 2)) / size;
    // only drawn near the colony, so the drop never wanders over the copy
    const near = Math.hypot(mx, my) < 0.95;
    mouse.tx = near ? mx : 9; mouse.ty = near ? my : 9;
    if (mouse.x > 5 && near) { mouse.x = mx * 1.4; mouse.y = my * 1.4; }
  });
  panel.addEventListener('pointerleave', () => { mouse.tx = 9; mouse.ty = 9; });

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : pause(); });
  io.observe(panel);
  const onVis = () => (document.hidden ? pause() : play());
  document.addEventListener('visibilitychange', onVis);

  let rT;
  const onResize = () => {
    clearTimeout(rT);
    rT = setTimeout(() => {
      layout(); if (!running) frame(performance.now());
    }, 150);
  };
  window.addEventListener('resize', onResize);

  function teardown() {
    pause(); io.disconnect();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVis);
    hero.classList.remove('has-webgl');
    quad.geometry.dispose(); material.dispose(); renderer.dispose();
  }
  window.addEventListener('pagehide', teardown, { once: true });
}
