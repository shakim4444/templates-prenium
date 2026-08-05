/* =========================================================================
   EFFLUVE - l'editeur de couleurs de la demonstration

   Un carre en haut a droite ouvre trois rangees : le FOND, la couleur de
   MARQUE (celle des titres, du bouton plein et de l'ecran de contact) et
   l'ACCENT (l'or). C'est de quoi essayer une direction en direct devant le
   client, sans toucher au modele.

   ⚠️ Cet outil sert la DEMONSTRATION, pas le site vendu : comme le banc
   typographique du modele createur, il se retire de lui-meme dans le cadre
   d'apercu.
   ⚠️ On ne cite AUCUN nom de client dans ces fichiers. Une jumelle anonyme se
   fabrique a partir d'ici, et un nom oublie dans un commentaire arrive intact
   dans le code source d'une demonstration censee ne designer personne.

   ⚠️ Les tons intermediaires ne sont PAS choisis, ils se DEDUISENT du couple
   fond / marque. Poses en dur, ils deviendraient illisibles a la premiere
   direction sombre - et c'est justement une direction qu'on veut pouvoir
   essayer.
   ========================================================================= */
(function () {
  'use strict';

  // Dans le cadre d'apercu on veut voir le SITE, pas les boutons de l'atelier.
  var dansApercu = new URLSearchParams(location.search).has('apercu');
  var racine = document.documentElement;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------------
     Outillage couleur
     --------------------------------------------------------------------- */
  function versRvb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function luminance(hex) {
    return versRvb(hex).map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }).reduce(function (t, v, i) { return t + v * [0.2126, 0.7152, 0.0722][i]; }, 0);
  }
  function contraste(a, b) {
    var x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function melange(a, b, part) {
    var A = versRvb(a), B = versRvb(b);
    return '#' + A.map(function (v, i) {
      return Math.round(v * part + B[i] * (1 - part)).toString(16).padStart(2, '0');
    }).join('');
  }
  function rgba(hex, alpha) {
    var c = versRvb(hex);
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + alpha + ')';
  }

  /* =====================================================================
     Les palettes proposees
     ===================================================================== */
  var FONDS = [
    { nom: 'Crème', val: '#F4EFE7' }, { nom: 'Blanc cassé', val: '#FAF7F2' },
    { nom: 'Ivoire', val: '#F7F3EA' }, { nom: 'Sable', val: '#EFE6D8' },
    { nom: 'Lin', val: '#EDE7DC' }, { nom: 'Perle', val: '#ECECEA' },
    { nom: 'Gris tourterelle', val: '#E4E2DD' }, { nom: 'Rosé poudré', val: '#F3E7E0' },
    { nom: 'Blush', val: '#F6E9E6' }, { nom: 'Amande', val: '#EEEDE3' },
    { nom: 'Céladon pâle', val: '#E7EDE7' }, { nom: 'Bleu brume', val: '#E6EAEE' },
    { nom: 'Taupe clair', val: '#E6DFD6' }, { nom: 'Prune profond', val: '#2A0F1C' },
    { nom: 'Bordeaux sombre', val: '#25100F' }, { nom: 'Encre', val: '#16141A' },
    { nom: 'Forêt', val: '#101A16' }, { nom: 'Nuit', val: '#13100F' },
  ];
  // La couleur de MARQUE porte les titres, le bouton plein et l'ecran de
  // contact : c'est elle qui donne son caractere a la maison.
  var MARQUES = [
    { nom: 'Prune', val: '#43162A' }, { nom: 'Bordeaux', val: '#481818' },
    { nom: 'Grenat', val: '#5A1A28' }, { nom: 'Aubergine', val: '#33203C' },
    { nom: 'Encre', val: '#231C24' }, { nom: 'Noir de vigne', val: '#191316' },
    { nom: 'Vert profond', val: '#20372C' }, { nom: 'Sapin', val: '#16302B' },
    { nom: 'Bleu nuit', val: '#1C2740' }, { nom: 'Ardoise', val: '#2C3540' },
    { nom: 'Brun tabac', val: '#3A2A1E' }, { nom: 'Cacao', val: '#2E2119' },
    { nom: 'Terre de Sienne', val: '#5C2E1E' }, { nom: 'Rouille', val: '#6B3020' },
  ];
  var ACCENTS = [
    { nom: 'Or', val: '#C09048' }, { nom: 'Or pâle', val: '#D2B071' },
    { nom: 'Laiton', val: '#B8873A' }, { nom: 'Bronze', val: '#8C6A3C' },
    { nom: 'Cuivre', val: '#A85A42' }, { nom: 'Champagne', val: '#CBB283' },
    { nom: 'Nacre', val: '#D8CDBB' }, { nom: 'Argent', val: '#9AA0A6' },
    { nom: 'Étain', val: '#7C858C' }, { nom: 'Vert bronze', val: '#7E8A5A' },
    { nom: 'Sauge', val: '#93A48B' }, { nom: 'Lie-de-vin', val: '#8A3A4A' },
    { nom: 'Framboise', val: '#A8415C' }, { nom: 'Terracotta', val: '#B4643F' },
    { nom: 'Safran', val: '#C98A2E' }, { nom: 'Bleu paon', val: '#3F6E7A' },
  ];

  var DEFAUTS = { fond: '#F6F3EC', marque: '#231C24', accent: '#C0A472' };
  var etat = Object.assign({}, DEFAUTS);
  try {
    var garde = JSON.parse(localStorage.getItem('parfumerie.couleurs') || 'null');
    if (garde) etat = Object.assign(etat, garde);
  } catch (e) {}

  function appliquer() {
    var s = racine.style;
    var fondClair = luminance(etat.fond) > 0.32;

    // Le texte courant se deduit du fond : sur une direction sombre, une encre
    // sombre disparaitrait purement et simplement.
    var texte = fondClair ? melange(etat.marque, etat.fond, 0.86) : melange('#FFFFFF', etat.fond, 0.9);
    // Ce qui s'ecrit SUR la couleur de marque (bouton plein, ecran de contact,
    // bouton de retour). Le CSS y mettait `--creme` : juste tant que la creme
    // est claire, faux des qu'on choisit un fond sombre.
    var surMarque = luminance(etat.marque) < 0.34 ? '#F4EFE7' : '#170F13';

    s.setProperty('--creme', etat.fond);
    s.setProperty('--creme-2', melange(etat.marque, etat.fond, 0.09));
    s.setProperty('--prune', etat.marque);
    s.setProperty('--prune-2', melange('#FFFFFF', etat.marque, 0.14));
    s.setProperty('--or', etat.accent);
    s.setProperty('--or-clair', melange('#FFFFFF', etat.accent, 0.2));
    s.setProperty('--encre', texte);
    s.setProperty('--sourd', melange(texte, etat.fond, 0.56));
    s.setProperty('--trait', rgba(etat.marque, fondClair ? 0.16 : 0.4));
    s.setProperty('--trait-or', rgba(etat.accent, 0.38));
    s.setProperty('--sur-marque', surMarque);
    /* ⚠️ La couleur de marque a DEUX emplois que rien ne distingue dans la
       feuille : elle est l'APLAT du bouton plein et de l'ecran de contact, et
       elle est la COULEUR DES TITRES. Les deux ne peuvent pas suivre la meme
       regle : sur une direction sombre, un titre prune sur du noir ne se lit
       plus du tout - vu a la capture, les onze noms de parfums avaient disparu.
       Sur fond clair le titre EST la marque ; sur fond sombre, il en garde la
       teinte mais monte en clarte. */
    s.setProperty('--titre-couleur', fondClair ? etat.marque : melange('#FFFFFF', etat.marque, 0.58));
    // Les cartes sont un voile POSE sur le fond. Blanc sur une direction
    // claire, blanc tres dilue sur une direction sombre - sinon elles virent
    // au laiteux et mangent le contenu.
    s.setProperty('--carte', fondClair ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.05)');
    s.setProperty('--carte-2', fondClair ? 'rgba(255,255,255,.72)' : 'rgba(255,255,255,.09)');

    try { localStorage.setItem('parfumerie.couleurs', JSON.stringify(etat)); } catch (e) {}
    majContraste();
  }

  /* Les endroits ou la feuille du modele ecrit une couleur EN DUR. On les
     rebranche sur les variables : sans ca, une direction sombre laisse du
     texte creme sur creme, et des cartes blanches sur du prune. */
  var pont = document.createElement('style');
  pont.textContent = [
    '.etat--sombre, .etat--sombre h2 { color: var(--sur-marque); }',
    '.btn--plein, .retour, .famille .compte, .skip-link { color: var(--sur-marque); }',
    '.etat--sombre .label, .ecrits span, .c-lignes dt { color: color-mix(in srgb, var(--sur-marque) 62%, var(--prune)); }',
    '.ecrits article, .c-fiche, .c-lignes { border-color: color-mix(in srgb, var(--sur-marque) 22%, transparent); }',
    '.c-lignes { background: color-mix(in srgb, var(--sur-marque) 18%, transparent); }',
    '.q-choix button, .r-carte, .famille { background: var(--carte); }',
    '.q-choix button:hover, .famille:hover { background: var(--carte-2); }',
    // Tout ce qui ECRIT en couleur de marque, par opposition a ce qui la pose
    // en aplat (bouton plein, bouton de retour, ecran de contact).
    '.sceau, .hero-titre, .q-titre, .q-compte, .q-choix b, .r-titre, .r-carte .r-nom,',
    '.f-titre, .famille h3, .fiche-nom, .fiche-meta dd, .btn--fil, .fiche-fermer',
    '{ color: var(--titre-couleur); }',
    '.fiche-fermer { background: var(--creme); }',
    '.btn--fil:hover { border-color: var(--titre-couleur); }',
  ].join('\n');
  document.head.appendChild(pont);

  /* ---------------------------------------------------------------------
     Le panneau
     --------------------------------------------------------------------- */
  function rangee(titre, choix, cle) {
    var bloc = document.createElement('div');
    bloc.className = 'coul-rangee';
    var t = document.createElement('p');
    t.textContent = titre;
    bloc.appendChild(t);
    var ligne = document.createElement('div');
    ligne.className = 'coul-ligne';
    choix.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'coul-case';
      b.title = c.nom;
      b.setAttribute('aria-label', titre + ' : ' + c.nom);
      b.style.background = c.val;
      b.addEventListener('click', function () {
        etat[cle] = c.val;
        appliquer();
        $$('.coul-case', ligne).forEach(function (a) { a.removeAttribute('data-choisi'); });
        b.setAttribute('data-choisi', '');
      });
      if (etat[cle] === c.val) b.setAttribute('data-choisi', '');
      ligne.appendChild(b);
    });
    bloc.appendChild(ligne);
    return bloc;
  }

  /* ---------------------------------------------------------------------
     Le banc typographique
     ⚠️ Chaque famille n'est chargee QU'AU MOMENT ou on la choisit. Charger
     seize polices d'avance pour n'en garder qu'une, c'est plusieurs centaines
     de kilo-octets pour rien - et sur la connexion d'un visiteur, ca se voit.
     --------------------------------------------------------------------- */
  var TYPOS = [
    { nom: 'Cormorant + Jost', titre: 'Cormorant Garamond', corps: 'Jost' },
    { nom: 'Playfair + Inter', titre: 'Playfair Display', corps: 'Inter' },
    { nom: 'DM Serif + Jost', titre: 'DM Serif Display', corps: 'Jost' },
    { nom: 'Bodoni + Karla', titre: 'Bodoni Moda', corps: 'Karla' },
    { nom: 'Fraunces + Karla', titre: 'Fraunces', corps: 'Karla' },
    { nom: 'Libre Baskerville', titre: 'Libre Baskerville', corps: 'Source Sans 3' },
    { nom: 'Lora + Mulish', titre: 'Lora', corps: 'Mulish' },
    { nom: 'Marcellus + Jost', titre: 'Marcellus', corps: 'Jost' },
    { nom: 'Italiana + Jost', titre: 'Italiana', corps: 'Jost' },
    { nom: 'Instrument + Inter', titre: 'Instrument Serif', corps: 'Inter' },
    { nom: 'Syne + Inter', titre: 'Syne', corps: 'Inter' },
    { nom: 'Unbounded + Jost', titre: 'Unbounded', corps: 'Jost' },
    { nom: 'Sora + Manrope', titre: 'Sora', corps: 'Manrope' },
    { nom: 'Outfit', titre: 'Outfit', corps: 'Outfit' },
    { nom: 'Epilogue', titre: 'Epilogue', corps: 'Epilogue' },
  ];
  // Ces familles n'ont qu'une graisse : leur demander une echelle de poids
  // renvoie une erreur et la police ne se charge pas du tout.
  var UNE_GRAISSE = ['Instrument Serif', 'DM Serif Display', 'Italiana', 'Marcellus'];
  var chargees = {};
  function charger(famille) {
    if (chargees[famille]) return;
    chargees[famille] = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + famille.replace(/ /g, '+')
      + (UNE_GRAISSE.indexOf(famille) >= 0 ? '' : ':wght@300;400;500;600')
      + '&display=swap';
    document.head.appendChild(l);
  }
  function appliquerTypo(t) {
    charger(t.titre); charger(t.corps);
    racine.style.setProperty('--titre', '"' + t.titre + '", Georgia, serif');
    racine.style.setProperty('--corps', '"' + t.corps + '", system-ui, sans-serif');
    try { localStorage.setItem('parfumerie.typo', t.nom); } catch (e) {}
  }

  var panneau = document.createElement('div');
  panneau.className = 'coul-panneau';
  var entete = document.createElement('p');
  entete.className = 'coul-entete';
  entete.textContent = 'Essayer une direction';
  panneau.appendChild(entete);
  panneau.appendChild(rangee('Fond', FONDS, 'fond'));
  panneau.appendChild(rangee('Marque', MARQUES, 'marque'));
  panneau.appendChild(rangee('Accent', ACCENTS, 'accent'));

  var blocTypo = document.createElement('div');
  blocTypo.className = 'coul-rangee';
  var titreTypo = document.createElement('p');
  titreTypo.textContent = 'Typographie';
  blocTypo.appendChild(titreTypo);
  var listeTypo = document.createElement('div');
  listeTypo.className = 'coul-typos';
  var typoGardee = null;
  try { typoGardee = localStorage.getItem('parfumerie.typo'); } catch (e) {}
  TYPOS.forEach(function (t) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'coul-typo';
    b.textContent = t.nom;
    b.addEventListener('click', function () {
      appliquerTypo(t);
      $$('.coul-typo', listeTypo).forEach(function (a) { a.removeAttribute('data-choisi'); });
      b.setAttribute('data-choisi', '');
    });
    if (typoGardee === t.nom) { b.setAttribute('data-choisi', ''); appliquerTypo(t); }
    listeTypo.appendChild(b);
  });
  blocTypo.appendChild(listeTypo);
  panneau.appendChild(blocTypo);

  // ⚠️ Un outil de couleurs qui laisse rendre le site illisible SANS RIEN DIRE
  // est un piege : on mesure et on affiche.
  var mesure = document.createElement('p');
  mesure.className = 'coul-mesure';
  panneau.appendChild(mesure);

  function majContraste() {
    var fondClair = luminance(etat.fond) > 0.32;
    var texte = fondClair ? melange(etat.marque, etat.fond, 0.86) : melange('#FFFFFF', etat.fond, 0.9);
    var r = contraste(texte, etat.fond);
    var rOr = contraste(etat.accent, etat.fond);
    mesure.textContent = 'Texte sur fond : ' + r.toFixed(1) + ':1'
      + (r < 4.5 ? ' - illisible' : r < 7 ? ' - correct' : ' - confortable')
      + ' · accent : ' + rOr.toFixed(1) + ':1'
      + (rOr < 3 ? ' - a reserver aux traits' : '');
    if (r < 4.5) mesure.setAttribute('data-alerte', '');
    else mesure.removeAttribute('data-alerte');
  }

  var retablir = document.createElement('button');
  retablir.type = 'button';
  retablir.className = 'coul-retablir';
  retablir.textContent = 'Revenir aux couleurs d’origine';
  retablir.addEventListener('click', function () {
    etat = Object.assign({}, DEFAUTS);
    appliquer();
    $$('.coul-case', panneau).forEach(function (a) { a.removeAttribute('data-choisi'); });
    $$('.coul-rangee', panneau).forEach(function (r) {
      var premier = r.querySelector('.coul-case');
      if (premier) premier.setAttribute('data-choisi', '');
    });
  });
  panneau.appendChild(retablir);

  var bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.className = 'coul-bouton';
  bouton.setAttribute('aria-expanded', 'false');
  bouton.setAttribute('aria-label', 'Essayer d’autres couleurs');
  bouton.innerHTML = '<span aria-hidden="true"></span>';
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

  var style = document.createElement('style');
  style.textContent = [
    // Le bouton se pose AU-DESSUS de celui de l'apercu appareil (top 196) ;
    // le panneau s'ouvre EN DESSOUS des deux, sinon il les recouvre.
    '.coul-bouton{position:fixed;right:18px;top:142px;z-index:80;width:46px;height:46px;',
    ' border:1px solid var(--trait);background:var(--creme);cursor:pointer;display:grid;place-items:center;border-radius:50%}',
    '.coul-bouton span{width:19px;height:19px;border-radius:50%;display:block;',
    ' background:linear-gradient(135deg,var(--or) 0 50%,var(--prune) 50% 100%)}',
    '.coul-bouton:hover{border-color:var(--prune)}',
    '.coul-panneau{position:fixed;right:18px;top:252px;z-index:80;width:min(292px,calc(100vw - 36px));',
    ' max-height:min(64vh,560px);overflow-y:auto;background:var(--creme);',
    ' border:1px solid var(--trait);padding:14px;display:none;color:var(--encre);',
    ' box-shadow:0 26px 60px -30px rgba(0,0,0,.5)}',
    '.coul-panneau[data-ouvert]{display:block}',
    '.coul-entete,.coul-rangee p{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--sourd);margin:0}',
    '.coul-entete{padding-bottom:12px}',
    '.coul-rangee{margin-top:14px}',
    '.coul-ligne{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}',
    '.coul-case{width:27px;height:27px;border:1px solid var(--trait);cursor:pointer;padding:0;border-radius:50%}',
    '.coul-case:hover{transform:scale(1.12)}',
    '.coul-case[data-choisi]{outline:2px solid var(--prune);outline-offset:2px}',
    '.coul-typos{display:grid;gap:5px;margin-top:9px}',
    '.coul-typo{text-align:left;padding:8px 11px;border:1px solid var(--trait);background:none;',
    ' cursor:pointer;font-size:12px;color:var(--encre);border-radius:3px}',
    '.coul-typo:hover{border-color:var(--or)}',
    '.coul-typo[data-choisi]{border-color:var(--prune);background:var(--creme-2)}',
    '.coul-mesure{margin-top:16px;font-size:11px;line-height:1.45;color:var(--sourd)}',
    '.coul-mesure[data-alerte]{color:#B3261E;font-weight:500}',
    '.coul-retablir{margin-top:12px;width:100%;padding:9px;background:none;cursor:pointer;',
    ' border:1px solid var(--trait);color:var(--encre);font-size:11px;letter-spacing:.1em;border-radius:100px}',
    '.coul-retablir:hover{border-color:var(--prune)}',
    // ⚠️ Au telephone les boutons flottants se posent SUR le titre en haut a
    // droite. Ils descendent a gauche - le centre du bas est pris par le
    // bouton de retour, le bas droit par la pastille de demonstration.
    '@media(max-width:760px){',
    ' .coul-bouton{top:auto;right:auto;left:14px;bottom:62px;width:42px;height:42px}',
    ' .coul-panneau{top:auto;right:auto;left:14px;bottom:112px;max-height:52vh}',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // Les couleurs s'appliquent TOUJOURS - y compris dans le cadre d'apercu,
  // puisque c'est le rendu choisi qu'on veut y voir. Seuls les boutons partent.
  appliquer();
  if (!dansApercu) {
    document.body.appendChild(bouton);
    document.body.appendChild(panneau);
  }
})();
