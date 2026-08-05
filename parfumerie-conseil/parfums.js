/* =========================================================================
   EFFLUVE - la base de parfums
   =========================================================================
   C'est le moteur de toute l'experience : le questionnaire, la reduction en
   direct, les fiches et l'explorateur de familles lisent tous ce fichier.

   ⚠️ DONNEES A FAIRE VERIFIER PAR LA BOUTIQUE AVANT MISE EN LIGNE.
   Les maisons, annees, parfumeurs et notes ci-dessous sont ceux que la
   documentation publique rapporte, mais une pyramide olfactive varie d'une
   source a l'autre et certaines reformulations ont change la composition.
   Sur un site marchand, une note fausse est une reclamation client.

   ⚠️ AUCUNE PHOTO DE PRODUIT. Deux raisons, l'une juridique et l'autre
   technique :
     - les visuels officiels d'une maison sont proteges ; les afficher sur le
       site d'un revendeur sans accord n'est pas acquis (citer le nom d'un
       parfum qu'on vend, si) ;
     - cent photos qui tournent et se reorganisent en direct, c'est une
       diapositive sur un telephone d'entree de gamme. Chaque parfum est donc
       dessine : un flacon SVG teinte par sa famille. Ca tourne a 60 images
       par seconde avec cent flacons a l'ecran, et la boutique peut deposer
       ses propres photos par-dessus (champ `photo`).

   Chaque entree :
     nom, maison, annee, parfumeur, famille
     notes  : { tete, coeur, fond }
     texte  : la description
     ambiance : ce que le parfum evoque
     genre  : feminin | masculin | mixte
     force  : 1 (discret) a 5 (tres present)
     moment : jour | soir | les-deux
     saisons: ete | hiver | mi-saison
     traits : mots-cles utilises par le questionnaire
     teinte : la couleur du jus dans le flacon dessine
     photo  : vide - a remplir par la boutique si elle a ses visuels
   ========================================================================= */

export const FAMILLES = [
  { cle: 'floral',   nom: 'Floral',   teinte: '#D98BA8', texte: 'La fleur au premier plan : rose, jasmin, tubéreuse, iris.' },
  { cle: 'oriental', nom: 'Oriental', teinte: '#8E4A2E', texte: 'Résines, épices et baumes. Chaud, enveloppant, du soir.' },
  { cle: 'boise',    nom: 'Boisé',    teinte: '#6B5233', texte: 'Cèdre, vétiver, santal. La colonne vertébrale des parfums de caractère.' },
  { cle: 'frais',    nom: 'Frais',    teinte: '#7FB2A6', texte: 'Agrumes, aromates, notes marines. La lumière du matin.' },
  { cle: 'oud',      nom: 'Oud',      teinte: '#3B2418', texte: 'Le bois d’agar. Dense, animal, immédiatement reconnaissable.' },
  /* ⚠️ La FAMILLE s'appelle « Ambré » (l'adjectif), la MATIERE s'appelle
     « ambre » (le nom). Une correction automatique avait accentue les deux, et
     les fiches affichaient « notes de fond : ambré » - un parfumeur l'aurait vu
     tout de suite. */
  { cle: 'ambre',    nom: 'Ambré',    teinte: '#C08A3E', texte: 'Vanille, benjoin, labdanum. Une chaleur de peau.' },
  { cle: 'gourmand', nom: 'Gourmand', teinte: '#A9663F', texte: 'Vanille, caramel, amande, café. Le parfum qu’on a envie de croquer.' },
  { cle: 'epice',    nom: 'Épicé',    teinte: '#9E3B2C', texte: 'Poivre, cannelle, safran, cardamome. Du relief, tout de suite.' },
  { cle: 'cuir',     nom: 'Cuir',     teinte: '#54301F', texte: 'Cuir, tabac, bouleau. Un vestiaire, une selle, un fumoir.' },
  { cle: 'fruite',   nom: 'Fruité',   teinte: '#C4553F', texte: 'Pêche, poire, fruits rouges, figue. Juteux et solaire.' },
  { cle: 'chypre',   nom: 'Chypre',   teinte: '#6E6A34', texte: 'Bergamote, mousse de chêne, patchouli. L’élégance sèche.' },
];

const P = (nom, maison, annee, parfumeur, famille, tete, coeur, fond, texte, ambiance, genre, force, moment, saisons, traits) =>
  ({ nom, maison, annee, parfumeur, famille, notes: { tete, coeur, fond }, texte, ambiance, genre, force, moment, saisons, traits, photo: '' });

