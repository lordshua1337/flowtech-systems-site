// Visual layer for the campaign run: stylesheet + artifact renderers.
// A view is (data, h) => { html, run?(el, rt) }. Text lives in the scenario file, layout lives here.

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Short stable digest for an artifact id (FNV-1a), shown like the real pack shows hashes.
export const digest = id => { let h = 2166136261; for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, '0').slice(0, 6); };

export const CSS = `
.fts-run{--spd:1;display:flex;flex-direction:column;gap:12px;color:#EDECE6;font-size:14px}
.fts-run *{box-sizing:border-box}
.fts-run[data-paused] *{animation-play-state:paused!important}
.fts-head{display:flex;align-items:center;justify-content:space-between;gap:8px 12px;flex-wrap:wrap}
.fts-live{display:inline-flex;align-items:center;gap:9px;font-size:12px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#8ACFFF}
.fts-ping{width:8px;height:8px;border-radius:50%;background:#2E9BFF;animation:fts-ping calc(1.4s/var(--spd)) ease-out infinite}
.fts-run[data-paused] .fts-ping{background:#F5B544;animation:none}
.fts-run[data-complete] .fts-ping{background:#3DDC97;animation:none}.fts-run[data-complete] .fts-live{color:#3DDC97}
.fts-files{display:flex;flex-wrap:wrap;gap:5px}.fts-files .fts-chip{text-transform:none;letter-spacing:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px;font-weight:600}
@keyframes fts-ping{0%{box-shadow:0 0 0 0 rgba(46,155,255,.65)}100%{box-shadow:0 0 0 10px rgba(46,155,255,0)}}
.fts-clock{font-variant-numeric:tabular-nums;font-size:13px;font-weight:800;letter-spacing:.07em;color:#EDECE6}
.fts-sim{display:inline-flex;align-items:center;gap:7px;align-self:flex-start;height:24px;padding:0 10px;border-radius:999px;border:1px solid rgba(245,181,68,.45);background:rgba(245,181,68,.08);color:#F5B544;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
.fts-rail{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}
.fts-rail div{min-width:0}
.fts-rail i{display:block;height:4px;border-radius:2px;background:rgba(237,236,230,.14);overflow:hidden;position:relative}
.fts-rail b{position:absolute;inset:0;transform-origin:left;transform:scaleX(0);background:#2E9BFF;transition:transform .5s cubic-bezier(.16,1,.3,1)}
.fts-rail span{display:block;margin-top:6px;font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#6F6E69;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .3s}
.fts-rail div[data-on] span{color:#EDECE6}
.fts-rail div[data-done] b{transform:scaleX(1);background:#3DDC97}
.fts-main{position:relative;display:flex;flex-direction:column;gap:12px}
.fts-card{display:flex;gap:12px;align-items:center;padding:11px 13px;border-radius:18px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.12);height:112px;overflow:hidden}
.fts-card img{flex:none;width:52px;height:60px;object-fit:cover;object-position:50% 58%;border-radius:12px;background:#101111;border:1px solid rgba(237,236,230,.14)}
.fts-card .tx{min-width:0;display:flex;flex-direction:column;gap:3px}
.fts-card .tx{flex:1}.fts-card .who{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:#8ACFFF;white-space:nowrap}
.fts-card .who span{min-width:0;overflow:hidden;text-overflow:ellipsis}.fts-card .who .fts-chip{flex:none}.fts-card .who em{font-style:normal;color:#7D7C77}
.fts-card h5{margin:0;font-size:15.5px;line-height:1.2;font-weight:800;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fts-card p{margin:0;font-size:12.5px;line-height:1.4;color:#B9B8B1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.fts-chip{display:inline-flex;align-items:center;gap:6px;height:20px;padding:0 8px;border-radius:999px;font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;background:rgba(237,236,230,.1);color:#C9C8C1}
.fts-chip.b{background:rgba(46,155,255,.18);color:#8ACFFF}.fts-chip.g{background:rgba(61,220,151,.16);color:#3DDC97}.fts-chip.a{background:rgba(245,181,68,.16);color:#F5B544}.fts-chip.r{background:rgba(255,107,107,.16);color:#FF8A8A}
.fts-stage{position:relative;height:276px;border-radius:20px;background:#0F1012;border:1px solid rgba(237,236,230,.12);overflow:hidden}
.fts-view{position:absolute;inset:0;padding:14px;display:flex;flex-direction:column;gap:9px;animation:fts-in calc(.5s/var(--spd)) cubic-bezier(.16,1,.3,1) both}
.fts-view.out{animation:fts-out calc(.25s/var(--spd)) ease-in both;pointer-events:none}
@keyframes fts-in{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}
@keyframes fts-out{to{opacity:0;transform:translateY(-6px)}}
.fts-k{font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#7D7C77}
.fts-row{display:flex;align-items:center;justify-content:space-between;gap:10px}
.fts-paper{background:#EDECE6;color:#0A0B0C;border-radius:12px;padding:11px 13px;font-size:12px;line-height:1.42;position:relative}
.fts-paper .fts-k{color:#6B6A65}
.fts-paper .fts-chip.b{background:rgba(21,112,207,.14);color:#0B4A99}.fts-paper .fts-chip.g{background:rgba(31,169,113,.18);color:#0E6B43}.fts-paper .fts-chip.a{background:rgba(201,131,18,.18);color:#8A5A00}
.fts-paper h6{margin:0 0 4px;font-size:15px;line-height:1.12;font-weight:850;font-stretch:75%;text-transform:uppercase;letter-spacing:.005em}
.fts-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
.fts-typing::after{content:'';display:inline-block;width:6px;height:1em;margin-left:2px;vertical-align:-2px;background:#1570CF;animation:fts-caret calc(.7s/var(--spd)) steps(1) infinite}
@keyframes fts-caret{50%{opacity:0}}
.fts-feed{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px;height:148px;overflow:hidden;-webkit-mask-image:linear-gradient(#000 60%,transparent);mask-image:linear-gradient(#000 60%,transparent)}
.fts-feed li{display:grid;grid-template-columns:42px 22px minmax(0,1fr);gap:8px;align-items:center;font-size:12.5px;line-height:1.3;color:#B9B8B1;animation:fts-feed calc(.4s/var(--spd)) cubic-bezier(.16,1,.3,1) both}
.fts-feed time{font-size:10.5px;color:#6F6E69;font-variant-numeric:tabular-nums}
.fts-feed img{width:22px;height:22px;border-radius:50%;object-fit:cover;object-position:50% 30%;background:#101111;border:1px solid rgba(237,236,230,.2)}
.fts-feed b{color:#EDECE6;font-weight:700}
.fts-feed code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#8ACFFF;white-space:nowrap}
.fts-feed li[data-k=warn]{color:#F5B544}.fts-feed li[data-k=bad]{color:#FF8A8A}.fts-feed li[data-k=ok]{color:#3DDC97}
@keyframes fts-feed{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
.fts-ctl{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
.fts-btn{display:inline-flex;align-items:center;gap:7px;height:34px;padding:0 13px;border-radius:999px;border:1px solid rgba(237,236,230,.28);background:rgba(237,236,230,.04);color:#EDECE6;font:inherit;font-size:13px;font-weight:700;cursor:pointer;transition:background .2s,transform .15s,border-color .2s}
.fts-btn:hover{background:rgba(237,236,230,.12)}.fts-btn:active{transform:scale(.96)}
.fts-btn:focus-visible,.fts-approve:focus-visible{outline:2px solid #8ACFFF;outline-offset:2px}
.fts-btn[aria-pressed=true]{background:#EDECE6;color:#0A0B0C;border-color:#EDECE6}
.fts-btn.pri{background:#1570CF;border-color:#1570CF;color:#fff}.fts-btn.pri:hover{background:#1A7FE0}
.fts-ctl .sp{flex:1}
.fts-gate{position:absolute;inset:0;z-index:6;display:flex;flex-direction:column;gap:11px;padding:16px;border-radius:20px;background:rgba(10,11,12,.93);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1.5px dashed rgba(245,181,68,.7);animation:fts-in calc(.45s/var(--spd)) cubic-bezier(.16,1,.3,1) both}
.fts-gate h5{margin:0;font-size:22px;line-height:.95;font-weight:850;font-stretch:62%;text-transform:uppercase;color:#fff}
.fts-gate ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:7px;font-size:13px;line-height:1.35;color:#D5D4CD}
.fts-gate li{display:flex;gap:9px;align-items:baseline}.fts-gate li::before{content:'';flex:none;width:6px;height:6px;border-radius:50%;background:#F5B544;transform:translateY(-1px)}
.fts-gate .go{margin-top:auto;display:flex;align-items:center;gap:12px}
.fts-approve{position:relative;flex:1;height:48px;border-radius:999px;border:0;background:#1570CF;color:#fff;font:inherit;font-size:16px;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 28px rgba(21,112,207,.45);transition:background .2s,transform .15s}
.fts-approve:hover{background:#1A7FE0}.fts-approve:active{transform:scale(.97)}
.fts-approve[data-done]{background:#1FA971;box-shadow:0 8px 28px rgba(31,169,113,.45);pointer-events:none}
.fts-count{flex:none;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#A9A8A2;min-width:74px}
.fts-count svg{display:block}
.fts-stamp{position:absolute;right:14px;top:12px;z-index:3;transform:rotate(-8deg);border:2.5px solid #1FA971;color:#1FA971;padding:3px 10px;border-radius:6px;font-weight:900;font-size:13px;letter-spacing:.14em;text-transform:uppercase;background:rgba(237,236,230,.6);animation:fts-stamp calc(.5s/var(--spd)) cubic-bezier(.2,1.5,.4,1) both}
.fts-stamp.r{border-color:#E24B4B;color:#E24B4B}.fts-stamp.a{border-color:#C98312;color:#C98312}
@keyframes fts-stamp{0%{opacity:0;transform:rotate(-8deg) scale(2.4)}100%{opacity:1;transform:rotate(-8deg) scale(1)}}
.fts-pop{animation:fts-pop calc(.5s/var(--spd)) cubic-bezier(.16,1,.3,1) both}
@keyframes fts-pop{from{opacity:0;transform:translateY(8px) scale(.96)}to{opacity:1;transform:none}}
.fts-wipe{animation:fts-wipe calc(.8s/var(--spd)) cubic-bezier(.16,1,.3,1) both}
@keyframes fts-wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
.fts-flag{background:linear-gradient(transparent 55%,rgba(245,181,68,.75) 55%);transition:background .3s}
.fts-flag.bad{background:linear-gradient(transparent 55%,rgba(226,75,75,.7) 55%)}
.fts-strike{text-decoration:line-through;text-decoration-color:#E24B4B;color:#8E8D87}
.fts-ins{background:rgba(31,169,113,.2);border-radius:3px;padding:0 2px}
.fts-scan{position:absolute;left:0;right:0;height:26px;background:linear-gradient(transparent,rgba(21,112,207,.28),transparent);border-bottom:1.5px solid rgba(21,112,207,.6);animation:fts-scan calc(2.2s/var(--spd)) ease-in-out infinite}
@keyframes fts-scan{0%{top:-26px}100%{top:100%}}
.fts-bar{height:6px;border-radius:3px;background:rgba(237,236,230,.12);overflow:hidden}.fts-bar b{display:block;height:100%;border-radius:3px;background:linear-gradient(90deg,#1570CF,#2E9BFF);transform-origin:left;animation:fts-grow calc(.9s/var(--spd)) cubic-bezier(.16,1,.3,1) both}
@keyframes fts-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.fts-map text{font-family:inherit}
.fts-gd{fill:#2E9BFF;opacity:.16;animation:fts-gd calc(.9s/var(--spd)) ease-out both}
@keyframes fts-gd{0%{opacity:.16}35%{opacity:1;fill:#BFE3FF}100%{opacity:.34;fill:#2E9BFF}}
.fts-ct{animation:fts-ctp calc(.6s/var(--spd)) cubic-bezier(.2,1.5,.4,1) both}
@keyframes fts-ctp{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
.fts-ring{transform-box:fill-box;transform-origin:center;animation:fts-rg calc(1.8s/var(--spd)) ease-out infinite}
@keyframes fts-rg{0%{opacity:.8;transform:scale(.6)}100%{opacity:0;transform:scale(2.6)}}
.fts-flow{stroke-dasharray:5 6;animation:fts-flow calc(1.1s/var(--spd)) linear infinite}
@keyframes fts-flow{to{stroke-dashoffset:-22}}
.fts-spin{transform-box:fill-box;transform-origin:center;animation:fts-spin calc(1.1s/var(--spd)) linear infinite}
@keyframes fts-spin{to{transform:rotate(360deg)}}
.fts-lock{display:inline-flex;width:14px;height:14px}
.fts-shelf{display:flex;flex-direction:column;gap:14px;margin-top:clamp(28px,4vh,44px)}
.fts-shelf[hidden]{display:none}
.fts-shelf-h{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:12px 28px}
.fts-shelf-h h4{margin:0;font-weight:850;font-stretch:62%;text-transform:uppercase;font-size:clamp(28px,2.6vw,42px);line-height:.9;color:#EDECE6}
.fts-stats{display:flex;flex-wrap:wrap;gap:8px}
.fts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}
.fts-art{position:relative;display:flex;flex-direction:column;gap:7px;padding:10px 12px 11px;border-radius:14px;border:1px solid rgba(237,236,230,.14);background:rgba(237,236,230,.04);overflow:hidden;animation:fts-art calc(.7s/var(--spd)) cubic-bezier(.16,1,.3,1) both;transition:opacity .5s,border-color .4s,background .4s}
@keyframes fts-art{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
.fts-art.fresh{border-color:rgba(46,155,255,.9);box-shadow:0 0 0 1px rgba(46,155,255,.5),0 0 26px rgba(46,155,255,.35)}
.fts-art .top{display:flex;align-items:center;gap:7px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#8E8D87}
.fts-art .top img{width:20px;height:20px;border-radius:50%;object-fit:cover;object-position:50% 30%;background:#101111;border:1px solid rgba(237,236,230,.2)}
.fts-art .top .v{margin-left:auto;color:#6F6E69}
.fts-art .fn{font-size:12.5px;font-weight:700;color:#EDECE6;overflow-wrap:break-word}
.fts-art .bt{display:flex;align-items:center;justify-content:space-between;gap:8px}
.fts-art .dg{font-size:10.5px;color:#6F6E69}
.fts-art[data-s=cleared]{border-color:rgba(46,155,255,.4)}
.fts-art[data-s=approved]{border-color:rgba(61,220,151,.45);background:rgba(61,220,151,.05)}
.fts-art[data-s=held],.fts-art[data-s=blocked]{border-color:rgba(245,181,68,.5);background:rgba(245,181,68,.05)}
.fts-art[data-s=rejected]{border-color:rgba(255,107,107,.6);background:rgba(255,107,107,.06)}
.fts-art[data-s=stale]{opacity:.5;border-style:dashed;border-color:rgba(255,107,107,.6);background:repeating-linear-gradient(135deg,rgba(255,107,107,.06) 0 6px,transparent 6px 12px)}
.fts-art[data-s=stale] .fn,.fts-art[data-s=superseded] .fn{text-decoration:line-through;text-decoration-color:#FF6B6B;color:#8E8D87}
.fts-art[data-s=superseded]{opacity:.42}
.fts-art.shine::after{content:'';position:absolute;inset:0;background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.22) 50%,transparent 65%);transform:translateX(-120%);animation:fts-shine calc(.9s/var(--spd)) ease-out both;pointer-events:none}
@keyframes fts-shine{to{transform:translateX(120%)}}
.fts-seal{display:flex;flex-direction:column;gap:10px}
.fts-big{font-weight:850;font-stretch:62%;text-transform:uppercase;font-size:clamp(34px,3vw,48px);line-height:.9;color:#fff}
.fts-kpis{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.fts-kpi{padding:10px 12px;border-radius:14px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.12)}
.fts-kpi b{display:block;font-size:26px;line-height:1;font-weight:850;font-stretch:75%;color:#fff;font-variant-numeric:tabular-nums}
.fts-kpi span{display:block;margin-top:4px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#8E8D87}
@media (max-width:560px){.fts-grid{grid-template-columns:repeat(2,1fr)}.fts-stage{height:340px}.fts-paper{font-size:11.5px}.fts-view{padding:12px}.fts-card{height:auto;min-height:112px}.fts-card h5{white-space:normal}.fts-rail span{font-size:9px}}
@media (prefers-reduced-motion:reduce){.fts-run *,.fts-shelf *{animation:none!important;transition:none!important}}
`;

