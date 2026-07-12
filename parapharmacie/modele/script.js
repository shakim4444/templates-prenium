/* Template parapharmacie "Rituel botanique" - JS partage (vanilla, aucun jeton ici).
   1. burger mobile  2. header au scroll  3. reveals
   4. etagere des rayons (scroll horizontal : fleches + clavier)
   5. formulaires -> message WhatsApp compose (commande, diagnostic de peau) */
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

  /* 4. Etagere des rayons : fleches + fleches clavier, snap doux
        (scroll instantane si reduced-motion) */
  document.querySelectorAll('[data-etagere]').forEach(function (bloc) {
    var scroller = bloc.querySelector('.rayons-scroller');
    if (!scroller) return;
    var prev = bloc.querySelector('.ray-prev');
    var next = bloc.querySelector('.ray-next');
    function pas() {
      var carte = scroller.querySelector('.rayon-carte');
      return carte ? carte.getBoundingClientRect().width + 24 : 320;
    }
    function aller(direction) {
      scroller.scrollBy({ left: direction * pas(), behavior: reduit ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { aller(-1); });
    if (next) next.addEventListener('click', function () { aller(1); });
    scroller.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); aller(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); aller(-1); }
    });
  });

  /* 5. Formulaires -> WhatsApp (repli sans JS : lien wa.me direct affiche a cote).
        Chaque form porte data-whatsapp (numero) + data-intro (1re ligne du message) ;
        chaque champ nomme porte data-label pour la ligne composee. */
  document.querySelectorAll('form[data-whatsapp]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var lignes = [form.getAttribute('data-intro') || 'Bonjour,'];
      form.querySelectorAll('input, select, textarea').forEach(function (champ) {
        if (!champ.name) return;
        var valeur = String(champ.value || '').trim();
        if (valeur) lignes.push((champ.getAttribute('data-label') || champ.name) + ' : ' + valeur);
      });
      var numero = form.getAttribute('data-whatsapp') || '';
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(lignes.join('\n')), '_blank', 'noopener');
    });
  });
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

/* ============ PRENIUM+ : diagnostic express ============ */
(function () {
  'use strict';
  var bloc = document.querySelector('[data-diagnostic]');
  if (!bloc) return;
  var reponses = {};
  var resultat = bloc.querySelector('.diag-resultat');
  var texte = bloc.querySelector('.diag-texte');
  var lien = bloc.querySelector('.diag-wa');
  var CONSEILS = {
    seche: 'peau sèche : crème riche et huile nourrissante',
    mixte: 'peau mixte : nettoyant doux et hydratant léger',
    grasse: 'peau grasse : nettoyage précis et soin matifiant',
    sensible: 'peau sensible : formules courtes, maximum de douceur'
  };
  var PRIORITES = {
    eclat: 'un rituel éclat (exfoliation douce, vitamine C)',
    hydratation: 'une hydratation en couches fines',
    apaiser: 'des soins apaisants sans parfum',
    prevenir: 'une routine prévention avec SPF chaque matin'
  };
  var UNIVERS = { visage: 'rayon visage', cheveux: 'rayon cheveux', corps: 'rayon corps' };
  bloc.querySelectorAll('.diag-q').forEach(function (q) {
    q.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        q.querySelectorAll('button').forEach(function (x) { x.classList.remove('actif'); });
        b.classList.add('actif');
        reponses[q.getAttribute('data-q')] = b.getAttribute('data-v');
        montrer();
      });
    });
  });
  function montrer() {
    if (!reponses.peau || !reponses.priorite || !reponses.univers) return;
    var phrase = 'Notre lecture : ' + CONSEILS[reponses.peau] + ', avec ' + PRIORITES[reponses.priorite] + '. On vous attend au ' + UNIVERS[reponses.univers] + ' pour composer le rituel complet.';
    texte.textContent = phrase;
    resultat.hidden = false;
    var wa = document.querySelector('a[href*="wa.me/"]');
    if (wa) {
      var num = (wa.getAttribute('href').match(/wa\.me\/(\d+)/) || [])[1];
      if (num) lien.setAttribute('href', 'https://wa.me/' + num + '?text=' + encodeURIComponent('Bonjour ! Diagnostic express — ' + phrase));
    }
    resultat.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
