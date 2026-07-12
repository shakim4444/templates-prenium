/* MAISON — shared script. Degrades gracefully if GSAP/Lenis CDN is unavailable. */
(function () {
  function q(s) { return document.querySelector(s); }

  function wireForms() {
    document.querySelectorAll('form[data-fake]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var b = f.querySelector('button');
        if (b) { b.textContent = 'Merci ✓'; b.disabled = true; }
      });
    });
  }

  function fallbackStatic() {
    document.documentElement.classList.add('no-anim');
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      var lenis = new Lenis({ lerp: 0.08, autoRaf: false });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* Index hero */
    if (q('.hero')) {
      var tl = gsap.timeline({ delay: 0.2 });
      tl.to('.hero .cover', { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power4.inOut' });
      tl.to('.hero h1 .line span', { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12 }, '-=0.7');
      tl.to('.hero .footline', { opacity: 1, duration: 0.9 }, '-=0.4');
    }

    /* Subpage hero */
    if (q('.page-hero')) {
      gsap.from('.page-hero > *', { y: 40, opacity: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: 0.1 });
    }

    /* Lookbook parallax */
    gsap.utils.toArray('.look').forEach(function (el, i) {
      var img = el.querySelector('img');
      if (img) {
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
      gsap.from(el, {
        y: 70, opacity: 0, duration: 1, ease: 'power3.out', delay: (i % 2) * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    /* Pull quote letters */
    var quote = q('#quoteText');
    if (quote) {
      quote.innerHTML = quote.textContent.split('').map(function (c) {
        return '<span class="char">' + (c === ' ' ? '&nbsp;' : c) + '</span>';
      }).join('');
      gsap.to('#quoteText .char', {
        opacity: 1, stagger: 0.015, ease: 'none',
        scrollTrigger: { trigger: '.quote', start: 'top 70%', end: 'bottom 55%', scrub: true }
      });
    }

    /* Atelier strip drift */
    if (q('#strip')) {
      gsap.to('#strip', {
        x: function () { return -(q('#strip').scrollWidth - window.innerWidth + 100); },
        ease: 'none',
        scrollTrigger: { trigger: '.strip-wrap', start: 'top bottom', end: 'bottom top', scrub: 0.5, invalidateOnRefresh: true }
      });
    }

    /* Generic reveals */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
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