// ---------- small helpers ----------
const chip = (t, k = '') => `<span class="fts-chip ${k}">${esc(t)}</span>`;
const lockIcon = '<svg class="fts-lock" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="2" fill="currentColor"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" stroke-width="1.5"/></svg>';
const checkIcon = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const stamp = (t, k = '') => `<div class="fts-stamp ${k}">${esc(t)}</div>`;

// ---------- Texas map ----------
const TX = [[-103.04, 36.5], [-100, 36.5], [-100, 34.56], [-99.2, 34.2], [-98.5, 34.1], [-97.9, 33.85], [-97.15, 33.74], [-96.5, 33.82], [-96, 33.55], [-94.04, 33.55], [-94.04, 31.99], [-93.8, 31.5], [-93.52, 31.18], [-93.7, 30.5], [-93.9, 30], [-93.84, 29.69], [-94.7, 29.35], [-95.3, 28.9], [-96, 28.35], [-96.8, 28.1], [-97.2, 27.65], [-97.4, 26.9], [-97.15, 25.96], [-97.5, 25.9], [-98.3, 26.1], [-99.1, 26.4], [-99.5, 27.5], [-100.3, 28.3], [-100.7, 29.1], [-101.4, 29.8], [-102.3, 29.9], [-102.7, 29.7], [-103.1, 29], [-103.2, 28.98], [-104, 29.3], [-104.5, 29.7], [-105, 30.6], [-106, 31.4], [-106.53, 31.78], [-106.62, 32], [-103.06, 32]];
const PS = 18.4, px = lon => (lon + 106.75) * 0.857 * PS, py = lat => (36.7 - lat) * PS;
const inTX = (x, y) => { let c = false; for (let i = 0, j = TX.length - 1; i < TX.length; j = i++) { const xi = px(TX[i][0]), yi = py(TX[i][1]), xj = px(TX[j][0]), yj = py(TX[j][1]); if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };

const mapView = d => {
  const outline = 'M' + TX.map(([a, b]) => px(a).toFixed(1) + ' ' + py(b).toFixed(1)).join('L') + 'Z';
  let dots = ''; const st = 6.3;
  for (let y = 4; y < 205; y += st) for (let x = 2; x < 215; x += st) if (inTX(x, y)) dots += `<circle class="fts-gd" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.35" style="animation-delay:calc(${(x / 215 * 1.7).toFixed(2)}s/var(--spd))"/>`;
  const cs = d.counties.map((c, i) => { const x = px(c.lon).toFixed(1), y = py(c.lat).toFixed(1); return `<g class="fts-ct" style="animation-delay:calc(${(1.9 + i * 0.09).toFixed(2)}s/var(--spd))"><circle class="fts-ring" cx="${x}" cy="${y}" r="3.4" fill="none" stroke="#8ACFFF" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="3.1" fill="#EDECE6" stroke="#2E9BFF" stroke-width="1.6"/></g>`; }).join('');
  const rows = d.counties.slice(0, 6).map((c, i) => `<div class="fts-pop" style="display:grid;grid-template-columns:1fr 26px;gap:8px;align-items:center;animation-delay:calc(${(2.1 + i * 0.12).toFixed(2)}s/var(--spd))"><div><div style="font-size:12px;font-weight:700;color:#EDECE6;line-height:1.1">${esc(c.name)}</div><div class="fts-bar" style="margin-top:3px"><b style="width:${c.fit}%;animation-delay:calc(${(2.2 + i * 0.12).toFixed(2)}s/var(--spd))"></b></div></div><div class="fts-mono" style="font-size:11.5px;color:#8ACFFF;text-align:right">${c.fit}</div></div>`).join('');
  return {
    html: `<div style="display:flex;gap:12px;height:100%"><svg class="fts-map" viewBox="0 0 215 206" style="flex:none;width:226px;height:auto;align-self:center" role="img" aria-label="Texas map with 12 modeled target counties"><path d="${outline}" fill="rgba(46,155,255,.05)" stroke="rgba(138,207,255,.55)" stroke-width="1.2" stroke-linejoin="round"/>${dots}${cs}</svg>
      <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:7px"><div><div class="fts-k">County-sector cells scored</div><div class="fts-mono" data-n="${d.cells}" style="font-size:25px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums;line-height:1.1">0</div></div>
      <div class="fts-k" style="margin-top:2px">Top counties · fit index</div>${rows}<div style="margin-top:auto">${chip('Modeled, not measured', 'a')}</div></div></div>`,
    run: async (el, rt) => { const n = el.querySelector('[data-n]'); await rt.tween(1900, p => { n.textContent = Math.round(p * d.cells).toLocaleString('en-US'); }); n.textContent = d.cells.toLocaleString('en-US'); }
  };
};

// ---------- cooling loop diagram ----------
const diagramView = d => ({
  html: `<svg viewBox="0 0 332 208" style="width:100%;height:100%" role="img" aria-label="Illustrative cooling-tower loop diagram">
    <defs><linearGradient id="fts-wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E9BFF" stop-opacity=".5"/><stop offset="1" stop-color="#1570CF" stop-opacity=".25"/></linearGradient></defs>
    <path d="M30 40 L104 40 L116 150 L18 150 Z" fill="rgba(237,236,230,.05)" stroke="#8ACFFF" stroke-width="1.6" stroke-linejoin="round"/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M${34 + i * 1.4} ${70 + i * 15} L${100 - i * 1.4} ${70 + i * 15}" stroke="rgba(138,207,255,.4)" stroke-width="1.2" stroke-dasharray="3 3"/>`).join('')}
    <rect x="18" y="150" width="98" height="20" rx="4" fill="url(#fts-wg)" stroke="#8ACFFF" stroke-width="1.4"/>
    <text x="67" y="10" text-anchor="middle" font-size="9" font-weight="800" fill="#EDECE6" letter-spacing=".06em">COOLING TOWER</text><circle cx="67" cy="30" r="13" fill="none" stroke="#EDECE6" stroke-width="1.5"/><g class="fts-spin"><path d="M67 19v22M56 30h22" stroke="#EDECE6" stroke-width="2.2" stroke-linecap="round"/></g>
    <rect x="212" y="62" width="104" height="64" rx="8" fill="rgba(237,236,230,.05)" stroke="#EDECE6" stroke-width="1.5"/>
    ${[0, 1, 2, 3].map(i => `<path d="M222 ${76 + i * 13} H306" stroke="rgba(237,236,230,.35)" stroke-width="3" stroke-linecap="round"/>`).join('')}
    <text x="264" y="52" text-anchor="middle" font-size="10" font-weight="800" fill="#EDECE6" letter-spacing=".06em">CHILLER / CONDENSER</text>
    <path d="M116 160 H150" stroke="#2E9BFF" stroke-width="3" class="fts-flow"/><circle cx="168" cy="160" r="15" fill="#0F1012" stroke="#2E9BFF" stroke-width="1.6"/><path d="M160 160l16-7v14z" fill="#2E9BFF"/><path d="M183 160 H198 V94 H212" stroke="#2E9BFF" stroke-width="3" fill="none" class="fts-flow"/>
    <path d="M290 62 V30 H104" stroke="#F58B44" stroke-width="3" fill="none" class="fts-flow" style="animation-direction:reverse"/>
    <text x="196" y="24" text-anchor="middle" font-size="9.5" font-weight="700" fill="#F5B544">WARM WATER BACK TO TOWER</text>
    <text x="168" y="190" text-anchor="middle" font-size="9.5" font-weight="700" fill="#8ACFFF">COOLED WATER TO CONDENSER</text>
    <g class="fts-pop" style="animation-delay:calc(1.3s/var(--spd))"><circle class="fts-ring" cx="296" cy="94" r="7" fill="none" stroke="#F5B544" stroke-width="1.6"/><circle cx="296" cy="94" r="3.4" fill="#F5B544"/><path d="M296 98 L300 134" stroke="#F5B544" stroke-width="1" stroke-dasharray="2 3"/><text x="318" y="148" text-anchor="end" font-size="9.5" font-weight="800" fill="#F5B544">SCALE FORMS ON HOT SURFACES</text></g>
    <g class="fts-pop" style="animation-delay:calc(1.9s/var(--spd))"><circle class="fts-ring" cx="70" cy="160" r="6" fill="none" stroke="#3DDC97" stroke-width="1.6"/><circle cx="70" cy="160" r="3" fill="#3DDC97"/><path d="M70 160 L40 192" stroke="#3DDC97" stroke-width="1" stroke-dasharray="2 3"/><text x="8" y="203" font-size="9.5" font-weight="800" fill="#3DDC97">WARM, SLOW WATER: BIOFILM RISK</text></g>
    <text x="324" y="204" text-anchor="end" font-size="9" font-weight="800" fill="#7D7C77" letter-spacing=".06em">ILLUSTRATIVE · NOT TO SCALE</text></svg>`
});

// ---------- document-like views ----------
const briefView = d => ({
  html: `<div class="fts-paper" style="flex:1"><div class="fts-row"><span class="fts-k">Campaign brief</span>${chip(d.ver, 'b')}</div><h6 style="margin-top:5px">${esc(d.title)}</h6>
    <div style="display:grid;grid-template-columns:78px 1fr;gap:5px 10px;margin-top:4px">${d.fields.map(([k, v]) => `<span class="fts-k" style="padding-top:2px">${esc(k)}</span><span data-t>${esc(v)}</span>`).join('')}</div>
    <div style="margin-top:8px;padding-top:7px;border-top:1px solid rgba(10,11,12,.16);font-size:11px;color:#45474A" data-t>${esc(d.rule)}</div></div>`,
  run: async (el, rt) => { for (const n of el.querySelectorAll('[data-t]')) await rt.type(n, 8); }
});

const positionView = d => ({
  html: `<div class="fts-k">Messages by buyer · positioning v1</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;flex:1">${d.buyers.map((b, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.3 + i * 0.35).toFixed(2)}s/var(--spd));padding:11px 12px;border-radius:14px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.12);display:flex;flex-direction:column;gap:7px"><div class="fts-k" style="color:#8ACFFF">${esc(b.who)}</div><div style="font-size:14px;font-weight:800;line-height:1.2;color:#fff">${esc(b.pillar)}</div><div style="font-size:11.5px;line-height:1.35;color:#B9B8B1">${esc(b.note)}</div><div style="margin-top:auto"><div class="fts-k">Proof required</div><div style="font-size:11.5px;color:#EDECE6;line-height:1.3;margin-top:2px">${esc(b.proof)}</div></div></div>`).join('')}</div>
    <div class="fts-row">${chip('Evidence first', 'g')}<span style="font-size:11.5px;color:#8E8D87">No claim ships without a record behind it</span></div>`
});

