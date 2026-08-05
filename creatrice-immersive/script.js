/* =========================================================================
   NAYA SANOU - version « démo interactive »
   Un seul fichier, sans dépendance.

   Trois choses seulement :
     1. le panneau de droite suit la section lue ;
     2. la mosaïque des publications reçoit sa photo ;
     3. le banc d'essai typographique, identique à la version classique.
   ========================================================================= */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     1. Le panneau suit la lecture

     ⚠️ On observe avec une fenêtre CENTRÉE (`rootMargin: -45% 0px -45% 0px`),
     pas l'entrée en écran. Sans ça, deux sections sont visibles en même temps
     pendant presque tout le défilement et le panneau clignote entre deux
     états. Là, une seule section peut occuper la bande centrale : le
     changement se fait une fois, au bon moment.
     --------------------------------------------------------------------- */
  var couches = {};
  $$('[data-couche]').forEach(function (c) { couches[c.getAttribute('data-couche')] = c; });

  var actuelle = null;
  function activer(nom) {
    if (nom === actuelle || !couches[nom]) return;
    actuelle = nom;
    Object.keys(couches).forEach(function (k) {
      couches[k].classList.toggle('active', k === nom);
    });
  }

  var scenes = $$('.scene[data-scene]');
  if (scenes.length) {
    activer(scenes[0].getAttribute('data-scene'));

    if ('IntersectionObserver' in window) {
      var vigie = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) {
          if (e.isIntersecting) activer(e.target.getAttribute('data-scene'));
        });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      scenes.forEach(function (s) { vigie.observe(s); });
    } else {
      // Repli : on choisit la section la plus proche du milieu de l'écran.
      window.addEventListener('scroll', function () {
        var milieu = window.innerHeight / 2, meilleure = null, ecart = Infinity;
        scenes.forEach(function (s) {
          var r = s.getBoundingClientRect();
          var d = Math.abs((r.top + r.bottom) / 2 - milieu);
          if (d < ecart) { ecart = d; meilleure = s; }
        });
        if (meilleure) activer(meilleure.getAttribute('data-scene'));
      }, { passive: true });
    }
  }

  /* ---------------------------------------------------------------------
     2. La mosaïque des publications
     Les quatre tuiles portent la MÊME photo, chacune cadrée sur un quart.
     On la pose ici plutôt que quatre fois dans le HTML : une seule adresse à
     changer le jour où la photo change.
     --------------------------------------------------------------------- */
  $$('.mosaique').forEach(function (m) {
    var photo = m.getAttribute('data-photo');
    if (!photo) return;
    $$('.tuile-photo', m).forEach(function (t) { t.style.backgroundImage = 'url("' + photo + '")'; });
  });

  /* ---------------------------------------------------------------------
     3. L'en-tête
     --------------------------------------------------------------------- */
  var entete = $('#entete');
  if (entete) {
    var haut = $('#haut');
    var majEntete = function () {
      // Elle devient opaque une fois le hero passé : sur la photo sombre elle
      // se lit en clair, sur l'ivoire elle a besoin d'un fond.
      var seuil = haut ? haut.offsetHeight - 90 : 200;
      entete.classList.toggle('collee', window.scrollY > seuil);
    };
    window.addEventListener('scroll', majEntete, { passive: true });
    majEntete();
  }

  /* ---------------------------------------------------------------------
     4. Le formulaire
     Sans serveur, la demande part sur WhatsApp - c'est le canal où l'on
     répond vraiment. Le formulaire dit ce qu'il fait, il ne fait pas semblant.
     --------------------------------------------------------------------- */
  var demande = $('[data-reservation]');
  if (demande) {
    demande.addEventListener('submit', function (e) {
      e.preventDefault();
      // ⚠️ Le formulaire porte `novalidate` : sans ce contrôle, on peut envoyer
      // une demande vide, qui arrive sur WhatsApp sans nom ni adresse.
      var vide = $$('[required]', demande).filter(function (c) { return !c.value.trim(); });
      if (vide.length) {
        vide[0].focus();
        if (vide[0].reportValidity) vide[0].reportValidity();
        return;
      }
      var d = new FormData(demande);
      var texte = ['Bonjour, je souhaite vous contacter.', '',
        'Prestation : ' + (d.get('prestation') || '-'),
        'Nom : ' + (d.get('nom') || '-'),
        'Structure : ' + (d.get('structure') || '-'),
        'E-mail : ' + (d.get('email') || '-'),
        '', (d.get('details') || '')].join('\n');
      window.open('https://wa.me/' + demande.getAttribute('data-whatsapp')
        + '?text=' + encodeURIComponent(texte), '_blank', 'noopener');
    });
  }

  $$('[data-annee]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------------------------------------------------------------------
     4 bis. Le curseur : le monogramme HB
     Il suit le pointeur et s'ouvre sur ce qui se clique.
     ⚠️ On ne le met en route QUE sur une souris et si le visiteur n'a pas
     demande moins de mouvement. Dans les deux autres cas on rend le curseur du
     systeme - sinon on retire le sien a quelqu'un sans rien lui donner.
     --------------------------------------------------------------------- */
  var curseur = $('.curseur');
  var finPointeur = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (curseur && doux && finPointeur) {
    var vx = 0, vy = 0, cible = null;
    document.addEventListener('mousemove', function (e) {
      vx = e.clientX; vy = e.clientY;
      curseur.style.left = vx + 'px';
      curseur.style.top = vy + 'px';
      cible = e.target;
      // Il s'ouvre sur les images et les elements cliquables : c'est la que le
      // monogramme prend son sens.
      /* ⚠️ Deux tailles, pas une : sur une image, le disque de 76 px se pose
         dans le vide ; sur un lien de texte, il RECOUVRE la ligne qu'on est en
         train de lire. La variante etroite donne le meme signal sans cacher le
         mot qu'on vise. */
      var ferme = cible && cible.closest ? cible.closest('a, button, .tuile, .puce-produit, .couche img') : null;
      var visuel = cible && cible.closest ? cible.closest('.tuile, .puce-produit, .couche img') : null;
      curseur.classList.toggle('ouvert', !!ferme);
      curseur.classList.toggle('ouvert--fin', !!ferme && !visuel);
    }, { passive: true });
    document.documentElement.classList.add('curseur-actif');
  }

  /* ---------------------------------------------------------------------
     5. Le banc d'essai typographique
     Quatorze identités à essayer en un clic, plus la police d'origine.
     ⚠️ On ne charge PAS les quinze au démarrage : la feuille d'une
     combinaison n'est demandée qu'au moment où on la choisit.
     --------------------------------------------------------------------- */
  var COMBOS = [
    { cle: '',           nom: 'Mono (actuelle)',    detail: 'Martian Mono, une seule famille', police: '' },
    { cle: 'luxe',       nom: 'Luxe elegant',       detail: 'Cormorant Garamond + Jost',       police: 'Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500' },
    { cle: 'editorial',  nom: 'Editorial mode',     detail: 'Playfair Display + Inter',        police: 'Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500' },
    { cle: 'cosmetique', nom: 'Cosmetique premium', detail: 'Fraunces + Karla',                police: 'Fraunces:opsz,wght@9..144,300..600&family=Karla:wght@300;400;500' },
    { cle: 'minimal',    nom: 'Minimal chic',       detail: 'Instrument Serif + Manrope',      police: 'Instrument+Serif&family=Manrope:wght@300;400;500' },
    { cle: 'magazine',   nom: 'Magazine beaute',    detail: 'Bodoni Moda + Work Sans',         police: 'Bodoni+Moda:opsz,wght@6..96,400..600&family=Work+Sans:wght@300;400;500' },
    { cle: 'couture',    nom: 'Haute couture',      detail: 'Italiana + Montserrat',           police: 'Italiana&family=Montserrat:wght@300;400;500' },
    { cle: 'douceur',    nom: 'Douceur moderne',    detail: 'DM Serif Display + DM Sans',      police: 'DM+Serif+Display&family=DM+Sans:wght@300;400;500' },
    { cle: 'parisien',   nom: 'Parisien',           detail: 'Marcellus + Lato',                police: 'Marcellus&family=Lato:wght@300;400;700' },
    { cle: 'net',        nom: 'Contraste net',      detail: 'Syne + Space Grotesk',            police: 'Syne:wght@400;600;700&family=Space+Grotesk:wght@300;400;500' },
    { cle: 'eclat',      nom: 'Eclat',              detail: 'Prata + Figtree',                 police: 'Prata&family=Figtree:wght@300;400;500' },
    { cle: 'signature',  nom: 'Signature',          detail: 'Gilda Display + Nunito Sans',     police: 'Gilda+Display&family=Nunito+Sans:wght@300;400;600' },
    { cle: 'ligne',      nom: 'Ligne pure',         detail: 'Tenor Sans + Barlow',             police: 'Tenor+Sans&family=Barlow:wght@300;400;500' },
    { cle: 'sensuel',    nom: 'Sensuel',            detail: 'Yeseva One + Poppins',            police: 'Yeseva+One&family=Poppins:wght@300;400;500' },
    { cle: 'classique',  nom: 'Classique',          detail: 'Libre Baskerville + Outfit',      police: 'Libre+Baskerville:wght@400;700&family=Outfit:wght@300;400;500' }
  ];

  var MEMOIRE = 'chaine.typo';
  var chargees = {};

  function charger(c) {
    if (!c.police || chargees[c.cle]) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + c.police + '&display=swap';
    document.head.appendChild(l);
    chargees[c.cle] = true;
  }

  function appliquer(c) {
    charger(c);
    if (c.cle) document.documentElement.setAttribute('data-typo', c.cle);
    else document.documentElement.removeAttribute('data-typo');
    try { localStorage.setItem(MEMOIRE, c.cle); } catch (e) {}
  }

  var choisie = '';
  try { choisie = localStorage.getItem(MEMOIRE) || ''; } catch (e) {}
  COMBOS.forEach(function (c) { if (c.cle && c.cle === choisie) charger(c); });

  var bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.className = 'typo-bouton';
  bouton.setAttribute('aria-expanded', 'false');
  bouton.setAttribute('aria-label', 'Essayer une autre typographie');
  bouton.textContent = 'Aa';

  var panneau = document.createElement('div');
  panneau.className = 'typo-panneau';
  var titre = document.createElement('p');
  titre.textContent = 'Typographie - ' + COMBOS.length + ' propositions';
  panneau.appendChild(titre);

  COMBOS.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-pressed', String(c.cle === choisie));
    b.innerHTML = '<b></b><span></span>';
    b.querySelector('b').textContent = c.nom;
    b.querySelector('span').textContent = c.detail;
    b.addEventListener('click', function () {
      appliquer(c);
      choisie = c.cle;
      $$('button', panneau).forEach(function (a) { a.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
    });
    panneau.appendChild(b);
  });

  bouton.addEventListener('click', function () {
    var ouvert = panneau.hasAttribute('data-ouvert');
    if (ouvert) panneau.removeAttribute('data-ouvert');
    else panneau.setAttribute('data-ouvert', '');
    bouton.setAttribute('aria-expanded', String(!ouvert));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panneau.hasAttribute('data-ouvert')) {
      panneau.removeAttribute('data-ouvert');
      bouton.setAttribute('aria-expanded', 'false');
      bouton.focus();
    }
  });

  // ⚠️ Pas de bouton dans le cadre d'apercu telephone / bureau : on y regarde
  // le rendu du site, pas celui des outils. La police choisie, elle, est bien
  // appliquee - c'est justement ce qu'on veut voir.
  if (!new URLSearchParams(location.search).has('apercu')) {
    document.body.appendChild(bouton);
    document.body.appendChild(panneau);
  }

  // Défilement doux vers les ancres, sauf si le visiteur a demandé moins
  // d'animation - auquel cas le saut immédiat est ce qu'il attend.
  if (!doux) document.documentElement.style.scrollBehavior = 'auto';
  else document.documentElement.style.scrollBehavior = 'smooth';
})();
