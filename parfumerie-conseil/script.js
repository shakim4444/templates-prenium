/* =========================================================================
   EFFLUVE - le moteur de l'experience
   =========================================================================
   Le site n'a PAS de defilement. Tout est un ETAT dans la meme fenetre :
   l'accroche, le questionnaire, la selection, l'explorateur de familles et la
   prise de contact. On ne change pas de page, on change de scene.

   ⚠️ Les photos sont les VRAIES photos produit (dossier `photos/`, champ
   `photo` de parfums.js). Le flacon dessine ne sert plus que de repli, pour
   les references dont on n'a pas encore l'image : mieux vaut un dessin coherent
   qu'un cadre vide.
   ========================================================================= */
import { PARFUMS, FAMILLES } from './parfums.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const doux = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* -------------------------------------------------------------------------
   1. Le visuel d'un parfum : sa photo, ou un flacon dessine en repli
   ------------------------------------------------------------------------- */
function flacon(teinte) {
  return `<svg viewBox="0 0 60 92" aria-hidden="true">
    <rect x="23" y="1" width="14" height="11" rx="2.5" fill="#43162A"/>
    <rect x="25" y="11.5" width="10" height="4.5" rx="1" fill="#C09048"/>
    <rect x="26.5" y="15" width="7" height="7" fill="${teinte}" opacity=".55"/>
    <path d="M26.5 21c0 3-3.5 4-8 7-3.4 2.2-4.5 4.6-4.5 8v46a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6V36c0-3.4-1.1-5.8-4.5-8-4.5-3-8-4-8-7z" fill="${teinte}" opacity=".92"/>
    <path d="M26.5 21c0 3-3.5 4-8 7-3.4 2.2-4.5 4.6-4.5 8v46a6 6 0 0 0 6 6h20a6 6 0 0 0 6-6V36c0-3.4-1.1-5.8-4.5-8-4.5-3-8-4-8-7z" fill="none" stroke="#43162A" stroke-opacity=".24" stroke-width="1.2"/>
    <rect x="18" y="40" width="6" height="34" rx="3" fill="#fff" opacity=".34"/>
  </svg>`;
}
const visuel = (p, classe = '') => (p.photo
  ? `<img src="${p.photo}" alt="${p.nom} - ${p.maison}" loading="lazy">`
  : `<span class="${classe || 'flacon-mini'}">${flacon(p.teinte)}</span>`);

/* -------------------------------------------------------------------------
   2. Les etats
   ⚠️ La transition est APPUYEE et se joue en deux temps : le sortant recule,
   floute et s'efface pendant que l'entrant monte. Un simple fondu croise
   passait inapercu - or c'est ce basculement qui dit au visiteur qu'il a
   changé de lieu sans changer de page.
   ------------------------------------------------------------------------- */
const nuage = $('#nuage');
const boutonRetour = $('#retour');
let etatCourant = 'accroche';
const pile = [];
let enTransition = false;

function montrer(nom, { empiler = true, sens = 'montee' } = {}) {
  if (nom === etatCourant || enTransition) return;
  const sortant = $(`.etat[data-etat="${etatCourant}"]`);
  const entrant = $(`.etat[data-etat="${nom}"]`);
  if (!entrant) return;

  enTransition = true;
  // Le sens du mouvement. Par defaut on monte du bas - c'est le parcours
  // normal. « descente » sert quand l'ecran arrive PAR-DESSUS ce qu'on
  // regardait (le contact ouvert depuis une fiche parfum) : un volet qu'on
  // tire, pas une page suivante.
  // ⚠️ La classe est retiree de TOUS les etats avant d'etre posee : sans ca,
  // un ecran garde son sens d'entree pour toujours et le mouvement devient
  // incoherent des la deuxieme visite.
  $$('.etat').forEach((e) => e.classList.remove('descend'));
  if (sens === 'descente') entrant.classList.add('descend');
  if (empiler) pile.push(etatCourant);
  etatCourant = nom;

  // Le nuage recule : c'est ce petit mouvement de fond qui fait basculer
  // toute la scene, et pas seulement le texte.
  nuage.classList.add('recul');
  // Sur les ecrans remplis, il s'efface presque entierement - sinon les
  // flacons passent par-dessus les cartes et les titres.
  nuage.classList.toggle('efface', ['familles', 'resultat', 'contact'].includes(nom));

  if (sortant) { sortant.classList.add('sortant'); sortant.classList.remove('actif'); }
  const attente = doux ? 260 : 0;
  setTimeout(() => {
    if (sortant) sortant.classList.remove('sortant');
    entrant.classList.add('actif');
    entrant.scrollTop = 0;
    // On arrive en haut d'un nouvel ecran : l'en-tete redescend. Sans ca, on
    // change de scene et le sceau reste invisible sans raison.
    if (entete) entete.classList.remove('remontee');
    nuage.classList.remove('recul');
    majRetour();
    enTransition = false;
    const titre = $('h1, h2', entrant);
    if (titre) { titre.setAttribute('tabindex', '-1'); titre.focus({ preventScroll: true }); }
    if (nom === 'familles') ajusterTitreFamilles();
  }, attente);
}

