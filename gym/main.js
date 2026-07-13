/* FORGE — shared script. Degrades gracefully if GSAP/Lenis CDN is unavailable. */
(function () {
  function q(s) { return document.querySelector(s); }

  function fillMarquee() {
    var m = q('#marquee');
    if (!m) return;
    var words = '<span>Plus fort chaque jour —</span><span>Zéro raccourci —</span><span>Soulève fort —</span><span>FORGE —</span>';
    m.innerHTML = words.repeat(8);
  }
  function wireForms() {
    document.querySelectorAll('form[data-fake]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var b = f.querySelector('button');
        if (b) { b.textContent = 'Envoyé ✓ — à très vite à la salle'; b.disabled = true; }
      });
    });
  }

  function fallbackStatic() {
    document.documentElement.classList.add('no-anim');
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      var lenis = new Lenis({ lerp: 0.09 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* Index: slam hero */
    if (q('#slam')) {
      var tl = gsap.timeline({ delay: 0.15 });
      tl.to('#slam', { scale: 1, opacity: 1, duration: 0.7, ease: 'power4.in' });
      tl.to('#slam', { keyframes: [ { y: 6, duration: 0.05 }, { y: -4, duration: 0.05 }, { y: 0, duration: 0.08 } ] });
      tl.to('#heroSub', { opacity: 1, y: 0, duration: 0.6 }, '-=0.1');
    }

    /* Subpages: page hero entrance */
    if (q('.page-hero')) {
      gsap.from('.page-hero > *', { y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', delay: 0.1 });
    }

    /* Marquee + velocity skew */
    if (q('#marquee')) {
      gsap.to('#marquee', { xPercent: -50, ease: 'none', duration: 24, repeat: -1 });
      var proxy = { skew: 0 };
      var skewSetter = gsap.quickSetter('.marquee', 'skewX', 'deg');
      ScrollTrigger.create({
        onUpdate: function (self) {
          var skew = gsap.utils.clamp(-8, 8, self.getVelocity() / -250);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, { skew: 0, duration: 0.8, ease: 'power3', overwrite: true, onUpdate: function () { skewSetter(proxy.skew); } });
          }
        }
      });
    }

    /* Program cards pop */
    if (q('.programs')) {
      gsap.from('.program', {
        y: 60, opacity: 0, rotate: 2, stagger: 0.1, duration: 0.7, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.programs', start: 'top 80%' }
      });
    }

    /* Generic reveals */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
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