export const PARFUMS = [
  /* ---------- Floral ---------- */
  P('N°5', 'Chanel', 1921, 'Ernest Beaux', 'floral', ['Aldéhydes', 'Ylang-ylang', 'Neroli'], ['Rose de mai', 'Jasmin', 'Iris'], ['Santal', 'Vanille', 'Vétiver'],
    'Le premier parfum à avoir assumé l’abstraction : on n’y cherche pas une fleur, on y trouve une idée de fleur. Les aldéhydes ouvrent comme une lumière blanche.', 'Un tailleur blanc, un dimanche matin', 'feminin', 4, 'les-deux', ['mi-saison', 'hiver'], ['lumineux', 'poudre', 'classique']),
  P('J’adore', 'Dior', 1999, 'Calice Becker', 'floral', ['Poire', 'Melon', 'Bergamote'], ['Jasmin sambac', 'Rose de mai', 'Tubéreuse'], ['Musc', 'Cèdre', 'Vanille'],
    'Un bouquet solaire et lisse, construit pour plaire tout de suite. Peu de rugosité, beaucoup de lumière.', 'Une robe qui accroche le soleil', 'feminin', 3, 'jour', ['ete', 'mi-saison'], ['lumineux', 'solaire', 'doux']),
  P('Flowerbomb', 'Viktor & Rolf', 2005, 'Olivier Polge', 'floral', ['Thé', 'Bergamote', 'Osmanthus'], ['Jasmin sambac', 'Rose', 'Orchidée'], ['Patchouli', 'Musc', 'Vanille'],
    'Un floral qui explose plutôt qu’il ne s’ouvre. Très présent dès la première heure, il laisse une traînée sucrée reconnaissable.', 'Une entrée remarquée', 'feminin', 5, 'soir', ['hiver', 'mi-saison'], ['sucre', 'affirme', 'enveloppant']),
  P('Daisy', 'Marc Jacobs', 2007, 'Alberto Morillas', 'floral', ['Fraise', 'Feuille de violette', 'Pamplemousse'], ['Gardenia', 'Violette', 'Jasmin'], ['Musc', 'Vanille', 'Bois blanc'],
    'Un floral léger, presque adolescent, qui ne demande aucun effort. Il accompagne sans s’imposer.', 'Un vendredi après-midi de printemps', 'feminin', 2, 'jour', ['ete', 'mi-saison'], ['leger', 'doux', 'quotidien']),
  P('Paradoxe', 'Prada', 2022, 'Nadège Le Garlantezec', 'floral', ['Neroli'], ['Ambre floral', 'Jasmin'], ['Musc blanc', 'Bois'],
    'Un neroli poudre posé sur un fond musqué très propre. Fait pour la journée, sans lourdeur.', 'Un bureau lumineux', 'feminin', 3, 'jour', ['mi-saison', 'ete'], ['propre', 'poudre', 'moderne']),
  P('Rose des Vents', 'Louis Vuitton', 2016, 'Jacques Cavallier', 'floral', ['Poivre rose'], ['Rose de mai', 'Rose de Turquie', 'Iris'], ['Musc', 'Cèdre'],
    'Une rose franche, sans confiture ni nostalgie : la fleur telle qu’on la coupe, avec un peu de tige.', 'Un bouquet posé sur une table nue', 'feminin', 3, 'les-deux', ['mi-saison'], ['floral-vrai', 'elegant', 'sobre']),
  P('Alien', 'Mugler', 2005, 'Dominique Ropion', 'floral', ['Jasmin sambac'], ['Bois de cachemire'], ['Ambre blanc'],
    'Trois notes seulement, poussées a l’extrême. Un jasmin solaire sur un ambre qui ne s’éteint pas de la journée.', 'Une nuit très claire', 'feminin', 5, 'soir', ['hiver'], ['affirme', 'enveloppant', 'hypnotique']),
  P('Fleur Narcotique', 'Ex Nihilo', 2014, 'Quentin Bisch', 'floral', ['Bergamote', 'Pêche', 'Litchi'], ['Pivoine', 'Jasmin', 'Fleur d’oranger'], ['Musc', 'Mousse', 'Bois'],
    'Un floral-fruité très travaillé, qui reste net là où d’autres deviennent sirupeux. La signature d’une maison de niche accessible.', 'Un salon en fin d’après-midi', 'mixte', 4, 'les-deux', ['mi-saison', 'ete'], ['fruite', 'elegant', 'moderne']),
  P('Carnal Flower', 'Frédéric Malle', 2005, 'Dominique Ropion', 'floral', ['Bergamote', 'Melon', 'Eucalyptus'], ['Tubéreuse', 'Ylang-ylang', 'Jasmin'], ['Musc', 'Noix de coco'],
    'La tubéreuse la plus fidèle du marché : verte, laiteuse, presque vivante. Rien n’est adouci.', 'Un jardin la nuit, après la pluie', 'feminin', 5, 'soir', ['ete', 'mi-saison'], ['vert', 'charnel', 'affirme']),
  P('Iris Silver Mist', 'Serge Lutens', 1994, 'Maurice Roucel', 'floral', ['Iris'], ['Racine d’iris', 'Encens'], ['Vétiver', 'Bois de cèdre'],
    'L’iris pris du côté de la racine, pas de la fleur : froid, terreux, minéral. Un parfum qui ne cherche pas à séduire.', 'Une galerie vide un matin d’hiver', 'mixte', 3, 'les-deux', ['hiver', 'mi-saison'], ['poudre', 'froid', 'rare']),

  /* ---------- Oriental / Ambre ---------- */
  P('Shalimar', 'Guerlain', 1925, 'Jacques Guerlain', 'oriental', ['Bergamote', 'Citron'], ['Iris', 'Jasmin', 'Rose'], ['Vanille', 'Fève tonka', 'Encens'],
    'L’oriental fondateur : un accord vanille-bergamote qui a défini une famille entière. Il vieillit sur la peau comme un cuir.', 'Un fumoir à la lumière basse', 'feminin', 4, 'soir', ['hiver'], ['vanille', 'classique', 'enveloppant']),
  P('Black Opium', 'Yves Saint Laurent', 2014, 'Nathalie Lorson', 'gourmand', ['Poire', 'Poivre rose'], ['Café', 'Fleur d’oranger', 'Jasmin'], ['Vanille', 'Patchouli', 'Cèdre'],
    'Le café-vanille qui a lancé une décennie de parfums gourmands. Très présent, conçu pour la sortie du soir.', 'Une nuit en ville', 'feminin', 5, 'soir', ['hiver', 'mi-saison'], ['sucre', 'cafe', 'affirme']),
  P('La Nuit de l’Homme', 'Yves Saint Laurent', 2009, 'Anne Flipo', 'epice', ['Cardamome'], ['Lavande', 'Cèdre'], ['Vétiver', 'Coumarine'],
    'Une cardamome fraîche posée sur un cèdre sec. L’équilibre exact entre chaleur et retenue.', 'Un dîner qui se prolonge', 'masculin', 4, 'soir', ['mi-saison', 'hiver'], ['epice', 'elegant', 'seducteur']),
  P('Ambre Nuit', 'Dior', 2009, 'François Demachy', 'ambre', ['Bergamote', 'Poivre rose'], ['Rose de Damas'], ['Ambre gris', 'Patchouli'],
    'Une rose poivrée sur un ambre gris très sec. Ni sucre ni lourd, malgré la famille.', 'Une soirée d’hiver a Paris', 'mixte', 4, 'soir', ['hiver'], ['ambre', 'rose', 'raffine']),
  P('Spicebomb Extreme', 'Viktor & Rolf', 2015, 'Olivier Polge', 'epice', ['Poivre noir', 'Cumin'], ['Lavande', 'Cannelle'], ['Tabac', 'Vanille'],
    'Le tabac-vanille pousse loin, tenu par un poivre qui l’empêche de devenir dessert.', 'Un hiver, col relevé', 'masculin', 5, 'soir', ['hiver'], ['epice', 'tabac', 'chaud']),
  P('Ambre Sultan', 'Serge Lutens', 1993, 'Christopher Sheldrake', 'ambre', ['Coriandre', 'Origan', 'Laurier'], ['Résine ambrée', 'Angélique'], ['Benjoin', 'Vanille', 'Patchouli'],
    'Un ambre aromatique, presque médicinal en ouverture, qui se fond ensuite en résine chaude. Une signature de maison.', 'Un souk à la tombée du jour', 'mixte', 5, 'soir', ['hiver'], ['ambre', 'resine', 'rare']),
  P('Angel’s Share', 'By Kilian', 2020, 'Quentin Bisch', 'gourmand', ['Cognac'], ['Cannelle', 'Fève tonka', 'Praline'], ['Chêne', 'Vanille', 'Bois de santal'],
    'Un cognac vieilli en fut : bois, sucre brun et épices. Reconnaissable dès la première seconde.', 'Un verre au coin du feu', 'mixte', 5, 'soir', ['hiver'], ['gourmand', 'chaud', 'affirme']),
  P('Tobacco Vanille', 'Tom Ford', 2007, 'Olivier Gillotin', 'gourmand', ['Feuille de tabac', 'Épices'], ['Fève tonka', 'Cacao', 'Fleur de tabac'], ['Vanille', 'Bois secs', 'Fruits secs'],
    'Le tabac le plus opulent du marché. À porter par petites touches : il occupe une pièce entière.', 'Un club, des fauteuils de cuir', 'mixte', 5, 'soir', ['hiver'], ['tabac', 'gourmand', 'opulent']),
  P('Coco Mademoiselle', 'Chanel', 2001, 'Jacques Polge', 'chypre', ['Orange', 'Bergamote'], ['Rose', 'Jasmin', 'Litchi'], ['Patchouli', 'Vétiver', 'Vanille'],
    'Un chypre moderne, mené par le patchouli. Il a défini le parfum féminin des années 2000 et n’a pas bougé depuis.', 'Un rendez-vous qu’on ne rate pas', 'feminin', 4, 'les-deux', ['mi-saison', 'hiver'], ['patchouli', 'classique', 'affirme']),
  P('Opium', 'Yves Saint Laurent', 1977, 'Jean Amic', 'oriental', ['Mandarine', 'Clou de girofle', 'Coriandre'], ['Myrrhe', 'Œillet', 'Cannelle'], ['Ambre', 'Patchouli', 'Encens'],
    'Le scandale de 1977 : un oriental épicé sans aucune retenue. Il a fait école et n’a jamais été égalé en densité.', 'Un soir qui ne finit pas', 'feminin', 5, 'soir', ['hiver'], ['epice', 'opulent', 'classique']),

  /* ---------- Boise ---------- */
  P('Terre d’Hermès', 'Hermès', 2006, 'Jean-Claude Ellena', 'boise', ['Orange', 'Pamplemousse'], ['Poivre', 'Silex'], ['Vétiver', 'Cèdre', 'Benjoin'],
    'Un minéral rare en parfumerie : de la pierre, de l’orange et du vétiver. Sec, lisible, sans un gramme de sucre.', 'Un chemin de terre au soleil', 'masculin', 4, 'les-deux', ['mi-saison', 'ete'], ['mineral', 'sec', 'elegant']),
  P('Santal 33', 'Le Labo', 2011, 'Frank Voelkl', 'boise', ['Cardamome', 'Iris', 'Violette'], ['Santal', 'Papyrus'], ['Cuir', 'Ambre', 'Cèdre'],
    'Le bois-cuir devenu signature d’une génération. Fumé, laiteux, un peu urineux au début - c’est ce qui le rend mémorable.', 'Un loft, du béton ciré', 'mixte', 4, 'les-deux', ['mi-saison', 'hiver'], ['boise', 'fume', 'moderne']),
  P('Bois d’Argent', 'Dior', 2004, 'Annick Menardo', 'boise', ['Iris'], ['Miel', 'Encens', 'Cuir'], ['Bois de santal', 'Musc', 'Myrrhe'],
    'Un bois-miel poudre, très doux, presque cotonneux. Un parfum de peau plus que de effluve.', 'Un pull de cachemire', 'mixte', 3, 'les-deux', ['hiver', 'mi-saison'], ['poudre', 'doux', 'intime']),
  P('Vétiver', 'Guerlain', 1961, 'Jean-Paul Guerlain', 'boise', ['Citron', 'Bergamote', 'Coriandre'], ['Vétiver', 'Tabac'], ['Tabac', 'Poivre', 'Muscade'],
    'Le vétiver de référence : terreux, fumé, avec une amertume verte qui n’a pas pris une ride.', 'Un jardin après la tonte', 'masculin', 3, 'jour', ['ete', 'mi-saison'], ['vetiver', 'sec', 'classique']),
  P('Oud Wood', 'Tom Ford', 2007, 'Richard Herpin', 'oud', ['Oud', 'Bois de rose', 'Cardamome'], ['Santal', 'Vétiver', 'Fève tonka'], ['Ambre', 'Vanille', 'Musc'],
    'L’oud rendu portable : la note est la, mais adoucie par le santal et la vanille. Une porte d’entrée dans la famille.', 'Un salon feutré', 'mixte', 4, 'soir', ['hiver', 'mi-saison'], ['oud', 'doux', 'raffine']),
  P('Encre Noire', 'Lalique', 2006, 'Nathalie Lorson', 'boise', ['Cyprès'], ['Vétiver de Haïti', 'Vétiver du Bourbon'], ['Musc', 'Bois de cachemire'],
    'Un vétiver sombre, presque encre. Très peu d’ouverture, beaucoup de fond : il commence là où d’autres finissent.', 'Une bibliothèque le soir', 'masculin', 4, 'soir', ['hiver', 'mi-saison'], ['vetiver', 'sombre', 'sobre']),
  P('Bleu de Chanel', 'Chanel', 2010, 'Jacques Polge', 'boise', ['Citron', 'Menthe', 'Pamplemousse'], ['Gingembre', 'Nuez moscada', 'Jasmin'], ['Encens', 'Vétiver', 'Cèdre'],
    'Un boisé-agrume très’équilibre, conçu pour ne déplaire a personne sans être fade. Le classique moderne du vestiaire masculin.', 'Un costume bleu marine', 'masculin', 4, 'les-deux', ['mi-saison', 'ete'], ['frais', 'boise', 'polyvalent']),
  P('Gypsy Water', 'Byredo', 2008, 'Jérôme Epinette', 'boise', ['Baies de genièvre', 'Citron', 'Poivre'], ['Encens', 'Pin', 'Orris'], ['Ambre', 'Santal', 'Vanille'],
    'Un bois clair et sec, avec une fumée de feu de camp très discrète. Facile à porter toute la journée.', 'Un feu de bois en forêt', 'mixte', 3, 'jour', ['mi-saison', 'hiver'], ['boise', 'fume', 'leger']),
  P('Tam Dao', 'Diptyque', 2003, 'Daniel Molière', 'boise', ['Cyprès', 'Myrte'], ['Santal', 'Cèdre', 'Rose'], ['Ambre', 'Musc', 'Bois de Brésil'],
    'Le santal droit, presque monacal : du bois, un peu de lait, rien d’autre. Un parfum de calme.', 'Un temple, de l’encens froid', 'mixte', 3, 'les-deux', ['mi-saison'], ['santal', 'calme', 'sobre']),
  P('Cédrat Boisé', 'Mancera', 2011, 'Pierre Montale', 'boise', ['Cédrat', 'Citron', 'Cassis'], ['Poivre', 'Bois de gaïac'], ['Vanille', 'Musc', 'Patchouli'],
    'Un agrume tenu par un bois vanille : la fraîcheur du début ne s’effondre pas au bout d’une heure, ce qui est rare.', 'Un été qui dure', 'masculin', 5, 'les-deux', ['ete', 'mi-saison'], ['frais', 'boise', 'tenace']),

  /* ---------- Frais ---------- */
  P('Light Blue', 'Dolce & Gabbana', 2001, 'Olivier Cresp', 'frais', ['Citron de Sicile', 'Pomme', 'Cèdre'], ['Bambou', 'Jasmin', 'Rose blanche'], ['Cèdre', 'Ambre', 'Musc'],
    'Le parfum d’été par excellence : pomme verte et citron sur un fond de cèdre. Simple, efficace, immédiatement reconnaissable.', 'Un bord de mer en juillet', 'feminin', 3, 'jour', ['ete'], ['frais', 'agrume', 'solaire']),
  P('Acqua di Gio Profumo', 'Giorgio Armani', 2015, 'Alberto Morillas', 'frais', ['Bergamote'], ['Notes marines', 'Sauge', 'Romarin'], ['Encens', 'Patchouli'],
    'La version sombre du classique marin : le même air iodé, mais posé sur un encens qui lui donne du poids.', 'Une mer grise, très tôt', 'masculin', 4, 'les-deux', ['mi-saison', 'ete'], ['marin', 'sobre', 'elegant']),
  P('Eau Sauvage', 'Dior', 1966, 'Edmond Roudnitska', 'frais', ['Citron', 'Basilic', 'Bergamote'], ['Jasmin', 'Coriandre', 'Romarin'], ['Vétiver', 'Mousse de chêne', 'Musc'],
    'Le premier grand frais masculin. Un citron sec, un jasmin caché, une mousse : il à soixante ans et se porte toujours.', 'Une chemise blanche repassée', 'masculin', 3, 'jour', ['ete', 'mi-saison'], ['agrume', 'classique', 'net']),
  P('Colonia', 'Acqua di Parma', 1916, 'Maison Acqua di Parma', 'frais', ['Citron', 'Bergamote', 'Orange amère'], ['Lavande', 'Romarin', 'Verveine'], ['Bois de santal', 'Patchouli', 'Musc'],
    'La cologne italienne dans sa forme la plus pure. Elle ne dure pas longtemps, et c’est exactement son propos.', 'Un matin d’été, fenêtres ouvertes', 'mixte', 2, 'jour', ['ete'], ['agrume', 'classique', 'leger']),
  P('Silver Mountain Water', 'Creed', 1995, 'Olivier Creed', 'frais', ['Bergamote', 'Mandarine'], ['Thé vert', 'Cassis'], ['Musc', 'Bois de santal'],
    'Une eau de montagne : thé vert, cassis et musc minéral. Très propre, presque transparent.', 'Un torrent en altitude', 'mixte', 3, 'jour', ['ete', 'mi-saison'], ['propre', 'the', 'frais']),
  P('Eau des Merveilles', 'Hermès', 2004, 'Ralf Schwieger', 'frais', ['Orange amère', 'Citron', 'Poivre'], ['Ambre gris', 'Bois flotté'], ['Cèdre', 'Vétiver', 'Benjoin'],
    'Un ambre sans sucre, ce qui est presque une contradiction : du bois flotte, du sel et un agrume qui ne tombe jamais dans le doux.', 'Du bois rejeté par la mer', 'feminin', 3, 'jour', ['ete', 'mi-saison'], ['ambre-sec', 'original', 'leger']),
  P('CK One', 'Calvin Klein', 1994, 'Alberto Morillas', 'frais', ['Ananas', 'Mandarine', 'Bergamote'], ['Thé vert', 'Muguet', 'Violette'], ['Musc', 'Ambre', 'Cèdre'],
    'Le premier grand parfum mixte assumé. Un thé vert transparent qui a marqué toute une décennie.', 'Un jean et un t-shirt blanc', 'mixte', 2, 'jour', ['ete', 'mi-saison'], ['propre', 'the', 'quotidien']),
  P('Virgin Island Water', 'Creed', 2007, 'Olivier Creed', 'frais', ['Citron vert', 'Mandarine', 'Bergamote'], ['Noix de coco', 'Ylang-ylang', 'Jasmin'], ['Sucre de canne', 'Musc blanc'],
    'Une pina colada rendue élégante : coco et citron vert, sans l’effet monoi bon marché.', 'Une plage, en fin de journée', 'mixte', 3, 'jour', ['ete'], ['coco', 'solaire', 'vacances']),

  /* ---------- Oud ---------- */
  P('Oud Ispahan', 'Dior', 2012, 'François Demachy', 'oud', ['Rose de Damas'], ['Oud', 'Encens'], ['Santal', 'Patchouli', 'Labdanum'],
    'La rose et l’oud dans leur équilibre le plus juste. Dense, mais jamais étouffant.', 'Un tapis de soie', 'mixte', 5, 'soir', ['hiver'], ['oud', 'rose', 'opulent']),
  P('Black Afgano', 'Nasomatto', 2009, 'Alessandro Gualtieri', 'oud', ['Résines vertes'], ['Oud', 'Café', 'Tabac'], ['Résines', 'Bois fumés'],
    'Un des parfums les plus sombres qui existent : résine verte, oud et café. Il divise, et c’est fait pour.', 'Une pièce sans fenêtre', 'mixte', 5, 'soir', ['hiver'], ['oud', 'sombre', 'rare']),
  P('Royal Oud', 'Creed', 2011, 'Olivier Creed', 'oud', ['Citron', 'Poivre rose', 'Bergamote'], ['Oud', 'Genévrier', 'Angélique'], ['Santal', 'Cèdre', 'Musc'],
    'L’oud le plus clair du marché : un bois de cèdre lumineux où l’oud sert de colonne, pas de façade.', 'Un vestibule de marbre', 'mixte', 4, 'les-deux', ['mi-saison', 'hiver'], ['oud', 'clair', 'raffine']),
  P('Interlude Man', 'Amouage', 2012, 'Pierre Negrin', 'oud', ['Bergamote', 'Origan', 'Poivre'], ['Encens', 'Oud', 'Cuir'], ['Ambre', 'Mousse', 'Patchouli'],
    'Une fumée dense et immobile, tenue pendant des heures. Un parfum d’hiver, pour ceux qui veulent qu’on se souvienne.', 'Une résine qui brûle lentement', 'masculin', 5, 'soir', ['hiver'], ['encens', 'oud', 'opulent']),
  P('Oud Satin Mood', 'Maison Francis Kurkdjian', 2015, 'Francis Kurkdjian', 'oud', ['Violette'], ['Rose de Bulgarie', 'Oud'], ['Vanille', 'Benjoin', 'Musc'],
    'Un oud vanille très doux, presque textile - d’ou le nom. La version confortable de la famille.', 'Un rideau de velours', 'mixte', 5, 'soir', ['hiver'], ['oud', 'vanille', 'doux']),

  /* ---------- Gourmand ---------- */
  P('La Vie est Belle', 'Lancôme', 2012, 'Olivier Polge', 'gourmand', ['Cassis', 'Poire'], ['Iris', 'Jasmin', 'Fleur d’oranger'], ['Praline', 'Vanille', 'Patchouli'],
    'Un iris-praline très construit : le sucre est la, mais tenu par un patchouli qui l’empêche de devenir enfantin.', 'Un goûter qui s’éternise', 'feminin', 4, 'les-deux', ['hiver', 'mi-saison'], ['sucre', 'iris', 'doux']),
  P('Pink Sugar', 'Aquolina', 2004, 'Beatrice Aguilar', 'gourmand', ['Bergamote', 'Orange', 'Figue'], ['Réglisse', 'Barbe a papa', 'Fraise'], ['Vanille', 'Musc', 'Bois'],
    'Assumé jusqu’au bout : barbe à papa et caramel, sans le moindre détour. On l’aime ou on le fuit.', 'Une fête foraine', 'feminin', 4, 'jour', ['hiver', 'mi-saison'], ['sucre', 'joyeux', 'assume']),
  P('Café Tabac', 'Nishane', 2018, 'Cécile Zarokian', 'gourmand', ['Café', 'Bergamote'], ['Tabac', 'Fève tonka'], ['Vanille', 'Bois'],
    'Un café noir sur du tabac blond. Plus amer que sucre, ce qui le distingue des gourmands de grande diffusion.', 'Un comptoir en zinc, tot le matin', 'mixte', 4, 'les-deux', ['hiver'], ['cafe', 'tabac', 'chaud']),
  P('Delina', 'Parfums de Marly', 2017, 'Quentin Bisch', 'floral', ['Litchi', 'Rhubarbe', 'Bergamote'], ['Rose turque', 'Pivoine', 'Muguet'], ['Vanille', 'Cachemire', 'Musc'],
    'Une rose-litchi très lisse, avec une vanille qui prolonge tout. Un succès de niche devenu un standard.', 'Un mariage en fin d’été', 'feminin', 5, 'les-deux', ['mi-saison'], ['rose', 'fruite', 'tenace']),
  P('Baccarat Rouge 540', 'Maison Francis Kurkdjian', 2015, 'Francis Kurkdjian', 'ambre', ['Safran', 'Jasmin'], ['Ambre gris', 'Bois de cèdre'], ['Musc', 'Résine de sapin'],
    'Un ambre sucre-salé devenu phénomène. Très tenace, très reconnaissable, et souvent copié.', 'Une salle de bal vide', 'mixte', 5, 'soir', ['hiver', 'mi-saison'], ['ambre', 'sucre', 'tenace']),
  P('Layton', 'Parfums de Marly', 2016, 'Hamid Merati-Kashani', 'gourmand', ['Pomme', 'Bergamote', 'Lavande'], ['Geranium', 'Violette', 'Jasmin'], ['Vanille', 'Fève tonka', 'Santal'],
    'Pomme et vanille sur un fond boisé. Chaleureux sans être lourd, il fonctionne aussi bien au bureau qu’au restaurant.', 'Un manteau de laine', 'masculin', 5, 'les-deux', ['hiver', 'mi-saison'], ['vanille', 'polyvalent', 'tenace']),

  /* ---------- Epice ---------- */
  P('Sauvage', 'Dior', 2015, 'François Demachy', 'epice', ['Bergamote de Calabre', 'Poivre'], ['Poivre de Sichuan', 'Lavande', 'Geranium'], ['Ambroxan', 'Cèdre', 'Labdanum'],
    'L’ambroxan pousse au premier plan : minéral, sec, immédiatement identifiable. Le parfum le plus vendu de la décennie.', 'Un désert au crépuscule', 'masculin', 5, 'les-deux', ['mi-saison', 'ete'], ['mineral', 'frais', 'affirme']),
  P('Déclaration', 'Cartier', 1998, 'Jean-Claude Ellena', 'epice', ['Cumin', 'Coriandre', 'Bergamote'], ['Cuir', 'Bois de gaïac', 'Poivre'], ['Cèdre', 'Vétiver', 'Ambre'],
    'Le cumin osé et parfaitement dosé : une peau chaude, sans jamais basculer dans l’épicé de cuisine.', 'Un marché aux épices', 'masculin', 4, 'les-deux', ['mi-saison'], ['epice', 'cuir', 'original']),
  P('Portrait of a Lady', 'Frédéric Malle', 2010, 'Dominique Ropion', 'epice', ['Framboise', 'Cassis', 'Cannelle'], ['Rose turque', 'Clou de girofle'], ['Patchouli', 'Encens', 'Santal'],
    'Une rose-patchouli d’une densité rare. Elle tient deux jours sur un vêtement et ne ressemble a rien d’autre.', 'Un portrait a l’huile', 'feminin', 5, 'soir', ['hiver'], ['rose', 'patchouli', 'opulent']),
  P('Safran Troublant', 'L’Artisan Parfumeur', 2002, 'Olivia Giacobetti', 'epice', ['Safran'], ['Rose', 'Santal'], ['Vanille', 'Lait de figue'],
    'Un safran laiteux, extrêmement doux. Un parfum de peau plus qu’un parfum de effluve.', 'Un riz au lait à la cardamome', 'mixte', 2, 'les-deux', ['mi-saison', 'hiver'], ['safran', 'doux', 'intime']),

  /* ---------- Cuir ---------- */
  P('Tuscan Leather', 'Tom Ford', 2007, 'Antoine Maisondieu', 'cuir', ['Framboise', 'Safran', 'Thym'], ['Cuir', 'Jasmin', 'Olibanum'],  ['Bois d’ambre', 'Suède'],
    'Un cuir brut, presque animal, adouci par une framboise qui surprend à chaque fois. Aucun compromis.', 'Un atelier de sellier', 'mixte', 5, 'soir', ['hiver', 'mi-saison'], ['cuir', 'affirme', 'rare']),
  P('Cuir de Russie', 'Chanel', 1927, 'Ernest Beaux', 'cuir', ['Aldéhydes', 'Orange', 'Mandarine'], ['Iris', 'Jasmin', 'Rose'], ['Cuir', 'Bouleau', 'Vétiver'],
    'Le cuir de bouleau des cavaliers russes, poudre d’iris. Un des plus grands cuirs jamais composés.', 'Une selle, une écurie propre', 'mixte', 4, 'les-deux', ['hiver', 'mi-saison'], ['cuir', 'poudre', 'classique']),
  P('Knize Ten', 'Knize', 1924, 'Vincent Roubert', 'cuir', ['Petit-grain', 'Bergamote', 'Citron'], ['Geranium', 'Cèdre', 'Rose'], ['Cuir', 'Castoréum', 'Vanille'],
    'Le cuir viennois d’origine, presque intact depuis un siècle. Il sent le tabac froid et le cuir ciré.', 'Un tailleur pour hommes en 1930', 'masculin', 4, 'soir', ['hiver'], ['cuir', 'tabac', 'classique']),
  P('Ombre Leather', 'Tom Ford', 2018, 'Sonia Constant', 'cuir', ['Cardamome'], ['Cuir', 'Jasmin sambac'], ['Ambre', 'Patchouli', 'Mousse'],
    'Un cuir doux et sec, beaucoup plus facile à porter que ses aînés. Une bonne première approche de la famille.', 'Une veste de daim', 'mixte', 4, 'les-deux', ['mi-saison', 'hiver'], ['cuir', 'doux', 'moderne']),

  /* ---------- Fruite ---------- */
  P('Mango Skin', 'Vilhelm Parfumerie', 2018, 'Jérôme Epinette', 'fruite', ['Mangue', 'Poivre rose'], ['Rose', 'Cassis'], ['Musc', 'Ambre', 'Bois'],
    'Une mangue franche, presque juteuse, tenue par un musc propre. Le fruit sans le bonbon.', 'Un fruit coupe en deux', 'mixte', 4, 'jour', ['ete', 'mi-saison'], ['fruite', 'solaire', 'joyeux']),
  P('Pêche Cardinal', 'Nicolaï', 2013, 'Patricia de Nicolai', 'fruite', ['Pêche', 'Bergamote'], ['Tubéreuse', 'Ylang-ylang', 'Noix de coco'], ['Musc', 'Vanille'],
    'La pêche la plus réaliste du marché, posée sur une tubéreuse laiteuse. Un parfum de plein été.', 'Un panier de pêches au soleil', 'feminin', 4, 'jour', ['ete'], ['fruite', 'solaire', 'gourmand']),
  P('Philosykos', 'Diptyque', 1996, 'Olivia Giacobetti', 'fruite', ['Feuille de figuier'], ['Figue', 'Lait de figue'], ['Bois de figuier', 'Cèdre', 'Noix de coco'],
    'L’arbre entier : la feuille verte, le fruit, le bois. Une des plus belles figues de la parfumerie.', 'Un figuier en Grèce', 'mixte', 3, 'jour', ['ete', 'mi-saison'], ['vert', 'figue', 'naturel']),
  P('Cherry Smoke', 'Nishane', 2019, 'Cécile Zarokian', 'fruite', ['Cerise noire', 'Poivre'], ['Tabac', 'Encens'], ['Bois fumés', 'Vanille'],
    'Une cerise noire posée sur une fumée de tabac. L’accord surprend puis devient évident.', 'Un fruit confit près du feu', 'mixte', 4, 'soir', ['hiver', 'mi-saison'], ['fruite', 'fume', 'original']),

  /* ---------- Chypre ---------- */
  P('Mitsouko', 'Guerlain', 1919, 'Jacques Guerlain', 'chypre', ['Bergamote', 'Mandarine'], ['Pêche', 'Jasmin', 'Rose'], ['Mousse de chêne', 'Vétiver', 'Cannelle'],
    'Le chypre-fruité absolu : une pêche sèche posée sur de la mousse. Un siècle plus tard, rien ne lui ressemble.', 'Une aquarelle passée', 'feminin', 4, 'les-deux', ['mi-saison', 'hiver'], ['chypre', 'fruite', 'classique']),
  P('Chypre Palatin', 'MDCI', 2012, 'Bertrand Duchaufour', 'chypre', ['Lavande', 'Bergamote', 'Aldéhydes'], ['Jasmin', 'Iris', 'Cuir'], ['Mousse', 'Labdanum', 'Benjoin'],
    'Un chypre monumental, construit comme une architecture. Long a s’ouvrir, immense une fois installé.', 'Un escalier de pierre', 'mixte', 5, 'soir', ['hiver'], ['chypre', 'opulent', 'rare']),
  P('Aromatics Elixir', 'Clinique', 1971, 'Bernard Chant', 'chypre', ['Camomille', 'Coriandre', 'Aldéhydes'], ['Rose', 'Jasmin', 'Ylang-ylang'], ['Patchouli', 'Mousse de chêne', 'Vétiver'],
    'Un chypre herbacé et amer, presque médicinal. Il ne fait aucune concession et se reconnaît à dix mètres.', 'Une herboristerie', 'feminin', 5, 'soir', ['hiver'], ['chypre', 'herbace', 'affirme']),

  /* ---------- Complements pour atteindre le volume ---------- */
  P('Libre', 'Yves Saint Laurent', 2019, 'Anne Flipo', 'floral', ['Mandarine', 'Cassis', 'Lavande'], ['Lavande', 'Fleur d’oranger', 'Jasmin'], ['Vanille', 'Musc', 'Cèdre'],
    'Lavande et fleur d’oranger sur une vanille : un accord masculin-féminin assumé, très net.', 'Une veste d’homme sur une robe', 'feminin', 4, 'les-deux', ['mi-saison'], ['lavande', 'vanille', 'moderne']),
  P('Good Girl', 'Carolina Herrera', 2016, 'Louise Turner', 'gourmand', ['Amande', 'Café', 'Bergamote'], ['Tubéreuse', 'Jasmin sambac', 'Fleur d’oranger'], ['Fève tonka', 'Cacao', 'Praline'],
    'Amande et café sur une tubéreuse. Conçu pour le soir et pour qu’on le remarque.', 'Un talon qui claque', 'feminin', 5, 'soir', ['hiver'], ['sucre', 'affirme', 'soir']),
  P('Si', 'Giorgio Armani', 2013, 'Christine Nagel', 'chypre', ['Cassis'], ['Rose de mai', 'Freesia'], ['Vanille', 'Patchouli', 'Bois blond'],
    'Un chypre adouci à la vanille : la structure classique, sans l’amertume. Très portable.', 'Un foulard de soie', 'feminin', 4, 'les-deux', ['mi-saison', 'hiver'], ['chypre', 'doux', 'elegant']),
  P('Aventus', 'Creed', 2010, 'Erwin Creed', 'fruite', ['Ananas', 'Cassis', 'Bergamote', 'Pomme'], ['Bouleau', 'Patchouli', 'Jasmin'], ['Musc', 'Mousse de chêne', 'Ambre', 'Vanille'],
    'Ananas et bouleau fumé : l’accord qui a changé la parfumerie masculine des années 2010. Copié partout, égalé rarement.', 'Une réunion qu’on mène', 'masculin', 4, 'les-deux', ['mi-saison', 'ete'], ['fruite', 'fume', 'affirme']),
  P('Green Irish Tweed', 'Creed', 1985, 'Pierre Bourdon', 'frais', ['Citron', 'Verveine'], ['Iris', 'Violette'], ['Santal', 'Ambre gris'],
    'Un vert-iris rare : de l’herbe coupée, de la violette et du santal. Élégant sans effort.', 'Un terrain de golf au matin', 'masculin', 3, 'jour', ['mi-saison', 'ete'], ['vert', 'classique', 'sobre']),
  P('L’Homme Idéal', 'Guerlain', 2014, 'Thierry Wasser', 'gourmand', ['Citron', 'Bergamote', 'Amande'], ['Amande amère', 'Rose', 'Cannelle'], ['Fève tonka', 'Cuir', 'Vanille'],
    'L’amande amère en vedette, tenue par un cuir. Un gourmand masculin qui évite le dessert.', 'Une pâtisserie et un vestiaire', 'masculin', 4, 'les-deux', ['hiver', 'mi-saison'], ['amande', 'gourmand', 'elegant']),
  P('Musc Ravageur', 'Frédéric Malle', 2000, 'Maurice Roucel', 'ambre', ['Lavande', 'Bergamote', 'Cannelle'], ['Clou de girofle', 'Musc'], ['Vanille', 'Santal', 'Ambre'],
    'Un musc chaud et animal, très proche de la peau. Le contraire d’un parfum propre.', 'Un drap froissé', 'mixte', 4, 'soir', ['hiver'], ['musc', 'chaud', 'intime']),
  P('Vanille 44', 'Le Labo', 2010, 'Frank Voelkl', 'gourmand', ['Bergamote', 'Bois de gaïac'], ['Vanille de Madagascar', 'Fleur d’oranger'], ['Musc', 'Bois de santal'],
    'Une vanille fumée, jamais sucrée. La note la plus banale de la parfumerie, rendue adulte.', 'Une gousse fendue', 'mixte', 4, 'les-deux', ['hiver'], ['vanille', 'fume', 'doux']),
  P('Bal d’Afrique', 'Byredo', 2009, 'Jérôme Epinette', 'boise', ['Bergamote', 'Neroli', 'Citron'], ['Violette', 'Jasmin', 'Cyclamen'], ['Cèdre', 'Musc', 'Vétiver', 'Ambre'],
    'Un vétiver clair, floral et sec. Conçu comme un souvenir de soirée, il reste très facile à porter.', 'Un bal en plein air', 'mixte', 3, 'les-deux', ['mi-saison', 'ete'], ['vetiver', 'floral', 'leger']),
  P('Blanche', 'Byredo', 2009, 'Jérôme Epinette', 'floral', ['Aldéhydes', 'Rose', 'Poivre rose'], ['Violette', 'Neroli'], ['Musc blanc', 'Santal', 'Bois'],
    'Le parfum du linge propre, fait avec sérieux : des aldéhydes, du musc blanc, rien d’autre.', 'Une chemise sortie du placard', 'feminin', 3, 'jour', ['mi-saison', 'ete'], ['propre', 'musc', 'sobre']),
  P('Wood Sage & Sea Salt', 'Jo Malone', 2014, 'Christine Nagel', 'frais', ['Ambrette'], ['Sel de mer', 'Sauge'], ['Bois flotté', 'Ambre gris'],
    'Du sel, de la sauge et du bois flotte. Court en tenue, juste en intention.', 'Une falaise, du vent', 'mixte', 2, 'jour', ['ete', 'mi-saison'], ['marin', 'leger', 'naturel']),
  P('Vétiver Extraordinaire', 'Frédéric Malle', 2002, 'Dominique Ropion', 'boise', ['Poivre rose', 'Bergamote'], ['Vétiver de Haïti'], ['Cèdre', 'Musc', 'Encens'],
    'La plus forte concentration de vétiver du marché. Terreux, fumé, sans une once de sucre.', 'De la terre après l’orage', 'masculin', 4, 'les-deux', ['mi-saison'], ['vetiver', 'sec', 'affirme']),
  P('Ani', 'Nishane', 2019, 'Cécile Zarokian', 'ambre', ['Bergamote', 'Mandarine', 'Pomme'], ['Ambre', 'Vanille', 'Rose'], ['Musc', 'Bois', 'Fève tonka'],
    'Un ambre sucre lumineux, très tenace. Le genre de parfum qu’on sent sur un manteau le lendemain.', 'Une lumière dorée', 'mixte', 5, 'les-deux', ['hiver', 'mi-saison'], ['ambre', 'sucre', 'tenace']),
  P('Herod', 'Parfums de Marly', 2012, 'Quentin Bisch', 'gourmand', ['Poivre', 'Cannelle'], ['Tabac', 'Osmanthus'], ['Vanille', 'Vétiver', 'Bois de cachemire'],
    'Un tabac-vanille poivre, plus sec que la moyenne de la famille. Un parfum d’automne.', 'Une pipe éteinte', 'masculin', 5, 'soir', ['hiver'], ['tabac', 'vanille', 'chaud']),
  P('Kalan', 'Parfums de Marly', 2019, 'Quentin Bisch', 'fruite', ['Bergamote', 'Ananas', 'Cannelle'], ['Fleur d’oranger', 'Prune'], ['Ambre', 'Vanille', 'Bois'],
    'Un fruité ambre très généreux, presque solaire. Fait pour l’été, tient pour l’hiver.', 'Un fruit confit au soleil', 'mixte', 5, 'les-deux', ['ete', 'mi-saison'], ['fruite', 'ambre', 'tenace']),
  P('Cologne Indélébile', 'Frédéric Malle', 2015, 'Dominique Ropion', 'frais', ['Bergamote', 'Petit-grain'], ['Fleur d’oranger', 'Neroli'], ['Musc blanc', 'Ambrette'],
    'Une cologne qui ne s’évapore pas : le problème historique de la famille, résolu par un fond de musc.', 'Un matin d’été qui dure', 'mixte', 3, 'jour', ['ete'], ['agrume', 'propre', 'leger']),
  P('Rose Anonyme', 'Atelier Cologne', 2012, 'Ralf Schwieger', 'floral', ['Gingembre', 'Bergamote'], ['Rose turque', 'Encens'], ['Oud', 'Patchouli', 'Benjoin'],
    'Une rose sombre, poivrée, avec un oud discret. Ni féminine ni masculine, franchement mixte.', 'Une rose noire', 'mixte', 4, 'soir', ['mi-saison', 'hiver'], ['rose', 'oud', 'moderne']),
  P('Tobacco Oud', 'Tom Ford', 2013, 'Olivier Gillotin', 'oud', ['Coriandre', 'Poivre rose'], ['Tabac', 'Oud', 'Cannelle'], ['Bois de santal', 'Encens', 'Cacao'],
    'Un tabac fumé doublé d’un oud sec. Sombre, hivernal, très reconnaissable.', 'Un cigare dans un fauteuil', 'mixte', 5, 'soir', ['hiver'], ['tabac', 'oud', 'sombre']),
  P('Nomade', 'Chloé', 2018, 'Quentin Bisch', 'chypre', ['Mirabelle', 'Bergamote'], ['Freesia', 'Rose'], ['Mousse de chêne', 'Patchouli', 'Bois'],
    'Un chypre fruité très’accessible : la mousse est la, mais adoucie par une mirabelle.', 'Un sentier de bord de mer', 'feminin', 3, 'jour', ['mi-saison'], ['chypre', 'fruite', 'leger']),
  P('Oud Minérale', 'Tom Ford', 2016, 'Yann Vasnier', 'oud', ['Notes marines'], ['Oud', 'Algues', 'Sel'], ['Ambre gris', 'Bois'],
    'Un oud marin, ce qui semble contradictoire jusqu’à ce qu’on le sente : du sel, de l’iodé et du bois.', 'Une falaise à marée basse', 'mixte', 4, 'les-deux', ['ete', 'mi-saison'], ['oud', 'marin', 'original']),
  P('L’Air du Désert Marocain', 'Tauer', 2005, 'Andy Tauer', 'epice', ['Coriandre', 'Cumin', 'Petit-grain'], ['Encens', 'Ciste', 'Jasmin'], ['Ambre', 'Cèdre', 'Vétiver'],
    'Un encens sec sous un ciel chaud. Un des plus grands parfums indépendants jamais composés.', 'Un désert la nuit', 'mixte', 5, 'soir', ['hiver', 'mi-saison'], ['encens', 'epice', 'rare']),
  P('Reflection Man', 'Amouage', 2007, 'Lucas Sieuzac', 'floral', ['Poivre rose', 'Romarin', 'Neroli'], ['Jasmin', 'Iris', 'Cardamome'], ['Vétiver', 'Cèdre', 'Santal'],
    'Un floral masculin très net, mené par le jasmin et l’iris. Rare et parfaitement équilibre.', 'Une chemise blanche, un miroir', 'masculin', 4, 'les-deux', ['mi-saison'], ['floral', 'elegant', 'raffine']),
  P('Erba Pura', 'Xerjoff', 2014, 'Maison Xerjoff', 'fruite', ['Orange', 'Citron', 'Fruits exotiques'], ['Musc blanc', 'Ambre'], ['Vanille', 'Bois de santal'],
    'Un fruité sucre extrêmement tenace. Peu de complexité, beaucoup de plaisir immédiat.', 'Une corbeille de fruits', 'mixte', 5, 'les-deux', ['ete', 'mi-saison'], ['fruite', 'sucre', 'tenace']),
  P('Straight to Heaven', 'By Kilian', 2007, 'Sidonie Lancesseur', 'boise', ['Rhum', 'Muscade'], ['Bois de santal', 'Patchouli'], ['Vanille', 'Musc', 'Cèdre'],
    'Un rhum boisé, chaud et un peu insolent. Un parfum de soir, court en nombre de notes, long en tenue.', 'Un bar après minuit', 'masculin', 4, 'soir', ['hiver'], ['rhum', 'boise', 'chaud']),
  P('Fleur de Peau', 'Diptyque', 2018, 'Olivier Pescheux', 'floral', ['Aldéhydes', 'Poivre rose'], ['Iris', 'Rose', 'Violette'], ['Musc', 'Ambre gris', 'Cuir'],
    'Un musc-iris très proche de la peau, avec un cuir à peine présent. Discret et durable.', 'Une épaule nue', 'mixte', 3, 'les-deux', ['mi-saison'], ['musc', 'poudre', 'intime']),
  P('Eau Duelle', 'Diptyque', 2010, 'Fabrice Pellegrin', 'gourmand', ['Cardamome', 'Bergamote', 'Poivre rose'], ['Encens', 'Thé noir'], ['Vanille de Madagascar', 'Ambre'],
    'Une vanille transparente, presque sans sucre, tirée vers l’encens. Une vanille qu’on peut porter au bureau.', 'Un thé fumé', 'mixte', 3, 'les-deux', ['mi-saison', 'hiver'], ['vanille', 'the', 'sobre']),
  P('Ganymede', 'Marc-Antoine Barrois', 2019, 'Quentin Bisch', 'cuir', ['Mandarine', 'Safran'], ['Suède', 'Immortelle'], ['Ambroxan', 'Minéral', 'Bois'],
    'Un daim minéral, presque métallique. Une des propositions les plus originales de la dernière décennie.', 'Une surface de métal froid', 'mixte', 4, 'les-deux', ['mi-saison'], ['cuir', 'mineral', 'moderne']),
  P('Ombre Nomade', 'Louis Vuitton', 2018, 'Jacques Cavallier', 'oud', ['Framboise'], ['Oud', 'Rose', 'Encens'], ['Bois de gaïac', 'Benjoin'],
    'Un oud-encens dense avec une framboise en ouverture. Très tenace, très remarque.', 'Une fumée dans une pièce sombre', 'mixte', 5, 'soir', ['hiver'], ['oud', 'encens', 'opulent']),
  P('Bois Impérial', 'Essential Parfums', 2021, 'Jérôme Epinette', 'boise', ['Pamplemousse', 'Poivre rose'], ['Vétiver', 'Iris', 'Geranium'], ['Ambre', 'Bois de gaïac'],
    'Un vétiver-ambre très propre, conçu pour le quotidien. Bon rapport qualité-prix, ce qui compte aussi.', 'Un bureau clair', 'masculin', 4, 'jour', ['mi-saison', 'ete'], ['boise', 'propre', 'polyvalent']),
  P('Fils de Dieu', 'État Libre d’Orange', 2012, 'Ralf Schwieger', 'epice', ['Gingembre', 'Citron vert', 'Coriandre'], ['Riz', 'Coco', 'Jasmin'], ['Cuir', 'Musc', 'Vétiver'],
    'Du riz au lait de coco, du gingembre et un cuir en fond. Une composition qui n’a aucun équivalent.', 'Une cuisine thaïe', 'mixte', 3, 'les-deux', ['ete', 'mi-saison'], ['coco', 'epice', 'original']),
  P('Grand Soir', 'Maison Francis Kurkdjian', 2016, 'Francis Kurkdjian', 'ambre', ['Lavande', 'Orange'], ['Benjoin', 'Ciste'], ['Vanille', 'Ambre', 'Fève tonka'],
    'Un ambre-vanille très droit, sans effets. La simplicité exécutée parfaitement.', 'Une nuit de Paris', 'mixte', 4, 'soir', ['hiver'], ['ambre', 'vanille', 'elegant']),
  P('Neroli Portofino', 'Tom Ford', 2011, 'Rodrigo Flores-Roux', 'frais', ['Neroli', 'Bergamote', 'Citron'], ['Fleur d’oranger', 'Lavande', 'Romarin'], ['Ambrette', 'Ambre', 'Musc'],
    'Le neroli méditerranéen dans sa version la plus luxueuse. Très court en tenue, très beau pendant.', 'Un citronnier au bord de l’eau', 'mixte', 2, 'jour', ['ete'], ['agrume', 'neroli', 'leger']),
  P('Halfeti', 'Penhaligon s', 2015, 'Christian Provenzano', 'oud', ['Bergamote', 'Cardamome', 'Poivre'], ['Rose', 'Jasmin', 'Cyprès'], ['Oud', 'Cuir', 'Ambre', 'Vanille'],
    'Une rose noire d’Halfeti sur un oud cuir. Sombre, riche, très reconnaissable.', 'Une rose presque noire', 'mixte', 5, 'soir', ['hiver'], ['rose', 'oud', 'sombre']),
  P('Jazz Club', 'Maison Margiela', 2013, 'Aliénor Massenet', 'gourmand', ['Poivre rose', 'Neroli', 'Citron'], ['Rhum', 'Feuille de tabac', 'Clary sage'], ['Vanille', 'Fève tonka', 'Styrax'],
    'Rhum et tabac dans une pièce feutrée. Le plus réussi de la collection, et le plus facile à porter.', 'Un club de jazz, verre à la main', 'mixte', 4, 'soir', ['hiver', 'mi-saison'], ['rhum', 'tabac', 'chaud']),
  P('By the Fireplace', 'Maison Margiela', 2015, 'Marie Salamagne', 'gourmand', ['Clou de girofle', 'Poivre rose', 'Orange'], ['Châtaigne', 'Bois de gaïac', 'Encens'], ['Vanille', 'Fève tonka', 'Cachemire'],
    'Une châtaigne grillée et un bois fumé. Un parfum de décembre, littéralement.', 'Un feu de cheminée', 'mixte', 4, 'soir', ['hiver'], ['fume', 'gourmand', 'chaud']),
  P('Replica Beach Walk', 'Maison Margiela', 2012, 'Jérôme Epinette', 'frais', ['Bergamote', 'Poivre rose', 'Citron'], ['Ylang-ylang', 'Noix de coco', 'Héliotrope'], ['Musc', 'Bois de cèdre', 'Benjoin'],
    'Une crème solaire élégante : coco, sel et fleur blanche. Le souvenir d’une plage plus que la plage.', 'Du sable chaud', 'mixte', 3, 'jour', ['ete'], ['coco', 'solaire', 'vacances']),
  P('Angel', 'Mugler', 1992, 'Olivier Cresp', 'gourmand', ['Bergamote', 'Melon', 'Coco'], ['Miel', 'Fruits rouges', 'Prune'], ['Patchouli', 'Caramel', 'Vanille'],
    'Le premier gourmand de l’histoire : patchouli et caramel. Il a créé une famille entière à lui seul.', 'Une étoile bleue', 'feminin', 5, 'soir', ['hiver'], ['patchouli', 'sucre', 'affirme']),
  P('Hypnotic Poison', 'Dior', 1998, 'Annick Menardo', 'gourmand', ['Amande amère', 'Coco', 'Prune'], ['Jasmin', 'Carvi', 'Rose'], ['Vanille', 'Musc', 'Fève tonka', 'Santal'],
    'Une amande-vanille lactée et hypnotique. Un des rares parfums qu’on reconnaît sans jamais l’avoir appris.', 'Un philtre', 'feminin', 5, 'soir', ['hiver'], ['amande', 'vanille', 'enveloppant']),
  P('Poison Girl', 'Dior', 2016, 'François Demachy', 'gourmand', ['Orange amère', 'Citron de Sicile'], ['Rose de Damas', 'Rose de mai', 'Fleur d’oranger'], ['Vanille', 'Amande', 'Fève tonka'],
    'Rose et amande sur une vanille lactée. La version douce de la famille Poison.', 'Un rouge à lèvres', 'feminin', 4, 'les-deux', ['hiver', 'mi-saison'], ['rose', 'amande', 'doux']),
  P('Eros', 'Versace', 2012, 'Aurélien Guichard', 'frais', ['Menthe', 'Pomme verte', 'Citron'], ['Fève tonka', 'Ambroxan', 'Geranium'], ['Vanille', 'Cèdre', 'Vétiver', 'Mousse'],
    'Menthe et vanille : un contraste net qui a fait le succès du parfum auprès des plus jeunes.', 'Une nuit d’été', 'masculin', 5, 'soir', ['ete', 'mi-saison'], ['frais', 'sucre', 'affirme']),
  P('Le Mâle', 'Jean Paul Gaultier', 1995, 'Francis Kurkdjian', 'gourmand', ['Menthe', 'Lavande', 'Bergamote'], ['Cannelle', 'Cumin', 'Fleur d’oranger'], ['Vanille', 'Fève tonka', 'Santal'],
    'Lavande et vanille : l’accord fougère-gourmand qui a changé le rayon masculin pour vingt ans.', 'Un marin en permission', 'masculin', 4, 'les-deux', ['hiver', 'mi-saison'], ['lavande', 'vanille', 'classique']),
  P('Dior Homme', 'Dior', 2005, 'Olivier Polge', 'floral', ['Lavande', 'Sauge', 'Bergamote'], ['Iris', 'Cacao', 'Ambrette'], ['Cuir', 'Vétiver', 'Patchouli'],
    'L’iris masculin qui a ouvert une voie : poudre, cacao, cuir. Élégant et un peu mélancolique.', 'Un rouge à lèvres et une veste noire', 'masculin', 4, 'les-deux', ['mi-saison', 'hiver'], ['iris', 'poudre', 'elegant']),
  P('Fahrenheit', 'Dior', 1988, 'Jean-Louis Sieuzac', 'cuir', ['Mandarine', 'Aubépine', 'Muscade'], ['Violette', 'Muguet', 'Chèvrefeuille'], ['Cuir', 'Vétiver', 'Musc', 'Ambre'],
    'La violette et l’essence : un accord que personne n’avait osé et que personne n’a refait.', 'De l’essence sur du cuir', 'masculin', 4, 'soir', ['mi-saison', 'hiver'], ['cuir', 'violette', 'rare']),
  P('Habit Rouge', 'Guerlain', 1965, 'Jean-Paul Guerlain', 'oriental', ['Citron', 'Bergamote', 'Orange'], ['Rose', 'Cannelle', 'Patchouli'], ['Vanille', 'Cuir', 'Fève tonka'],
    'Un oriental d’équitation : cuir, vanille et agrume. Le premier oriental masculin de l’histoire.', 'Une veste rouge de cavalier', 'masculin', 4, 'les-deux', ['hiver', 'mi-saison'], ['cuir', 'vanille', 'classique']),
  P('Un Jardin sur le Nil', 'Hermès', 2005, 'Jean-Claude Ellena', 'frais', ['Mangue verte', 'Tomate', 'Carotte'], ['Lotus', 'Jacinthe', 'Iris'], ['Encens', 'Sycomore', 'Musc'],
    'Une mangue verte, presque végétale. Le meilleur exemple de l’ecriture transparente d’Ellena.', 'Un jardin au bord du fleuve', 'mixte', 2, 'jour', ['ete'], ['vert', 'leger', 'original']),
  P('Terre de Lumière', 'L’Occitane', 2016, 'Calice Becker', 'gourmand', ['Bergamote', 'Poivre rose'], ['Lavande', 'Immortelle'], ['Fève tonka', 'Musc', 'Miel'],
    'Une lavande-miel douce, très provençale. Un gourmand floral peu commun, facile à porter.', 'Un champ en fin de journée', 'feminin', 3, 'jour', ['mi-saison', 'ete'], ['lavande', 'miel', 'doux']),
  P('Bois Talisman', 'Van Cleef & Arpels', 2019, 'Nathalie Feisthauer', 'boise', ['Poivre rose', 'Bergamote'], ['Rhum', 'Fève tonka'], ['Santal', 'Cèdre', 'Ambre'],
    'Un bois-rhum très doux, presque sirupeux au début, qui sèche vers le santal.', 'Un talisman de bois poli', 'mixte', 4, 'soir', ['hiver'], ['boise', 'rhum', 'chaud']),
  P('Fucking Fabulous', 'Tom Ford', 2017, 'Yann Vasnier', 'cuir', ['Lavande', 'Amande amère', 'Sauge'], ['Cuir', 'Fleur d’oranger'], ['Fève tonka', 'Vanille', 'Bois'],
    'Un cuir amande, doux et provocateur. Le nom fait plus de bruit que le parfum, qui est excellent.', 'Un blouson neuf', 'mixte', 4, 'soir', ['hiver', 'mi-saison'], ['cuir', 'amande', 'moderne']),
  P('Silver Rain', 'La Prairie', 2001, 'Michel Almairac', 'floral', ['Mandarine', 'Cassis'], ['Muguet', 'Rose', 'Freesia'], ['Musc', 'Bois de santal', 'Ambre'],
    'Un floral blanc lumineux, très discret. Un parfum de bureau au sens noble.', 'Une pluie fine au printemps', 'feminin', 2, 'jour', ['mi-saison', 'ete'], ['floral', 'leger', 'propre']),
  P('Amber Absolute', 'Tom Ford', 2007, 'Yann Vasnier', 'ambre', ['Encens', 'Bergamote'], ['Labdanum', 'Benjoin'], ['Vanille', 'Bois de santal', 'Ambre'],
    'L’ambre à son maximum : résine, encens et vanille, sans aucune dilution.', 'Une résine chauffée', 'mixte', 5, 'soir', ['hiver'], ['ambre', 'encens', 'opulent']),
  P('Iris Poudre', 'Frédéric Malle', 2000, 'Pierre Bourdon', 'floral', ['Aldéhydes', 'Orange', 'Bergamote'], ['Iris', 'Jasmin', 'Ylang-ylang'], ['Vanille', 'Musc', 'Santal'],
    'L’iris le plus lumineux qui soit : aldéhydes, vanille et poudre de riz. Un classique instantané.', 'De la poudre de riz', 'feminin', 4, 'les-deux', ['mi-saison', 'hiver'], ['iris', 'poudre', 'elegant']),
  P('Sables', 'Annick Goutal', 1985, 'Annick Goutal', 'ambre', ['Immortelle'], ['Curry', 'Céleri'], ['Ambre', 'Vanille', 'Bois de santal'],
    'L’immortelle a l’état brut : sirop d’érable, curry et sel. Un parfum qui ne ressemble a aucun autre.', 'Une dune en septembre', 'masculin', 4, 'les-deux', ['mi-saison', 'hiver'], ['immortelle', 'original', 'rare']),
  P('Mandarina Corsica', 'Acqua di Parma', 2017, 'Maison Acqua di Parma', 'frais', ['Mandarine', 'Bergamote'], ['Menthe', 'Basilic'], ['Cèdre', 'Musc'],
    'Une mandarine franche et verte. Court, net, parfait pour les journées chaudes.', 'Un verger d’agrumes', 'mixte', 2, 'jour', ['ete'], ['agrume', 'leger', 'net']),
  P('Rose de Nuit', 'Serge Lutens', 1993, 'Christopher Sheldrake', 'floral', ['Rose'], ['Mousse de chêne', 'Musc', 'Abricot'], ['Ambre', 'Civette', 'Bois'],
    'Une rose de nuit, sombre et animale. À l’opposé exact de la rose fraîche du matin.', 'Un jardin après la tombée du jour', 'feminin', 4, 'soir', ['hiver'], ['rose', 'sombre', 'rare']),
  P('Tihota', 'Indult', 2007, 'Francis Kurkdjian', 'gourmand', ['Vanille'], ['Vanille de Tahiti', 'Musc'], ['Musc blanc'],
    'Une vanille pure, sans décor : la matière seule, très bien faite. Le minimalisme appliqué au gourmand.', 'Une gousse dans du papier kraft', 'mixte', 4, 'les-deux', ['hiver'], ['vanille', 'doux', 'rare']),
  P('Aqua Universalis', 'Maison Francis Kurkdjian', 2009, 'Francis Kurkdjian', 'frais', ['Bergamote', 'Citron'], ['Lys', 'Muguet'], ['Musc blanc', 'Bois'],
    'Le linge propre élevé au rang de parfum. Aucune aspérité, aucun risque, une réussite technique.', 'Un drap séché au vent', 'mixte', 3, 'jour', ['ete', 'mi-saison'], ['propre', 'musc', 'leger']),
  P('Oud for Greatness', 'Initio', 2018, 'Maison Initio', 'oud', ['Safran', 'Muscade', 'Lavande'], ['Oud', 'Patchouli'], ['Musc', 'Bois'],
    'Un oud-safran très puissant, conçu pour marquer. Une seule pulvérisation suffit largement.', 'Une porte de bois sculptée', 'mixte', 5, 'soir', ['hiver'], ['oud', 'safran', 'opulent']),
  P('Side Effect', 'Initio', 2016, 'Maison Initio', 'gourmand', ['Rhum', 'Cannelle'], ['Tabac', 'Vanille'], ['Bois de santal', 'Musc'],
    'Rhum, tabac et vanille : le trio des soirs d’hiver, pousse très loin en concentration.', 'Un fond de verre ambre', 'mixte', 5, 'soir', ['hiver'], ['rhum', 'tabac', 'tenace']),
  P('Musc Nomade', 'Annick Goutal', 2008, 'Isabelle Doyen', 'ambre', ['Ambrette'], ['Musc', 'Papyrus'], ['Bois de santal', 'Benjoin'],
    'Un musc végétal chaud, très proche de la peau. Un parfum qu’on ne sent presque que sur soi.', 'De la peau nue', 'mixte', 2, 'les-deux', ['mi-saison'], ['musc', 'doux', 'intime']),
  P('Ani Rose', 'Nishane', 2021, 'Cécile Zarokian', 'floral', ['Rose', 'Bergamote'], ['Rose de Damas', 'Ambre'], ['Vanille', 'Musc'],
    'Une rose ambrée très sucrée et tenace. Fait pour ceux qui veulent qu’on les sente arriver.', 'Un bouquet énorme', 'feminin', 5, 'soir', ['hiver'], ['rose', 'sucre', 'tenace']),
  P('Bois du Portugal', 'Creed', 1987, 'Olivier Creed', 'boise', ['Bergamote', 'Lavande'], ['Cèdre', 'Vétiver', 'Santal'], ['Ambre gris', 'Musc', 'Fève tonka'],
    'Un cèdre classique et rassurant, sans effet de mode. Le parfum du costume trois pièces.', 'Une bibliothèque en acajou', 'masculin', 4, 'les-deux', ['hiver', 'mi-saison'], ['boise', 'classique', 'elegant']),
  P('Al Haramain Amber Oud', 'Al Haramain', 2018, 'Maison Al Haramain', 'ambre', ['Bergamote', 'Cassis'], ['Ambre', 'Jasmin'], ['Musc', 'Bois', 'Vanille'],
    'Un ambre sucre très tenace, à un prix sans commune mesure avec ce qu’il imité. Utile à connaître.', 'Une lumière dorée', 'mixte', 5, 'les-deux', ['hiver', 'mi-saison'], ['ambre', 'sucre', 'tenace']),
  P('Encens Mythique', 'Armani Privé', 2015, 'Maison Armani', 'oriental', ['Aldéhydes', 'Poivre rose'], ['Encens', 'Rose', 'Iris'], ['Ambre gris', 'Musc', 'Bois'],
    'Un encens poudre et clair, très loin de l’église. Élégant, presque abstrait.', 'Une fumée blanche', 'mixte', 4, 'les-deux', ['mi-saison', 'hiver'], ['encens', 'poudre', 'raffine']),
  P('Vanilla Sex', 'Tom Ford', 2024, 'Maison Tom Ford', 'gourmand', ['Vanille', 'Bergamote'], ['Fleur d’oranger', 'Vanille bourbon'], ['Musc', 'Bois'],
    'Une vanille solaire et lactée, très directe. Peu de nuances, beaucoup d’effet.', 'Une peau au soleil', 'mixte', 4, 'les-deux', ['ete', 'mi-saison'], ['vanille', 'solaire', 'doux']),
  P('Ombre Nomade Extrait', 'Louis Vuitton', 2022, 'Jacques Cavallier', 'oud', ['Framboise', 'Safran'], ['Oud', 'Rose', 'Encens'], ['Benjoin', 'Bois de gaïac'],
    'La version concentrée : le même oud, plus dense encore. Réservé aux amateurs avertis.', 'Une résine noire', 'mixte', 5, 'soir', ['hiver'], ['oud', 'encens', 'opulent']),
  P('Molecule 01', 'Escentric Molecules', 2006, 'Geza Schoen', 'boise', ['Iso E Super'], ['Iso E Super'], ['Iso E Super'],
    'Une seule molécule, rien d’autre. Certains ne le sentent pas du tout ; les autres n’en portent plus d’autre.', 'Du bois, ou presque rien', 'mixte', 2, 'les-deux', ['mi-saison'], ['boise', 'minimal', 'rare']),
  P('Kiss Me Intense', 'By Kilian', 2016, 'Calice Becker', 'gourmand', ['Amande'], ['Vanille', 'Fève tonka'], ['Musc', 'Bois de santal'],
    'Amande et vanille, très proches du dessert, mais tenues par un fond boisé.', 'Un macaron', 'feminin', 4, 'soir', ['hiver'], ['amande', 'vanille', 'gourmand']),
  P('Fleur de Cassie', 'Frédéric Malle', 2000, 'Dominique Ropion', 'floral', ['Cassie', 'Aldéhydes', 'Bergamote'], ['Mimosa', 'Jasmin', 'Rose'], ['Musc', 'Santal', 'Fève tonka'],
    'Un mimosa poudre et animal, ni sage ni facile. Un des floraux les plus adultes qui soient.', 'Une branche de mimosa', 'feminin', 4, 'les-deux', ['mi-saison'], ['mimosa', 'poudre', 'rare']),
  P('Oud Save The King', 'Fragrance du Bois', 2016, 'Maison Fragrance du Bois', 'oud', ['Safran', 'Rose'], ['Oud du Laos', 'Patchouli'], ['Ambre', 'Musc', 'Bois'],
    'Un oud naturel, sans le côté médicinal des reconstitutions bon marché. Cher, et ca s’entend.', 'Un morceau de bois d’agar', 'mixte', 5, 'soir', ['hiver'], ['oud', 'rose', 'rare']),
  P('Bois Marocain', 'Tom Ford', 2009, 'Yann Vasnier', 'boise', ['Poivre', 'Baies de genièvre'], ['Encens', 'Cyprès'], ['Cèdre', 'Vétiver', 'Ambre'],
    'Un cèdre-encens sec et austère. Peu de gens l’aiment tout de suite ; ceux-la ne le quittent plus.', 'Une porte en cèdre', 'mixte', 4, 'soir', ['hiver', 'mi-saison'], ['boise', 'encens', 'sobre']),
  P('Costa Azzurra', 'Tom Ford', 2014, 'Yann Vasnier', 'frais', ['Lavande', 'Absinthe', 'Genièvre'], ['Driftwood', 'Agave', 'Aloe'], ['Chêne', 'Vétiver', 'Ambre'],
    'Un vert-marin résineux, presque amer. Le maquis méditerranéen plutôt que la plage.', 'Des pins au bord de la mer', 'mixte', 4, 'jour', ['ete', 'mi-saison'], ['vert', 'marin', 'sec']),
  P('Soleil Blanc', 'Tom Ford', 2016, 'Maison Tom Ford', 'ambre', ['Bergamote', 'Cardamome', 'Pistache'], ['Tubéreuse', 'Ylang-ylang', 'Jasmin'], ['Coco', 'Ambre', 'Benjoin'],
    'Coco et fleurs blanches : une huile solaire de luxe, assumée comme telle.', 'Un transat au soleil', 'feminin', 4, 'jour', ['ete'], ['coco', 'solaire', 'gourmand']),
  P('Encens Suave', 'Nicolaï', 2005, 'Patricia de Nicolai', 'oriental', ['Encens', 'Bergamote'], ['Rose', 'Ciste'], ['Vanille', 'Benjoin', 'Ambre'],
    'Un encens doux et vanille, très chaleureux. Une entrée idéale dans une famille souvent austère.', 'Une chapelle en été', 'mixte', 3, 'les-deux', ['hiver', 'mi-saison'], ['encens', 'vanille', 'doux']),
  P('Vétiver Fatal', 'Atelier Materi', 2020, 'Marie Schnirer', 'boise', ['Poivre rose'], ['Vétiver', 'Iris'], ['Vanille', 'Musc', 'Ambre'],
    'Un vétiver vanille, presque doux. La matière prise du côté confortable plutôt que terreux.', 'Une racine sèche au soleil', 'mixte', 3, 'les-deux', ['mi-saison'], ['vetiver', 'doux', 'moderne']),
  P('Bergamote 22', 'Le Labo', 2006, 'Frank Voelkl', 'frais', ['Bergamote', 'Pamplemousse'], ['Fleur d’oranger', 'Vétiver'], ['Musc', 'Ambre', 'Cèdre'],
    'Une bergamote soutenue par un musc : le problème de tenue des agrumes, résolu simplement.', 'Un zeste frais', 'mixte', 3, 'jour', ['ete', 'mi-saison'], ['agrume', 'propre', 'net']),
  P('Another 13', 'Le Labo', 2010, 'Nathalie Lorson', 'ambre', ['Poire', 'Ambrette'], ['Musc', 'Jasmin'], ['Ambroxan', 'Musc blanc', 'Cèdre'],
    'Un musc-ambroxan quasi transparent qui s’accroche à la peau pendant des heures. Extrêmement porte.', 'Une peau propre', 'mixte', 4, 'les-deux', ['mi-saison'], ['musc', 'propre', 'moderne']),
  P('Portrait de Femme', 'Effluve', 2024, 'Composition maison', 'floral', ['Poivre rose', 'Bergamote'], ['Rose de mai', 'Iris', 'Jasmin'], ['Santal', 'Musc', 'Ambre'],
    'Notre composition maison : une rose-iris tenue par un santal doux. Conçue pour le climat d’ici, où beaucoup de floraux s’effondrent à midi.', 'Un portrait à la lumière du soir', 'feminin', 4, 'les-deux', ['mi-saison', 'hiver'], ['rose', 'iris', 'elegant']),
  P('Effluve Nuit', 'Effluve', 2025, 'Composition maison', 'ambre', ['Safran', 'Cardamome'], ['Ambre', 'Rose', 'Encens'], ['Oud', 'Vanille', 'Bois de santal'],
    'Notre extrait du soir : ambre, encens et une pointe d’oud. Le plus tenace de la maison.', 'Une nuit chaude', 'mixte', 5, 'soir', ['hiver', 'mi-saison'], ['ambre', 'oud', 'opulent']),
];