/* L'en-tete s'efface quand on descend, revient quand on remonte.
   ⚠️ Le defilement n'appartient PAS a la fenetre : chaque etat gere le sien
   (`.etat { overflow-y: auto }`), et la fiche parfum le sien. Ecouter
   `window.scroll` ne recevrait donc jamais rien. On ecoute en phase de
   CAPTURE sur le document, seule facon d'attraper un evenement `scroll`, qui
   ne remonte pas la hierarchie.
   ⚠️ On ne remonte l'en-tete que s'il y a VRAIMENT de quoi defiler : sur un
   ecran qui tient dans la fenetre, la faire disparaitre serait un mouvement
   sans cause, et le visiteur perdrait le sceau et le bouton de contact. */
const entete = $('.entete');
const dernierHaut = new WeakMap();
document.addEventListener('scroll', (e) => {
  const zone = e.target;
  if (!zone || !zone.classList || !entete) return;
  if (!zone.classList.contains('etat') && !zone.classList.contains('fiche')) return;
  const course = zone.scrollHeight - zone.clientHeight;
  if (course < 60) { entete.classList.remove('remontee'); return; }
  const haut = zone.scrollTop;
  const avant = dernierHaut.get(zone) || 0;
  dernierHaut.set(zone, haut);
  // Un seuil, sinon le moindre tremblement de doigt fait clignoter l'en-tete.
  if (Math.abs(haut - avant) < 6) return;
  entete.classList.toggle('remontee', haut > 56 && haut > avant);
}, true);

function majRetour() {
  const montrerRetour = etatCourant !== 'accroche';
  boutonRetour.hidden = !montrerRetour;
  // On relance l'animation d'entree a chaque apparition.
  if (montrerRetour) {
    boutonRetour.style.animation = 'none';
    void boutonRetour.offsetWidth;
    boutonRetour.style.animation = '';
  }
}

function revenir() {
  // Depuis le questionnaire, « Retour » recule d'une QUESTION tant qu'il en
  // reste derriere - et seulement une fois a la premiere question, il ramene
  // a l'accueil. C'est ce que le visiteur attend a cet endroit.
  if (etatCourant === 'questions' && historique.length) { reculerQuestion(); return; }

  // Contact ouvert DEPUIS une fiche parfum : on remet le visiteur exactement
  // ou il etait, c'est-a-dire sur SA fiche - pas sur la grille, ou il devrait
  // retrouver son parfum parmi cent vingt.
  if (ficheEnAttente && etatCourant === 'contact') {
    const p = ficheEnAttente;
    ficheEnAttente = null;
    montrer(pile.pop() || 'accroche', { empiler: false });
    ouvrirFiche(p);
    return;
  }

  const cible = pile.pop() || 'accroche';
  montrer(cible, { empiler: false });
}

boutonRetour.addEventListener('click', revenir);
$$('[data-aller]').forEach((b) => b.addEventListener('click', (e) => {
  e.preventDefault();
  montrer(b.getAttribute('data-aller'));
}));

/* -------------------------------------------------------------------------
   3. Le nuage de flacons
   ------------------------------------------------------------------------- */
const fioles = new Map();

