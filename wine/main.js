/* DOMAINE — shared script. Lenis retire, scroll natif. */
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
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
  }

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    /* PAS de Lenis - scroll natif */

    /* Hero parallaxe vineyard */
    var vineyard = document.querySelector('.hero .vineyard');
    if (vineyard) {
      gsap.to(vineyard, {
        yPercent: 20, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }

    /* Generic reveals */
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.from(el, {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
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

    /* Parallaxe images */
    document.querySelectorAll('[data-parallax]').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
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
