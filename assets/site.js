(function () {
  var t = document.querySelector('.nav-toggle'), n = document.getElementById('nav');
  if (t && n) t.addEventListener('click', function () {
    var open = n.classList.toggle('open');
    t.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
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