function semerNuage() {
  const frag = document.createDocumentFragment();
  PARFUMS.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'fiole';
    // Spirale plutot que hasard : le hasard fait des paquets et des trous.
    const angle = i * 2.399963;
    const rayon = 0.16 + 0.42 * Math.sqrt(i / PARFUMS.length);
    el.style.left = (50 + Math.cos(angle) * rayon * 118) + '%';
    el.style.top = (50 + Math.sin(angle) * rayon * 112) + '%';
    el.style.setProperty('--e', (0.5 + ((i * 37) % 65) / 100).toFixed(2));
    // Le nuage porte les VRAIES photos, DETOUREES (demande patron 2026-08-05 :
    // « qu'on enleve le fond blanc pour qu'ils paraissent transparents »).
    // ⚠️ Ce sont les WebP a canal alpha de `photos-nuage/`, pas les JPEG de
    // `photos/` : le fond blanc du studio n'existe plus, et le fichier pese
    // trois fois moins - ce qui compte quand la scene en charge cent vingt.
    // ⚠️ `decoding="async"` et `loading="lazy"` ne sont pas decoratifs : sans
    // eux, le navigateur decode toutes les images avant de peindre la premiere,
    // et l'accroche apparait avec une seconde de retard.
    // Le repli reste le flacon dessine pour les references sans photo.
    const dedans = p.photo
      ? `<img src="${p.photo.replace('./photos/', './photos-nuage/').replace('.jpg', '.webp')}" alt="" loading="lazy" decoding="async">`
      : flacon(p.teinte);

    // Chaque flacon a SA course, SA cadence et SON inclinaison. Une seule
    // animation partagee fait respirer les cent vingt flacons en cadence : on
    // ne voit plus des objets qui flottent, on voit un decor qui pulse.
    // Les valeurs viennent de l'index, pas d'un tirage au sort : le nuage doit
    // se redessiner a l'identique d'un chargement a l'autre.
    const t = (5.5 + ((i * 23) % 55) / 10).toFixed(1);      // 5,5 s a 11 s
    const dy = (9 + ((i * 17) % 13)).toFixed(0);            // 9 a 21 px
    const dx = (3 + ((i * 11) % 8)).toFixed(0);             // 3 a 10 px
    const r = (1.2 + ((i * 13) % 34) / 10).toFixed(1);      // 1,2 a 4,5 degres
    // Un flacon sur deux part dans l'autre sens : sans ca, tout le nuage
    // derive du meme cote et l'ensemble a l'air de glisser.
    const sens = i % 2 ? 1 : -1;
    el.innerHTML = `<span style="--t:${t}s;--dy:${dy}px;--dx:${dx * sens}px;--r:${r * sens}deg;`
      + `animation-delay:${((i % 40) * -0.35).toFixed(2)}s">${dedans}</span>`;
    fioles.set(p.id, el);
    frag.appendChild(el);
  });
  nuage.appendChild(frag);
}

function afficherNuage(liste) {
  const gardes = new Set(liste.map((p) => p.id));
  fioles.forEach((el, id) => el.classList.toggle('hors', !gardes.has(id)));
}

/* -------------------------------------------------------------------------
   4. Le questionnaire
   Chaque option donne des POINTS, elle ne filtre pas : un filtre dur tombe a
   zero resultat des qu'on croise trois criteres, ou reste bloque a quarante.
   Avec un score, on garde les meilleurs et on decide combien il en reste.
   ------------------------------------------------------------------------- */
const egal = (champ, valeur, points = 2) => (p) => (p[champ] === valeur ? points : 0);
const trait = (mot, points = 2) => (p) => (p.traits.includes(mot) ? points : 0);
const famille = (cle, points = 3) => (p) => (p.famille === cle ? points : 0);
const note = (mot, points = 2) => (p) => {
  const tout = [...p.notes.tete, ...p.notes.coeur, ...p.notes.fond].join(' ').toLowerCase();
  return tout.includes(mot.toLowerCase()) ? points : 0;
};
const somme = (...fns) => (p) => fns.reduce((t, f) => t + f(p), 0);

