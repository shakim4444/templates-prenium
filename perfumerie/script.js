/* Template parfumerie "Extrait - vapeur d'iris" - JS partage (vanilla, aucun jeton ici).
   1. burger mobile  2. header au scroll  3. sequence d'entree du hero
   4. reveals au scroll  5. pyramide olfactive (strates accordeon)
   6. filtres par famille olfactive (collection)  7. formulaire -> message WhatsApp */
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

  /* 3. Sequence d'entree du hero */
  var hero = document.querySelector('.hero');
  if (hero) {
    if (reduit) hero.classList.add('is-entree');
    else requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add('is-entree'); });
    });
  }

  /* 4. Reveals au scroll (coupes si reduced-motion) */
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

  /* 5. Pyramide olfactive : strates accordeon (tete / coeur / fond).
        Reduced-motion : tout est ouvert, statique. */
  document.querySelectorAll('.pyramide').forEach(function (pyr) {
    var strates = pyr.querySelectorAll('.strate');
    function poser(strate, ouvert) {
      strate.classList.toggle('is-open', ouvert);
      var btn = strate.querySelector('.strate-btn');
      if (btn) btn.setAttribute('aria-expanded', String(ouvert));
    }
    if (reduit) {
      strates.forEach(function (s) { poser(s, true); });
      return;
    }
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

  /* 6. Filtres par famille olfactive (page collection).
        Les chips sont construits depuis les valeurs data-famille des cartes,
        donc ils restent justes apres le remplacement des jetons. */
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
        b.type = 'button';
        b.className = 'filtre-chip';
        b.textContent = libelle;
        b.setAttribute('aria-pressed', valeur === '' ? 'true' : 'false');
        b.addEventListener('click', function () {
          filtres.querySelectorAll('.filtre-chip').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          cartes.forEach(function (c) {
            var ok = valeur === '' || (c.getAttribute('data-famille') || '').trim() === valeur;
            c.classList.toggle('est-masque', !ok);
          });
        });
        return b;
      }
      filtres.appendChild(faireChip('Toutes les familles', ''));
      familles.forEach(function (f) { filtres.appendChild(faireChip(f, f)); });
      filtres.hidden = false;
    }
  }

  /* 7. Rendez-vous olfactif -> WhatsApp (repli sans JS : lien wa.me direct affiche a cote) */
  var form = document.getElementById('form-rdv');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var lignes = [
        'Bonjour, je souhaite prendre rendez-vous a la parfumerie.',
        'Nom : ' + (d.get('nom') || '-'),
        'Objet : ' + (d.get('objet') || '-'),
        'Date souhaitee : ' + (d.get('date') || '-'),
        'Creneau : ' + (d.get('creneau') || '-')
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

/* ============ PRENIUM+ : sillage du pointeur et vapeur vivante ============ */
(function () {
  'use strict';
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var pointeurFin = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduit) return;
  window.addEventListener('load', function () {
    try {
      if (!window.gsap) return;
      /* La vapeur derive lentement */
      document.querySelectorAll('.vapeur-fond span').forEach(function (s, i) {
        gsap.to(s, { y: -26 - i * 8, x: i % 2 ? 18 : -14, scale: 1.06, duration: 7 + i * 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
      /* Sillage du pointeur */
      if (!pointeurFin) return;
      var dernier = 0;
      window.addEventListener('pointermove', function (e) {
        var t = Date.now();
        if (t - dernier < 46) return;
        dernier = t;
        var d = document.createElement('span');
        d.className = 'sillage';
        d.style.left = e.clientX + 'px';
        d.style.top = e.clientY + 'px';
        document.body.appendChild(d);
        gsap.fromTo(d, { opacity: .5, scale: .4 }, { opacity: 0, scale: 1.6, y: -26, duration: 1.1, ease: 'power1.out', onComplete: function () { d.remove(); } });
      });
    } catch (e) { /* rien */ }
  });
})();
