/* =========================================================================
   APERCU TELEPHONE / BUREAU
   Un bouton a droite qui montre le site tel qu'il s'affiche sur l'autre
   appareil : le rendu telephone depuis un ordinateur, et le rendu bureau
   depuis un telephone.

   ⚠️ Ca passe FORCEMENT par un iframe, et c'est le point technique de ce
   fichier. Les media queries repondent au VIEWPORT, pas a la largeur d'un
   conteneur : mettre la page dans une boite de 390 px sur un ecran de 1440
   afficherait la mise en page bureau retrecie - exactement le contraire de ce
   qu'on veut voir. Un iframe a son propre viewport, donc son propre CSS.

   ⚠️ Fichier de DEMONSTRATION. Il n'a rien a faire dans le site livre : on
   retire la ligne <script> et il ne reste rien.
   ========================================================================= */
(function () {
  'use strict';

  // La page affichee DANS le cadre ne doit pas reproposer l'outil : sinon on
  // peut ouvrir un apercu dans l'apercu, indefiniment.
  if (new URLSearchParams(location.search).has('apercu')) {
    document.documentElement.setAttribute('data-dans-apercu', '');
    return;
  }

  var TAILLES = {
    mobile: { l: 390, h: 844, nom: 'Téléphone' },
    bureau: { l: 1440, h: 900, nom: 'Bureau' },
  };

  var style = document.createElement('style');
  style.textContent = [
    /* ⚠️ Couleurs FIXES, jamais celles du site. Les deux systemes n'emploient
       pas les memes noms : `--encre` est le FOND chez l'un et le TEXTE chez
       l'autre. En heritant, le bouton sortait en aplat sombre sur sombre - un
       rectangle plein au milieu du decor (vu a la capture). Un outil de
       demonstration ne doit rien devoir aux jetons de son hote. */
    '.ap-bouton{position:fixed;right:18px;top:196px;z-index:80;width:46px;height:46px;',
    ' border:1px solid rgba(0,0,0,.22);background:#FFFFFFEE;backdrop-filter:blur(6px);',
    ' color:#222;cursor:pointer;display:grid;place-items:center;',
    ' box-shadow:0 10px 26px -14px rgba(0,0,0,.5)}',
    '.ap-bouton:hover{background:#222;color:#fff;border-color:#222}',
    '.ap-bouton svg{width:20px;height:20px}',
    '.ap-voile{position:fixed;inset:0;z-index:200;background:rgba(20,18,15,.92);',
    ' display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:20px}',
    '.ap-voile[data-ouvert]{display:flex}',
    '.ap-barre{display:flex;gap:8px;align-items:center}',
    '.ap-barre button{padding:9px 18px;border-radius:100px;border:1px solid rgba(255,255,255,.28);',
    ' background:none;color:#F4EFE7;cursor:pointer;font:400 11px/1 system-ui,sans-serif;',
    ' letter-spacing:.18em;text-transform:uppercase}',
    '.ap-barre button[aria-pressed="true"]{background:#F4EFE7;color:#141210;border-color:#F4EFE7}',
    '.ap-barre .ap-fermer{margin-left:10px}',
    '.ap-scene{flex:1;width:100%;display:grid;place-items:center;min-height:0}',
    /* Le cadre est mis a l'echelle par transform : l'iframe garde sa vraie
       largeur - donc ses vraies media queries - et on la regarde en plus petit. */
    '.ap-cadre{transform-origin:center center;box-shadow:0 40px 90px -30px rgba(0,0,0,.9);background:#fff}',
    '.ap-cadre[data-mode="mobile"]{border-radius:34px;overflow:hidden;border:9px solid #17140f}',
    '.ap-cadre[data-mode="bureau"]{border-radius:6px;overflow:hidden;border:1px solid rgba(255,255,255,.2)}',
    '.ap-cadre iframe{display:block;border:0;background:#fff}',
    '.ap-note{color:rgba(244,239,231,.6);font:400 11px/1.5 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}',
    '@media(max-width:760px){.ap-bouton{top:auto;right:auto;left:14px;bottom:110px;width:42px;height:42px}}',
  ].join('\n');
  document.head.appendChild(style);

  var ICONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">'
    + '<rect x="2" y="4" width="13" height="10" rx="1.5"/><path d="M5.5 18h6"/>'
    + '<rect x="16.5" y="9" width="5.5" height="11" rx="1.4"/></svg>';

  var bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.className = 'ap-bouton';
  bouton.setAttribute('aria-label', 'Voir le rendu téléphone ou bureau');
  bouton.innerHTML = ICONE;

  var voile = document.createElement('div');
  voile.className = 'ap-voile';
  voile.innerHTML = '<div class="ap-barre">'
    + '<button type="button" data-mode="mobile">Téléphone</button>'
    + '<button type="button" data-mode="bureau">Bureau</button>'
    + '<button type="button" class="ap-fermer">Fermer</button>'
    + '</div><div class="ap-scene"><div class="ap-cadre"><iframe title="Aperçu"></iframe></div></div>'
    + '<p class="ap-note"></p>';

  var cadre = voile.querySelector('.ap-cadre');
  var cadreIframe = voile.querySelector('iframe');
  var note = voile.querySelector('.ap-note');
  var mode = null;

  function adresse() {
    var u = new URL(location.href);
    u.searchParams.set('apercu', '1');
    return u.toString();
  }

  function poser(nouveau) {
    mode = nouveau;
    var t = TAILLES[mode];
    cadre.setAttribute('data-mode', mode);
    cadreIframe.width = t.l;
    cadreIframe.height = t.h;
    cadreIframe.style.width = t.l + 'px';
    cadreIframe.style.height = t.h + 'px';
    if (cadreIframe.getAttribute('src') !== adresse()) cadreIframe.src = adresse();
    voile.querySelectorAll('.ap-barre button[data-mode]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === mode));
    });
    ajuster();
  }

  // On met le cadre a l'echelle pour qu'il tienne dans la fenetre, jamais
  // au-dela de 1 : agrandir un rendu telephone ne montrerait rien de vrai.
  function ajuster() {
    if (!mode) return;
    var t = TAILLES[mode];
    var scene = voile.querySelector('.ap-scene').getBoundingClientRect();
    var bord = mode === 'mobile' ? 18 : 2;
    var k = Math.min(1, (scene.width - 24) / (t.l + bord), (scene.height - 12) / (t.h + bord));
    cadre.style.transform = 'scale(' + Math.max(0.2, k).toFixed(3) + ')';
    note.textContent = t.nom + ' - ' + t.l + ' x ' + t.h + ' px'
      + (k < 0.999 ? ' (affiché à ' + Math.round(k * 100) + ' %)' : '');
  }

  bouton.addEventListener('click', function () {
    voile.setAttribute('data-ouvert', '');
    // On propose d'emblee l'AUTRE appareil que celui qu'on utilise : c'est ce
    // qu'on vient chercher en cliquant.
    poser(window.innerWidth < 900 ? 'bureau' : 'mobile');
  });
  voile.querySelectorAll('.ap-barre button[data-mode]').forEach(function (b) {
    b.addEventListener('click', function () { poser(b.getAttribute('data-mode')); });
  });
  voile.querySelector('.ap-fermer').addEventListener('click', function () {
    voile.removeAttribute('data-ouvert');
    bouton.focus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && voile.hasAttribute('data-ouvert')) {
      voile.removeAttribute('data-ouvert');
      bouton.focus();
    }
  });
  window.addEventListener('resize', ajuster);

  document.body.appendChild(bouton);
  document.body.appendChild(voile);
})();
