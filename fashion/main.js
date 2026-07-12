/* MAISON — shared script. Lenis retire, scroll natif. */
(function () {
  function wireForms() {
    document.querySelectorAll('form[data-fake]').forEach(function (f) {
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        var b = f.querySelector('button');
        if (b) { b.textContent = 'Merci !'; b.disabled = true; }
      });
    });
  }

  function fallbackStatic() {
    document.documentElement.classList.add('no-anim');
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    /* PAS de Lenis - scroll natif */

    /* Index hero */
    if (document.querySelector('.hero .left')) {
      var tl = gsap.timeline({ delay: 0.2 });
      tl.to('.hero .cover', { clipPath: 'inset(0% 0 0 0)', duration: 1.3, ease: 'power4.inOut' });
      tl.to('.hero h1 .line span', { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.12 }, '-=0.7');
      tl.to('.hero .footline', { opacity: 1, duration: 0.9 }, '-=0.4');
    }

    /* Subpage hero */
    if (document.querySelector('.page-hero')) {
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

    /* Atelier strip drift */
    var stripEl = document.getElementById('strip');
    if (stripEl) {
      gsap.to(stripEl, {
        x: function () { return -(stripEl.scrollWidth - window.innerWidth + 100); },
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

    /* Parallaxe images */
    document.querySelectorAll('[data-parallax]').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
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

  wireForms();
  window.addEventListener('load', function () {
    try {
      if (window.gsap && window.ScrollTrigger) { init(); } else { fallbackStatic(); }
    } catch (err) { fallbackStatic(); }
  });
})();
