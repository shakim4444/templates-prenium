/* Parfumerie "Extrait" — script. Lenis retire, scroll natif. */
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

  var hero = document.querySelector('.hero');
  if (hero) {
    if (reduit) hero.classList.add('is-entree');
    else requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('is-entree'); }); });
  }

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

  /* Pyramide olfactive */
  document.querySelectorAll('.pyramide').forEach(function (pyr) {
    var strates = pyr.querySelectorAll('.strate');
    function poser(strate, ouvert) {
      strate.classList.toggle('is-open', ouvert);
      var btn = strate.querySelector('.strate-btn');
      if (btn) btn.setAttribute('aria-expanded', String(ouvert));
    }
    if (reduit) { strates.forEach(function (s) { poser(s, true); }); return; }
    strates.forEach(function (s, i) {
      poser(s, i === 0);
      var btn = s.querySelector('.strate-btn');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var dejaOuvert = s.classList.contains('is-open');
        strates.forEach(function (autre) { poser(autre, false); });
        poser(s, !dejaOuvert);
      });
    });
  });

  /* Filtres familles */
  var filtres = document.getElementById('filtres-familles');
  if (filtres) {
    var cartes = Array.prototype.slice.call(document.querySelectorAll('.parfum-carte[data-famille]'));
    var familles = [];
    cartes.forEach(function (c) {
      var f = (c.getAttribute('data-famille') || '').trim();
      if (f && familles.indexOf(f) === -1) familles.push(f);
    });
    if (familles.length > 1) {
      function faireChip(libelle, valeur) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'filtre-chip'; b.textContent = libelle;
        b.setAttribute('aria-pressed', valeur === '' ? 'true' : 'false');
        b.addEventListener('click', function () {
          filtres.querySelectorAll('.filtre-chip').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          cartes.forEach(function (c) { c.classList.toggle('est-masque', valeur !== '' && (c.getAttribute('data-famille') || '').trim() !== valeur); });
        });
        return b;
      }
      filtres.appendChild(faireChip('Toutes les familles', ''));
      familles.forEach(function (f) { filtres.appendChild(faireChip(f, f)); });
      filtres.hidden = false;
    }
  }

  var form = document.getElementById('form-rdv');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var lignes = [
        'Bonjour, je souhaite prendre rendez-vous a la parfumerie.',
        'Nom : ' + (d.get('nom') || '-'),
        'Date : ' + (d.get('date') || '-')
      ];
      var msg = d.get('message'); if (msg) lignes.push('Message : ' + msg);
      window.open('https://wa.me/' + (form.getAttribute('data-whatsapp') || '') + '?text=' + encodeURIComponent(lignes.join('\n')), '_blank', 'noopener');
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