const accountsView = d => ({
  html: `<div class="fts-row"><span class="fts-k">ICP match · by facility type</span>${chip('Modeled counts', 'a')}</div>
    <div style="display:flex;flex-direction:column;gap:6px;flex:1">${d.rows.map((r, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.2 + i * 0.15).toFixed(2)}s/var(--spd));display:grid;grid-template-columns:1fr 40px 40px;gap:8px;align-items:center;font-size:12.5px"><span style="color:#EDECE6;font-weight:600">${esc(r[0])}</span><span class="fts-mono" style="color:#3DDC97;text-align:right">${r[1]}</span><span class="fts-mono" style="color:#8E8D87;text-align:right">−${r[2]}</span></div>`).join('')}
    <div style="display:grid;grid-template-columns:1fr 40px 40px;gap:8px;font-size:10px" class="fts-k"><span></span><span style="text-align:right">match</span><span style="text-align:right">excl.</span></div></div>
    <div class="fts-pop" style="animation-delay:calc(1.3s/var(--spd));display:flex;gap:10px;align-items:center;padding:9px 11px;border-radius:12px;border:1px dashed rgba(245,181,68,.65);background:rgba(245,181,68,.07);color:#F5B544;font-size:12px;font-weight:700">${lockIcon}<span>Outbound list held · Operator approves any contact list</span></div>`
});

const researchView = d => ({
  html: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;flex:1"><div style="display:flex;flex-direction:column;gap:6px"><div class="fts-k">Competitor claims · dated</div>${d.vendors.map((v, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.2 + i * 0.25).toFixed(2)}s/var(--spd));padding:8px 10px;border-radius:11px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.1)"><div style="font-size:12px;font-weight:700;color:#EDECE6">${esc(v.name)}</div><div style="font-size:11px;color:#B9B8B1;line-height:1.3;margin:2px 0 5px">${esc(v.claim)}</div><div class="fts-row"><span class="fts-mono" style="font-size:10px;color:#7D7C77">seen ${esc(v.seen)}</span>${chip(v.flag, v.k)}</div></div>`).join('')}</div>
    <div style="display:flex;flex-direction:column;gap:6px"><div class="fts-k">Evidence register</div>${d.evidence.map((e, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.5 + i * 0.22).toFixed(2)}s/var(--spd));padding:7px 10px;border-radius:11px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.1)"><div class="fts-row"><span class="fts-mono" style="font-size:10.5px;color:#8ACFFF">${esc(e.id)}</span>${chip(e.valid, e.k)}</div><div style="font-size:11.5px;color:#EDECE6;line-height:1.3;margin-top:3px">${esc(e.type)}</div><div style="font-size:10.5px;color:#8E8D87">${esc(e.scope)}</div></div>`).join('')}</div></div>`
});