const QUESTIONS = [
  {
    titre: 'Ce qu’on doit retenir de vous',
    aide: 'Il n’y a pas de bonne réponse : on cherche un tempérament, pas une préférence.',
    choix: [
      { nom: 'De la lumière', detail: 'Clair, net, immédiat', score: somme(trait('lumineux', 3), trait('solaire', 2), trait('propre', 2), trait('leger', 1)) },
      { nom: 'De la chaleur', detail: 'Enveloppant, proche de la peau', score: somme(trait('chaud', 3), trait('enveloppant', 3), trait('doux', 2), trait('intime', 2)) },
      { nom: 'Du caractère', detail: 'On vous remarque avant de vous voir', score: somme(trait('affirme', 3), trait('opulent', 3), trait('tenace', 2)) },
      { nom: 'De la retenue', detail: 'Discret, mais on s’en souvient', score: somme(trait('sobre', 3), trait('minimal', 3), trait('elegant', 2), trait('classique', 1)) },
    ],
  },
  {
    titre: 'À quel moment le portez-vous ?',
    aide: 'Un parfum de journée et un parfum de soirée ne se construisent pas pareil.',
    choix: [
      { nom: 'La journée', detail: 'Travail, courses, rendez-vous', score: somme(egal('moment', 'jour', 3), egal('moment', 'les-deux', 2)) },
      { nom: 'Le soir', detail: 'Dîners, sorties, occasions', score: somme(egal('moment', 'soir', 3), egal('moment', 'les-deux', 2)) },
      { nom: 'Les deux', detail: 'Un seul flacon pour tout', score: egal('moment', 'les-deux', 3) },
    ],
  },
  {
    titre: 'La saison qui compte',
    aide: 'Sous notre climat, la chaleur amplifie tout. C’est le critère le plus concret de la liste.',
    choix: [
      { nom: 'La saison chaude', detail: 'Il doit tenir sans devenir lourd', score: (p) => (p.saisons.includes('ete') ? 3 : 0) },
      { nom: 'La saison fraîche', detail: 'Il peut se permettre d’être dense', score: (p) => (p.saisons.includes('hiver') ? 3 : 0) },
      { nom: 'Toute l’année', detail: 'Un parfum qui ne dépend pas du thermomètre', score: (p) => (p.saisons.includes('mi-saison') ? 3 : 0) },
    ],
  },
  {
    titre: 'Votre effluve',
    aide: 'Le effluve, c’est ce qui reste dans la pièce après vous.',
    choix: [
      { nom: 'Sur ma peau', detail: 'Il faut s’approcher pour le sentir', score: (p) => (p.force <= 2 ? 3 : p.force === 3 ? 1 : 0) },
      { nom: 'À bonne distance', detail: 'Présent sans occuper la pièce', score: (p) => (p.force === 3 || p.force === 4 ? 3 : 1) },
      { nom: 'Qu’on le remarque', detail: 'Il annonce votre arrivée', score: (p) => (p.force === 5 ? 3 : p.force === 4 ? 2 : 0) },
    ],
  },
  {
    titre: 'Une matière vous attire',
    aide: 'Choisissez à l’instinct, sans réfléchir à ce que ça donnera.',
    choix: [
      { nom: 'La rose', detail: 'La fleur, sous toutes ses formes', score: somme(note('rose', 3), famille('floral', 1)) },
      { nom: 'Le bois', detail: 'Cèdre, santal, vétiver', score: somme(famille('boise', 3), note('santal', 1), note('vetiver', 1), note('cedre', 1)) },
      { nom: 'La vanille', detail: 'Douce, gourmande, chaude', score: somme(note('vanille', 3), famille('gourmand', 2)) },
      { nom: 'L’agrume', detail: 'Bergamote, citron, mandarine', score: somme(famille('frais', 2), note('bergamote', 2), note('citron', 2)) },
      { nom: 'L’oud', detail: 'Le bois d’agar, dense et rare', score: somme(famille('oud', 3), note('oud', 2)) },
      { nom: 'Le cuir', detail: 'Cuir, tabac, fumée', score: somme(famille('cuir', 3), note('tabac', 2), trait('fume', 2)) },
    ],
  },
  {
    titre: 'Pour qui ?',
    aide: 'Une indication, pas une règle : une grande partie de la collection se porte indifféremment.',
    choix: [
      { nom: 'Pour elle', detail: '', score: somme(egal('genre', 'feminin', 3), egal('genre', 'mixte', 2)) },
      { nom: 'Pour lui', detail: '', score: somme(egal('genre', 'masculin', 3), egal('genre', 'mixte', 2)) },
      { nom: 'Sans étiquette', detail: 'Les compositions mixtes', score: egal('genre', 'mixte', 3) },
    ],
  },
  {
    titre: 'L’occasion',
    aide: 'Un parfum de tous les jours et un parfum de fête ne se choisissent pas ensemble.',
    choix: [
      { nom: 'Tous les jours', detail: 'Il doit pouvoir se porter au bureau', score: somme(trait('polyvalent', 3), trait('quotidien', 3), trait('propre', 2), trait('leger', 2)) },
      { nom: 'Un rendez-vous', detail: 'Il doit faire son effet, sans en faire trop', score: somme(trait('elegant', 3), trait('seducteur', 3), trait('raffine', 2)) },
      { nom: 'Une soirée', detail: 'Il a le droit de prendre de la place', score: somme(trait('opulent', 3), trait('affirme', 2), egal('moment', 'soir', 2)) },
      { nom: 'Un cadeau', detail: 'Il doit plaire sans connaître la personne', score: somme(trait('classique', 3), trait('doux', 2), trait('elegant', 2)) },
    ],
  },
  {
    titre: 'Et pour finir',
    aide: 'La dernière question départage des parfums déjà très proches.',
    choix: [
      { nom: 'Un classique', detail: 'Une valeur sûre, connue et reconnue', score: somme(trait('classique', 3), (p) => (p.annee < 2000 ? 2 : 0)) },
      { nom: 'Quelque chose de moderne', detail: 'Sorti ces dix dernières années', score: somme(trait('moderne', 3), (p) => (p.annee >= 2010 ? 2 : 0)) },
      { nom: 'Quelque chose de rare', detail: 'Peu porté, difficile à trouver', score: somme(trait('rare', 3), trait('original', 3)) },
    ],
  },
];

