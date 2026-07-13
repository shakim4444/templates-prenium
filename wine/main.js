/* DOMAINE — shared script. Degrades gracefully if GSAP/Lenis CDN is unavailable. */
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
  }

  function fallbackStatic() {
    document.documentElement.classList.add('no-anim');
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    /* Smooth scroll: one RAF source only. Native scrolling remains active on touch devices. */
    if (window.Lenis && !window.matchMedia('(pointer: coarse)').matches) {
      var lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9
      });
      lenis.on('scroll', ScrollTrigger.update);
      var lenisRaf = function (time) {
        lenis.raf(time);
        window.requestAnimationFrame(lenisRaf);
      };
      window.requestAnimationFrame(lenisRaf);
      window.addEventListener('pagehide', function () { lenis.destroy(); }, { once: true });
    }

    window.requestAnimationFrame(function () { ScrollTrigger.refresh(); });

    function revealHero() {
      if (!q('.hero')) return;
      var tl = gsap.timeline();
      tl.to('.hero .vineyard', { scale: 1, duration: 2.4, ease: 'power2.out' });
      tl.to('.hero .est', { opacity: 1, duration: 1 }, '-=1.9');
      tl.to('.hero h1', { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, '-=1.5');
      tl.to('.hero .bottle', { opacity: 1, duration: 1 }, '-=0.8');
    }

    /* Direct access: the hero is revealed immediately. */
    if (q('.hero')) revealHero();

    /* Subpage hero */
    if (q('.page-hero')) {
      gsap.from('.page-hero > *', { y: 36, opacity: 0, duration: 1.2, stagger: 0.14, ease: 'power3.out', delay: 0.15 });
    }

    /* Story word reveal */
    var p = q('#storyText');
    if (p) {
      p.innerHTML = p.textContent.split(' ').map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
      gsap.to('#storyText .w', {
        opacity: 1, stagger: 0.05, ease: 'none',
        scrollTrigger: { trigger: '#storyText', start: 'top 75%', end: 'bottom 50%', scrub: true }
      });
    }

    /* Wine cards */
    if (q('.wines')) {
      gsap.from('.wine', {
        y: 60, opacity: 0, stagger: 0.12, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.wines', start: 'top 82%' }
      });
    }

    /* Generic reveals */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 36, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 87%' }
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
