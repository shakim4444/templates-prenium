/* =========================================================================
   OUTILS DE DEMONSTRATION - Naya Sanou
   Deux bancs d'essai, pour trancher a l'oeil plutot que sur un nom :
     Aa  la typographie  (15 combinaisons)
     ◐   les couleurs    (fond, texte, accent, et un jeu SEPARE pour le pied
                          de page et la frame de prise de contact)

   ⚠️ Ce fichier est PARTAGE par les deux demonstrations (classique et
   interactive). Une seule source : recopie dans deux dossiers, il finirait
   par diverger, et on comparerait deux sites qui n'ont plus les memes
   reglages.

   ⚠️ Il n'a rien a faire dans le site livre au client. C'est un outil de
   choix : une fois la direction arretee, on retire la ligne <script> et les
   valeurs retenues passent en dur dans styles.css.
   ========================================================================= */
(function () {
  'use strict';

  // ⚠️ La page affichee DANS le cadre d'apercu telephone / bureau ne doit pas
  // reproposer les outils : sinon on regarde un rendu mobile encombre de trois
  // boutons qui n'existeront jamais chez le client. Les couleurs et la police
  // deja choisies, elles, sont bien reposees ci-dessous - c'est le rendu qu'on
  // veut voir.
  var dansApercu = new URLSearchParams(location.search).has('apercu');

  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var racine = document.documentElement;

  /* ---------------------------------------------------------------------
     Petit outillage couleur
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
  // Melange deux couleurs, pour deduire les gris intermediaires du couple choisi.
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
     1. LES COULEURS
     ===================================================================== */
  var FONDS = [
    { nom: 'Ivoire', val: '#F1ECE6' }, { nom: 'Blanc cassé', val: '#FAF7F2' },
    { nom: 'Sable', val: '#EDE4D8' }, { nom: 'Perle', val: '#ECECEA' },
    { nom: 'Rosé', val: '#F3E7E0' }, { nom: 'Anthracite', val: '#2E2E2E' },
    { nom: 'Nuit', val: '#14120F' },
  ];
  var TEXTES = [
    { nom: 'Anthracite', val: '#2E2E2E' }, { nom: 'Noir', val: '#121212' },
    { nom: 'Prune', val: '#3A2430' }, { nom: 'Gris', val: '#4A4A4A' },
    { nom: 'Ivoire', val: '#F1ECE6' },
  ];
  var ACCENTS = [
    { nom: 'Lie-de-vin', val: '#7D4047' }, { nom: 'Or', val: '#C09048' },
    { nom: 'Cuivre', val: '#A85A42' }, { nom: 'Prune', val: '#5E2039' },
    { nom: 'Vert profond', val: '#3F5B4C' }, { nom: 'Bleu encre', val: '#33455E' },
    { nom: 'Encre', val: '#2E2E2E' },
  ];
  // Le pied de page et la frame de contact forment un monde a part : on les
  // choisit en TRIO, parce que trois curseurs separes pour un bloc unique se
  // reglent mal et se contredisent vite.
  var PIEDS = [
    { nom: 'Comme la page', val: null },
    { nom: 'Anthracite', val: ['#2E2E2E', '#F1ECE6', '#B6A697'] },
    { nom: 'Prune profond', val: ['#43162A', '#F4EFE7', '#C09048'] },
    { nom: 'Nuit', val: ['#14120F', '#EDE7DE', '#C9A96A'] },
    { nom: 'Lie-de-vin', val: ['#5E2039', '#F3E7E0', '#D8A860'] },
    { nom: 'Ivoire appuyé', val: ['#E4DED6', '#2E2E2E', '#7D4047'] },
  ];

  var DEFAUTS = { fond: '#F1ECE6', texte: '#2E2E2E', accent: '#7D4047', pied: null };
  var etat = Object.assign({}, DEFAUTS);
  try {
    var garde = JSON.parse(localStorage.getItem('chaine.couleurs') || 'null');
    if (garde) etat = Object.assign(etat, garde);
  } catch (e) {}

  function appliquerCouleurs() {
    var s = racine.style;
    s.setProperty('--encre', etat.fond);
    s.setProperty('--ivoire', etat.texte);
    s.setProperty('--halo', etat.accent);
    s.setProperty('--signal', etat.accent);
    // Les tons intermediaires se DEDUISENT du couple : poses en dur, ils
    // deviendraient illisibles des qu'on choisit un fond sombre.
    s.setProperty('--sourd', melange(etat.texte, etat.fond, 0.62));
    s.setProperty('--taupe', melange(etat.texte, etat.fond, 0.42));
    s.setProperty('--nuit', melange(etat.texte, etat.fond, 0.08));
    s.setProperty('--voile', melange(etat.texte, etat.fond, 0.14));
    s.setProperty('--trait', rgba(etat.texte, 0.16));
    s.setProperty('--trait-fort', rgba(etat.texte, 0.34));
    s.setProperty('--carte', rgba(etat.texte, 0.035));
    s.setProperty('--sur-photo', '#F1ECE6');

    if (etat.pied) {
      s.setProperty('--pied-fond', etat.pied[0]);
      s.setProperty('--pied-texte', etat.pied[1]);
      s.setProperty('--pied-accent', etat.pied[2]);
      racine.setAttribute('data-pied', 'perso');
    } else {
      racine.removeAttribute('data-pied');
    }
    try { localStorage.setItem('chaine.couleurs', JSON.stringify(etat)); } catch (e) {}
    majContraste();
  }

  // Le style qui donne au pied de page et a la frame de contact leur propre
  // monde. Injecte ici pour que les deux demonstrations en heritent sans
  // toucher a leur feuille de style.
  var feuille = document.createElement('style');
  feuille.textContent = [
    '[data-pied="perso"] .pied,',
    '[data-pied="perso"] .bloc.appel,',
    '[data-pied="perso"] #contact,',
    '[data-pied="perso"] .scene[data-scene="contact"] {',
    '  background: var(--pied-fond);',
    '  color: var(--pied-texte);',
    '  --encre: var(--pied-fond);',
    '  --ivoire: var(--pied-texte);',
    '  --halo: var(--pied-accent);',
    '  --signal: var(--pied-accent);',
    '  --sourd: color-mix(in srgb, var(--pied-texte) 62%, var(--pied-fond));',
    '  --taupe: color-mix(in srgb, var(--pied-texte) 45%, var(--pied-fond));',
    '  --trait: color-mix(in srgb, var(--pied-texte) 18%, transparent);',
    '  --trait-fort: color-mix(in srgb, var(--pied-texte) 34%, transparent);',
    '}',
    /* La frame de contact a besoin d'un peu d'air autour d'elle une fois
       qu'elle porte sa propre couleur : sans ca, l'aplat colle au texte. */
    '[data-pied="perso"] #contact,',
    '[data-pied="perso"] .bloc.appel { padding-left: var(--marge); padding-right: var(--marge); }',
  ].join('\n');
  document.head.appendChild(feuille);

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
      if (cle === 'pied') {
        b.style.background = c.val ? c.val[0] : 'transparent';
        b.style.borderColor = c.val ? c.val[2] : 'currentColor';
        if (!c.val) b.textContent = '=';
      } else {
        b.style.background = c.val;
      }
      b.addEventListener('click', function () {
        etat[cle] = c.val;
        appliquerCouleurs();
        $$('.coul-case', ligne).forEach(function (a) { a.removeAttribute('data-choisi'); });
        b.setAttribute('data-choisi', '');
      });
      var dejaChoisi = cle === 'pied'
        ? JSON.stringify(etat.pied) === JSON.stringify(c.val)
        : etat[cle] === c.val;
      if (dejaChoisi) b.setAttribute('data-choisi', '');
      ligne.appendChild(b);
    });
    bloc.appendChild(ligne);
    return bloc;
  }

  var panneauCouleurs = document.createElement('div');
  panneauCouleurs.className = 'coul-panneau';
  var entete = document.createElement('p');
  entete.className = 'coul-entete';
  entete.textContent = 'Couleurs';
  panneauCouleurs.appendChild(entete);
  panneauCouleurs.appendChild(rangee('Fond', FONDS, 'fond'));
  panneauCouleurs.appendChild(rangee('Texte', TEXTES, 'texte'));
  panneauCouleurs.appendChild(rangee('Accent', ACCENTS, 'accent'));
  panneauCouleurs.appendChild(rangee('Pied de page et contact', PIEDS, 'pied'));

  // ⚠️ Un outil de couleurs qui laisse rendre le site illisible SANS RIEN DIRE
  // est un piege. On mesure le contraste du texte sur le fond et on l'affiche :
  // en dessous de 4,5 pour 1, le texte courant n'est plus lisible.
  var mesure = document.createElement('p');
  mesure.className = 'coul-mesure';
  panneauCouleurs.appendChild(mesure);

  function majContraste() {
    var r = contraste(etat.texte, etat.fond);
    mesure.textContent = 'Contraste texte / fond : ' + r.toFixed(1) + ':1'
      + (r < 4.5 ? ' - illisible' : r < 7 ? ' - correct' : ' - confortable');
    mesure.setAttribute('data-alerte', r < 4.5 ? '' : null);
    if (r >= 4.5) mesure.removeAttribute('data-alerte');
  }

  var retablir = document.createElement('button');
  retablir.type = 'button';
  retablir.className = 'coul-retablir';
  retablir.textContent = 'Revenir aux couleurs d’origine';
  retablir.addEventListener('click', function () {
    etat = Object.assign({}, DEFAUTS);
    appliquerCouleurs();
    $$('.coul-case', panneauCouleurs).forEach(function (a) { a.removeAttribute('data-choisi'); });
    $$('.coul-rangee', panneauCouleurs).forEach(function (r, i) {
      var premier = r.querySelector('.coul-case');
      if (premier) premier.setAttribute('data-choisi', '');
    });
  });
  panneauCouleurs.appendChild(retablir);

  var boutonCouleurs = document.createElement('button');
  boutonCouleurs.type = 'button';
  boutonCouleurs.className = 'coul-bouton';
  boutonCouleurs.setAttribute('aria-expanded', 'false');
  boutonCouleurs.setAttribute('aria-label', 'Essayer d’autres couleurs');
  boutonCouleurs.innerHTML = '<span aria-hidden="true"></span>';

  boutonCouleurs.addEventListener('click', function () {
    var ouvert = panneauCouleurs.hasAttribute('data-ouvert');
    if (ouvert) panneauCouleurs.removeAttribute('data-ouvert');
    else panneauCouleurs.setAttribute('data-ouvert', '');
    boutonCouleurs.setAttribute('aria-expanded', String(!ouvert));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panneauCouleurs.hasAttribute('data-ouvert')) {
      panneauCouleurs.removeAttribute('data-ouvert');
      boutonCouleurs.setAttribute('aria-expanded', 'false');
      boutonCouleurs.focus();
    }
  });

  /* ---------------------------------------------------------------------
     Le style des deux outils. Pose ici pour que les demonstrations n'aient
     rien a savoir de leur existence.
     --------------------------------------------------------------------- */
  var styleOutils = document.createElement('style');
  styleOutils.textContent = [
    '.coul-bouton{position:fixed;right:18px;top:142px;z-index:70;width:46px;height:46px;',
    ' border:1px solid var(--trait-fort);background:var(--encre);cursor:pointer;display:grid;place-items:center}',
    '.coul-bouton span{width:19px;height:19px;border-radius:50%;',
    ' background:linear-gradient(135deg,var(--halo) 0 50%,var(--ivoire) 50% 100%);display:block}',
    '.coul-bouton:hover{border-color:var(--ivoire)}',
    '.coul-panneau{position:fixed;right:18px;top:196px;z-index:70;width:min(292px,calc(100vw - 36px));',
    ' max-height:min(70vh,600px);overflow-y:auto;background:var(--encre);',
    ' border:1px solid var(--trait-fort);padding:14px;display:none;color:var(--ivoire)}',
    '.coul-panneau[data-ouvert]{display:block}',
    '.coul-entete,.coul-rangee p{font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--sourd);margin:0}',
    '.coul-entete{padding-bottom:12px}',
    '.coul-rangee{margin-top:14px}',
    '.coul-ligne{display:flex;flex-wrap:wrap;gap:7px;margin-top:9px}',
    '.coul-case{width:27px;height:27px;border:1px solid var(--trait-fort);cursor:pointer;padding:0;',
    ' font-size:12px;line-height:1;color:var(--sourd);background:none}',
    '.coul-case:hover{transform:scale(1.12)}',
    '.coul-case[data-choisi]{outline:2px solid var(--ivoire);outline-offset:2px}',
    '.coul-mesure{margin-top:16px;font-size:11px;line-height:1.4;color:var(--sourd)}',
    '.coul-mesure[data-alerte]{color:#B3261E;font-weight:500}',
    '.coul-retablir{margin-top:12px;width:100%;padding:9px;background:none;cursor:pointer;',
    ' border:1px solid var(--trait);color:var(--ivoire);font-size:11px;letter-spacing:.1em}',
    '.coul-retablir:hover{border-color:var(--ivoire)}',
    // ⚠️ Au telephone, en haut a droite, les deux boutons se posent SUR le
    // titre. Ils descendent en bas a gauche - le bas droit est occupe par la
    // pastille de demonstration.
    '@media(max-width:760px){',
    ' .coul-bouton{top:auto;right:auto;left:14px;bottom:62px;width:42px;height:42px}',
    ' .coul-panneau{top:auto;right:auto;left:14px;bottom:110px;max-height:52vh}',
    '}',
  ].join('\n');
  document.head.appendChild(styleOutils);

  // Les couleurs sont appliquees dans TOUS les cas - y compris dans le cadre
  // d'apercu, puisque c'est le rendu choisi qu'on veut y voir. Seuls les
  // boutons disparaissent.
  appliquerCouleurs();
  if (!dansApercu) {
    document.body.appendChild(boutonCouleurs);
    document.body.appendChild(panneauCouleurs);
  }
})();
