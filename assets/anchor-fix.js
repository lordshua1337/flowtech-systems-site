// The page runtime swaps <x-dc> for #dc-root after load, which throws away the browser's own
// scroll to #hash. This puts it back: wait for the target, scroll to it, and re-check as fonts
// and images move the layout. Any wheel, touch, key or click from the visitor ends it.
(function () {
  var h = location.hash;
  if (h.length < 2 || /^#agent-/.test(h)) return;
  var id; try { id = decodeURIComponent(h.slice(1)); } catch (e) { id = h.slice(1); }
  var stopped = false, started = Date.now();
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (t) {
    addEventListener(t, function () { stopped = true; }, { passive: true, once: true });
  });
  function place() {
    var el = document.getElementById(id); if (!el) return false;
    var m = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    var y = Math.max(0, Math.round(el.getBoundingClientRect().top + window.pageYOffset - m));
    if (Math.abs(y - window.pageYOffset) > 2) window.scrollTo(0, y);
    return true;
  }
  var delays = [0, 120, 300, 600, 1000, 1600, 2600, 4000], n = 0;
  function step() {
    if (stopped) return;
    var ok = place();
    if (!ok && Date.now() - started < 6000) return setTimeout(step, 100);
    if (++n < delays.length) setTimeout(step, delays[n] - delays[n - 1]);
  }
  function go() { step(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!stopped) place(); }); }
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
})();
