/* colonyhub prototype v0.2 — nav, language, network map, statement moment, clock */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lang = 'en';

  /* ---------- Service lines: data in services-data.js (CMS `services` model later) ---------- */
  const UNITS = window.CH_UNITS || [];
  const mqMobile = window.matchMedia('(max-width: 767px)');

  /* ---------- Header / mega / mobile menu ---------- */
  const trigger = $('[data-mega-trigger]'), mega = $('[data-mega]'), megaWrap = trigger.closest('.has-mega');
  const hoverOK = window.matchMedia('(hover: hover) and (pointer: fine)');
  let hT;
  const setMega = (o) => { trigger.setAttribute('aria-expanded', String(o)); mega.hidden = !o; };
  trigger.addEventListener('click', () => setMega(mega.hidden));
  megaWrap.addEventListener('mouseenter', () => { if (hoverOK.matches) { clearTimeout(hT); setMega(true); } });
  megaWrap.addEventListener('mouseleave', () => { if (hoverOK.matches) hT = setTimeout(() => setMega(false), 160); });
  megaWrap.addEventListener('focusout', (e) => { if (!megaWrap.contains(e.relatedTarget)) setMega(false); });
  document.addEventListener('click', (e) => { if (!megaWrap.contains(e.target)) setMega(false); });
  mega.addEventListener('click', (e) => { if (e.target.closest('a')) setMega(false); });

  const toggle = $('[data-menu-toggle]'), menu = $('[data-mobile-menu]');
  const setMenu = (o) => {
    toggle.setAttribute('aria-expanded', String(o)); menu.hidden = !o;
    document.body.style.overflow = o ? 'hidden' : '';
    if (o) { const f = menu.querySelector('a'); f && f.focus(); }
  };
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!mega.hidden) { setMega(false); trigger.focus(); }
      if (!menu.hidden) { setMenu(false); toggle.focus(); }
    }
    if (e.key === 'Tab' && !menu.hidden) {
      const items = [toggle, ...$$('a, button', menu)].filter((el) => el.offsetParent !== null);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', (m) => { if (m.matches) setMenu(false); });

  /* ---------- Clock (Jakarta time) ---------- */
  const clock = $('[data-clock]');
  const tick = () => {
    clock.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }).format(new Date());
  };
  tick(); setInterval(tick, 15000);

  /* ---------- Network map ---------- */
  const svg = $('[data-map]'), mapWrap = $('[data-net-map]'), legend = $('[data-legend]');
  const el = (tag, a = {}) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); return e; };

  function buildMap() {
    $$('.grp, .hub', svg).forEach((n) => n.remove());
    UNITS.forEach((u, i) => {
      const g = el('g', { class: 'grp', 'data-i': i, style: `--c:${u.c}` });
      const d = 'M' + u.path.map((p) => p.join(' ')).join(' L');
      g.appendChild(el('path', { class: 'line', d }));
      g.appendChild(el('path', { class: 'hit', d }));
      let [a, b] = u.path.slice(-2);
      if (u.path.length === 2) a = [a[0] + Math.sign(b[0] - a[0]) * 70, a[1]]; // keep stops clear of the hub ring
      const stops = u.stops[lang];
      const below = b[1] > 300;
      stops.forEach(([name, desc], k) => {
        const t = (k + 1) / (stops.length + 1);
        const x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t;
        const sg = el('g', { class: 'st', tabindex: 0, role: 'button', 'aria-label': `${name}: ${desc}`, 'data-x': x, 'data-y': y, 'data-below': below ? 1 : 0 });
        sg.appendChild(el('circle', { class: 'st-hit', cx: x, cy: y, r: 18 }));
        sg.appendChild(el('circle', { class: 'stop', cx: x, cy: y, r: 7 }));
        const lab = el('text', { class: 'stop-label', x: x + 6, y: y + (below ? 26 : -18), transform: `rotate(${below ? 32 : -32} ${x} ${y})` });
        lab.textContent = name;
        sg.appendChild(lab);
        const show = () => { activate(i); showTip(sg, u, name, desc); };
        sg.addEventListener('mouseenter', show);
        sg.addEventListener('focus', show);
        sg.addEventListener('click', show);
        sg.addEventListener('mouseleave', hideTip);
        sg.addEventListener('blur', hideTip);
        g.appendChild(sg);
      });
      const right = b[0] > 600;
      g.appendChild(el('circle', { class: 'term', cx: b[0], cy: b[1], r: 13 }));
      g.appendChild(el('circle', { cx: b[0], cy: b[1], r: 5, fill: '#0B1230' }));
      const tl = el('text', { class: 'term-label', x: b[0] + (right ? 26 : -26), y: b[1] + 9, 'text-anchor': right ? 'start' : 'end' });
      tl.textContent = u.name;
      g.appendChild(tl);
      g.addEventListener('mouseenter', () => activate(i));
      svg.appendChild(g);
    });
    const hub = el('g', { class: 'hub' });
    hub.appendChild(el('circle', { class: 'hub-ring', cx: 600, cy: 300, r: 46 }));
    const use = el('use', { href: '#hub-mark', x: 572, y: 272, width: 56, height: 56, class: 'mark-dark' });
    hub.appendChild(use);
    const hl = el('text', { class: 'hub-label', x: 600, y: 372 }); hl.textContent = 'COLONYHUB';
    hub.appendChild(hl);
    svg.appendChild(hub);
  }

  /* Station info card, positioned from the stop's map coordinates */
  const tip = $('[data-tip]');
  function showTip(sg, u, name, desc) {
    const r = svg.getBoundingClientRect(), w = mapWrap.getBoundingClientRect();
    const s = r.width / 1200;
    const x = r.left - w.left + Number(sg.dataset.x) * s;
    const y = r.top - w.top + Number(sg.dataset.y) * s;
    tip.style.setProperty('--c', u.c);
    $('[data-tip-unit]', tip).textContent = `${u.name} Unit`;
    $('[data-tip-name]', tip).textContent = name;
    $('[data-tip-desc]', tip).textContent = desc;
    tip.hidden = false;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    const up = sg.dataset.below === '1';          // bottom lines: card above the stop (labels hang below)
    tip.style.left = Math.min(Math.max(x - tw / 2, 8), w.width - tw - 8) + 'px';
    tip.style.top = (up ? y - th - 22 : y + 22) + 'px';
  }
  function hideTip() { tip.hidden = true; }

  function buildLegend() {
    legend.innerHTML = '';
    UNITS.forEach((u, i) => {
      const li = document.createElement('li');
      li.style.setProperty('--c', u.c);
      li.innerHTML = `<button type="button" class="lg-btn" aria-pressed="false" aria-expanded="false" aria-controls="lg-p${i}" data-i="${i}">
          <span class="swatch" aria-hidden="true"></span>
          <span class="lg-text"><strong>${u.name} Unit</strong><span class="sub">${u.sub[lang]}</span></span>
          <span class="lg-chev" aria-hidden="true"></span>
        </button>
        <div class="lg-panel" id="lg-p${i}" inert>
          <div class="lg-inner">
            <ol class="m-stops">${u.stops[lang].map(([n, d], k) => `<li style="--k:${k}"><strong>${n}</strong><span>${d}</span></li>`).join('')}</ol>
          </div>
        </div>`;
      const btn = li.querySelector('button');
      btn.addEventListener('mouseenter', () => { if (!mqMobile.matches) activate(i); });
      btn.addEventListener('focus', () => { if (!mqMobile.matches) activate(i); });
      btn.addEventListener('click', () => {
        if (mqMobile.matches) openPanel(i, btn.getAttribute('aria-expanded') !== 'true');
        else activate(i, true);
      });
      legend.appendChild(li);
    });
    if (mqMobile.matches) openPanel(openIdx, openIdx >= 0, true);
  }

  /* Mobile: lines become an accordion, one open at a time.
     Panels animate their height in CSS (grid rows 0fr → 1fr); while they resize, the row the
     visitor tapped is held at the same spot on screen so nothing jumps under the thumb. */
  let openIdx = 0, holdRaf = 0;
  function openPanel(i, open, instant) {
    const btns = $$('.lg-btn', legend);
    const anchor = btns[i];
    const startTop = anchor ? anchor.getBoundingClientRect().top : 0;
    btns.forEach((b, k) => {
      const on = open && k === i;
      b.setAttribute('aria-expanded', String(on));
      const p = document.getElementById('lg-p' + k);
      p.classList.toggle('is-open', on);
      p.classList.toggle('no-anim', !!instant);
      p.inert = !on;
    });
    openIdx = open ? i : -1;
    if (instant || !anchor || reduce) return;
    cancelAnimationFrame(holdRaf);
    // Hold until the panels have stopped resizing (not a fixed time: slow devices finish late).
    const t0 = performance.now();
    let lastH = -1, still = 0;
    const hold = () => {
      const drift = anchor.getBoundingClientRect().top - startTop;
      if (Math.abs(drift) > 0.5) window.scrollBy({ top: drift, behavior: 'instant' }); // html has smooth scroll
      const h = legend.offsetHeight;
      still = h === lastH ? still + 1 : 0; lastH = h;
      const elapsed = performance.now() - t0;
      if ((elapsed < 300 || still < 4) && elapsed < 2000) holdRaf = requestAnimationFrame(hold);
    };
    holdRaf = requestAnimationFrame(hold);
  }
  mqMobile.addEventListener('change', () => buildLegend());

  let pinned = -1;
  function activate(i, pin) {
    if (pin) pinned = pinned === i ? -1 : i;
    const cur = pin ? pinned : i;
    if (cur < 0) mapWrap.removeAttribute('data-active'); else mapWrap.setAttribute('data-active', cur);
    $$('.grp', svg).forEach((g) => g.classList.toggle('is-on', Number(g.dataset.i) === cur));
    $$('.lg-btn', legend).forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.i) === pinned)));
  }
  const reset = () => { activate(pinned); hideTip(); };
  svg.addEventListener('mouseleave', reset);
  legend.addEventListener('mouseleave', () => activate(pinned));
  legend.addEventListener('focusout', (e) => { if (!legend.contains(e.relatedTarget)) activate(pinned); });

  function buildMegaAndFooter() {
    $('[data-mega-lines]').innerHTML = UNITS.map((u) =>
      `<li><a href="#network" style="--c:${u.c}"><span class="swatch" aria-hidden="true"></span><strong>${u.name} Unit</strong><small>${u.sub[lang]}</small></a></li>`).join('');
    $('[data-footer-units]').innerHTML = UNITS.map((u) => `<li><a href="#network">${u.name} Unit</a></li>`).join('');
  }

  /* ---------- Statement: words light up as the section scrolls through ---------- */
  const st = $('[data-statement]');
  const KEY = { en: ['between', 'vendors.', 'one', 'line,'], id: ['di', 'antara', 'vendor.', 'satu', 'jalur,'] };
  function buildStatement() {
    const words = st.textContent.trim().split(/\s+/);
    st.setAttribute('aria-label', st.textContent.trim());
    st.innerHTML = words.map((w) => `<span class="w${KEY[lang].includes(w) ? ' key' : ''}" aria-hidden="true">${w}</span>`).join(' ');
    if (!reduce) { st.classList.add('is-armed'); onScroll(); }
  }
  function onScroll() {
    if (!st.classList.contains('is-armed')) return;
    const r = st.getBoundingClientRect(), vh = window.innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
    const ws = $$('.w', st), n = Math.round(p * ws.length);
    ws.forEach((w, k) => w.classList.toggle('is-lit', k < n));
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Language (EN default, ID) ---------- */
  const dict = window.CH_I18N || {};
  const nodes = $$('[data-i18n]');
  nodes.forEach((n) => { n.dataset.en = n.textContent; });
  function setLang(l) {
    lang = l;
    nodes.forEach((n) => { const v = l !== 'en' && dict[l] && dict[l][n.dataset.i18n]; n.textContent = v || n.dataset.en; });
    document.documentElement.lang = l;
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    buildMap(); buildLegend(); buildMegaAndFooter(); buildStatement(); activate(pinned);
    try { localStorage.setItem('ch-lang', l); } catch (_) { /* storage unavailable */ }
  }
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  let saved = 'en';
  try { saved = localStorage.getItem('ch-lang') || 'en'; } catch (_) { /* storage unavailable */ }
  setLang(saved === 'id' ? 'id' : 'en');
})();