const territoriesView = d => ({
  html: `<div class="fts-k">Three creative territories</div><div style="display:flex;flex-direction:column;gap:7px;flex:1">${d.items.map((t, i) => `<div class="fts-pop" data-pick="${t.pick ? 1 : 0}" style="animation-delay:calc(${(0.25 + i * 0.3).toFixed(2)}s/var(--spd));display:flex;gap:11px;align-items:center;padding:10px 12px;border-radius:14px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.12);transition:all .5s"><span class="fts-mono" style="font-size:18px;font-weight:700;color:#7D7C77">${'ABC'[i]}</span><div style="min-width:0"><div style="font-size:14px;font-weight:800;color:#fff;line-height:1.15">${esc(t.name)}</div><div style="font-size:11.5px;color:#B9B8B1;line-height:1.3">${esc(t.line)}</div></div></div>`).join('')}</div>`,
  run: async (el, rt) => { await rt.sleep(1500); el.querySelectorAll('[data-pick]').forEach(n => { if (n.dataset.pick === '1') { n.style.borderColor = '#2E9BFF'; n.style.background = 'rgba(46,155,255,.14)'; n.style.boxShadow = '0 0 22px rgba(46,155,255,.3)'; n.insertAdjacentHTML('beforeend', `<span style="margin-left:auto">${chip('Chosen', 'b')}</span>`); } else n.style.opacity = '.45'; }); }
});

