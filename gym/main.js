/* FORGE — shared script. Lenis retire, scroll natif. Degrade gracefully si GSAP/CDN absent. */
(function () {
  function q(s) { return document.querySelector(s); }

  function fillMarquee() {
    var m = document.getElementById('marquee');
    if (!m) return;
    var words = 'Plus fort chaque jour · Zero raccourci · Souleve fort · FORGE · ';
    m.innerHTML = words.repeat(8);
  }
  function wireForms() {
    document.querySelectorAll('form[data-fake]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var b = f.querySelector('button');
        if (b) { b.textContent = 'Envoye ✓'; b.disabled = true; }
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

    /* Index: hero */
    var slam = q('#slam');
    if (slam) {
      var tl = gsap.timeline({ delay: 0.15 });
      tl.from(slam, { y: 80, opacity: 0, duration: 0.8, ease: 'power4.out' });
      var heroSub = q('#heroSub');
      if (heroSub) tl.from(heroSub, { y: 30, opacity: 0, duration: 0.7 }, '-=0.4');
    }

    /* Subpages: page hero entrance */
    if (q('.page-hero')) {
      gsap.from('.page-hero > *', { y: 50, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power4.out', delay: 0.1 });
    }

    /* Marquee */
    var marqueeEl = document.getElementById('marquee');
    if (marqueeEl) {
      var mw = marqueeEl.scrollWidth / 2;
      if (mw > 0) {
        gsap.to(marqueeEl, { x: -mw, ease: 'none', duration: 24, repeat: -1 });
        /* skew au scroll */
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

    /* Compteurs */
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var state = { v: 0 };
      gsap.to(state, {
        v: target, duration: 1.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        onUpdate: function () { el.textContent = Math.round(state.v); },
        onComplete: function () { el.textContent = el.getAttribute('data-count'); }
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
