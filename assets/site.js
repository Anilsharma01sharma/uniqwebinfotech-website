(function () {
  var t = document.querySelector('.nav-toggle'), n = document.getElementById('nav');
  if (t && n) t.addEventListener('click', function () {
    var open = n.classList.toggle('open');
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
    t.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
  });
  if (t && n) {
    n.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { if (n.classList.contains('open')) t.click(); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && n.classList.contains('open')) t.click(); });
  }
  var btns = document.querySelectorAll('[data-filter]');
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      document.querySelectorAll('#work [data-cat]').forEach(function (c) {
        c.style.display = (f === 'all' || c.getAttribute('data-cat') === f) ? '' : 'none';
      });
    });
  });
})();
(function () {
  document.documentElement.classList.add('js');
  var b = document.getElementById('more-clients'), g = document.getElementById('clients');
  if (!b || !g) return;
  if (g.children.length <= 6) { b.style.display = 'none'; return; }
  b.addEventListener('click', function () {
    var open = g.classList.toggle('open');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.textContent = open ? 'Show fewer' : 'View more results';
  });
})();
(function () {
  var t = document.getElementById('chat-toggle'), w = document.getElementById('chat-widget'), o = document.getElementById('chat-options');
  if (!t || !w || !o) return;
  t.addEventListener('click', function () {
    var open = !w.classList.contains('open');
    w.classList.toggle('open', open); o.hidden = !open;
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
    t.setAttribute('aria-label', open ? 'Hide chat options' : 'Open chat options');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && w.classList.contains('open')) t.click(); });
})();
/* Count-up numbers, filling bars and drawing charts when they scroll into view */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NUM = /\d[\d,]*(?:\.\d+)?/g;
  function prep(el) {
    var txt = el.textContent, parts = [], last = 0, m;
    NUM.lastIndex = 0;
    while ((m = NUM.exec(txt))) {
      var raw = m[0], val = parseFloat(raw.replace(/,/g, ''));
      var isYear = /^\d{4}$/.test(raw) && val >= 1900 && val <= 2100;
      parts.push(txt.slice(last, m.index));
      parts.push(isYear ? raw : { val: val, dec: (raw.split('.')[1] || '').length, comma: raw.indexOf(',') > -1 });
      last = m.index + raw.length;
    }
    parts.push(txt.slice(last));
    el._parts = parts;
  }
  function render(el, t) {
    el.textContent = el._parts.map(function (p) {
      if (typeof p === 'string') return p;
      var v = p.val * t, s = p.dec ? v.toFixed(p.dec) : String(Math.round(v));
      return p.comma ? Number(s).toLocaleString('en-US', { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec }) : s;
    }).join('');
  }
  function count(el) {
    var t0 = null, dur = 1600;
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      render(el, e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = document.querySelectorAll('.stat b, .result b, .client .metric');
  var groups = document.querySelectorAll('.visual, .result, .client, .stats');
  if (reduce || !('IntersectionObserver' in window)) { groups.forEach(function (g) { g.classList.add('in'); }); return; }
  nums.forEach(function (el) { prep(el); render(el, 0); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target; io.unobserve(el);
      el.classList.add('in');
      if (el._parts) count(el);
      el.querySelectorAll && el.querySelectorAll('.stat b, .result b, .client .metric').forEach(function (n) { if (n._parts && !n._done) { n._done = 1; count(n); } });
    });
  }, { threshold: 0.35 });
  groups.forEach(function (g) { io.observe(g); });
  function fire(el) {
    if (el.classList.contains('in')) return;
    io.unobserve(el); el.classList.add('in');
    if (el._parts) count(el);
    el.querySelectorAll('.stat b, .result b, .client .metric').forEach(function (n) { if (n._parts && !n._done) { n._done = 1; count(n); } });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      groups.forEach(function (g) { if (g.offsetParent !== null && g.getBoundingClientRect().top < innerHeight * 0.85) fire(g); });
    });
  }, { passive: true });
})();