const copyView = d => {
  const body = d.parts.map(p => p.map(seg => typeof seg === 'string' ? esc(seg) : `<span class="fts-flag-slot" data-f="${seg.f}">${esc(seg.t)}</span>`).join(''));
  return {
    html: `<div class="fts-paper" style="flex:1;overflow:hidden"><div class="fts-row"><span class="fts-k">${esc(d.label)}</span>${chip(d.ver, d.verK || 'b')}</div>
      <h6 style="margin-top:6px;font-size:17px;line-height:1.08" data-t>${body[0]}</h6><div style="margin:3px 0 7px;font-size:12.5px" data-t>${body[1]}</div>
      <ul style="margin:0 0 7px;padding-left:16px;font-size:11.5px;line-height:1.4;color:#2A2B2D">${body.slice(2, 5).map(b => `<li data-t>${b}</li>`).join('')}</ul>
      <span style="display:inline-block;padding:5px 12px;border-radius:999px;background:#1570CF;color:#fff;font-size:11.5px;font-weight:800" data-t>${body[5]}</span>${d.scan ? '<div class="fts-scan" style="top:0"></div>' : ''}</div>`,
    run: async (el, rt) => {
      if (!d.noType) for (const n of el.querySelectorAll('[data-t]')) await rt.type(n, 9);
      if (d.flags) { await rt.sleep(d.flagAt || 600); for (const f of d.flags) { el.querySelectorAll(`[data-f="${f}"]`).forEach(n => n.classList.add('fts-flag', 'bad')); await rt.sleep(450); } }
      if (d.ins) { await rt.sleep(300); el.querySelectorAll('[data-f]').forEach(n => n.classList.add('fts-ins')); }
    }
  };
};

