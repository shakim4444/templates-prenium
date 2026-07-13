/* Template restaurant "Braise et feuille" - JS partage (vanilla, aucun jeton ici).
   1. burger mobile  2. header au scroll  3. reveals  4. lightbox galerie
   5. formulaire de reservation -> message WhatsApp compose */
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

  /* 4. Lightbox galerie (dialog natif) */
  var lightbox = document.getElementById('lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    var lbImg = lightbox.querySelector('img');
    document.querySelectorAll('.galerie-item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var img = btn.querySelector('img');
        if (!img) return;
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lightbox.showModal();
      });
    });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
    var fermer = lightbox.querySelector('.lightbox-fermer');
    if (fermer) fermer.addEventListener('click', function () { lightbox.close(); });
  }

  /* 5. Reservation -> WhatsApp (repli sans JS : lien wa.me direct affiche a cote) */
  var form = document.getElementById('form-resa');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var lignes = [
        'Bonjour, je souhaite reserver une table.',
        'Nom : ' + (d.get('nom') || '-'),
        'Date : ' + (d.get('date') || '-'),
        'Heure : ' + (d.get('heure') || '-'),
        'Personnes : ' + (d.get('personnes') || '-')
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

/* ============ PRENIUM+ : braises dans le hero ============ */
(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduit) return;
  window.addEventListener('load', function () {
    try {
      var zone = document.querySelector('.hero') || document.querySelector('.page-header');
      if (!zone) return;
      var canvas = document.createElement('canvas');
      canvas.className = 'braises';
      canvas.setAttribute('aria-hidden', 'true');
      if (!zone.style.position) zone.style.position = 'relative';
      zone.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var braises = [];
      function taille() { canvas.width = zone.clientWidth; canvas.height = zone.clientHeight; }
      taille();
      window.addEventListener('resize', taille);
      for (var i = 0; i < 34; i++) {
        braises.push({ x: Math.random(), y: Math.random(), v: .0006 + Math.random() * .0016, r: 1 + Math.random() * 2.4, o: .2 + Math.random() * .5, d: Math.random() * 6.28 });
      }
      var visible = true;
      document.addEventListener('visibilitychange', function () { visible = !document.hidden; });
      (function boucle() {
        requestAnimationFrame(boucle);
        if (!visible) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < braises.length; i++) {
          var b = braises[i];
          b.y -= b.v; b.d += .02;
          if (b.y < -0.05) { b.y = 1.05; b.x = Math.random(); }
          var x = (b.x + Math.sin(b.d) * .012) * canvas.width;
          var y = b.y * canvas.height;
          var scint = .55 + Math.sin(b.d * 3) * .45;
          ctx.beginPath();
          ctx.arc(x, y, b.r, 0, 6.283);
          ctx.fillStyle = 'rgba(228, 87, 46, ' + (b.o * scint).toFixed(3) + ')';
          ctx.fill();
        }
      })();
    } catch (e) { /* rien */ }
  });
})();