function echelle(depart, etapes, arrivee = 10) {
  const l = [];
  for (let k = 1; k <= etapes; k += 1) {
    l.push(Math.max(arrivee, Math.round(arrivee * Math.pow(depart / arrivee, (etapes - k) / etapes))));
  }
  return l;
}
const PALIERS = echelle(PARFUMS.length, QUESTIONS.length);

let etape = 0;
let scores = new Map();
let enLice = PARFUMS.slice();
const historique = [];

function poserQuestion() {
  const q = QUESTIONS[etape];
  $('#q-numero').textContent = String(etape + 1);
  $('#q-total').textContent = String(QUESTIONS.length);
  $('#q-jauge').style.width = ((etape / QUESTIONS.length) * 100) + '%';
  $('#q-restants').textContent = String(enLice.length);
  $('#q-titre').textContent = q.titre;
  $('#q-aide').textContent = q.aide;

  const zone = $('#q-choix');
  zone.innerHTML = '';
  q.choix.forEach((c, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.style.animation = `monte .6s var(--sortie) both ${(0.05 + i * 0.06).toFixed(2)}s`;
    b.innerHTML = '<b></b>' + (c.detail ? '<span></span>' : '');
    b.querySelector('b').textContent = c.nom;
    if (c.detail) b.querySelector('span').textContent = c.detail;
    b.addEventListener('click', () => repondre(c));
    zone.appendChild(b);
  });
}

function repondre(choix) {
  historique.push({ enLice: enLice.slice(), scores: new Map(scores) });
  for (const p of enLice) scores.set(p.id, (scores.get(p.id) || 0) + choix.score(p));
  enLice = enLice.slice()
    .sort((x, y) => (scores.get(y.id) - scores.get(x.id)) || (y.annee - x.annee) || x.nom.localeCompare(y.nom))
    .slice(0, PALIERS[etape]);

  afficherNuage(enLice);
  etape += 1;

  if (etape < QUESTIONS.length) poserQuestion();
  else { $('#q-jauge').style.width = '100%'; montrerResultat(); }
}

