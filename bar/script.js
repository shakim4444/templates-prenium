/* Bar "Nuit ambree" — script. Lenis retire, scroll natif. */
(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Burger mobile */
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

  /* Header au scroll */
  var header = document.querySelector('.site-header');
  function surScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  surScroll();
  window.addEventListener('scroll', surScroll, { passive: true });

  /* Reveals */
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

  /* Parallaxe hero */
  var heroImg = document.querySelector('.hero-fond img');
  if (heroImg && !reduit) {
    var enCours = false;
    window.addEventListener('scroll', function () {
      if (enCours) return;
      enCours = true;
      requestAnimationFrame(function () {
        heroImg.style.transform = 'translateY(' + Math.min(window.scrollY, 800) * 0.18 + 'px) scale(1.06)';
        enCours = false;
      });
    }, { passive: true });
  }

  /* Reservation WhatsApp */
  var form = document.getElementById('form-resa');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var lignes = [
        'Bonjour, je souhaite reserver une table au bar.',
        'Nom : ' + (d.get('nom') || '-'),
        'Date : ' + (d.get('date') || '-'),
        'Heure : ' + (d.get('heure') || '-'),
        'Personnes : ' + (d.get('personnes') || '-')
      ];
      var msg = d.get('message'); if (msg) lignes.push('Message : ' + msg);
      var numero = form.getAttribute('data-whatsapp') || '';
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(lignes.join('\n')), '_blank', 'noopener');
    });
  }
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