const adsView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Ad set · ${esc(d.ver)}</span>${chip(d.badge, d.badgeK)}</div><div style="display:grid;grid-template-columns:1.1fr 1.1fr .8fr;gap:8px;flex:1;align-items:stretch">${d.ads.map((a, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.2 + i * 0.28).toFixed(2)}s/var(--spd));display:flex;flex-direction:column;border-radius:10px;overflow:hidden;background:#EDECE6;color:#0A0B0C"><div style="flex:1;min-height:56px;position:relative;background:radial-gradient(120% 90% at 20% 0%,#2E9BFF,#0B3E80 70%);display:flex;align-items:flex-end;padding:8px"><svg viewBox="0 0 100 40" style="position:absolute;inset:auto 0 0 0;width:100%;opacity:.5" aria-hidden="true"><path d="M0 26 Q12 14 25 26 T50 26 T75 26 T100 26 V40 H0Z" fill="rgba(255,255,255,.22)"/><path d="M0 32 Q12 22 25 32 T50 32 T75 32 T100 32 V40 H0Z" fill="rgba(255,255,255,.18)"/></svg><span style="position:relative;font-size:${i === 2 ? 10.5 : 12.5}px;line-height:1.05;font-weight:850;font-stretch:70%;text-transform:uppercase;color:#fff">${esc(a.h)}</span></div><div style="padding:6px 8px 8px;display:flex;flex-direction:column;gap:5px"><span style="font-size:9.5px;line-height:1.3;color:#45474A">${esc(a.b)}</span><span style="align-self:flex-start;padding:2px 8px;border-radius:999px;background:#1570CF;color:#fff;font-size:9px;font-weight:800">${esc(a.cta)}</span></div><div style="padding:3px 8px;background:rgba(10,11,12,.08);font-size:8.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#6B6A65">${esc(a.fmt)}</div></div>`).join('')}</div>`
});

const videoView = d => ({
  html: `<div class="fts-row"><span class="fts-k">15-second cut-down · ${esc(d.ver)}</span>${chip('Silent + captions', 'b')}</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;flex:1">${d.frames.map((f, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.2 + i * 0.22).toFixed(2)}s/var(--spd));display:flex;flex-direction:column;gap:5px"><div style="flex:1;border-radius:8px;background:linear-gradient(${150 + i * 20}deg,#0B3E80,#1A7FE0 ${60 + i * 8}%,#8ACFFF);position:relative;overflow:hidden"><div style="position:absolute;left:6px;bottom:5px;font-size:8.5px;font-weight:800;color:#fff;letter-spacing:.05em" class="fts-mono">${esc(f[0])}</div></div><div style="font-size:9.5px;line-height:1.25;color:#B9B8B1;min-height:36px">${esc(f[1])}</div></div>`).join('')}</div>
    <div class="fts-bar"><b style="width:100%;animation-duration:calc(2.4s/var(--spd))"></b></div>`
});

const contentView = d => ({
  html: `<div style="display:grid;grid-template-columns:1.25fr 1fr;gap:10px;flex:1"><div style="display:flex;flex-direction:column;gap:6px"><div class="fts-k">Search intent → page</div>${d.search.map((s, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.2 + i * 0.2).toFixed(2)}s/var(--spd));display:grid;grid-template-columns:1fr auto;gap:6px;align-items:center;padding:6px 9px;border-radius:10px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.1)"><span style="font-size:11px;color:#EDECE6;line-height:1.25">${esc(s[0])}</span><span class="fts-mono" style="font-size:10px;color:#8ACFFF">${esc(s[1])}</span></div>`).join('')}</div>
    <div style="display:flex;flex-direction:column;gap:6px"><div class="fts-k">2-week LinkedIn plan</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px">${d.cal.map((c, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.5 + i * 0.07).toFixed(2)}s/var(--spd));height:22px;border-radius:6px;background:${c ? 'rgba(46,155,255,.28)' : 'rgba(237,236,230,.06)'};border:1px solid ${c ? 'rgba(46,155,255,.6)' : 'rgba(237,236,230,.08)'}"></div>`).join('')}</div>
    <div class="fts-k" style="margin-top:4px">Press desk</div><div class="fts-pop" style="animation-delay:calc(1.2s/var(--spd));font-size:11px;line-height:1.35;color:#C9C8C1;padding:8px 10px;border-radius:10px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.1)">${esc(d.press)}</div>${chip('Holding statement ready', 'g')}</div></div>`
});

const auditView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Claim review · v1 draft</span>${chip('Independent reviewer', 'b')}</div><div style="display:flex;flex-direction:column;gap:6px;flex:1">${d.claims.map((c, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.15 + i * 0.35).toFixed(2)}s/var(--spd));display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:8px 10px;border-radius:11px;background:${c.ok ? 'rgba(61,220,151,.06)' : 'rgba(255,107,107,.08)'};border:1px solid ${c.ok ? 'rgba(61,220,151,.3)' : 'rgba(255,107,107,.45)'}"><div><div style="font-size:11.5px;color:#EDECE6;line-height:1.25">“${esc(c.text)}”</div><div style="font-size:10.5px;color:#9B9A94;line-height:1.3;margin-top:2px">${esc(c.why)}</div></div>${chip(c.verdict, c.ok ? 'g' : 'r')}</div>`).join('')}</div>
    <div class="fts-row"><span style="font-size:11px;color:#8E8D87">Supported · Qualified · Contradicted · Unknown · Non-factual</span></div>`
});

const returnView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Returned to the owner · exact findings</span>${chip('Rework 1 of 1', 'a')}</div>
    <div style="display:flex;flex-direction:column;gap:6px">${d.findings.map((f, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.15 + i * 0.3).toFixed(2)}s/var(--spd));padding:8px 10px;border-radius:11px;background:rgba(255,107,107,.08);border:1px solid rgba(255,107,107,.4)"><div class="fts-row"><span class="fts-k" style="color:#FF8A8A">${esc(f.k)}</span><span class="fts-mono" style="font-size:10px;color:#8E8D87">${esc(f.where)}</span></div><div style="font-size:11.5px;color:#EDECE6;line-height:1.3;margin-top:3px">${esc(f.line)}</div></div>`).join('')}</div>
    <div class="fts-pop" style="animation-delay:calc(1.1s/var(--spd));margin-top:auto"><div class="fts-k">Downstream artifacts invalidated</div><div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:5px">${d.stale.map(s => `<span class="fts-chip r fts-mono" style="text-transform:none;letter-spacing:0">${esc(s)}</span>`).join('')}</div><div style="margin-top:6px;font-size:11px;color:#8E8D87">${esc(d.kept)}</div></div>`
});

