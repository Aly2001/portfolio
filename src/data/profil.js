// ─────────────────────────────────────────────────────────────
// SOURCE UNIQUE DU CONTENU
// Tout le texte du site vient d'ici, et l'assistant lit le même fichier
// (via « npm run fiches »). Une information se change UNE fois, ici.
// ─────────────────────────────────────────────────────────────

export const profil = {
  nom: 'Aly Keita',
  titre: 'Data Scientist & Développeur IA',
  accroche: "Des vraies données jusqu'aux utilisateurs.",
  presentation:
    "data scientist et développeur IA, en Master 2 Ingénierie des Systèmes Complexes à l'EILCO (Calais). Je collecte, nettoie et modélise les données, puis j'en fais des outils que les gens utilisent vraiment.",
  disponible: true, // affiche « Ouvert aux opportunités »
  mobilite: 'partout en France',
  ville: 'Calais',
  specialite: 'Data et IA générative',
  email: 'alykeita295@gmail.com',
  linkedin: 'https://www.linkedin.com/in/aly-keita-306703340/',
  github: 'https://github.com/Aly2001',

  // CV PUBLIC (sans numéro de téléphone), dans /public. null = boutons CV masqués.
  cvUrl: '/cv-aly-keita.pdf',
}

// Chiffres de Quai Nord, à UN seul endroit (ils grandissent chaque nuit).
export const quaiNord = {
  passages: '775 550',
}

// États possibles d'un projet : 'en-ligne', 'en-cours', 'termine'
export const ETATS = {
  'en-ligne': 'En ligne',
  'en-cours': 'En cours',
  termine: 'Terminé',
}

const GH = 'https://github.com/Aly2001/'

export const projets = [
  {
    id: 'quai-nord',
    phare: true,
    etat: 'en-ligne',
    titre: 'Quai Nord',
    contexte: 'Projet personnel · 2026',
    resume: "Prévoir le risque de retard d'un TER des Hauts-de-France avant de partir.",
    texte: `Les retards SNCF sont collectés toutes les 5 minutes, croisés avec les horaires et la météo : ${quaiNord.passages} passages analysés. Nora, une assistante IA, guide ensuite vers le bus, le tram ou le métro, et le code vérifie chacune de ses réponses.`,
    chaine: ['Collecte', 'Nettoyage', 'Modèle', 'Site', 'Nora'],
    chaineActive: 'Modèle',
    visuel: { image: '/projets/quai-nord-carte.webp', alt: 'Carte des retards TER de Quai Nord', largeur: 900, hauteur: 1315 },
    site: 'https://quai-nord.web.app',
    code: GH + 'quai-nord',
    outils: ['Python', 'Pandas', 'SQLite', 'FastAPI', 'React', 'Vite', 'Docker', 'Google Cloud', 'Firebase', 'Gemini', 'Vitest', 'Pytest'],
    // Lu seulement par l'assistant : la démarche détaillée.
    etapes: [
      { titre: 'Le problème', texte: "Les applications disent si un train EST en retard, jamais s'il RISQUE de l'être, la veille, pour choisir le bon." },
      { titre: 'Les données', texte: `Les retards en temps réel de la SNCF, collectés toutes les 5 minutes sur une VM Google Cloud, plus les horaires et la météo : ${quaiNord.passages} passages analysés.` },
      { titre: 'La méthode', texte: 'Nettoyage (TER seulement, prévisions écartées), facteurs du retard, lissage bayésien, puis un modèle évalué sur des semaines jamais vues.' },
      { titre: 'Le résultat', texte: 'Un site en ligne, indexé par Google, et Nora, une IA dont le code vérifie chaque réponse. Le modèle de prédiction arrive mi-novembre.' },
      { titre: "Ce que j'ai appris", texte: "Ne jamais croire le premier graphique ; une IA peut inventer, le code doit vérifier." },
    ],
    complement:
      "Nora est l'assistante IA de Quai Nord (Gemini, API FastAPI). Elle aide à prendre le bus, le tram ou le métro depuis la gare dans 6 villes. Son code vérifie chaque réponse : les adresses et les lignes inventées sont bloquées, et des quotas protègent le service.",
  },
  {
    id: 'iot',
    etat: 'en-cours',
    titre: 'Maintenance prédictive IoT',
    contexte: 'EILCO · 2026 – 2027',
    texte: "Un capteur ESP32 écoute les vibrations d'une machine ; un modèle doit repérer les défauts, avec un suivi en temps réel.",
    visuel: {
      schema: [['Capteur', 'vibrations'], ['ESP32', 'mesure'], ['Modèle', 'détecte'], ['Firebase', 'suivi']],
      alt: 'Schéma : capteur, ESP32, modèle, suivi Firebase',
    },
    code: null,
    outils: ['ESP32', 'Python', 'Machine learning', 'Firebase'],
  },
  {
    id: 'agent-rag',
    etat: 'termine',
    titre: 'Agent LLM + RAG pour un hôtel',
    contexte: 'Projet personnel · 2026',
    texte: "Un agent qui répond aux clients en cherchant la réponse dans les documents de l'établissement.",
    visuel: {
      schema: [['Question', 'du client'], ['Recherche', 'documents'], ['LLM', 'rédige'], ['Réponse', 'sourcée']],
      alt: 'Schéma : question, recherche, LLM, réponse',
    },
    code: null,
    outils: ['LLM', 'RAG', 'Python'],
  },
  {
    id: 'avis-amazon',
    etat: 'termine',
    titre: 'Réputation client par le NLP',
    contexte: 'Projet personnel · 2025',
    texte: "568 454 avis Amazon analysés : sentiment (93,5 % d'exactitude), 5 sujets d'insatisfaction et évolution mensuelle.",
    visuel: { image: '/projets/avis-notes.webp', alt: 'Répartition des notes de 568 454 avis Amazon', largeur: 1000, hauteur: 565 },
    code: GH + 'avis-clients-projet',
    outils: ['NLP', 'TF-IDF', 'Régression logistique', 'LDA', 'Pandas'],
  },
  {
    id: 'attrition',
    etat: 'termine',
    titre: 'Attrition RH',
    contexte: 'Projet personnel · 2026',
    texte: "Prédire le départ d'un employé (1 470 salariés) : régression logistique et Random Forest, évalués sur le rappel. Ceux qui font des heures supplémentaires partent environ trois fois plus.",
    visuel: { image: '/projets/rh-heures-sup.webp', alt: 'Départs selon les heures supplémentaires', largeur: 571, hauteur: 432 },
    code: GH + 'hr-attrition-prediction',
    outils: ['Scikit-learn', 'Pandas', 'Régression logistique', 'Random Forest'],
  },
  {
    id: 'prix-maisons',
    etat: 'termine',
    titre: 'Prix des maisons',
    contexte: 'Projet personnel · 2026',
    texte: 'Prédire le prix de vente d’une maison : Ridge optimisé par GridSearchCV, R² de 0,89 sur le jeu de test.',
    visuel: { image: '/projets/maison-reel-predit.webp', alt: 'Prix réel contre prix prédit par le modèle Ridge', largeur: 722, hauteur: 700 },
    code: GH + 'prediction_prix_de_maison',
    outils: ['Scikit-learn', 'Ridge / Lasso', 'GridSearchCV'],
  },
  {
    id: 'rdv-medicaux',
    etat: 'termine',
    titre: 'Rendez-vous médicaux',
    contexte: 'Fin de Licence · 2024 – 2025',
    texte: 'Une application web : authentification, calendrier et dossiers patients.',
    visuel: { image: '/projets/rdv-connexion.webp', alt: "Page de connexion de l'application de rendez-vous", largeur: 1000, hauteur: 625 },
    code: GH + 'Aly-Keita',
    outils: ['Django', 'SQLite', 'JavaScript'],
  },
]

