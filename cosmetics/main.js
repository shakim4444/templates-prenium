/* LUEUR — shared script. Degrades gracefully if GSAP/Lenis CDN is unavailable. */
(function () {
  function q(s) { return document.querySelector(s); }

  function wireForms() {
    document.querySelectorAll('form[data-fake]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var b = f.querySelector('button');
        if (b) { b.textContent = 'Envoyé ✓'; b.disabled = true; }
      });
    });
    document.querySelectorAll('.card button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.textContent = 'Ajouté ✓';
        setTimeout(function () { btn.textContent = 'Ajouter'; }, 1400);
      });
    });
  }

  function setBars() {
    document.querySelectorAll('.ing').forEach(function (ing) {
      var fill = ing.querySelector('.fill');
      if (fill) fill.style.width = (fill.dataset.pct || 0) + '%';
    });
  }

  function fallbackStatic() {
    document.documentElement.classList.add('no-anim');
    setBars();
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      var lenis = new Lenis({ lerp: 0.09, autoRaf: false });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* Hero entrance */
    if (q('.hero')) {
      var tl = gsap.timeline({ delay: 0.1 });
      tl.from('.hero .eyebrow', { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out' });
      tl.from('.hero h1', { y: 40, opacity: 0, duration: 0.9, ease: 'power4.out' }, '-=0.4');
      tl.from('.hero p.sub', { y: 24, opacity: 0, duration: 0.7 }, '-=0.5');
      tl.from('.hero .product', { y: 60, opacity: 0, scale: 0.92, duration: 1, ease: 'back.out(1.3)' }, '-=0.4');
    }

    /* Subpage hero */
    if (q('.page-hero')) {
      gsap.from('.page-hero > *', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.1 });
    }

    /* Cards tilt toward cursor + pop-in */
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -6;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 600, duration: 0.4 });
      });
      card.addEventListener('pointerleave', function () {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      });
    });
    if (q('.cards')) {
      gsap.from('.card', {
        y: 50, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'back.out(1.3)',
        scrollTrigger: { trigger: '.cards', start: 'top 82%' }
      });
    }

    /* Ingredient bars */
    document.querySelectorAll('.ing').forEach(function (ing) {
      var fill = ing.querySelector('.fill');
      if (!fill) return;
      var pct = parseFloat(fill.dataset.pct || '0');
      gsap.to(fill, {
        width: pct + '%', duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: ing, start: 'top 85%' }
      });
    });

    /* Generic reveals */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 34, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  }

  wireForms();
  try {
    if (window.gsap && window.ScrollTrigger) { init(); } else { fallbackStatic(); }
  } catch (err) {
    fallbackStatic();
  }
})();

/* ---- home v2: counters + parallax ---- */
(function () {
  function showCounts() {
    var els = document.querySelectorAll('[data-count]');
    for (var i = 0; i < els.length; i++) { els[i].textContent = els[i].getAttribute('data-count'); }
  }
  try {
    if (!window.gsap || !window.ScrollTrigger) { showCounts(); return; }
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var state = { v: 0 };
      gsap.to(state, {
        v: target, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        onUpdate: function () { el.textContent = Math.round(state.v); }
      });
    });
    document.querySelectorAll('[data-parallax]').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  } catch (e) { showCounts(); }
})();