const landingView = d => ({
  html: `<div style="flex:1;border-radius:10px;overflow:hidden;background:#EDECE6;color:#0A0B0C;display:flex;flex-direction:column"><div style="display:flex;align-items:center;gap:5px;padding:6px 9px;background:#D8D7D0"><i style="width:7px;height:7px;border-radius:50%;background:#E24B4B"></i><i style="width:7px;height:7px;border-radius:50%;background:#E5A93C"></i><i style="width:7px;height:7px;border-radius:50%;background:#46B97A"></i><span class="fts-mono" style="margin-left:8px;font-size:9.5px;color:#6B6A65;background:#EDECE6;border-radius:5px;padding:2px 9px;flex:1">${esc(d.url)}</span></div>
    <div style="flex:1;display:grid;grid-template-columns:1.15fr .85fr;gap:10px;padding:10px 12px"><div class="fts-wipe" style="display:flex;flex-direction:column;gap:6px"><div style="font-size:8.5px;font-weight:900;letter-spacing:.1em;color:#1570CF">FLOW-TECH</div><div style="font-size:15px;line-height:1.02;font-weight:850;font-stretch:70%;text-transform:uppercase">${esc(d.h1)}</div><div style="font-size:9.5px;line-height:1.35;color:#45474A">${esc(d.sub)}</div><div style="display:flex;gap:5px;margin-top:auto">${d.chips.map(c => `<span style="padding:2px 7px;border-radius:999px;background:rgba(10,11,12,.08);font-size:8.5px;font-weight:800">${esc(c)}</span>`).join('')}</div></div>
    <div class="fts-pop" style="animation-delay:calc(.6s/var(--spd));display:flex;flex-direction:column;gap:5px;padding:8px;border-radius:9px;background:#fff;border:1px solid rgba(10,11,12,.12)"><div style="font-size:9px;font-weight:900;letter-spacing:.06em">REQUEST A SYSTEM REVIEW</div>${['Name', 'Work email', 'Facility type'].map(x => `<div style="height:16px;border-radius:4px;background:#F1F0EB;border:1px solid rgba(10,11,12,.1);font-size:8px;color:#8E8D87;padding:2px 5px">${x}</div>`).join('')}<div style="margin-top:auto;padding:4px;border-radius:999px;background:#1570CF;color:#fff;text-align:center;font-size:9px;font-weight:800">Request review</div></div></div></div>
    <div class="fts-row" style="gap:6px;flex-wrap:wrap">${chip('Form is a local demo', 'a')}${chip('Browser walk queued', 'n')}</div>`
});

const flowView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Conversion wireflow · proposed</span>${chip('Accessibility check', 'b')}</div>
    <svg viewBox="0 0 332 98" style="width:100%;flex:none" role="img" aria-label="Wireflow from ad click to CRM event">${d.nodes.map((n, i) => `<g class="fts-pop" style="animation-delay:calc(${(0.15 + i * 0.22).toFixed(2)}s/var(--spd))"><rect x="${n.x}" y="${n.y}" width="58" height="30" rx="8" fill="rgba(237,236,230,.06)" stroke="${n.k === 'bad' ? '#F5B544' : '#8ACFFF'}" stroke-width="1.4" ${n.k === 'bad' ? 'stroke-dasharray="3 3"' : ''}/><text x="${n.x + 29}" y="${n.y + 18.5}" text-anchor="middle" font-size="8.6" font-weight="800" fill="#EDECE6">${esc(n.t)}</text></g>`).join('')}
    ${d.edges.map(e => `<path d="${e}" stroke="#8ACFFF" stroke-width="1.5" fill="none" class="fts-flow" marker-end="url(#fts-ar)"/>`).join('')}<defs><marker id="fts-ar" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8z" fill="#8ACFFF"/></marker></defs></svg>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:auto">${d.checks.map((c, i) => `<span class="fts-pop" style="animation-delay:calc(${(1 + i * 0.2).toFixed(2)}s/var(--spd))">${chip(c[0], c[1])}</span>`).join('')}</div>`
});

