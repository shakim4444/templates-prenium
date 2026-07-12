/* Parapharmacie "Rituel botanique" — script. Lenis retire, scroll natif. */
(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var burger = document.querySelector('.burger');
  var panel = document.getElementById('nav-mobile');
  function fermerMenu() {
    if (!burger || !panel) return;
    burger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('is-open');
  }
  if (burger && panel) {
    burger.addEventListener('click', function () {
      var ouvert = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!ouvert));
      panel.classList.toggle('is-open', !ouvert);
    });
    panel.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', fermerMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermerMenu(); });
  }

  var header = document.querySelector('.site-header');
  function surScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  surScroll();
  window.addEventListener('scroll', surScroll, { passive: true });

  var reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (reduit || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var obs = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) {
          if (e.isIntersecting) {
            var delai = parseInt(e.target.getAttribute('data-reveal-delay') || '0', 10);
            setTimeout(function () { e.target.classList.add('is-in'); }, delai);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function (el) { obs.observe(el); });
    }
  }

  document.querySelectorAll('[data-etagere]').forEach(function (bloc) {
    var scroller = bloc.querySelector('.rayons-scroller');
    if (!scroller) return;
    var prev = bloc.querySelector('.ray-prev');
    var next = bloc.querySelector('.ray-next');
    function pas() {
      var carte = scroller.querySelector('.rayon-carte');
      return carte ? carte.getBoundingClientRect().width + 24 : 320;
    }
    function aller(dir) { scroller.scrollBy({ left: dir * pas(), behavior: reduit ? 'auto' : 'smooth' }); }
    if (prev) prev.addEventListener('click', function () { aller(-1); });
    if (next) next.addEventListener('click', function () { aller(1); });
    scroller.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); aller(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); aller(-1); }
    });
  });

  document.querySelectorAll('form[data-whatsapp]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lignes = [form.getAttribute('data-intro') || 'Bonjour,'];
      form.querySelectorAll('input, select, textarea').forEach(function (champ) {
        if (!champ.name) return;
        var valeur = String(champ.value || '').trim();
        if (valeur) lignes.push((champ.getAttribute('data-label') || champ.name) + ' : ' + valeur);
      });
      window.open('https://wa.me/' + (form.getAttribute('data-whatsapp') || '') + '?text=' + encodeURIComponent(lignes.join('\n')), '_blank', 'noopener');
    });
  });
})();

/* GSAP layer - PAS de Lenis */
(function () {
  'use strict';
  function finaliserCompteurs() {
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }
  window.addEventListener('load', function () {
    if (!window.gsap || !window.ScrollTrigger) { finaliserCompteurs(); return; }
    try {
      gsap.registerPlugin(ScrollTrigger);
      /* PAS de Lenis */
      document.querySelectorAll('[data-count]').forEach(function (el) {
        var fin = parseFloat(el.getAttribute('data-count')) || 0;
        var obj = { v: 0 };
        gsap.to(obj, {
          v: fin, duration: 1.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: function () { el.textContent = Math.round(obj.v); },
          onComplete: function () { el.textContent = el.getAttribute('data-count'); }
        });
      });
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        gsap.to(el, {
          yPercent: parseFloat(el.getAttribute('data-parallax')) || -8, ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
      document.querySelectorAll('.marquee-inner').forEach(function (el) {
        var demi = el.scrollWidth / 2;
        if (demi > 0) gsap.to(el, { x: -demi, duration: 26, ease: 'none', repeat: -1 });
      });
    } catch (e) { finaliserCompteurs(); }
  });
})();