// Un identifiant stable, derive du nom : il sert d ancre dans l URL de la fiche.
for (const p of PARFUMS) {
  p.id = (p.maison + '-' + p.nom).toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  p.teinte = (FAMILLES.find((f) => f.cle === p.famille) || FAMILLES[0]).teinte;
}

/* Les VRAIES photos produit, recuperees et servies en local (dossier photos/).
   ⚠️ Un parfum absent de cette liste garde le flacon dessine : mieux vaut un
   dessin coherent qu'un cadre vide. Pour en ajouter une, deposer le fichier
   <identifiant>.jpg dans photos/ et ajouter l'identifiant ici.
   ⚠️ Ce sont des visuels de presse des maisons. Un revendeur qui affiche les
   parfums qu'il VEND est dans son role ; verifier tout de meme avec la boutique
   avant une mise en ligne marchande. */
const AVEC_PHOTO = new Set(["dior-j-adore","viktor-rolf-flowerbomb","marc-jacobs-daisy","prada-paradoxe","louis-vuitton-rose-des-vents","mugler-alien","ex-nihilo-fleur-narcotique","frederic-malle-carnal-flower","serge-lutens-iris-silver-mist","guerlain-shalimar","yves-saint-laurent-black-opium","yves-saint-laurent-la-nuit-de-l-homme","dior-ambre-nuit","viktor-rolf-spicebomb-extreme","serge-lutens-ambre-sultan","by-kilian-angel-s-share","tom-ford-tobacco-vanille","chanel-coco-mademoiselle","yves-saint-laurent-opium","hermes-terre-d-hermes","le-labo-santal-33","dior-bois-d-argent","guerlain-vetiver","tom-ford-oud-wood","lalique-encre-noire","chanel-bleu-de-chanel","byredo-gypsy-water","diptyque-tam-dao","mancera-cedrat-boise","dolce-gabbana-light-blue","giorgio-armani-acqua-di-gio-profumo","dior-eau-sauvage","acqua-di-parma-colonia","creed-silver-mountain-water","hermes-eau-des-merveilles","calvin-klein-ck-one","creed-virgin-island-water","dior-oud-ispahan","nasomatto-black-afgano","creed-royal-oud","amouage-interlude-man","maison-francis-kurkdjian-oud-satin-mood","lancome-la-vie-est-belle","aquolina-pink-sugar","parfums-de-marly-delina","maison-francis-kurkdjian-baccarat-rouge-540","parfums-de-marly-layton","dior-sauvage","cartier-declaration","frederic-malle-portrait-of-a-lady","l-artisan-parfumeur-safran-troublant","tom-ford-tuscan-leather","chanel-cuir-de-russie","knize-knize-ten","tom-ford-ombre-leather","vilhelm-parfumerie-mango-skin","diptyque-philosykos","guerlain-mitsouko","mdci-chypre-palatin","clinique-aromatics-elixir","yves-saint-laurent-libre","carolina-herrera-good-girl","giorgio-armani-si","creed-aventus","creed-green-irish-tweed","guerlain-l-homme-ideal","frederic-malle-musc-ravageur","le-labo-vanille-44","byredo-bal-d-afrique","byredo-blanche","jo-malone-wood-sage-sea-salt","frederic-malle-vetiver-extraordinaire","nishane-ani","parfums-de-marly-herod","parfums-de-marly-kalan","frederic-malle-cologne-indelebile","atelier-cologne-rose-anonyme","tom-ford-tobacco-oud","chloe-nomade","tom-ford-oud-minerale","tauer-l-air-du-desert-marocain","amouage-reflection-man","xerjoff-erba-pura","by-kilian-straight-to-heaven","diptyque-fleur-de-peau","diptyque-eau-duelle","marc-antoine-barrois-ganymede","louis-vuitton-ombre-nomade","essential-parfums-bois-imperial","etat-libre-d-orange-fils-de-dieu","maison-francis-kurkdjian-grand-soir","tom-ford-neroli-portofino","penhaligon-s-halfeti","maison-margiela-jazz-club","maison-margiela-by-the-fireplace","mugler-angel","dior-hypnotic-poison","dior-poison-girl","versace-eros","jean-paul-gaultier-le-male","dior-dior-homme","dior-fahrenheit","guerlain-habit-rouge","hermes-un-jardin-sur-le-nil","l-occitane-terre-de-lumiere","la-prairie-silver-rain","tom-ford-amber-absolute","frederic-malle-iris-poudre","serge-lutens-rose-de-nuit","indult-tihota","maison-francis-kurkdjian-aqua-universalis","initio-oud-for-greatness","initio-side-effect","nishane-ani-rose","creed-bois-du-portugal","tom-ford-vanilla-sex","louis-vuitton-ombre-nomade-extrait","escentric-molecules-molecule-01","frederic-malle-fleur-de-cassie","tom-ford-bois-marocain","tom-ford-costa-azzurra","tom-ford-soleil-blanc","le-labo-bergamote-22","le-labo-another-13"]);
for (const p of PARFUMS) if (AVEC_PHOTO.has(p.id)) p.photo = './photos/' + p.id + '.jpg';

/* ⚠️ On ne garde QUE les parfums dont on a la vraie photo. Melanger des photos
   produit et des flacons dessines dans la meme grille se voit immediatement et
   fait bricole - or c'est une boutique. Les references sans image sortent donc
   du catalogue ; pour en remettre une, il suffit de deposer sa photo.
   Le questionnaire s'adapte tout seul : l'echelle de reduction est calculee a
   partir du nombre reel de parfums, elle n'est ecrite nulle part. */
for (let i = PARFUMS.length - 1; i >= 0; i -= 1) if (!PARFUMS[i].photo) PARFUMS.splice(i, 1);
