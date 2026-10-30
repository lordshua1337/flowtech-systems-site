// Campaign run engine for the home-page map. start(ctx) plays SCENARIO on the live map:
// real handoffs drive the WebGL comets, a console shows each step, a shelf collects every artifact.
import { SCENARIO as SC } from './scenario-texas-cooling-towers.js';
import { CSS, VIEWS, digest, esc, chip, stamp, checkIcon } from './previews.js';

const NS = 'http://www.w3.org/2000/svg';
const ABORT = { aborted: true };
const STATE_LABEL = { draft: ['Draft', ''], cleared: ['Cleared', 'b'], approved: ['Approved', 'g'], held: ['Held', 'a'], blocked: ['Send blocked', 'a'], rejected: ['Rejected', 'r'], stale: ['Stale', 'r'], superseded: ['Superseded', ''] };

export function start(ctx) {
  const { root, svg, panel, nodes, D, PORT, paint, reduced, shelfEl, playBtn, playLbl } = ctx;
  const gl = root.__orgGL || null;
  const alias = i => (D.B[i] ? D.B[i][2] : 'Operator');
  const role = i => (D.B[i] ? D.B[i][1] : 'Operator');

  if (!document.querySelector('style[data-fts]')) { const st = document.createElement('style'); st.setAttribute('data-fts', ''); st.textContent = CSS; document.head.appendChild(st); }

  // ---------------------------------------------------------------- run clock (pause + speed aware)
  const q = new URLSearchParams(location.search).get('simspeed');
  const base = (q && +q > 0 ? +q : 1) / SC.pace;
  const rt = { now: 0, speed: base, base, paused: false, dead: false, skip: false, timers: [], tweens: [] };
  let last = performance.now(), raf = 0;
  const frame = t => {
    raf = 0; if (rt.dead) return;
    const dt = Math.min(250, t - last); last = t;
    if (!rt.paused) {
      rt.now += dt * rt.speed;
      // resolve due timers, then let the continuations register theirs and resolve those too, all inside this frame
      const pump = () => { let n = 0; for (let i = rt.timers.length - 1; i >= 0; i--) if (rt.timers[i].at <= rt.now) { const x = rt.timers.splice(i, 1)[0]; x.res(); n++; } if (n && !rt.dead && !rt.paused) queueMicrotask(pump); };
      pump();
      for (let i = rt.tweens.length - 1; i >= 0; i--) { const w = rt.tweens[i], p = Math.min(1, (rt.now - w.t0) / w.dur); w.fn(p); if (p >= 1) { rt.tweens.splice(i, 1); w.res(); } }
      ticker && ticker(dt);
    }
    raf = requestAnimationFrame(frame);
  };
  let ticker = null;
  const sleep = ms => new Promise((res, rej) => { if (rt.dead) return rej(ABORT); rt.timers.push({ at: rt.now + Math.max(0, ms), res, rej }); });
  const tween = (ms, fn) => new Promise((res, rej) => { if (rt.dead) return rej(ABORT); if (reduced) { fn(1); return res(); } rt.tweens.push({ t0: rt.now, dur: Math.max(1, ms), fn, res, rej }); });
  const sleepUntil = abs => sleep(abs - rt.now);

  // ---------------------------------------------------------------- DOM: console
  const sr = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap';
  panel.setAttribute('aria-live', 'off');
  panel.innerHTML = `<div class="fts-run" data-run>
    <div class="fts-head"><span class="fts-live"><i class="fts-ping"></i>Live run</span><span class="fts-clock" data-clock>${esc(SC.steps[0].clock)}</span></div>
    <div class="fts-head" style="margin-top:-4px"><span class="fts-sim">Simulated run · illustrative data</span><span style="font-size:12px;color:#8E8D87">${esc(SC.title)}</span></div>
    <div class="fts-rail" data-rail>${SC.phases.map(p => `<div><i><b></b></i><span>${esc(p)}</span></div>`).join('')}</div>
    <div class="fts-main" data-main><div class="fts-card" data-card></div><div class="fts-stage" data-stage></div></div>
    <ul class="fts-feed" data-feed aria-hidden="true"></ul>
    <div class="fts-ctl" data-ctl>${reduced
      ? '<button type="button" class="fts-btn pri" data-next>Next step →</button><span class="sp"></span><button type="button" class="fts-btn" data-stop>Stop</button>'
      : '<button type="button" class="fts-btn" data-pause aria-pressed="false"><svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2h3v12H4zM9 2h3v12H9z" fill="currentColor"/></svg><span>Pause</span></button><button type="button" class="fts-btn" data-fast aria-pressed="false">2×</button><span class="sp"></span><button type="button" class="fts-btn" data-skip>Skip to results</button><button type="button" class="fts-btn" data-stop aria-label="Stop the run">Stop</button>'}</div>
    <div role="status" aria-live="polite" data-sr style="${sr}"></div></div>`;
  const $ = s => panel.querySelector(s);
  const runEl = $('[data-run]'), clockEl = $('[data-clock]'), railEl = $('[data-rail]'), mainEl = $('[data-main]'), cardEl = $('[data-card]'), stageEl = $('[data-stage]'), feedEl = $('[data-feed]'), srEl = $('[data-sr]'), ctlEl = $('[data-ctl]');
  const setSpd = () => runEl && runEl.style.setProperty('--spd', String(rt.speed));
  setSpd();

  // ---------------------------------------------------------------- DOM: shelf
  shelfEl.hidden = false;
  shelfEl.innerHTML = `<div class="fts-shelf-h"><div style="display:flex;flex-direction:column;gap:8px"><span class="fts-sim" style="align-self:flex-start">Simulated run · illustrative data</span><h4>Campaign pack</h4></div><div class="fts-stats" data-stats></div></div><div class="fts-grid" data-grid></div>`;
  const gridEl = shelfEl.querySelector('[data-grid]'), statsEl = shelfEl.querySelector('[data-stats]');
  const arts = new Map(); // id -> {el, st}
  const S = { touched: new Set(), gates: 0, repaired: 0, done: false, sealed: false, steps: 0 };
  root.__sim = S; S.rt = rt;
  Object.defineProperty(S, 'paused', { get: () => rt.paused }); Object.defineProperty(S, 'running', { get: () => !rt.dead });
  const stats = () => {
    const live = [...arts.values()].filter(a => a.st !== 'stale' && a.st !== 'superseded' && a.st !== 'rejected').length, kept = arts.size - live;
    statsEl.innerHTML = chip(arts.size + ' artifacts', 'b') + chip(S.gates + ' of 3 gates cleared', S.gates ? 'g' : '') + (S.repaired ? chip(S.repaired + ' claims repaired', 'a') : '') + (kept ? chip(kept + ' kept for audit', '') : '');
  };
  stats();

  // ---------------------------------------------------------------- node rings
  const rings = [];
  svg.querySelectorAll('[data-fts-ring]').forEach(n => n.remove());
  const ringFor = i => {
    if (rings[i]) return rings[i];
    const g = nodes[i], dot = g.querySelector('[data-dot]');
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('data-fts-ring', ''); c.setAttribute('cx', dot.getAttribute('cx')); c.setAttribute('cy', dot.getAttribute('cy')); c.setAttribute('r', '26'); c.setAttribute('fill', 'none'); c.setAttribute('stroke-width', '3'); c.setAttribute('opacity', '0'); c.style.pointerEvents = 'none';
    g.appendChild(c); rings[i] = { c, anim: null, st: 'idle' }; return rings[i];
  };
  const COL = { work: '#2E9BFF', done: '#3DDC97', held: '#F5B544', reject: '#FF6B6B' };
  const setNode = (i, st) => {
    if (i < 0 || !nodes[i]) return;
    const r = ringFor(i); if (r.anim) { r.anim.cancel(); r.anim = null; }
    r.st = st; r.c.setAttribute('stroke', COL[st]); r.c.setAttribute('opacity', st === 'done' ? '.85' : '1'); r.c.removeAttribute('stroke-dasharray');
    if (st === 'held') r.c.setAttribute('stroke-dasharray', '5 4');
    if (st === 'work' || st === 'reject') { S.touched.add(i); if (!reduced && r.c.animate) { r.anim = r.c.animate([{ opacity: 1, strokeWidth: 3 }, { opacity: .35, strokeWidth: 6 }], { duration: st === 'reject' ? 420 : 900, iterations: st === 'reject' ? 4 : Infinity, direction: 'alternate', easing: 'ease-in-out' }); r.anim.playbackRate = rt.speed; if (rt.paused) r.anim.pause(); } if (st === 'work' && gl) gl.flash(i, '#2E9BFF'); }
    if (st === 'done' || st === 'held') S.touched.add(i);
  };
  const eachRingAnim = fn => rings.forEach(r => r && r.anim && fn(r.anim));

  // ---------------------------------------------------------------- handoffs
  const adj = Array.from({ length: 27 }, () => []);
  D.E.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  const route = (a, b) => { const prev = new Map([[a, null]]), qd = [a]; while (qd.length) { const u = qd.shift(); if (u === b) break; for (const v of adj[u]) if (!prev.has(v)) { prev.set(v, u); qd.push(v); } } if (!prev.has(b)) return [[a, b]]; const path = []; for (let v = b; prev.get(v) !== null && prev.get(v) !== undefined; v = prev.get(v)) path.unshift([prev.get(v), v]); return path; };
  const hand = async (a, b) => {
    if (rt.skip || reduced) return;
    try {
      if (b < 0) { if (!(gl && gl.spoke(a))) await ctx.travel(a, -1, '#F5B544'); return; }
      if (a < 0) { ctx.pulse(); gl && gl.pulse(); await ctx.travel(-1, b, '#2E9BFF'); return; }
      for (const [u, v] of route(a, b)) { if (rt.dead) return; if (gl && gl.edge(u, v)) await sleep(gl.hop * 1000 + 70); else await ctx.travel(u, v, '#2E9BFF'); }
    } catch (e) { if (e !== ABORT) throw e; }
  };

  // ---------------------------------------------------------------- views
  let viewGen = 0, curView = null;
  const prepType = el => el.querySelectorAll('[data-t]').forEach(n => {
    const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT), tn = []; let x; while ((x = w.nextNode())) tn.push(x);
    n.style.minHeight = n.offsetHeight + 'px'; if (getComputedStyle(n).display.startsWith('inline')) n.style.minWidth = n.offsetWidth + 'px'; n.__tn = tn; n.__full = tn.map(t => t.data); tn.forEach(t => { t.data = ''; });
  });
  const rtApi = {
    sleep, tween,
    type: async (el, mpc) => {
      const tn = el.__tn, full = el.__full; if (!tn) return;
      const total = full.reduce((a, s) => a + s.length, 0);
      const paint2 = k => tn.forEach((t, i) => { const l = full[i].length; t.data = full[i].slice(0, Math.max(0, Math.min(l, k))); k -= l; });
      if (!total || reduced) { paint2(total); return; }
      el.classList.add('fts-typing');
      await tween(total * mpc, p => paint2(Math.round(total * p)));
      paint2(total); el.classList.remove('fts-typing');
    }
  };
  const mountView = d => {
    const gen = ++viewGen;
    if (curView) { const old = curView; old.classList.add('out'); setTimeout(() => old.remove(), 260); }
    const def = VIEWS[d.kind]; if (!def) return;
    const data = d.sampleIds ? { ...d, sample: d.sampleIds.map(id => [SC.art[id].file, digest(id)]) } : d;
    const out = def(data);
    const el = document.createElement('div'); el.className = 'fts-view'; el.innerHTML = out.html; stageEl.appendChild(el); curView = el;
    if (!d.noType) prepType(el);
    if (out.run) Promise.resolve(out.run(el, rtApi)).catch(e => { if (e !== ABORT) console.warn(e); });
    return gen;
  };

  // ---------------------------------------------------------------- card, feed, clock, rail
  const hhmm = clk => { const m = /(\d\d):(\d\d)/.exec(clk); return m ? +m[1] * 60 + +m[2] : 480; };
  const fmt = mins => String(Math.floor(mins / 60) % 24).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
  let clockBase = 480, feedN = 0;
  const setClock = t => { clockEl.textContent = t; clockBase = hhmm(t); feedN = 0; };
  const setCard = st => {
    const i = st.lead, extra = (st.extra || []).map(alias).join(' · ');
    cardEl.innerHTML = `<img src="${PORT[i]}" alt="" data-agent="${i}"><div class="tx"><div class="who"><span data-agent="${i}">${esc(alias(i))}${extra ? ` <em>+ ${esc(extra)}</em>` : ` <em>· ${esc(role(i))}</em>`}</span>${chip(st.status || 'Running', st.status === 'Rejected' ? 'r' : st.status === 'Reworking' || st.status === 'Rebuilding' ? 'a' : 'b')}</div><h5>${esc(st.title)}</h5><p>${esc(st.text)}</p></div>`;
    cardEl.classList.remove('fts-pop'); void cardEl.offsetWidth; cardEl.classList.add('fts-pop');
    srEl.textContent = alias(i) + ': ' + st.title;
  };
  const feed = (node, text, artId, kind) => {
    const li = document.createElement('li'); if (kind) li.dataset.k = kind;
    feedN++; const t = fmt(clockBase + feedN * 3);
    li.innerHTML = `<time>${t}</time><img src="${PORT[node]}" alt="" data-agent="${node}"><span><b data-agent="${node}">${esc(alias(node))}</b> ${esc(text)}${artId ? ` <code>${esc(SC.art[artId].file)}</code>` : ''}</span>`;
    feedEl.insertBefore(li, feedEl.firstChild); while (feedEl.children.length > 7) feedEl.lastChild.remove();
  };
  const phaseCount = SC.phases.map((_, p) => SC.steps.filter(s => s.phase === p).length);
  const phaseSeen = SC.phases.map(() => 0);
  const setPhase = (p, doneFrac) => [...railEl.children].forEach((d, k) => {
    d.toggleAttribute('data-on', k === p); d.toggleAttribute('data-done', k < p);
    const b = d.querySelector('b'); if (k === p) b.style.transform = `scaleX(${Math.max(.08, doneFrac)})`;
  });

  // ---------------------------------------------------------------- artifacts
  const addArt = id => {
    if (arts.has(id)) return; const a = SC.art[id]; if (!a) return;
    const v = /_v(\d+)/.exec(a.file), el = document.createElement('div');
    el.className = 'fts-art fresh'; el.dataset.s = 'draft'; el.dataset.id = id;
    el.innerHTML = `<div class="top"><img src="${PORT[a.owner]}" alt="" data-agent="${a.owner}"><span>${esc(a.type)}</span><span class="v">v${v ? v[1] : 1}</span></div><div class="fn fts-mono">${esc(a.file).replace(/([_.-])/g, '$1<wbr>')}</div><div class="bt"><span data-b></span><span class="dg fts-mono">#${digest(id)}</span></div>`;
    gridEl.appendChild(el); arts.set(id, { el, st: 'draft' }); paintBadge(id); stats();
    setTimeout(() => el.classList.remove('fresh'), 1500 / rt.speed + 400);
  };
  const paintBadge = id => { const a = arts.get(id), [l, k] = STATE_LABEL[a.st]; a.el.dataset.s = a.st; a.el.querySelector('[data-b]').innerHTML = chip(l, k); };
  const setSt = (to, ids) => ids.forEach(id => {
    const a = arts.get(id); if (!a || a.st === to) return; a.st = to; paintBadge(id);
    if (to === 'approved' || to === 'cleared') { a.el.classList.remove('shine'); void a.el.offsetWidth; a.el.classList.add('shine'); }
    if (to === 'cleared' && ids.includes('rev2')) S.repaired = 2; stats();
  });

  // ---------------------------------------------------------------- effects
  const ops = {
    work: ns => ns.forEach(n => setNode(n, 'work')), done: ns => ns.forEach(n => setNode(n, 'done')), held: ns => ns.forEach(n => setNode(n, 'held')), reject: ns => ns.forEach(n => setNode(n, 'reject')),
    feed: (n, text, artId, kind) => feed(n, text, artId, kind), art: (...ids) => ids.forEach(addArt), st: (to, ...ids) => setSt(to, ids),
    hand: (a, b) => { hand(a, b); }, view: d => mountView(d), clock: t => setClock(t), pulse: () => { ctx.pulse(); gl && gl.pulse(); }
  };
  const apply = f => { const fn = ops[f[1]]; if (fn) fn(...f.slice(2)); };

  // ---------------------------------------------------------------- gates
  let nextResolve = null;
  const waitNext = () => new Promise((res, rej) => { if (rt.dead) return rej(ABORT); nextResolve = res; });
  const runGate = async step => {
    const g = step.gate; setClock(step.clock); setPhase(step.phase, 1);
    ops.pulse(); paint(-1);
    srEl.textContent = `Approval needed from ${g.who}: ${g.title}`;
    const el = document.createElement('div'); el.className = 'fts-gate'; el.setAttribute('role', 'group'); el.setAttribute('aria-label', 'Approval needed');
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const total = SC.gateSeconds * (canHover ? 1000 : 1600), C = 2 * Math.PI * 14;
    el.innerHTML = `<div class="fts-row"><span class="fts-chip a">Gate ${g.n} of 3 · ${esc(g.who)}</span><span class="fts-k">Waiting for a person</span></div><h5>${esc(g.title)}</h5><ul>${g.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul><div><div class="fts-k" style="margin-bottom:6px">You are approving</div><div class="fts-files">${g.approve.slice(0, 6).map(id => `<span class="fts-chip">${esc(SC.art[id].file)}</span>`).join('')}${g.approve.length > 6 ? `<span class="fts-chip">+${g.approve.length - 6} more</span>` : ''}</div></div>
      <div class="go"><button type="button" class="fts-approve">${checkIcon}<span>Approve</span></button>${reduced ? '' : `<div class="fts-count"><svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="14" fill="none" stroke="rgba(237,236,230,.16)" stroke-width="3"/><circle data-ring cx="17" cy="17" r="14" fill="none" stroke="#F5B544" stroke-width="3" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0" transform="rotate(-90 17 17)"/></svg><span data-cd>Demo mode</span></div>`}</div>`;
    mainEl.appendChild(el);
    const btn = el.querySelector('.fts-approve'), ringEl = el.querySelector('[data-ring]'), cd = el.querySelector('[data-cd]');
    try { btn.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    let clicked = false, hold = false, elapsed = 0;
    btn.addEventListener('click', () => { clicked = true; });
    if (canHover) { el.addEventListener('pointerenter', () => { hold = true; }); el.addEventListener('pointerleave', () => { hold = false; }); }
    btn.addEventListener('focus', () => { if (btn.matches(':focus-visible')) hold = true; }); btn.addEventListener('blur', () => { hold = false; });
    await new Promise((res, rej) => {
      if (rt.dead) return rej(ABORT);
      ticker = dt => { if (clicked || rt.skip) { ticker = null; return res(); } if (reduced) return; if (!hold) elapsed += dt * rt.speed * SC.pace; const left = Math.max(0, total - elapsed); ringEl.setAttribute('stroke-dashoffset', String(C * (1 - left / total))); cd.textContent = hold ? 'Paused' : 'Auto in ' + Math.ceil(left / 1000) + 's'; if (left <= 0) { ticker = null; res(); } };
      runGate.abort = () => { ticker = null; rej(ABORT); };
    });
    ticker = null;
    btn.dataset.done = '1'; btn.innerHTML = checkIcon + '<span>Approved · ' + esc(g.who) + '</span>'; btn.style.pointerEvents = 'none';
    S.gates++; ops.pulse(); setSt('approved', g.approve);
    if (curView) curView.insertAdjacentHTML('beforeend', stamp(g.stamp)); stats();
    await sleep(rt.skip ? 30 : 1000);
    el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 320);
    if (reduced) await waitNext();
  };

  // ---------------------------------------------------------------- seal
  const runSeal = async step => {
    rt.skip = false; rt.speed = rt.base; setSpd(); setClock(step.clock); setPhase(5, 1); [...railEl.children].forEach(d => { d.setAttribute('data-done', ''); d.removeAttribute('data-on'); });
    paint(-1); ops.pulse(); addArt('seal');
    // wave: every Drop lights up in turn and fires its spoke into the core
    for (let i = 0; i < 27; i++) { if (rings[i] && rings[i].st === 'held') { S.touched.add(i); continue; } setNode(i, 'done'); if (gl && !reduced) gl.spoke(i); if (!reduced && i % 3 === 0) await sleep(70); }
    // inspector stamps what is still a draft as cleared
    arts.forEach((a, id) => { if (a.st === 'draft') setSt('cleared', [id]); });
    const held = [...arts.values()].filter(a => a.st === 'held' || a.st === 'blocked').length;
    const live = [...arts.values()].filter(a => !['stale', 'superseded', 'rejected'].includes(a.st)).length;
    const sealedStats = [[S.touched.size + '/27', 'Drops contributed'], [String(live), 'Live artifacts'], [S.gates + ' of 3', 'Gates cleared'], [String(S.repaired || 2), 'Claims repaired']];
    mainEl.innerHTML = `<div class="fts-seal fts-pop"><div class="fts-row" style="justify-content:flex-start;gap:10px"><span class="fts-chip g">${checkIcon} Sealed</span><span class="fts-k">Simulated run complete</span></div><div class="fts-big">Campaign pack sealed.</div>
      <p style="margin:0;font-size:14px;line-height:1.5;color:#C9C8C1">Every artifact has an owner, a version and a digest. ${held} hold${held === 1 ? '' : 's'} stay in place by design: the outbound list and email sending wait for a person.</p>
      <div class="fts-kpis">${sealedStats.map(k => `<div class="fts-kpi"><b>${esc(k[0])}</b><span>${esc(k[1])}</span></div>`).join('')}</div></div>`;
    cardEl.remove(); ctlEl.innerHTML = `<button type="button" class="fts-btn pri" data-again>Replay the run</button><a class="fts-btn" href="/proof#evidence-center">Evidence center →</a><span class="sp"></span><button type="button" class="fts-btn" data-down>Pack ↓</button>`;
    feedEl.style.height = '110px';
    srEl.textContent = 'Campaign pack sealed. ' + S.touched.size + ' of 27 Drops contributed.';
    S.sealed = true; stats(); runEl.setAttribute('data-complete', ''); const lv = runEl.querySelector('.fts-live'); if (lv) lv.innerHTML = '<i class="fts-ping"></i>Run complete';
    shelfEl.querySelector('.fts-shelf-h').insertAdjacentHTML('beforeend', '<button type="button" class="fts-btn pri" data-again>Replay the run</button>');
    if (!userScrolled && !reduced) setTimeout(() => shelfEl.scrollIntoView({ behavior: 'smooth', block: 'start' }), 900);
    await sleep(step.dur);
  };

  // ---------------------------------------------------------------- run loop
  const runStep = async (step, idx) => {
    if (step.gate) return runGate(step);
    if (step.seal) return runSeal(step);
    setClock(step.clock);
    setPhase(step.phase, phaseSeen[step.phase] / phaseCount[step.phase]);
    paint(step.lead); setCard(step);
    if (step.view) mountView(step.view);
    const t0 = rt.now;
    for (const f of step.fx.slice().sort((a, b) => a[0] - b[0])) { if (!reduced) await sleepUntil(t0 + f[0]); apply(f); }
    if (!reduced) await sleepUntil(t0 + step.dur);
    phaseSeen[step.phase]++; setPhase(step.phase, phaseSeen[step.phase] / phaseCount[step.phase]);
    if (reduced) await waitNext();
  };

  let userScrolled = false; const onUser = () => { userScrolled = true; };
  addEventListener('wheel', onUser, { passive: true }); addEventListener('touchmove', onUser, { passive: true });
  const finish = mode => {
    if (rt.dead) return; rt.dead = true; cancelAnimationFrame(raf);
    rt.timers.splice(0).forEach(t => t.rej && t.rej(ABORT)); rt.tweens.splice(0).forEach(t => t.rej && t.rej(ABORT));
    removeEventListener('wheel', onUser); removeEventListener('touchmove', onUser); document.removeEventListener('keydown', onKey, true);
    runGate.abort && runGate.abort(); panel.setAttribute('aria-live', 'polite');
    if (mode === 'stopped') { rings.forEach(r => { if (r) { r.anim && r.anim.cancel(); r.c.remove(); } }); eachRingAnim(a => a.cancel()); paint(-1); ctx.show(-1); shelfEl.hidden = true; shelfEl.innerHTML = ''; }
    else { rings.forEach(r => { if (r && r.anim) { r.anim.cancel(); r.anim = null; } }); }
    S.done = true; ctx.onEnd(mode);
  };
  const onKey = e => { if (e.key === 'Escape' && !rt.dead && !(window.FTAgents && window.FTAgents.isOpen())) { e.preventDefault(); finish('stopped'); } };
  document.addEventListener('keydown', onKey, true);

  runEl.addEventListener('click', e => {
    const t = e.target.closest('button,a'); if (!t || rt.dead && !t.hasAttribute('data-again') && !t.hasAttribute('data-down')) return;
    if (t.hasAttribute('data-stop')) finish('stopped');
    else if (t.hasAttribute('data-pause')) { rt.paused = !rt.paused; t.setAttribute('aria-pressed', String(rt.paused)); t.querySelector('span').textContent = rt.paused ? 'Resume' : 'Pause'; runEl.toggleAttribute('data-paused', rt.paused); eachRingAnim(a => rt.paused ? a.pause() : a.play()); }
    else if (t.hasAttribute('data-fast')) { const f = t.getAttribute('aria-pressed') !== 'true'; t.setAttribute('aria-pressed', String(f)); rt.base = base * (f ? 2 : 1); if (!rt.skip) rt.speed = rt.base; setSpd(); eachRingAnim(a => { a.playbackRate = rt.speed; }); }
    else if (t.hasAttribute('data-skip')) { rt.skip = true; rt.paused = false; rt.speed = base * 40; setSpd(); t.disabled = true; eachRingAnim(a => { a.playbackRate = rt.speed; }); }
    else if (t.hasAttribute('data-next')) { const r = nextResolve; nextResolve = null; r && r(); }
    else if (t.hasAttribute('data-down')) shelfEl.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    else if (t.hasAttribute('data-again')) ctx.restart();
  });
  shelfEl.onclick = e => { if (e.target.closest('[data-again]')) ctx.restart(); };
  // The agent card pauses the run while it is open, then puts it back the way it found it.
  S.setPaused = on => { if (rt.dead || rt.paused === on) return; rt.paused = on; runEl.toggleAttribute('data-paused', on); const b = runEl.querySelector('[data-pause]'); if (b) { b.setAttribute('aria-pressed', String(on)); b.querySelector('span').textContent = on ? 'Resume' : 'Pause'; } eachRingAnim(a => on ? a.pause() : a.play()); };

  // go
  raf = requestAnimationFrame(frame);
  try { panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); } catch (e) { /* ignore */ }
  (async () => {
    try { for (let i = 0; i < SC.steps.length; i++) { if (SC.steps[i].seal === true && rt.skip) { rt.skip = false; } await runStep(SC.steps[i], i); S.steps = i + 1; } finish('sealed'); }
    catch (e) { if (e !== ABORT) { console.error(e); finish('stopped'); } }
  })();
  return { stop: () => finish('stopped') };
}
