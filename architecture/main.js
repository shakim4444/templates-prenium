/* MONOLITH — shared script. Lenis retire, scroll natif. Degrade gracefully si GSAP/CDN absent. */
(function () {
  function q(s) { return document.querySelector(s); }

  function fillMarquee() {
    var m = document.getElementById('marquee');
    if (!m) return;
    var items = 'Culturel · Residentiel · Equipements · Prime · Tertiaire · Urbanisme · ';
    var content = items.repeat(8);
    m.innerHTML = content + content;
  }
  function wireForms() {
    document.querySelectorAll('form[data-fake]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var b = f.querySelector('button');
        if (b) { b.textContent = 'Envoye ✓ · reponse sous 48h'; b.disabled = true; }
      });
    });
  }

  function fallbackStatic() {
    document.documentElement.classList.add('no-anim');
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    /* PAS de Lenis - scroll natif */

    /* Curseur personnalise */
    var cursor = q('.cursor');
    if (cursor && window.matchMedia('(hover: hover)').matches) {
      window.addEventListener('pointermove', function (e) {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out' });
      });
    }

    /* Marquee defilant */
    var marqueeEl = document.getElementById('marquee');
    if (marqueeEl) {
      var mw = marqueeEl.scrollWidth / 2;
      if (mw > 0) gsap.to(marqueeEl, { x: -mw, ease: 'none', duration: 40, repeat: -1 });
    }

    /* Index: preloader + hero reveal */
    if (q('.preloader')) {
      var counter = { v: 0 };
      var tl = gsap.timeline();
      var numEl = q('.preloader .num');
      tl.to(counter, {
        v: 100, duration: 1.4, ease: 'power2.inOut',
        onUpdate: function () { if (numEl) numEl.textContent = Math.round(counter.v); }
      });
      tl.to('.preloader', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' });
      tl.to('.hero h1 .line span', { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.09 }, '-=0.35');
      tl.to('.hero .meta-row', { opacity: 1, duration: 0.8 }, '-=0.5');
    }

    /* Subpages: page-hero entrance */
    if (q('.page-hero')) {
      gsap.from('.page-hero > *', { y: 46, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: 0.1 });
    }

    /* Index: horizontal works */
    var track = q('.works-track');
    if (track) {
      var getScroll = function () { return track.scrollWidth - window.innerWidth; };
      gsap.to(track, {
        x: function () { return -getScroll(); },
        ease: 'none',
        scrollTrigger: {
          trigger: '.works-pin', start: 'top top',
          end: function () { return '+=' + getScroll(); },
          scrub: 0.6, pin: true, invalidateOnRefresh: true
        }
      });
    }

    /* Counters */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: function () { el.textContent = Math.round(obj.v); }
      });
    });

    /* Generic reveals */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });

    /* Parallaxe images */
    document.querySelectorAll('[data-parallax]').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  fillMarquee();
  wireForms();
  window.addEventListener('load', function () {
    try {
      if (window.gsap && window.ScrollTrigger) { init(); } else { fallbackStatic(); }
    } catch (err) {
      fallbackStatic();
    }
  });
})();

/* ---- portfolio : apercu flottant + rideaux d'images ---- */
(function () {
  window.addEventListener('load', function () {
    try {
      if (!window.gsap) return;
      var float = document.getElementById('previewFloat');
      var rows = document.querySelectorAll('.prow');
      if (float && rows.length && window.matchMedia('(hover: hover)').matches) {
        var img = float.querySelector('img');
        gsap.set(float, { xPercent: 8, yPercent: -50, scale: 0.92 });
        var xTo = gsap.quickTo(float, 'x', { duration: 0.45, ease: 'power3' });
        var yTo = gsap.quickTo(float, 'y', { duration: 0.45, ease: 'power3' });
        window.addEventListener('pointermove', function (e) { xTo(e.clientX); yTo(e.clientY); });
        rows.forEach(function (row) {
          row.addEventListener('pointerenter', function () {
            var s = row.getAttribute('data-img');
            if (s && img) img.setAttribute('src', s);
            gsap.to(float, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
          });
          row.addEventListener('pointerleave', function () {
            gsap.to(float, { opacity: 0, scale: 0.92, duration: 0.25, ease: 'power3.in' });
          });
        });
      }
      if (window.ScrollTrigger) {
        document.querySelectorAll('.pimg img').forEach(function (im) {
          gsap.fromTo(im,
            { clipPath: 'inset(0 0 100% 0)', scale: 1.12 },
            { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.2, ease: 'power4.out',
              scrollTrigger: { trigger: im, start: 'top 82%' } });
        });
      }
    } catch (e) { /* fallback statique */ }
  });
})();