function reculerQuestion() {
  const p = historique.pop();
  enLice = p.enLice; scores = p.scores; etape -= 1;
  afficherNuage(enLice);
  poserQuestion();
  majRetour();
}

/* -------------------------------------------------------------------------
   5. La selection
   ------------------------------------------------------------------------- */
function carteParfum(p, i = 0) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'r-carte';
  b.style.animation = `monte .7s var(--sortie) both ${(0.06 + i * 0.045).toFixed(2)}s`;
  b.innerHTML = `<span class="r-visuel">${visuel(p)}</span>`
    + '<span class="r-maison"></span><span class="r-nom"></span><span class="r-fam"></span>';
  b.querySelector('.r-maison').textContent = p.maison;
  b.querySelector('.r-nom').textContent = p.nom;
  b.querySelector('.r-fam').textContent = (FAMILLES.find((f) => f.cle === p.famille) || {}).nom || '';
  b.addEventListener('click', () => ouvrirFiche(p));
  return b;
}

function remplirGrille(liste) {
  const g = $('#r-grille');
  g.innerHTML = '';
  liste.forEach((p, i) => g.appendChild(carteParfum(p, i)));
}

function montrerResultat() {
  remplirGrille(enLice);
  const compte = enLice.reduce((t, p) => { t[p.famille] = (t[p.famille] || 0) + 1; return t; }, {});
  const dominante = Object.entries(compte).sort((x, y) => y[1] - x[1])[0];
  const nomFam = ((FAMILLES.find((f) => f.cle === dominante[0]) || {}).nom || '').toLowerCase();
  $('#r-label').textContent = 'La sélection';
  $('#r-titre').textContent = 'Votre parfum signature';
  // Deux lignes, pas trois : sur un ecran qui doit tout contenir, chaque ligne
  // de texte se paie en hauteur de grille.
  $('#r-texte').textContent = 'Dix parfums sur ' + PARFUMS.length + ', retenus d’après vos réponses. '
    + 'Votre terrain dominant est ' + nomFam + '. Ouvrez-en un pour voir sa composition.';
  afficherNuage(enLice);
  montrer('resultat');
}

/* -------------------------------------------------------------------------
   6. La fiche
   ------------------------------------------------------------------------- */
const fiche = $('#fiche');
const commander = $('#fiche-commander');
const LIEN_COMMANDE = commander.getAttribute('href');
let rendu = null;
let parfumAffiche = null;

function ouvrirFiche(p) {
  rendu = document.activeElement;
  parfumAffiche = p;
  $('#fiche-visuel').innerHTML = p.photo
    ? `<img src="${p.photo}" alt="${p.nom} - ${p.maison}">`
    : `<span class="flacon-grand">${flacon(p.teinte)}</span>`;
  $('#fiche-maison').textContent = p.maison;
  $('#fiche-nom').textContent = p.nom;

  const fam = FAMILLES.find((f) => f.cle === p.famille) || {};
  $('#fiche-meta').innerHTML = [['Année', p.annee], ['Parfumeur', p.parfumeur], ['Famille', fam.nom || p.famille]]
    .map(([t, v]) => '<div><dt>' + t + '</dt><dd>' + v + '</dd></div>').join('');

  $('#fiche-texte').textContent = p.texte;
  $('#fiche-ambiance').textContent = '« ' + p.ambiance + ' »';
  $('#fiche-pyramide').innerHTML = [
    ['Notes de tête', p.notes.tete], ['Notes de cœur', p.notes.coeur], ['Notes de fond', p.notes.fond],
  ].map(([t, n]) => '<div><dt>' + t + '</dt><dd>' + n.join(' · ') + '</dd></div>').join('');

  // ⚠️ On repart TOUJOURS du lien d'origine : ajouter le message au lien
  // courant empilait trois messages au troisieme parfum ouvert.
  commander.href = LIEN_COMMANDE + '?text='
    + encodeURIComponent('Bonjour, je souhaite commander ' + p.nom + ' (' + p.maison + ').');

  fiche.classList.add('ouverte');
  $('#fiche-fermer').focus();
}

function fermerFiche() {
  fiche.classList.remove('ouverte');
  if (rendu && rendu.focus) rendu.focus();
}

