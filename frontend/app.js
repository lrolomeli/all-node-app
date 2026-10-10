(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var reveals = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || prefersReduced) {
    Array.prototype.forEach.call(reveals, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(reveals, function (el) {
      io.observe(el);
    });
  }

  // Resalta el link del nav según la sección visible.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var targets = navLinks
    .map(function (link) {
      var href = link.getAttribute('href') || '';
      return href.charAt(0) === '#' ? document.querySelector(href) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === id);
        });
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    targets.forEach(function (target) {
      spy.observe(target);
    });
  }
})();
