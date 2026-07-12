/* MONOLITH — shared script. Degrades gracefully if GSAP/Lenis CDN is unavailable. */
(function () {
  function q(s) { return document.querySelector(s); }

  /* Vanilla behaviours — always work, even offline */
  function fillMarquee() {
    var m = q('#marquee');
    if (!m) return;
    var items = 'Civic — Residential — Cultural — <em>Award-winning</em> — Workplace — Urbanism — ';
    m.innerHTML = '<span>' + items.repeat(12) + '</span>';
  }
  function wireForms() {
    document.querySelectorAll('form[data-fake]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var b = f.querySelector('button');
        if (b) { b.textContent = 'Sent ✓ — we reply within 48h'; b.disabled = true; }
      });
    });
  }

  function fallbackStatic() {
    document.documentElement.classList.add('no-anim');
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      var lenis = new Lenis({ lerp: 0.08 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    var cursor = q('.cursor');
    if (cursor && window.matchMedia('(hover: hover)').matches) {
      window.addEventListener('pointermove', function (e) {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out' });
      });
    }

    if (q('#marquee')) gsap.to('#marquee', { xPercent: -50, ease: 'none', duration: 40, repeat: -1 });

    /* Index: preloader + hero reveal */
    if (q('.preloader')) {
      var counter = { v: 0 };
      var tl = gsap.timeline();
      tl.to(counter, {
        v: 100, duration: 1.4, ease: 'power2.inOut',
        onUpdate: function () { q('#counter').textContent = Math.round(counter.v); }
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
    var track = q('#worksTrack');
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
      var target = parseInt(el.dataset.count, 10);
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: function () { el.textContent = Math.round(obj.v); }
      });
    });

    /* Manifesto word reveal */
    var p = q('#manifestoText');
    if (p) {
      p.innerHTML = p.textContent.split(' ').map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
      gsap.to('#manifestoText .w', {
        opacity: 1, stagger: 0.04, ease: 'none',
        scrollTrigger: { trigger: '#manifestoText', start: 'top 75%', end: 'bottom 45%', scrub: true }
      });
    }

    /* Generic reveals */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });
  }

  fillMarquee();
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
