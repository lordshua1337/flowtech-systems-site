// Agent card: one modal that opens for any element carrying data-agent="<number|alias|role|slug>".
// It never navigates. Data lives in agent-data.js; the simulated-run facts and sample output are read
// from assets/sim/ on demand. Loaded with `defer` on every page; the big modules load on first use.
(function () {
  'use strict';
  if (window.FTAgents) return;
  var SRC = (document.currentScript && document.currentScript.src) || (location.origin + '/assets/agents/agent-cards.js');
  var BASE = new URL('./', SRC).href, SIM = new URL('../sim/', BASE).href;
  var PORT = function (img) { return new URL('../marbots/' + img, BASE).href; };
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var norm = function (s) { return String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ''); };

  // ---------------------------------------------------------------- data
  var M = null, dataP = null, runP = null, lookup = null;
  function data() {
    return dataP || (dataP = import(BASE + 'agent-data.js').then(function (m) {
      M = m; lookup = {};
      m.AGENTS.forEach(function (a) { [a.alias, a.role, a.slug].forEach(function (k) { lookup[norm(k)] = a.i; }); });
      return m;
    }));
  }
  function simData() {
    return runP || (runP = Promise.all([import(SIM + 'previews.js'), import(SIM + 'scenario-texas-cooling-towers.js')]).then(function (r) {
      return { P: r[0], SC: r[1].SCENARIO };
    }).catch(function () { return null; }));
  }
  function resolve(ref) {
    if (typeof ref === 'number') return ref;
    var s = String(ref).trim(); if (/^\d+$/.test(s)) return +s;
    var k = lookup && lookup[norm(s)]; return k == null ? -1 : k;
  }

  // ---------------------------------------------------------------- styles
  var CSS = [
    '.fta{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:clamp(10px,2.4vw,36px);font-family:"Archivo",system-ui,sans-serif;-webkit-font-smoothing:antialiased}',
    '.fta[hidden]{display:none}',
    '.fta *{box-sizing:border-box}',
    '.fta-veil{position:absolute;inset:0;background:rgba(3,4,5,.8);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:fta-fade .3s ease both}',
    '.fta-card{position:relative;display:flex;flex-direction:column;width:min(1200px,100%);height:min(880px,100%);border-radius:28px;border:1px solid rgba(237,236,230,.16);background:#0B0C0D;color:#EDECE6;box-shadow:0 50px 140px -30px rgba(0,0,0,.85),0 0 0 1px rgba(46,155,255,.06);overflow:hidden;outline:none;animation:fta-in .42s cubic-bezier(.16,1,.3,1) both}',
    '@keyframes fta-fade{from{opacity:0}to{opacity:1}}',
    '@keyframes fta-in{from{opacity:0;transform:translateY(22px) scale(.985)}to{opacity:1;transform:none}}',
    '@keyframes fta-swap{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}',
    '@keyframes fta-float{from{transform:translateY(0) rotate(-.6deg)}to{transform:translateY(-9px) rotate(.8deg)}}',
    '@keyframes fta-floor{from{transform:scaleX(1);opacity:1}to{transform:scaleX(.8);opacity:.6}}',
    '.fta-x{position:absolute;top:14px;right:14px;z-index:6;display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:50%;border:1px solid rgba(237,236,230,.22);background:rgba(10,11,12,.7);backdrop-filter:blur(8px);color:#EDECE6;cursor:pointer;transition:background .2s,border-color .2s}',
    '.fta-x:hover{background:#1570CF;border-color:#1570CF}',
    '.fta-body{flex:1;min-height:0;display:grid;grid-template-columns:minmax(300px,368px) minmax(0,1fr)}',
    '.fta-rail{min-height:0;overflow:auto;display:flex;flex-direction:column;gap:15px;padding:24px 24px 20px;scrollbar-width:thin;scrollbar-color:rgba(237,236,230,.2) transparent;border-right:1px solid rgba(237,236,230,.1);background:radial-gradient(120% 60% at 50% 0,rgba(26,127,224,.2),rgba(26,127,224,0) 62%),linear-gradient(180deg,#0E1013,#0A0B0C)}',
    '.fta-rail>*{flex:none}',
    '.fta-main{min-height:0;overflow:auto;padding:clamp(22px,3vw,40px) clamp(20px,3.2vw,44px) 30px;scroll-behavior:auto}',
    '.fta-ph{position:relative;aspect-ratio:4/3.35;border-radius:22px;background:#0E0F10;border:1px solid rgba(237,236,230,.12);overflow:hidden}',
    '.fta-ph img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 56%;transform-origin:50% 70%;animation:fta-float 3.8s ease-in-out infinite alternate;will-change:transform}',
    '.fta-ph .gl{position:absolute;left:25%;right:25%;bottom:10%;height:8%;border-radius:50%;background:radial-gradient(closest-side,rgba(64,170,255,.5),rgba(64,170,255,0));filter:blur(7px);animation:fta-floor 3.8s ease-in-out infinite alternate}',
    '.fta-ph .no{position:absolute;top:12px;left:14px;font-weight:900;font-stretch:62%;font-size:22px;line-height:1;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.6)}',
    '.fta-ph .no small{font-size:13px;font-weight:700;color:#A9A8A2;margin-left:4px;font-stretch:100%}',
    '.fta-tag{display:inline-flex;align-items:center;gap:8px;height:28px;padding:0 12px;border-radius:999px;background:rgba(46,155,255,.16);color:#8ACFFF;font-size:12px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;align-self:flex-start}',
    '.fta-name{margin:0;font-weight:850;font-stretch:62%;text-transform:uppercase;font-size:clamp(34px,3.6vw,50px);line-height:.9;letter-spacing:.002em}',
    '.fta-name.long{font-size:clamp(27px,2.7vw,36px);line-height:.94}',
    '.fta-alias{margin:6px 0 0;font-size:16px;font-weight:700;color:#8ACFFF}',
    '.fta-lead{margin:0;font-size:17px;line-height:1.5;color:#C9C8C1;text-wrap:pretty}',
    '.fta-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;border-radius:18px;overflow:hidden;background:rgba(237,236,230,.1);border:1px solid rgba(237,236,230,.1)}',
    '.fta-stats>div{padding:10px 12px 9px;background:#0D0E10;min-width:0}',
    '.fta-stats b{display:block;font-weight:850;font-stretch:62%;font-size:30px;line-height:1;color:#fff;font-variant-numeric:tabular-nums}',
    '.fta-stats b.t{font-size:15px;font-stretch:80%;line-height:1.15;padding-top:4px}',
    '.fta-stats span{display:block;margin-top:5px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7D7C77}',
    '.fta-gate{display:flex;gap:11px;align-items:flex-start;padding:14px 15px;border-radius:16px;border:1px dashed rgba(245,181,68,.6);background:rgba(245,181,68,.06);font-size:14px;line-height:1.5}',
    '.fta-gate i{flex:none;margin-top:6px;width:8px;height:8px;border-radius:50%;background:#F5B544;box-shadow:0 0 10px rgba(245,181,68,.7)}',
    '.fta-gate strong{color:#F5B544}',
    '.fta-gate[data-k=none]{border-color:rgba(237,236,230,.28);background:rgba(237,236,230,.04)}.fta-gate[data-k=none] i{background:#7D7C77;box-shadow:none}.fta-gate[data-k=none] strong{color:#C9C8C1}',
    '.fta-gate[data-k=block]{border-color:rgba(255,138,138,.6);background:rgba(255,138,138,.06)}.fta-gate[data-k=block] i{background:#FF8A8A;box-shadow:0 0 10px rgba(255,138,138,.7)}.fta-gate[data-k=block] strong{color:#FF8A8A}',
    '.fta-net{display:flex;flex-direction:column;gap:8px}',
    '.fta-net svg{display:block;width:100%;height:auto;max-width:230px;margin:0 auto}',
    '.fta-net g[data-fta-go]{cursor:pointer}',
    '.fta-k{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7D7C77}',
    '.fta-note{margin:0;font-size:12px;line-height:1.5;color:#7D7C77}',
    '.fta-sec{margin-top:clamp(30px,4.4vh,46px)}.fta-sec:first-child{margin-top:0}',
    '.fta-h{display:flex;align-items:center;gap:12px;margin:0 0 16px;font-size:13px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#8ACFFF}',
    '.fta-h span{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:22px;padding:0 7px;border-radius:999px;background:rgba(46,155,255,.16);font-size:11px;letter-spacing:.04em}',
    '.fta-h::after{content:"";flex:1;height:1px;background:rgba(237,236,230,.1)}',
    '.fta-mis{margin:0;font-size:16.5px;line-height:1.62;color:#C9C8C1;max-width:78ch;text-wrap:pretty}',
    '.fta-run-in{margin:12px 0 0;display:flex;gap:9px;align-items:center;font-size:13.5px;color:#A9A8A2}.fta-run-in b{color:#EDECE6;font-weight:700}',
    '.fta-procs{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}',
    '.fta-proc{position:relative;padding:18px 18px 16px;border-radius:20px;border:1px solid rgba(237,236,230,.12);background:rgba(237,236,230,.035);display:flex;flex-direction:column;gap:10px}',
    '.fta-proc h4{margin:0;font-size:17.5px;line-height:1.25;font-weight:800;color:#fff;padding-right:34px}',
    '.fta-pn{position:absolute;top:16px;right:16px;font-weight:900;font-stretch:62%;font-size:20px;line-height:1;color:rgba(138,207,255,.5)}',
    '.fta-proc dl{margin:0;display:flex;flex-direction:column;gap:9px}',
    '.fta-proc dl>div{display:grid;grid-template-columns:86px minmax(0,1fr);gap:10px;align-items:baseline}',
    '.fta-proc dt{font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#7D7C77}',
    '.fta-proc dd{margin:0;font-size:14px;line-height:1.5;color:#D9D8D2}',
    '.fta-proc .ok dt{color:#3DDC97}.fta-proc .ok dd{color:#C9C8C1}',
    '.fta-split{display:grid;grid-template-columns:minmax(0,.86fr) minmax(0,1.14fr);gap:18px;align-items:start}',
    '.fta-sim{display:inline-flex;align-items:center;gap:7px;height:26px;padding:0 11px;border-radius:999px;border:1px solid rgba(245,181,68,.45);background:rgba(245,181,68,.08);color:#F5B544;font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;margin-bottom:12px}',
    '.fta-arts{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}',
    '.fta-arts li{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 12px;border-radius:14px;background:rgba(237,236,230,.04);border:1px solid rgba(237,236,230,.1)}',
    '.fta-arts code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;color:#8ACFFF;overflow-wrap:anywhere}',
    '.fta-arts em{font-style:normal;font-size:12px;font-weight:700;color:#7D7C77}',
    '.fta-steps{list-style:none;margin:14px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}',
    '.fta-steps li{display:grid;grid-template-columns:94px minmax(0,1fr);gap:10px;font-size:13.5px;line-height:1.4;color:#C9C8C1}',
    '.fta-steps time{font-size:11.5px;font-weight:700;letter-spacing:.05em;color:#7D7C77;font-variant-numeric:tabular-nums;padding-top:1px}',
    '.fta-steps b{color:#fff;font-weight:700}',
    '.fta-sample .fts-run{gap:0}',
    '.fta-sample .fts-stage{height:auto;min-height:282px}',
    '.fta-sample .fts-view{position:relative;inset:auto;min-height:282px;animation:none}',
    '.fta-cap{margin:9px 2px 0;font-size:12px;line-height:1.45;color:#7D7C77}',
    '.fta-hand2{display:grid;grid-template-columns:230px minmax(0,1fr);gap:26px;align-items:center}',
    '.fta-hand{display:flex;flex-direction:column;gap:18px}',
    '.fta-hand h4{margin:0 0 10px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#7D7C77}',
    '.fta-chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.fta-chip{display:inline-flex;align-items:center;gap:10px;padding:5px 14px 5px 5px;border-radius:999px;border:1px solid rgba(237,236,230,.16);background:rgba(237,236,230,.04);color:#EDECE6;font-family:inherit;cursor:pointer;text-align:left;transition:border-color .2s,background .2s}',
    '.fta-chip:hover,.fta-chip:focus-visible{border-color:#2E9BFF;background:rgba(46,155,255,.12);outline:none}',
    '.fta-chip img{flex:none;width:38px;height:38px;border-radius:50%;object-fit:cover;object-position:50% 34%;background:#101111;border:1px solid rgba(237,236,230,.16)}',
    '.fta-chip span{display:flex;flex-direction:column;line-height:1.15}.fta-chip b{font-size:14px;font-weight:700}.fta-chip em{font-style:normal;font-size:11.5px;color:#7D7C77}',
    '.fta-conn{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}',
    '.fta-conn li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 14px;border-radius:14px;border:1px solid rgba(237,236,230,.12);background:rgba(237,236,230,.035);font-size:14.5px;font-weight:600}',
    '.fta-conn i{flex:none;font-style:normal;font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:4px 9px;border-radius:999px;background:rgba(46,155,255,.16);color:#8ACFFF;white-space:nowrap}',
    '.fta-conn li[data-m=d] i{background:rgba(237,236,230,.1);color:#C9C8C1}.fta-conn li[data-m=w] i{background:rgba(245,181,68,.16);color:#F5B544}',
    '.fta-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}',
    '.fta-list li{display:grid;grid-template-columns:34px minmax(0,1fr);gap:12px;align-items:start;padding:13px 15px;border-radius:16px;border:1px solid rgba(237,236,230,.1);background:rgba(237,236,230,.03);font-size:15px;line-height:1.5;color:#D9D8D2}',
    '.fta-list li>i{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:rgba(46,155,255,.16);color:#8ACFFF;font-style:normal;font-size:12px;font-weight:800}',
    '.fta-list.no li>i{background:rgba(255,138,138,.14);color:#FF8A8A;font-size:15px}',
    '.fta-foot{flex:none;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px clamp(14px,2vw,24px);border-top:1px solid rgba(237,236,230,.1);background:#0A0B0C}',
    '.fta-nav{display:inline-flex;align-items:center;gap:10px;max-width:34%;padding:5px 16px 5px 5px;border-radius:999px;border:1px solid rgba(237,236,230,.16);background:transparent;color:#EDECE6;font-family:inherit;cursor:pointer;transition:border-color .2s,background .2s}',
    '.fta-nav:hover,.fta-nav:focus-visible{border-color:#2E9BFF;background:rgba(46,155,255,.1);outline:none}',
    '.fta-nav[data-d="1"]{flex-direction:row-reverse;padding:5px 5px 5px 16px;text-align:right}',
    '.fta-nav img{flex:none;width:36px;height:36px;border-radius:50%;object-fit:cover;object-position:50% 34%;background:#101111;border:1px solid rgba(237,236,230,.16)}',
    '.fta-nav span{display:flex;flex-direction:column;line-height:1.15;min-width:0}.fta-nav em{font-style:normal;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#7D7C77}.fta-nav b{font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.fta-mid{display:flex;flex-direction:column;align-items:center;gap:7px;min-width:0}',
    '.fta-cnt{font-size:13px;font-weight:800;letter-spacing:.06em;font-variant-numeric:tabular-nums;color:#A9A8A2}.fta-cnt b{color:#fff}',
    '.fta-copy{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 13px;border-radius:999px;border:1px solid rgba(237,236,230,.2);background:transparent;color:#C9C8C1;font-family:inherit;font-size:12.5px;font-weight:700;cursor:pointer;transition:border-color .2s,color .2s}',
    '.fta-copy:hover{border-color:#2E9BFF;color:#fff}',
    '.fta-swap{animation:fta-swap .34s cubic-bezier(.16,1,.3,1) both}',
    '@media (max-width:860px){',
    '.fta{padding:0}',
    '.fta-card{width:100%;height:100%;border-radius:0;border:0}',
    '.fta-body{display:block;overflow:auto;-webkit-overflow-scrolling:touch}',
    '.fta-rail{overflow:visible;border-right:0;border-bottom:1px solid rgba(237,236,230,.1);padding:62px 18px 20px;display:grid;grid-template-columns:132px minmax(0,1fr);gap:14px 16px;align-items:start}',
    '.fta-rail>.fta-ph{grid-row:1 / span 2;aspect-ratio:4/5}',
    '.fta-rail>.fta-id{grid-column:2}',
    '.fta-rail>.fta-lead,.fta-rail>.fta-stats,.fta-rail>.fta-gate{grid-column:1 / -1}',
    '.fta-ph img{transform:scale(1.16)}.fta-ph .no{font-size:17px;top:9px;left:10px}.fta-ph .no small{display:none}',
    '.fta-main{overflow:visible;padding:22px 18px 28px}',
    '.fta-name{font-size:clamp(30px,9vw,42px)}',
    '.fta-procs,.fta-conn,.fta-hand2,.fta-split{grid-template-columns:minmax(0,1fr)}',
    '.fta-nav{max-width:38%}.fta-nav b{font-size:13px}',
    '.fta-copy span{display:none}',
    '}',
    '@media (max-width:520px){.fta-nav span{display:none}.fta-nav{padding:5px}.fta-nav[data-d="1"]{padding:5px}}',
    '@media (prefers-reduced-motion:reduce){.fta-card,.fta-veil,.fta-swap{animation:none}.fta-ph img,.fta-ph .gl{animation:none}}'
  ].join('\n');

  // ---------------------------------------------------------------- state + dom
  var el = null, cur = -1, openedFrom = null, prevHash = '', prevOverflow = '', pausedByUs = false, gen = 0;
  var X_ICON = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var LINK_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6.5 9.5l3-3M7 4.5l1-1a3 3 0 014.2 4.2l-1 1M9 11.5l-1 1a3 3 0 01-4.2-4.2l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
  var ARR_L = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function ensureDom() {
    if (el) return el;
    var st = document.createElement('style'); st.setAttribute('data-fta-css', ''); st.textContent = CSS; document.head.appendChild(st);
    el = document.createElement('div'); el.className = 'fta'; el.hidden = true; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-labelledby', 'fta-name');
    el.innerHTML = '<div class="fta-veil" data-fta-close></div><div class="fta-card" tabindex="-1"><button type="button" class="fta-x" data-fta-close aria-label="Close agent card">' + X_ICON + '</button><div class="fta-body"><aside class="fta-rail" data-fta-rail></aside><div class="fta-main" data-fta-main></div></div><div class="fta-foot" data-fta-foot></div></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-fta-close],[data-fta-go],[data-fta-step],[data-fta-copy]'); if (!t) return;
      if (t.hasAttribute('data-fta-close')) return close();
      if (t.hasAttribute('data-fta-go')) return show(+t.getAttribute('data-fta-go'), true);
      if (t.hasAttribute('data-fta-step')) return show((cur + (+t.getAttribute('data-fta-step')) + 27) % 27, true);
      if (t.hasAttribute('data-fta-copy')) return copyLink(t);
    });
    return el;
  }

  // ---------------------------------------------------------------- render
  function net(a) {
    var cx = 120, cy = 120, R = 96, n = 27, pt = function (k, r) { var t = -Math.PI / 2 + k * 2 * Math.PI / n; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; };
    var link = {}; M.EDGES.forEach(function (e) { if (e[0] === a.i) link[e[1]] = 1; if (e[1] === a.i) link[e[0]] = 1; });
    var s = '<svg viewBox="0 0 240 240" role="img" aria-label="Where ' + esc(a.alias) + ' sits among the 27 Drops">';
    s += '<circle cx="120" cy="120" r="96" fill="none" stroke="rgba(237,236,230,.07)"/><circle cx="120" cy="120" r="18" fill="#0B0C0D" stroke="rgba(245,181,68,.55)" stroke-dasharray="3 3"/><text x="120" y="123.5" text-anchor="middle" fill="#F5B544" style="font-size:8px;font-weight:800;letter-spacing:.08em">YOU</text>';
    M.EDGES.forEach(function (e) {
      var on = e[0] === a.i || e[1] === a.i, p = pt(e[0], R), q = pt(e[1], R);
      s += '<path d="M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + 'Q' + cx + ' ' + cy + ' ' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + '" fill="none" stroke="' + (on ? (e[0] === a.i ? '#2E9BFF' : '#8ACFFF') : '#EDECE6') + '" stroke-opacity="' + (on ? '.85' : '.06') + '" stroke-width="' + (on ? '1.5' : '1') + '"/>';
    });
    M.AGENTS.forEach(function (b) {
      var p = pt(b.i, R), me = b.i === a.i, lk = link[b.i], same = b.group === a.group;
      s += '<g data-fta-go="' + b.i + '"><title>' + esc(b.alias) + '</title><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="12" fill="transparent"/>' +
        (me ? '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="10" fill="none" stroke="#2E9BFF" stroke-opacity=".5"/>' : '') +
        '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (me ? 6.5 : lk ? 5 : 3.6) + '" fill="' + (me ? '#2E9BFF' : lk ? '#EDECE6' : same ? '#8ACFFF' : '#3a3c40') + '"' + (same && !me && !lk ? ' fill-opacity=".7"' : '') + '/></g>';
    });
    return s + '</svg>';
  }
  function chipHtml(k) { var b = M.AGENTS[k]; return '<button type="button" class="fta-chip" data-fta-go="' + k + '"><img src="' + PORT(b.img) + '" alt="" loading="lazy"><span><b>' + esc(b.alias) + '</b><em>' + esc(b.role) + '</em></span></button>'; }

  function railHtml(a, outs, ins) {
    var num = String(a.i + 1).padStart(2, '0');
    return '<div class="fta-ph"><div class="gl"></div><img src="' + PORT(a.img) + '" alt="' + esc(a.role) + ' Drop"><div class="no">' + num + '<small>/ 27</small></div></div>' +
      '<div class="fta-id" style="display:flex;flex-direction:column;gap:10px"><span class="fta-tag">' + esc(a.group) + ' · Drop ' + num + '</span><div><h2 class="fta-name' + (a.role.length > 21 ? ' long' : '') + '" id="fta-name">' + esc(a.role) + '</h2><p class="fta-alias">' + esc(a.alias) + '</p></div></div>' +
      '<p class="fta-lead">' + esc(a.tag) + '</p>' +
      '<div class="fta-stats"><div><b>' + a.procs.length + '</b><span>Procedures</span></div><div><b>' + outs.length + '</b><span>Hands work to</span></div><div><b>' + ins.length + '</b><span>Receives from</span></div>' +
      '<div><b data-s="art">·</b><span>Run artifacts</span></div><div><b data-s="led">·</b><span>Steps in run</span></div><div><b class="t">' + esc(a.gl) + '</b><span>Control</span></div></div>' +
      '<div class="fta-gate" data-k="' + a.gk + '"><i></i><span><strong>Sign-off · </strong>' + esc(a.gate) + '</span></div>';
  }

  function mainHtml(a, outs, ins) {
    var h = '';
    h += '<section class="fta-sec"><h3 class="fta-h"><span>01</span>What it does</h3><p class="fta-mis">' + esc(a.desc) + ' ' + esc(a.mission) + '</p><p class="fta-run-in"><b>Runs</b> ' + esc(a.run) + '</p></section>';
    h += '<section class="fta-sec"><h3 class="fta-h"><span>02</span>How it works</h3><ol class="fta-procs">' + a.procs.map(function (p, k) {
      return '<li class="fta-proc"><span class="fta-pn">' + String(k + 1).padStart(2, '0') + '</span><h4>' + esc(p.t) + '</h4><dl><div><dt>Takes in</dt><dd>' + esc(p.in) + '</dd></div><div><dt>Produces</dt><dd>' + esc(p.out) + '</dd></div><div class="ok"><dt>Passes when</dt><dd>' + esc(p.ok) + '</dd></div></dl></li>';
    }).join('') + '</ol></section>';
    h += '<section class="fta-sec" data-fta-runsec><h3 class="fta-h"><span>03</span>In the Texas cooling-tower run</h3><div class="fta-split"><div data-fta-arts><span class="fta-sim">Simulated run · illustrative</span><p class="fta-cap" style="margin:0">Loading the run…</p></div><div class="fta-sample" data-fta-sample></div></div></section>';
    h += '<section class="fta-sec"><h3 class="fta-h"><span>04</span>Hand-offs</h3><div class="fta-hand2"><div class="fta-net"><span class="fta-k">Where it sits among the 27</span>' + net(a) + '</div><div class="fta-hand"><div><h4>Receives work from</h4><div class="fta-chips">' + (ins.length ? ins.map(chipHtml).join('') : '<span class="fta-cap">Starts from the Operator’s request.</span>') + '</div></div><div><h4>Hands work to</h4><div class="fta-chips">' + (outs.length ? outs.map(chipHtml).join('') : '<span class="fta-cap">Hands to the Operator.</span>') + '</div></div></div></div></section>';
    h += '<section class="fta-sec"><h3 class="fta-h"><span>05</span>Connects to</h3><ul class="fta-conn">' + a.conn.map(function (c) { return '<li data-m="' + c[1] + '"><span>' + esc(c[0]) + '</span><i>' + ({ r: 'Read only', d: 'Drafts only', w: 'Writes after approval' }[c[1]]) + '</i></li>'; }).join('') + '</ul><p class="fta-cap" style="margin-top:12px">Access starts read-only. Nothing is written, published or spent without the Operator’s approval.</p></section>';
    h += '<section class="fta-sec"><h3 class="fta-h"><span>06</span>First 90 days at Flow-Tech</h3><ol class="fta-list">' + a.d90.map(function (t, k) { return '<li><i>' + (k + 1) + '</i><span>' + esc(t) + '</span></li>'; }).join('') + '</ol></section>';
    h += '<section class="fta-sec"><h3 class="fta-h"><span>07</span>Never does</h3><ul class="fta-list no">' + a.never.map(function (t) { return '<li><i>×</i><span>' + esc(t) + '</span></li>'; }).join('') + '</ul></section><p class="fta-note" style="margin-top:34px">Illustrative design data for how the department is set up. No results are claimed here.</p>';
    return h;
  }

  function footHtml(a) {
    var p = M.AGENTS[(a.i + 26) % 27], n = M.AGENTS[(a.i + 1) % 27];
    return '<button type="button" class="fta-nav" data-fta-step="-1" data-d="0" aria-label="Previous Drop: ' + esc(p.alias) + '"><img src="' + PORT(p.img) + '" alt=""><span><em>Previous</em><b>' + esc(p.alias) + '</b></span></button>' +
      '<div class="fta-mid"><div class="fta-cnt"><b>' + String(a.i + 1).padStart(2, '0') + '</b> / 27</div><button type="button" class="fta-copy" data-fta-copy>' + LINK_ICON + '<span>Copy link</span></button></div>' +
      '<button type="button" class="fta-nav" data-fta-step="1" data-d="1" aria-label="Next Drop: ' + esc(n.alias) + '"><img src="' + PORT(n.img) + '" alt=""><span><em>Next</em><b>' + esc(n.alias) + '</b></span></button>';
  }

  function show(i, swap) {
    if (i < 0 || i > 26 || !M) return;
    var a = M.AGENTS[i], outs = [], ins = [];
    M.EDGES.forEach(function (e) { if (e[0] === i) outs.push(e[1]); if (e[1] === i) ins.push(e[0]); });
    cur = i; var my = ++gen;
    var rail = el.querySelector('[data-fta-rail]'), main = el.querySelector('[data-fta-main]'), foot = el.querySelector('[data-fta-foot]');
    rail.innerHTML = railHtml(a, outs, ins); main.innerHTML = mainHtml(a, outs, ins); foot.innerHTML = footHtml(a);
    el.querySelector('.fta-body').scrollTop = 0; main.scrollTop = 0; rail.scrollTop = 0;
    if (swap && !reduced()) [rail, main].forEach(function (n) { n.classList.remove('fta-swap'); void n.offsetWidth; n.classList.add('fta-swap'); });
    try { history.replaceState(null, '', location.pathname + location.search + '#agent-' + a.slug); } catch (e) {}
    fillRun(a, my);
    if (swap) { var t = el.querySelector('.fta-name'); if (t) { t.setAttribute('tabindex', '-1'); } }
  }

  // ---------------------------------------------------------------- simulated-run section
  function stepsLed(SC, i) { return SC.steps.filter(function (s) { return s.lead === i; }); }
  function pickView(SC, i) {
    var over = { 9: 'video', 16: 'flow' };
    var all = [];
    SC.steps.forEach(function (s) {
      var led = s.lead === i, works = (s.fx || []).some(function (f) { return f[1] === 'work' && f[2].indexOf(i) > -1; });
      if (!led && !works) return;
      if (s.view) all.push({ s: s, v: s.view, led: led });
      (s.fx || []).forEach(function (f) { if (f[1] === 'view') all.push({ s: s, v: f[2], led: led, fx: true }); });
    });
    if (over[i]) { var o = all.filter(function (x) { return x.v.kind === over[i]; })[0]; if (o) return o; }
    return all.filter(function (x) { return x.led && !x.fx; })[0] || all.filter(function (x) { return !x.fx; })[0] || all[0] || null;
  }
  var rtStub = function (my) {
    return {
      sleep: function () { return Promise.resolve(); },
      type: function () { return Promise.resolve(); },
      tween: function (ms, fn) { return new Promise(function (res) { var t0 = performance.now(), d = Math.min(ms, 900); (function f(now) { if (my !== gen) return res(); var p = Math.min(1, (now - t0) / d); fn(p); if (p < 1) requestAnimationFrame(f); else res(); })(t0); }); }
    };
  };
  function fillRun(a, my) {
    simData().then(function (S) {
      if (my !== gen || !el || el.hidden) return;
      var box = el.querySelector('[data-fta-arts]'), sample = el.querySelector('[data-fta-sample]');
      if (!S) { var sec = el.querySelector('[data-fta-runsec]'); if (sec) sec.remove(); return; }
      var SC = S.SC, arts = Object.keys(SC.art).filter(function (k) { return SC.art[k].owner === a.i; }).map(function (k) { return [k, SC.art[k]]; });
      var led = stepsLed(SC, a.i);
      var set = function (k, v) { var n = el.querySelector('[data-s="' + k + '"]'); if (n) n.textContent = v; };
      set('art', arts.length); set('led', SC.steps.filter(function (s) { return s.lead === a.i || (s.fx || []).some(function (f) { return f[1] === 'work' && f[2].indexOf(a.i) > -1; }); }).length);
      var ver = function (f) { var m = /_v(\d+)/.exec(f); return m ? 'v' + m[1] : 'v1'; };
      box.innerHTML = '<span class="fta-sim">Simulated run · illustrative</span><ul class="fta-arts">' + arts.map(function (x) {
        return '<li><span class="fts-chip b" style="display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:999px;font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;background:rgba(46,155,255,.18);color:#8ACFFF">' + esc(x[1].type) + '</span><code>' + esc(x[1].file) + '</code><em>' + ver(x[1].file) + ' · #' + S.P.digest(x[0]) + '</em></li>';
      }).join('') + '</ul>' + (led.length ? '<ul class="fta-steps">' + led.map(function (s) { return '<li><time>' + esc(s.clock) + '</time><span><b>' + esc(s.title) + '.</b> ' + esc(s.text) + '</span></li>'; }).join('') + '</ul>' : '') +
        '<p class="fta-cap">Every name, count and file in the run is illustrative. It shows how the work moves, not Flow-Tech results.</p>';
      var pv = pickView(SC, a.i);
      if (!pv) { sample.remove(); return; }
      var d = pv.v, def = S.P.VIEWS[d.kind]; if (!def) { sample.remove(); return; }
      if (!document.querySelector('style[data-fts-css]')) { var st = document.createElement('style'); st.setAttribute('data-fts-css', ''); st.textContent = S.P.CSS; document.head.appendChild(st); }
      var dd = d.sampleIds ? Object.assign({}, d, { sample: d.sampleIds.map(function (id) { return [SC.art[id].file, S.P.digest(id)]; }) }) : d;
      var out; try { out = def(dd); } catch (e) { sample.remove(); return; }
      sample.innerHTML = '<span class="fta-sim">Sample output · from the run</span><div class="fts-run"><div class="fts-stage"><div class="fts-view">' + out.html + '</div></div></div><p class="fta-cap">Step: ' + esc(pv.s.title) + '. Illustrative content.</p>';
      var v = sample.querySelector('.fts-view');
      if (out.run) Promise.resolve(out.run(v, rtStub(my))).catch(function () {});
    });
  }

  // ---------------------------------------------------------------- open / close
  function focusables() { return [].slice.call(el.querySelectorAll('button:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')).filter(function (n) { return n.offsetParent !== null || n === document.activeElement; }); }
  function sim() { var r = document.querySelector('[data-org]'); return r && r.__sim && r.__sim.setPaused ? r.__sim : null; }
  function open(ref, opts) {
    opts = opts || {};
    return data().then(function () {
      var i = resolve(ref); if (i < 0) return false;
      ensureDom();
      if (el.hidden) {
        openedFrom = opts.from || document.activeElement; prevHash = /^#agent-/.test(location.hash) ? '' : location.hash;
        prevOverflow = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';
        var s = sim(); if (s && s.running && !s.paused) { s.setPaused(true); pausedByUs = true; }
        el.hidden = false;
        document.addEventListener('keydown', onKey, true);
      }
      show(i, !!opts.swap);
      var c = el.querySelector('.fta-card'); if (c) c.focus({ preventScroll: true });
      simData();
      return true;
    });
  }
  function close() {
    if (!el || el.hidden) return;
    gen++; el.hidden = true; document.removeEventListener('keydown', onKey, true);
    document.documentElement.style.overflow = prevOverflow;
    try { history.replaceState(null, '', location.pathname + location.search + prevHash); } catch (e) {}
    var s = sim(); if (pausedByUs && s) s.setPaused(false); pausedByUs = false;
    var f = openedFrom; openedFrom = null; cur = -1;
    if (f && f.focus && document.contains(f)) { try { f.focus({ preventScroll: true }); } catch (e) {} }
  }
  function onKey(e) {
    if (!el || el.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); return close(); }
    if (e.key === 'Tab') {
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1], a = document.activeElement;
      if (!el.contains(a)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && (a === first || a.classList.contains('fta-card'))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && a === last) { e.preventDefault(); first.focus(); }
      return;
    }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !/input|textarea|select/i.test((e.target.tagName || ''))) {
      e.preventDefault(); show((cur + (e.key === 'ArrowRight' ? 1 : 26)) % 27, true);
    }
  }
  function copyLink(btn) {
    var url = location.origin + location.pathname + '#agent-' + M.AGENTS[cur].slug, lab = btn.querySelector('span');
    var done = function () { if (lab) { lab.textContent = 'Copied'; setTimeout(function () { lab.textContent = 'Copy link'; }, 1600); } };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
    else { var t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (e) {} t.remove(); done(); }
  }

  // ---------------------------------------------------------------- wiring
  var gst = document.createElement('style'); gst.setAttribute('data-fta-base', '');
  gst.textContent = '[data-agent]{cursor:pointer}[data-agent]:focus-visible{outline:2px solid #2E9BFF;outline-offset:3px}span[data-agent]:hover,b[data-agent]:hover{text-decoration:underline;text-underline-offset:3px}';
  document.head.appendChild(gst);
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-agent]'); if (!t) return;
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault(); e.stopPropagation();
    open(t.getAttribute('data-agent'), { from: t });
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var t = e.target; if (!t || !t.getAttribute || !t.hasAttribute('data-agent') || t.tagName === 'A' || t.tagName === 'BUTTON') return;
    e.preventDefault(); open(t.getAttribute('data-agent'), { from: t });
  });
  function fromHash() { var m = /^#agent-([a-z0-9-]+)$/.exec(location.hash); if (m) open(m[1]); }
  addEventListener('hashchange', function () { if (/^#agent-/.test(location.hash)) fromHash(); });
  var warm = function () { data().catch(function () {}); };
  if (document.readyState === 'complete') { setTimeout(warm, 1200); setTimeout(fromHash, 600); }
  else addEventListener('load', function () { setTimeout(warm, 1200); setTimeout(fromHash, 600); });

  window.FTAgents = { open: open, close: close, resolve: function (r) { return resolve(r); }, ready: data, isOpen: function () { return !!el && !el.hidden; } };
})();
