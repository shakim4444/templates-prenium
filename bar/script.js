/* Template bar "Nuit ambree" - JS partage (vanilla, aucun jeton ici).
   1. burger mobile  2. header au scroll  3. reveals
   4. parallaxe douce du hero  5. formulaire -> message WhatsApp compose */
(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Burger mobile */
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

  /* 2. Header plein au scroll */
  var header = document.querySelector('.site-header');
  function surScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  surScroll();
  window.addEventListener('scroll', surScroll, { passive: true });

  /* 3. Reveals au scroll (coupes si reduced-motion) */
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

  /* 4. Parallaxe douce sur la photo du hero (coupe si reduced-motion) */
  var heroImg = document.querySelector('.hero-fond img');
  if (heroImg && !reduit) {
    var enCours = false;
    window.addEventListener('scroll', function () {
      if (enCours) return;
      enCours = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 800);
        heroImg.style.transform = 'translateY(' + y * 0.18 + 'px) scale(1.06)';
        enCours = false;
      });
    }, { passive: true });
  }

  /* 5. Reservation -> WhatsApp (repli sans JS : lien wa.me direct affiche a cote) */
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
        'Personnes : ' + (d.get('personnes') || '-'),
        'Occasion : ' + (d.get('occasion') || '-')
      ];
      var msg = d.get('message');
      if (msg) lignes.push('Message : ' + msg);
      var numero = form.getAttribute('data-whatsapp') || '';
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(lignes.join('\n')), '_blank', 'noopener');
    });
  }
})();

/* ============ PRENIUM : couche d'animations (GSAP + Lenis, degradation douce) ============ */
(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function finaliserCompteurs() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = el.getAttribute('data-count');
    });
  }

  window.addEventListener('load', function () {
    if (reduit || !window.gsap || !window.ScrollTrigger) { finaliserCompteurs(); return; }
    try {
      gsap.registerPlugin(ScrollTrigger);

      /* Defilement doux */
      if (window.Lenis) {
        var lenis = new Lenis({ lerp: 0.11 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        gsap.ticker.lagSmoothing(0);
      }

      /* Compteurs animes */
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

      /* Parallaxe douce des images encadrees */
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        gsap.to(el, {
          yPercent: parseFloat(el.getAttribute('data-parallax')) || -8,
          ease: 'none',
          scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });

      /* Bandeau defilant */
      document.querySelectorAll('.marquee-inner').forEach(function (el) {
        var demi = el.scrollWidth / 2;
        if (demi > 0) gsap.to(el, { x: -demi, duration: 26, ease: 'none', repeat: -1 });
      });
    } catch (e) { finaliserCompteurs(); }
  });
})();

/* ============ PRENIUM+ : lueur ambiante et cartes inclinables ============ */
(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pointeurFin = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduit || !pointeurFin) return;
  window.addEventListener('load', function () {
    try {
      if (!window.gsap) return;
      /* Lueur qui suit le pointeur */
      var lueur = document.createElement('div');
      lueur.className = 'lueur-ambiante';
      lueur.setAttribute('aria-hidden', 'true');
      document.body.appendChild(lueur);
      var qx = gsap.quickTo(lueur, 'x', { duration: 0.6, ease: 'power3' });
      var qy = gsap.quickTo(lueur, 'y', { duration: 0.6, ease: 'power3' });
      gsap.set(lueur, { xPercent: -50, yPercent: -50, opacity: 0 });
      window.addEventListener('pointermove', function (e) {
        qx(e.clientX); qy(e.clientY);
        gsap.to(lueur, { opacity: 1, duration: .4, overwrite: 'auto' });
      });
      document.documentElement.addEventListener('mouseleave', function () {
        gsap.to(lueur, { opacity: 0, duration: .4 });
      });
      /* Cartes inclinables */
      document.querySelectorAll('.carte-p, .temoin').forEach(function (carte) {
        carte.classList.add('inclinable');
        carte.addEventListener('pointermove', function (e) {
          var r = carte.getBoundingClientRect();
          var rx = ((e.clientY - r.top) / r.height - .5) * -7;
          var ry = ((e.clientX - r.left) / r.width - .5) * 9;
          gsap.to(carte, { rotationX: rx, rotationY: ry, transformPerspective: 700, duration: .5, ease: 'power2.out' });
        });
        carte.addEventListener('pointerleave', function () {
          gsap.to(carte, { rotationX: 0, rotationY: 0, duration: .7, ease: 'elastic.out(1, .5)' });
        });
      });
    } catch (e) { /* rien */ }
  });
})();
