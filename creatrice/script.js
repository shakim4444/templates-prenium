/* =========================================================================
   TEMPLATE CREATEUR "La chaine" - Atelier Web
   JavaScript unique, sans dependance, sans build.

   Regles tenues d'un bout a l'autre :
   - rien ne casse si le script ne se charge pas (le HTML reste lisible) ;
   - `prefers-reduced-motion` coupe le mouvement, il ne le degrade pas ;
   - tout ce qui est memorise l'est en local, sur l'appareil, et sert a faire
     GAGNER DU TEMPS au visiteur - jamais a lui montrer qu'on l'a reconnu.
   ========================================================================= */
(function () {
  'use strict';

  var doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tactile = window.matchMedia('(hover: none)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------------
     1. La memoire du site
     Un seul objet, une seule cle. Si le stockage est refuse (navigation
     privee, quota), tout continue de fonctionner en memoire vive.
     --------------------------------------------------------------------- */
  var CLE = 'chaine.v1';
  var memoire = (function () {
    try {
      var brut = localStorage.getItem(CLE);
      return brut ? JSON.parse(brut) : {};
    } catch (e) { return {}; }
  })();

  function retenir(champ, valeur) {
    memoire[champ] = valeur;
    try { localStorage.setItem(CLE, JSON.stringify(memoire)); } catch (e) { /* sans effet */ }
  }

  /* ---------------------------------------------------------------------
     2. Theme - pose AVANT le premier rendu par le petit script du <head>,
     ici on ne gere que la bascule.
     --------------------------------------------------------------------- */
  // Le CLAIR est le theme par defaut (creme et prune, d'apres la reference). Le sombre
  // est la variante : c'est l'inverse de la premiere version.
  function appliquerTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var b = $('[data-bascule-theme]');
    if (b) b.setAttribute('aria-label', t === 'sombre' ? 'Passer en mode clair' : 'Passer en mode sombre');
  }
  var basculeTheme = $('[data-bascule-theme]');
  if (basculeTheme) {
    basculeTheme.addEventListener('click', function () {
      var actuel = document.documentElement.getAttribute('data-theme') || 'clair';
      var t = actuel === 'sombre' ? 'clair' : 'sombre';
      appliquerTheme(t);
      retenir('theme', t);
    });
  }

  /* ---------------------------------------------------------------------
     3. Le generique
     Une amorce de projection, vue UNE fois. Celui qui revient ne la revoit
     pas : c'est la forme la plus utile de "on se souvient de vous".
     --------------------------------------------------------------------- */
  var generique = $('#generique');
  if (generique) {
    var dejaVenu = !!memoire.visites;
    if (!doux || dejaVenu) {
      generique.classList.add('parti');
      generique.setAttribute('aria-hidden', 'true');
    } else {
      document.body.classList.add('fige');
      var nombre = $('[data-amorce-nombre]');
      var n = 3;
      var tic = setInterval(function () {
        n -= 1;
        if (n > 0) { nombre.textContent = n; return; }
        clearInterval(tic);
        generique.classList.add('nomme');
        setTimeout(fermerGenerique, 900);
      }, 620);
      var passer = $('[data-passer-generique]');
      if (passer) passer.addEventListener('click', function () { clearInterval(tic); fermerGenerique(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { clearInterval(tic); fermerGenerique(); }
      });
    }
  }
  function fermerGenerique() {
    if (!generique || generique.classList.contains('parti')) return;
    generique.classList.add('parti');
    generique.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('fige');
  }

  /* ---------------------------------------------------------------------
     4. Compteur de visites
     Il ne sert plus qu'a une chose : ne pas rejouer le generique a quelqu'un
     qui revient. La barre « Rebonjour, on reprend a... » a ete RETIREE
     (demande patron 2026-08-02) - sur cinq pages, elle interrompait le
     visiteur pour lui faire gagner un clic.
     --------------------------------------------------------------------- */
  retenir('visites', (memoire.visites || 0) + 1);

  /* ---------------------------------------------------------------------
     5. En-tete + menu
     --------------------------------------------------------------------- */
  var entete = $('.entete');
  var surDefilement = [];
  if (entete) {
    surDefilement.push(function (y) { entete.classList.toggle('collee', y > 24); });
  }

  var burger = $('.burger');
  var panneau = $('.nav-panneau');
  if (burger && panneau) {
    burger.addEventListener('click', function () {
      var ouvert = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!ouvert));
      panneau.classList.toggle('ouvert', !ouvert);
      document.body.classList.toggle('fige', !ouvert);
    });
    $$('a', panneau).forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        panneau.classList.remove('ouvert');
        document.body.classList.remove('fige');
      });
    });
  }

  /* ---------------------------------------------------------------------
     6. Le rail de lecture
     La tete de lecture suit le defilement, le timecode aussi : ce n'est pas
     un ornement, c'est la position dans la page rendue lisible.
     --------------------------------------------------------------------- */
  var rail = $('.rail');
  if (rail) {
    var tete = $('.rail-tete', rail);
    var code = $('.rail-code', rail);
    var chapitre = $('.rail-chapitre', rail);
    var sections = $$('[data-chapitre]');

    surDefilement.push(function (y) {
      var course = document.documentElement.scrollHeight - window.innerHeight;
      var part = course > 0 ? Math.min(1, Math.max(0, y / course)) : 0;
      var haut = 128, bas = window.innerHeight - 128;
      tete.style.top = (haut + (bas - haut) * part) + 'px';

      // Timecode : la position dans la page, lue comme une minute de film.
      var total = Math.round(part * 240);
      code.textContent = String(Math.floor(total / 60)).padStart(2, '0') + ':' + String(total % 60).padStart(2, '0');
    });

    if ('IntersectionObserver' in window && sections.length) {
      var oeilChapitre = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) {
          if (e.isIntersecting) chapitre.textContent = e.target.getAttribute('data-chapitre');
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      sections.forEach(function (s) { oeilChapitre.observe(s); });
    }
  }

  /* ---------------------------------------------------------------------
     7. Defilement : une seule ecoute, une seule frame
     --------------------------------------------------------------------- */
  var enAttente = false;
  function auDefilement() {
    if (enAttente) return;
    enAttente = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      for (var i = 0; i < surDefilement.length; i++) surDefilement[i](y);
      enAttente = false;
    });
  }
  window.addEventListener('scroll', auDefilement, { passive: true });
  auDefilement();

  /* ---------------------------------------------------------------------
     8. Apparitions
     --------------------------------------------------------------------- */
  var aReveler = $$('.reveal');
  if ('IntersectionObserver' in window && doux) {
    var oeil = new IntersectionObserver(function (entrees, obs) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('vu');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    aReveler.forEach(function (el, i) {
      // Un decalage court entre voisins : la lecture suit, l'attente non.
      if (!el.style.getPropertyValue('--retard')) el.style.setProperty('--retard', (i % 4) * 70 + 'ms');
      oeil.observe(el);
    });
  } else {
    aReveler.forEach(function (el) { el.classList.add('vu'); });
  }

  /* ---------------------------------------------------------------------
     9. Compteurs et jauges
     --------------------------------------------------------------------- */
  function formater(n, suffixe) {
    return n.toLocaleString('fr-FR') + (suffixe || '');
  }
  function animerNombre(el) {
    var cible = parseFloat(el.getAttribute('data-compteur'));
    var suffixe = el.getAttribute('data-suffixe') || '';
    if (!doux) { el.textContent = formater(cible, suffixe); return; }
    var debut = performance.now(), duree = 1400;
    (function pas(t) {
      var p = Math.min(1, (t - debut) / duree);
      var doucement = 1 - Math.pow(1 - p, 3);
      var v = cible * doucement;
      el.textContent = formater(cible % 1 ? Math.round(v * 10) / 10 : Math.round(v), suffixe);
      if (p < 1) requestAnimationFrame(pas);
    })(debut);
  }
  var animables = $$('[data-compteur], [data-jauge]');
  if ('IntersectionObserver' in window && animables.length) {
    var oeilChiffres = new IntersectionObserver(function (entrees, obs) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        if (e.target.hasAttribute('data-compteur')) animerNombre(e.target);
        else e.target.style.width = e.target.getAttribute('data-jauge') + '%';
        obs.unobserve(e.target);
      });
    }, { threshold: .4 });
    animables.forEach(function (el) { oeilChiffres.observe(el); });
  } else {
    animables.forEach(function (el) {
      if (el.hasAttribute('data-compteur')) el.textContent = formater(parseFloat(el.getAttribute('data-compteur')), el.getAttribute('data-suffixe') || '');
      else el.style.width = el.getAttribute('data-jauge') + '%';
    });
  }

  /* ---------------------------------------------------------------------
     10. Parallaxe du hero
     Au pointeur ET au defilement, en une seule frame, coupee au doigt.
     --------------------------------------------------------------------- */
  var flottants = $$('[data-flotte]');
  if (flottants.length && doux && !tactile) {
    var sx = 0, sy = 0, cx = 0, cy = 0, boucle = false;
    window.addEventListener('pointermove', function (e) {
      sx = (e.clientX / window.innerWidth - .5) * 2;
      sy = (e.clientY / window.innerHeight - .5) * 2;
      if (!boucle) { boucle = true; requestAnimationFrame(glisser); }
    }, { passive: true });
    function glisser() {
      cx += (sx - cx) * .07;
      cy += (sy - cy) * .07;
      flottants.forEach(function (el) {
        var f = parseFloat(el.getAttribute('data-flotte')) || 10;
        var base = el.getAttribute('data-centre') === 'y' ? ' translateY(-50%)' : '';
        el.style.transform = 'translate3d(' + (cx * f) + 'px,' + (cy * f) + 'px,0)' + base;
      });
      if (Math.abs(sx - cx) > .001 || Math.abs(sy - cy) > .001) requestAnimationFrame(glisser);
      else boucle = false;
    }
  }

  /* ---------------------------------------------------------------------
     10 bis. Le curseur
     Dans ce site il n'y a plus ni bordure, ni bouton, ni carte : rien ne signale
     qu'un element repond au clic. Le curseur reprend ce role - il s'ouvre sur ce
     qui est cliquable et se referme ailleurs.
     Retire au doigt (aucun pointeur a suivre) et si le visiteur a demande moins
     de mouvement : dans les deux cas on rend le curseur du systeme.
     --------------------------------------------------------------------- */
  var curseur = $('.curseur');
  var finPointeur = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (curseur && doux && finPointeur) {
    var cx = -100, cy = -100, vx = -100, vy = -100, boucleCurseur = false;
    window.addEventListener('pointermove', function (e) {
      cx = e.clientX; cy = e.clientY;
      if (!boucleCurseur) { boucleCurseur = true; requestAnimationFrame(suivre); }
    }, { passive: true });
    function suivre() {
      // Un leger retard sur le pointeur : c'est ce decalage qui donne la matiere.
      vx += (cx - vx) * .22; vy += (cy - vy) * .22;
      // ⚠️ `left`/`top` et NON `transform` : le centrage se fait en CSS par
      // translate(-50%,-50%), qui suit la taille du disque. Ecraser `transform` ici
      // aurait decentre le curseur des qu'il s'ouvre sur une image.
      curseur.style.left = vx + 'px';
      curseur.style.top = vy + 'px';
      if (Math.abs(cx - vx) > .4 || Math.abs(cy - vy) > .4) requestAnimationFrame(suivre);
      else boucleCurseur = false;
    }
    document.documentElement.classList.add('curseur-actif');
    var CLIQUABLE = 'a, button, .campagne, .pub, [data-campagne], input, select, textarea, label';
    var VISUEL = '.campagne, .pub, .carte';
    document.addEventListener('pointerover', function (e) {
      var cible = e.target.closest ? e.target.closest(CLIQUABLE) : null;
      var visuel = e.target.closest ? e.target.closest(VISUEL) : null;
      /* Le disque s'ouvre sur TOUT ce qui est cliquable (demande patron
         2026-08-05), et plus seulement sur les visuels.
         ⚠️ Mais pas a la meme taille : sur une image, un disque de 76 px se
         pose dans le vide ; sur un lien de texte, il RECOUVRE la ligne qu'on
         est en train de lire. D'ou la variante etroite pour les liens et les
         boutons - meme signal, sans cacher le mot qu'on vise. */
      curseur.classList.toggle('ouvert', !!cible);
      curseur.classList.toggle('ouvert--fin', !!cible && !visuel);
      curseur.style.opacity = cible ? '1' : '.85';
    }, { passive: true });
    document.addEventListener('pointerleave', function () { curseur.style.opacity = '0'; });
  } else if (curseur) {
    curseur.remove();
    document.documentElement.style.cursor = 'auto';
  }

  /* ---------------------------------------------------------------------
     11. Filtres + recherche
     Un seul moteur pour le portfolio, les produits et l'archive : les pages
     ne font que declarer `data-liste`, `data-cat` et `data-cherche`.
     --------------------------------------------------------------------- */
  $$('[data-liste]').forEach(function (liste) {
    var articles = $$('[data-cat]', liste);
    var groupe = $('[data-filtres="' + liste.getAttribute('data-liste') + '"]');
    var recherche = $('[data-recherche="' + liste.getAttribute('data-liste') + '"]');
    var messageVide = $('[data-vide="' + liste.getAttribute('data-liste') + '"]');
    var categorie = 'tout', texte = '';

    function trier() {
      var visibles = 0;
      articles.forEach(function (a) {
        var cats = (a.getAttribute('data-cat') || '').toLowerCase();
        var mots = (a.getAttribute('data-cherche') || a.textContent).toLowerCase();
        var okCat = categorie === 'tout' || cats.indexOf(categorie) !== -1;
        // Tous les mots doivent etre presents : un filtre qui laisse passer
        // n'importe quoi ne filtre rien.
        var okTexte = !texte || texte.split(/\s+/).every(function (m) { return mots.indexOf(m) !== -1; });
        var montre = okCat && okTexte;
        a.hidden = !montre;
        if (montre) visibles += 1;
      });
      if (messageVide) messageVide.hidden = visibles > 0;
    }

    if (groupe) {
      $$('.filtre', groupe).forEach(function (b) {
        b.addEventListener('click', function () {
          $$('.filtre', groupe).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          categorie = (b.getAttribute('data-valeur') || 'tout').toLowerCase();
          trier();
        });
      });
    }
    if (recherche) {
      recherche.addEventListener('input', function () {
        texte = recherche.value.trim().toLowerCase();
        trier();
      });
    }
  });

  /* ---------------------------------------------------------------------
     12. Volet immersif des campagnes
     Le contenu vit dans un <template> a cote de la carte : rien a charger,
     rien a inventer cote script.
     --------------------------------------------------------------------- */
  var volet = $('#volet-campagne');
  if (volet) {
    var contenu = $('[data-volet-contenu]', volet);
    var rendu = null;
    $$('[data-campagne]').forEach(function (bouton) {
      bouton.addEventListener('click', function () {
        var modele = document.getElementById(bouton.getAttribute('data-campagne'));
        if (!modele) return;
        contenu.innerHTML = '';
        contenu.appendChild(modele.content.cloneNode(true));
        volet.classList.add('ouvert');
        volet.removeAttribute('aria-hidden');
        document.body.classList.add('fige');
        volet.scrollTop = 0;
        rendu = bouton;
        $('[data-fermer-volet]', volet).focus();
      });
    });
    function fermerVolet() {
      volet.classList.remove('ouvert');
      volet.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('fige');
      if (rendu) rendu.focus();
    }
    $('[data-fermer-volet]', volet).addEventListener('click', fermerVolet);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && volet.classList.contains('ouvert')) fermerVolet();
    });
  }

  /* ---------------------------------------------------------------------
     13. Evenements : compte a rebours + ajout au calendrier
     Le fichier .ics est fabrique DANS le navigateur : aucun service tiers,
     aucune donnee qui sort, et ca marche hors ligne.
     --------------------------------------------------------------------- */
  var rebours = $$('[data-rebours]');
  if (rebours.length) {
    (function battre() {
      var maintenant = Date.now();
      rebours.forEach(function (el) {
        var quand = new Date(el.getAttribute('data-rebours')).getTime();
        var reste = quand - maintenant;
        if (isNaN(quand)) { el.textContent = ''; return; }
        if (reste <= 0) { el.textContent = 'C\'est maintenant'; return; }
        var j = Math.floor(reste / 864e5);
        var h = Math.floor(reste % 864e5 / 36e5);
        var m = Math.floor(reste % 36e5 / 6e4);
        el.textContent = j > 0 ? ('J - ' + j + ' · ' + h + ' h ' + String(m).padStart(2, '0'))
                               : (h + ' h ' + String(m).padStart(2, '0') + ' min');
      });
      setTimeout(battre, 30000);
    })();
  }

  function deuxChiffres(n) { return String(n).padStart(2, '0'); }
  function dateIcs(d) {
    return d.getUTCFullYear() + deuxChiffres(d.getUTCMonth() + 1) + deuxChiffres(d.getUTCDate())
      + 'T' + deuxChiffres(d.getUTCHours()) + deuxChiffres(d.getUTCMinutes()) + '00Z';
  }
  $$('[data-calendrier]').forEach(function (b) {
    b.addEventListener('click', function () {
      var debut = new Date(b.getAttribute('data-debut'));
      if (isNaN(debut.getTime())) return;
      var fin = new Date(debut.getTime() + 2 * 36e5);
      var lignes = [
        'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Atelier Web//Chaine//FR',
        'BEGIN:VEVENT',
        'UID:' + debut.getTime() + '@chaine',
        'DTSTAMP:' + dateIcs(new Date()),
        'DTSTART:' + dateIcs(debut),
        'DTEND:' + dateIcs(fin),
        'SUMMARY:' + (b.getAttribute('data-titre') || 'Evenement'),
        'LOCATION:' + (b.getAttribute('data-lieu') || ''),
        'END:VEVENT', 'END:VCALENDAR'
      ];
      var lien = document.createElement('a');
      lien.href = URL.createObjectURL(new Blob([lignes.join('\r\n')], { type: 'text/calendar' }));
      lien.download = (b.getAttribute('data-titre') || 'evenement').replace(/[^\w-]+/g, '-').toLowerCase() + '.ics';
      lien.click();
      URL.revokeObjectURL(lien.href);
    });
  });

  /* ---------------------------------------------------------------------
     14. Reservation en trois temps
     On ne montre jamais un formulaire de vingt champs d'un coup.
     --------------------------------------------------------------------- */
  var reservation = $('[data-reservation]');
  if (reservation) {
    var volets = $$('.volet', reservation);
    var pastilles = $$('.etape', reservation);
    var index = 0;

    function afficher(i) {
      index = Math.max(0, Math.min(volets.length - 1, i));
      volets.forEach(function (v, k) { v.classList.toggle('actif', k === index); });
      pastilles.forEach(function (p, k) {
        p.classList.toggle('active', k === index);
        p.classList.toggle('faite', k < index);
      });
      var titre = $('h3, h2', volets[index]);
      if (titre) titre.setAttribute('tabindex', '-1'), titre.focus({ preventScroll: true });
    }
    $$('[data-suivant]', reservation).forEach(function (b) {
      b.addEventListener('click', function () {
        var volet = volets[index];
        var manquant = $$('[required]', volet).filter(function (c) { return !c.value.trim(); });
        var choix = $$('input[type="radio"]', volet);
        if (choix.length && !choix.some(function (c) { return c.checked; })) {
          $('[data-avis]', volet).textContent = 'Choisissez une prestation pour continuer.';
          return;
        }
        if (manquant.length) { manquant[0].focus(); manquant[0].reportValidity && manquant[0].reportValidity(); return; }
        afficher(index + 1);
      });
    });
    $$('[data-precedent]', reservation).forEach(function (b) {
      b.addEventListener('click', function () { afficher(index - 1); });
    });

    // Sans serveur, la demande part sur WhatsApp - c'est le canal qui repond
    // vraiment. Le formulaire dit ce qu'il fait, il ne fait pas semblant.
    reservation.addEventListener('submit', function (e) {
      e.preventDefault();

      /* ⚠️ Le formulaire porte `novalidate`, et depuis que les etapes ont disparu
         (version « demo classique »), plus personne ne verifiait quoi que ce soit :
         on pouvait envoyer une demande vide, qui arrive sur WhatsApp sans nom ni
         adresse - donc inexploitable. On controle ici, une fois, pour les deux
         formes du formulaire. */
      var avis = $('[data-avis]', reservation);
      var radios = $$('input[type="radio"]', reservation);
      if (radios.length && !radios.some(function (c) { return c.checked; })) {
        if (avis) avis.textContent = 'Choisissez une prestation pour continuer.';
        radios[0].focus();
        return;
      }
      var vide = $$('[required]', reservation).filter(function (c) { return !c.value.trim(); });
      if (vide.length) {
        vide[0].focus();
        if (vide[0].reportValidity) vide[0].reportValidity();
        return;
      }

      var d = new FormData(reservation);
      var texte = ['Bonjour, je souhaite reserver.', '',
        'Prestation : ' + (d.get('prestation') || '-'),
        'Date souhaitee : ' + (d.get('date') || '-'),
        'Nom : ' + (d.get('nom') || '-'),
        'Structure : ' + (d.get('structure') || '-'),
        'E-mail : ' + (d.get('email') || '-'),
        '', (d.get('details') || '')].join('\n');
      var numero = reservation.getAttribute('data-whatsapp');
      window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(texte), '_blank', 'noopener');
    });
  }

  /* ---------------------------------------------------------------------
     14 bis. Formulaire de contact
     `action="mailto:"` en POST est refuse ou ignore par la plupart des
     navigateurs : le visiteur clique et il ne se passe RIEN. On compose donc
     nous-memes un mailto complet, qui ouvre le client mail avec tout dedans.
     --------------------------------------------------------------------- */
  var contact = $('[data-contact]');
  if (contact) {
    contact.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(contact);
      var corps = [
        'Nom : ' + (d.get('nom') || '-'),
        'E-mail : ' + (d.get('email') || '-'),
        '', (d.get('message') || '')
      ].join('\n');
      window.location.href = 'mailto:' + contact.getAttribute('data-contact')
        + '?subject=' + encodeURIComponent(d.get('sujet') || 'Prise de contact')
        + '&body=' + encodeURIComponent(corps);
    });
  }

  /* ---------------------------------------------------------------------
     15. Code promo : un clic, c'est copie
     --------------------------------------------------------------------- */
  $$('.code-promo').forEach(function (b) {
    b.addEventListener('click', function () {
      var code = b.getAttribute('data-code') || b.textContent.trim();
      var avant = b.textContent;
      function dire(m) { b.textContent = m; setTimeout(function () { b.textContent = avant; }, 1800); }
      if (navigator.clipboard) navigator.clipboard.writeText(code).then(function () { dire('Copie'); }, function () { dire(code); });
      else dire(code);
    });
  });

  /* ---------------------------------------------------------------------
     16. Produits vus recemment
     --------------------------------------------------------------------- */
  $$('[data-produit]').forEach(function (carte) {
    carte.addEventListener('click', function () {
      var nom = carte.getAttribute('data-produit');
      var vus = (memoire.vus || []).filter(function (v) { return v !== nom; });
      vus.unshift(nom);
      retenir('vus', vus.slice(0, 6));
    });
  });
  var rangeeVus = $('[data-vus]');
  if (rangeeVus && (memoire.vus || []).length) {
    var trouves = memoire.vus.map(function (nom) {
      return $('[data-produit="' + nom.replace(/"/g, '') + '"]');
    }).filter(Boolean);
    if (trouves.length) {
      rangeeVus.hidden = false;
      var cible = $('[data-vus-liste]', rangeeVus);
      trouves.slice(0, 4).forEach(function (c) { cible.appendChild(c.cloneNode(true)); });
    }
  }

  /* ---------------------------------------------------------------------
     17. Flux social
     ⚠️ A LIRE AVANT DE PROMETTRE UN FLUX "AUTOMATIQUE" AU CLIENT.
     TikTok et Instagram n'autorisent AUCUNE lecture de flux depuis une page
     statique : il faut une cle d'API et un petit serveur qui la garde (une
     cle posee dans cette page serait publique et revoquee). Le HTML porte
     donc des publications ecrites a la main, qui s'affichent toujours ;
     si un point de collecte est declare via data-flux, elles sont remplacees
     par les vraies. Format attendu :
       [{ "image": "...", "titre": "...", "vues": "...", "lien": "..." }]
     --------------------------------------------------------------------- */
  var flux = $('[data-flux]');
  if (flux && flux.getAttribute('data-flux')) {
    fetch(flux.getAttribute('data-flux'), { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (liste) {
        if (!Array.isArray(liste) || !liste.length) return;
        flux.innerHTML = liste.slice(0, 6).map(function (p) {
          return '<a class="pub" href="' + p.lien + '" target="_blank" rel="noopener">'
            + '<img src="' + p.image + '" alt="" loading="lazy">'
            + '<span class="pub-voile"></span>'
            + '<span class="pub-info"><b>' + p.titre + '</b><span>' + (p.vues || '') + '</span></span></a>';
        }).join('');
      })
      .catch(function () { /* on garde les publications du HTML */ });
  }

  /* ---------------------------------------------------------------------
     18. Annee courante dans le pied de page
     --------------------------------------------------------------------- */
  $$('[data-annee]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

/* =========================================================================
   VERSION « DEMO CLASSIQUE » (2026-08-04)
   Deux ajouts autonomes : le banc d'essai typographique et le carrousel de
   temoignages. Bloc separe a dessein - il se retire d'une seule coupe.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     A. Banc d'essai typographique
     Quatorze identites a essayer en un clic, pour trancher a l'oeil plutot
     que sur un nom de police.

     ⚠️ On ne charge PAS les quatorze au demarrage : ce serait une trentaine
     de familles distantes avant le premier rendu. La feuille Google d'une
     combinaison n'est demandee qu'au moment ou on la choisit, et une seule
     fois (les deja-chargees sont retenues).
     --------------------------------------------------------------------- */
  var COMBOS = [
    { cle: '',           nom: 'Mono (actuelle)',   detail: 'Martian Mono, une seule famille', police: '' },
    { cle: 'luxe',       nom: 'Luxe elegant',      detail: 'Cormorant Garamond + Jost',       police: 'Cormorant+Garamond:wght@300;400;500&family=Jost:wght@300;400;500' },
    { cle: 'editorial',  nom: 'Editorial mode',    detail: 'Playfair Display + Inter',        police: 'Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500' },
    { cle: 'cosmetique', nom: 'Cosmetique premium', detail: 'Fraunces + Karla',               police: 'Fraunces:opsz,wght@9..144,300..600&family=Karla:wght@300;400;500' },
    { cle: 'minimal',    nom: 'Minimal chic',      detail: 'Instrument Serif + Manrope',      police: 'Instrument+Serif&family=Manrope:wght@300;400;500' },
    { cle: 'magazine',   nom: 'Magazine beaute',   detail: 'Bodoni Moda + Work Sans',         police: 'Bodoni+Moda:opsz,wght@6..96,400..600&family=Work+Sans:wght@300;400;500' },
    { cle: 'couture',    nom: 'Haute couture',     detail: 'Italiana + Montserrat',           police: 'Italiana&family=Montserrat:wght@300;400;500' },
    { cle: 'douceur',    nom: 'Douceur moderne',   detail: 'DM Serif Display + DM Sans',      police: 'DM+Serif+Display&family=DM+Sans:wght@300;400;500' },
    { cle: 'parisien',   nom: 'Parisien',          detail: 'Marcellus + Lato',                police: 'Marcellus&family=Lato:wght@300;400;700' },
    { cle: 'net',        nom: 'Contraste net',     detail: 'Syne + Space Grotesk',            police: 'Syne:wght@400;600;700&family=Space+Grotesk:wght@300;400;500' },
    { cle: 'eclat',      nom: 'Eclat',             detail: 'Prata + Figtree',                 police: 'Prata&family=Figtree:wght@300;400;500' },
    { cle: 'signature',  nom: 'Signature',         detail: 'Gilda Display + Nunito Sans',     police: 'Gilda+Display&family=Nunito+Sans:wght@300;400;600' },
    { cle: 'ligne',      nom: 'Ligne pure',        detail: 'Tenor Sans + Barlow',             police: 'Tenor+Sans&family=Barlow:wght@300;400;500' },
    { cle: 'sensuel',    nom: 'Sensuel',           detail: 'Yeseva One + Poppins',            police: 'Yeseva+One&family=Poppins:wght@300;400;500' },
    { cle: 'classique',  nom: 'Classique',         detail: 'Libre Baskerville + Outfit',      police: 'Libre+Baskerville:wght@400;700&family=Outfit:wght@300;400;500' }
  ];

  var MEMOIRE = 'chaine.typo';
  var chargees = {};

  function charger(combo) {
    if (!combo.police || chargees[combo.cle]) return;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + combo.police + '&display=swap';
    document.head.appendChild(l);
    chargees[combo.cle] = true;
  }

  /* ---------------------------------------------------------------------
     Titres pleine largeur
     Le patron veut ces titres sur UNE ligne, occupant la largeur. Une taille
     ecrite en dur ne peut pas y arriver : mesure faite, « Les chiffres qui
     comptent » a 7,2vw sortait de 118 % de la place disponible, et surtout les
     quinze typographies du banc d'essai n'ont pas la meme chasse - ce qui rentre
     dans l'une deborde dans l'autre. On mesure donc le texte a une taille de
     reference et on en deduit celle qui remplit la ligne.
     --------------------------------------------------------------------- */
  var REFERENCE = 100;

  function ajusterTitres() {
    document.querySelectorAll('.titre-plein').forEach(function (h) {
      if (window.innerWidth < 1100) { h.style.fontSize = ''; return; }
      var dispo = h.getBoundingClientRect().width;
      if (!dispo) return;
      h.style.fontSize = REFERENCE + 'px';
      var plage = document.createRange();
      plage.selectNodeContents(h);
      var large = plage.getBoundingClientRect().width;
      if (!large) { h.style.fontSize = ''; return; }
      // 0.98 : on laisse un cheveu de marge, sinon l'arrondi du navigateur suffit
      // a declencher un debordement d'un pixel - et un pixel de trop se voit.
      var taille = (REFERENCE * dispo * 0.98) / large;
      h.style.fontSize = Math.max(30, Math.min(150, taille)).toFixed(1) + 'px';
    });
  }

  function appliquer(combo) {
    charger(combo);
    if (combo.cle) document.documentElement.setAttribute('data-typo', combo.cle);
    else document.documentElement.removeAttribute('data-typo');
    try { localStorage.setItem(MEMOIRE, combo.cle); } catch (e) {}
    // La nouvelle famille arrive par le reseau : on remesure quand elle est la,
    // sinon les titres gardent la taille calculee pour la police precedente.
    ajusterTitres();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajusterTitres);
    setTimeout(ajusterTitres, 900);
  }

  var choisie = '';
  try { choisie = localStorage.getItem(MEMOIRE) || ''; } catch (e) {}

  // On repose le choix precedent avant de construire le panneau : sinon le visiteur
  // qui revient voit une image du site dans la police d'origine, puis un saut.
  COMBOS.forEach(function (c) { if (c.cle && c.cle === choisie) appliquer(c); });

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
      panneau.querySelectorAll('button').forEach(function (autre) { autre.setAttribute('aria-pressed', 'false'); });
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

  ajusterTitres();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajusterTitres);
  var minuteurTitres;
  window.addEventListener('resize', function () {
    clearTimeout(minuteurTitres);
    minuteurTitres = setTimeout(ajusterTitres, 140);
  });

  /* ---------------------------------------------------------------------
     B. Carrousel de temoignages
     Il avance seul, mais s'arrete des qu'on s'y interesse : survol, doigt
     pose, ou focus clavier. Un carrousel qui defile pendant qu'on lit est
     la meilleure facon de ne pas etre lu.
     --------------------------------------------------------------------- */
  var doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carrousel]').forEach(function (bloc) {
    var piste = bloc.querySelector('.carrousel-piste');
    var pied = bloc.querySelector('.carrousel-pied');
    if (!piste || !piste.children.length) return;

    // Combien de temoignages tiennent cote a cote : 2 sur bureau, 1 au telephone.
    // On le LIT dans la mise en page au lieu de le supposer - le point de bascule
    // est dans le CSS, et deux sources de verite finissent toujours par diverger.
    function parEcran() {
      var l = piste.getBoundingClientRect().width;
      var e = piste.children[0].getBoundingClientRect().width;
      return Math.max(1, Math.round(l / Math.max(1, e)));
    }

    var index = 0, minuteur = null;

    function pages() { return Math.max(1, Math.ceil(piste.children.length / parEcran())); }

    function aller(n) {
      var total = pages();
      index = (n + total) % total;
      piste.style.transform = 'translateX(' + (-index * 100) + '%)';
      if (pied) {
        pied.querySelectorAll('.carrousel-puce').forEach(function (p, i) {
          p.setAttribute('aria-current', String(i === index));
        });
      }
    }

    function construirePuces() {
      if (!pied) return;
      pied.innerHTML = '';
      for (var i = 0; i < pages(); i += 1) {
        (function (n) {
          var p = document.createElement('button');
          p.type = 'button';
          p.className = 'carrousel-puce';
          p.setAttribute('aria-label', 'Temoignage ' + (n + 1));
          p.setAttribute('aria-current', String(n === index));
          p.addEventListener('click', function () { aller(n); relancer(); });
          pied.appendChild(p);
        })(i);
      }
    }

    function relancer() {
      if (minuteur) clearInterval(minuteur);
      if (!doux) return;
      minuteur = setInterval(function () { aller(index + 1); }, 5200);
    }

    ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) {
      bloc.addEventListener(ev, function () { if (minuteur) clearInterval(minuteur); }, { passive: true });
    });
    ['mouseleave', 'focusout'].forEach(function (ev) {
      bloc.addEventListener(ev, relancer);
    });

    var redim;
    window.addEventListener('resize', function () {
      clearTimeout(redim);
      redim = setTimeout(function () { construirePuces(); aller(Math.min(index, pages() - 1)); }, 180);
    });

    construirePuces();
    aller(0);
    relancer();
  });
})();