// Du plus récent au plus ancien. Chaque étape indique sa ville ET son pays.
// « points » = détails mis en avant (le stage) ; « enCours » = étape actuelle.
export const parcours = [
  { id: 'calais', annee: '2025 – 2027', titre: 'Master 2 Ingénierie des Systèmes Complexes',
    etablissement: 'EILCO', ville: 'Calais', pays: 'France', enCours: true },
  {
    id: 'bank-al-maghreb',
    annee: 'Été 2024',
    titre: 'Stagiaire Data Scientist',
    etablissement: 'Bank Al-Maghreb',
    ville: 'Meknès',
    pays: 'Maroc',
    points: [
      'Un modèle de prédiction pour évaluer le risque client',
      "L'analyse des données en SQL et Python, avec des mises à jour automatisées",
      "Des tableaux de bord Power BI pour l'aide à la décision",
    ],
  },
  { id: 'meknes', annee: '2022 – 2024', titre: 'Licence Mathématiques-Informatique',
    etablissement: 'Faculté des Sciences Moulay Ismail', ville: 'Meknès', pays: 'Maroc' },
  { id: 'kenieba', annee: '2021', titre: 'Baccalauréat scientifique',
    etablissement: 'Lycée LKBA', ville: 'Kéniéba', pays: 'Mali' },
]

// Une seule façon d'écrire un lieu, partout (site et assistant) : « EILCO, Calais (France) ».
export const lieu = (e) => `${e.etablissement}, ${e.ville}\u00a0(${e.pays})` // la ville et son pays ne se séparent jamais

export const langues = ['Français courant (C2)', 'Anglais intermédiaire', 'Bambara (langue maternelle)']

export const competences = [
  { id: 'data', domaine: 'Data et machine learning', outils: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PySpark', 'Hadoop', 'SQL'] },
  { id: 'ia', domaine: 'IA générative', outils: ['LLM', 'RAG', 'NLP', 'Gemini'] },
  { id: 'dev', domaine: 'Développement', outils: ['React', 'Node.js', 'FastAPI', 'Django', 'Flask', 'Java / Spring', 'C / C++', 'Tests', 'Git'] },
  { id: 'bd', domaine: 'Bases de données', outils: ['Oracle', 'MySQL', 'MongoDB', 'Firebase'] },
  { id: 'cloud', domaine: 'Cloud et visualisation', outils: ['Google Cloud', 'Firebase', 'Docker', 'Power BI', 'Matplotlib', 'Seaborn'] },
]