/* « Contacter la boutique » depuis une fiche parfum.
   ⚠️ Le visiteur ne QUITTE pas son parfum, il va poser une question DESSUS :
   on retient donc lequel etait ouvert, et le bouton de retour le ramene a sa
   fiche - pas a la grille, ou il devrait le retrouver.
   L'ecran de contact descend du HAUT (demande patron 2026-08-05) : il vient
   par-dessus la fiche, comme un volet qu'on tire, au lieu de monter du bas
   comme les etats du parcours normal. */
let ficheEnAttente = null;

$('#fiche-contact').addEventListener('click', () => {
  ficheEnAttente = parfumAffiche;
  fermerFiche();
  montrer('contact', { sens: 'descente' });
});

/* -------------------------------------------------------------------------
   7. L'explorateur de familles
   ------------------------------------------------------------------------- */
function batirFamilles() {
  const g = $('#grille-familles');
  FAMILLES.forEach((f, i) => {
    const liste = PARFUMS.filter((p) => p.famille === f.cle);
    if (!liste.length) return;
    // On montre en priorite les parfums dont on a la VRAIE photo : une carte
    // de famille avec trois dessins et une photo se lit comme une erreur.
    const avecPhoto = liste.filter((p) => p.photo);
    const apercu = (avecPhoto.length >= 3 ? avecPhoto : liste).slice(0, 3);

    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'famille';
    b.style.animation = `monte .7s var(--sortie) both ${(0.05 + i * 0.04).toFixed(2)}s`;
    b.innerHTML = '<span class="f-apercu" aria-hidden="true">'
      + apercu.map((p) => `<span style="background-image:url('${p.photo || ''}')"></span>`).join('')
      + '</span><span class="compte">' + liste.length + '</span><h3></h3><p></p>';
    b.querySelector('h3').textContent = f.nom;
    b.querySelector('p').textContent = f.texte;
    b.addEventListener('click', () => ouvrirFamille(f, liste));
    g.appendChild(b);
  });
}

function ouvrirFamille(f, liste) {
  const choix = liste.slice(0, 12);
  remplirGrille(choix);
  $('#r-label').textContent = 'La collection';
  $('#r-titre').textContent = f.nom;
  $('#r-texte').textContent = f.texte + ' ' + liste.length
    + ' parfums dans cette famille. Ouvrez-en un pour voir sa composition.';
  afficherNuage(liste);
  montrer('resultat');
}

/* Le titre des familles doit tenir sur UNE ligne : c'est ce qui fait remonter
   la grille. Une taille ecrite en dur ne peut pas convenir - la phrase est
   longue et la fenetre change de largeur. On mesure, on en deduit la taille. */
function ajusterTitreFamilles() {
  const h = $('#f-titre');
  if (!h) return;
  if (window.innerWidth < 900) { h.style.fontSize = ''; return; }
  const dispo = h.getBoundingClientRect().width;
  if (!dispo) return;
  h.style.fontSize = '100px';
  const r = document.createRange();
  r.selectNodeContents(h);
  const large = r.getBoundingClientRect().width;
  if (!large) { h.style.fontSize = ''; return; }
  h.style.fontSize = Math.max(20, Math.min(60, (100 * dispo * 0.97) / large)).toFixed(1) + 'px';
}

/* -------------------------------------------------------------------------
   8. Mise en route
   ------------------------------------------------------------------------- */
function recommencer() {
  etape = 0; scores = new Map(); enLice = PARFUMS.slice(); historique.length = 0;
  afficherNuage(enLice);
  poserQuestion();
  montrer('questions');
}

semerNuage();
afficherNuage(PARFUMS);
batirFamilles();

$('#commencer').addEventListener('click', recommencer);
$('#fiche-fermer').addEventListener('click', fermerFiche);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (fiche.classList.contains('ouverte')) fermerFiche();
  else if (etatCourant !== 'accroche') revenir();
});
$('#annee').textContent = String(new Date().getFullYear());

let redim;
window.addEventListener('resize', () => {
  clearTimeout(redim);
  redim = setTimeout(ajusterTitreFamilles, 160);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajusterTitreFamilles);