const budgetView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Media plan · within the cap</span><span class="fts-mono" style="font-size:12px;color:#fff">$${d.cap.toLocaleString('en-US')} cap</span></div>
    <div style="display:flex;height:16px;border-radius:8px;overflow:hidden;gap:2px">${d.alloc.map((a, i) => `<div style="flex:${a.pct};background:${a.c};transform-origin:left;animation:fts-grow calc(.9s/var(--spd)) cubic-bezier(.16,1,.3,1) both;animation-delay:calc(${(i * 0.12).toFixed(2)}s/var(--spd))"></div>`).join('')}</div>
    <div style="display:flex;flex-direction:column;gap:5px;flex:1">${d.alloc.map((a, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.5 + i * 0.14).toFixed(2)}s/var(--spd));display:grid;grid-template-columns:10px 1fr auto;gap:8px;align-items:center;font-size:12px"><i style="width:10px;height:10px;border-radius:3px;background:${a.c}"></i><span style="color:#EDECE6">${esc(a.name)}<span style="color:#7D7C77"> · ${esc(a.note)}</span></span><span class="fts-mono" style="color:#C9C8C1">$${a.amt.toLocaleString('en-US')}</span></div>`).join('')}</div>
    <div class="fts-row">${chip('Cap checked across all channels', 'g')}${chip('Spend authority: $0 until approved', 'a')}</div>`
});

const emailView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Lifecycle emails · 3 stages</span>${chip('Drafts only', 'n')}</div><div style="display:flex;flex-direction:column;gap:6px;flex:1">${d.stages.map((s, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.2 + i * 0.28).toFixed(2)}s/var(--spd));display:grid;grid-template-columns:22px 1fr;gap:9px;align-items:center;padding:8px 10px;border-radius:11px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.1)"><span class="fts-mono" style="font-size:11px;color:#8ACFFF">S${i + 1}</span><div><div style="font-size:12px;font-weight:700;color:#EDECE6;line-height:1.2">${esc(s[0])}</div><div style="font-size:10.5px;color:#8E8D87;line-height:1.3">${esc(s[1])}</div></div></div>`).join('')}</div>
    <div class="fts-pop" style="animation-delay:calc(1.3s/var(--spd));display:flex;gap:9px;align-items:center;padding:8px 11px;border-radius:12px;border:1px dashed rgba(245,181,68,.65);background:rgba(245,181,68,.07);color:#F5B544;font-size:11.5px;font-weight:700">${lockIcon}<span>Sending blocked · consent not verified. Missing permission never sends.</span></div>`
});

const integrityView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Artifact integrity audit</span><span class="fts-mono" data-ct style="font-size:13px;color:#3DDC97">0/${d.total}</span></div>
    <div class="fts-bar" style="height:8px"><b data-pg style="transform:scaleX(0);animation:none"></b></div>
    <div data-rows style="display:flex;flex-direction:column;gap:4px;flex:1;overflow:hidden"></div>
    <div class="fts-row" style="font-size:11px;color:#8E8D87"><span>${esc(d.note)}</span></div>`,
  run: async (el, rt) => {
    const rows = el.querySelector('[data-rows]'), ct = el.querySelector('[data-ct]'), pg = el.querySelector('[data-pg]'); let n = 0;
    for (const f of d.sample) {
      n++; rows.insertAdjacentHTML('afterbegin', `<div class="fts-feed-row fts-pop" style="display:grid;grid-template-columns:1fr auto auto;gap:9px;align-items:center;font-size:11.5px"><span class="fts-mono" style="color:#EDECE6">${esc(f[0])}</span><span class="fts-mono" style="color:#6F6E69">#${esc(f[1])}</span><span style="color:#3DDC97">${checkIcon}</span></div>`);
      while (rows.children.length > 5) rows.lastChild.remove();
      const shown = Math.round(n / d.sample.length * d.total); ct.textContent = shown + '/' + d.total; pg.style.transform = `scaleX(${n / d.sample.length})`; pg.style.transition = 'transform .4s'; await rt.sleep(260);
    }
    ct.textContent = d.total + '/' + d.total;
  }
});

const launchView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Launch receipt</span>${chip('Approved by Operator', 'g')}</div><div style="display:flex;flex-direction:column;gap:7px;flex:1">${d.rows.map((r, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.15 + i * 0.22).toFixed(2)}s/var(--spd));display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;padding:8px 11px;border-radius:11px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.1)"><div><div style="font-size:12.5px;font-weight:700;color:#EDECE6">${esc(r[0])}</div><div style="font-size:10.5px;color:#8E8D87">${esc(r[1])}</div></div>${chip(r[2], r[3])}</div>`).join('')}</div>`
});

const outlookView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Outlook · first 14 days</span>${chip('Assumptions, not results', 'a')}</div><div style="display:flex;flex-direction:column;gap:7px;flex:1">${d.funnel.map((f, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.15 + i * 0.25).toFixed(2)}s/var(--spd))"><div class="fts-row" style="font-size:12px"><span style="color:#EDECE6;font-weight:600">${esc(f[0])}</span><span class="fts-mono" style="color:#8ACFFF">${esc(f[1])}</span></div><div style="position:relative;height:9px;margin-top:3px;border-radius:5px;background:repeating-linear-gradient(135deg,rgba(237,236,230,.08) 0 5px,transparent 5px 10px)"><div style="position:absolute;left:${f[2]}%;width:${f[3]}%;top:0;bottom:0;border-radius:5px;background:linear-gradient(90deg,#1570CF,#2E9BFF);transform-origin:left;animation:fts-grow calc(.9s/var(--spd)) cubic-bezier(.16,1,.3,1) both;animation-delay:calc(${(0.3 + i * 0.25).toFixed(2)}s/var(--spd))"></div></div><div style="font-size:10px;color:#6F6E69;margin-top:2px">${esc(f[4])}</div></div>`).join('')}</div>
    <div class="fts-row">${chip('Observed: not yet measured', 'n')}<span style="font-size:11px;color:#8E8D87">Unknown is not zero</span></div>`
});

const experimentView = d => ({
  html: `<div class="fts-paper" style="flex:1"><div class="fts-row"><span class="fts-k">Experiment protocol</span>${chip('Frozen before launch', 'b')}</div><h6 style="margin-top:5px">${esc(d.title)}</h6>
    <div style="display:grid;grid-template-columns:76px 1fr;gap:4px 10px;margin-top:2px">${d.fields.map(([k, v]) => `<span class="fts-k" style="padding-top:2px">${esc(k)}</span><span>${esc(v)}</span>`).join('')}</div></div>${stamp('Frozen', 'a')}`
});

const nextView = d => ({
  html: `<div class="fts-row"><span class="fts-k">Next week · top three moves</span>${chip('Awaiting Operator', 'a')}</div><div style="display:flex;flex-direction:column;gap:7px;flex:1">${d.moves.map((m, i) => `<div class="fts-pop" style="animation-delay:calc(${(0.2 + i * 0.3).toFixed(2)}s/var(--spd));display:flex;gap:11px;align-items:center;padding:10px 12px;border-radius:14px;background:rgba(237,236,230,.05);border:1px solid rgba(237,236,230,.12)"><span class="fts-mono" style="font-size:18px;font-weight:700;color:#2E9BFF">${i + 1}</span><div><div style="font-size:13.5px;font-weight:800;color:#fff;line-height:1.2">${esc(m[0])}</div><div style="font-size:11.5px;color:#B9B8B1;line-height:1.3">${esc(m[1])}</div></div></div>`).join('')}</div>`
});

export const VIEWS = { brief: briefView, position: positionView, map: mapView, accounts: accountsView, research: researchView, territories: territoriesView, copy: copyView, ads: adsView, video: videoView, diagram: diagramView, content: contentView, audit: auditView, ret: returnView, landing: landingView, flow: flowView, budget: budgetView, email: emailView, integrity: integrityView, launch: launchView, outlook: outlookView, experiment: experimentView, next: nextView };
export { chip, stamp, checkIcon, lockIcon };
