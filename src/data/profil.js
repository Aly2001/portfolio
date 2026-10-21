// ─────────────────────────────────────────────────────────────
// SOURCE UNIQUE DU CONTENU
// Tout le texte du site vient d'ici. Pour modifier une info,
// on la change UNE fois dans ce fichier, et toutes les sections
// (et plus tard l'assistant RAG) suivent automatiquement.
// ─────────────────────────────────────────────────────────────

export const profil = {
  nom: 'Aly Keita',
  titre: 'Data Scientist & Développeur IA',
  accroche:
    "Je construis des outils qui partent de vraies données et arrivent jusqu'aux utilisateurs.",
  disponible: true, // affiche « Ouvert aux opportunités »
  email: 'alykeita295@gmail.com',
  linkedin: 'https://www.linkedin.com/in/aly-keita-306703340/',
  github: 'https://github.com/Aly2001',

  // Chemin du CV PUBLIC (sans numéro de téléphone), à déposer dans /public.
  // Tant que la valeur est null, les boutons « CV » sont masqués.
  // Exemple quand le fichier sera prêt : '/cv-aly-keita.pdf'
  cvUrl: null,
}

// Chiffre « EN DIRECT » lu sur Quai Nord.
// null = on n'affiche pas de chiffre (jamais de chiffre inventé).
// Il sera branché sur Quai Nord dans une prochaine étape.
export const direct = {
  pourcentageRisque: null,
}

// États possibles d'un projet : 'en-ligne', 'en-cours', 'termine'
export const ETATS = {
  // court : tableau sur ordinateur · mobile : tableau sur téléphone
  // (vide = seulement le voyant) · long : pastilles des billets
  'en-ligne': { court: 'EN LIGNE', mobile: '', long: 'En ligne' },
  'en-cours': { court: 'EN COURS', mobile: '', long: 'En cours' },
  termine: { court: 'TERMINÉ', mobile: 'FINI', long: 'Terminé' },
}

export const projets = [
  {
    id: 'quai-nord',
    heure: '09:12',
    code: 'QUAI NORD',
    destination: 'Prédire le retard des TER',
    destinationCourte: 'Prédire le retard des TER',
    etat: 'en-ligne',
    phare: true,
    titre: 'Quai Nord',
    sousTitre: "Prévoir le retard d'un TER des Hauts-de-France avant de partir.",
    site: 'https://quai-nord.web.app',
    code_url: 'https://github.com/Aly2001/quai-nord',
    chaine: ['Collecte', 'Nettoyage', 'Modèle', 'Site', 'Nora'],
    chaineActive: 'Modèle',
    chiffres: [
      { valeur: '5 min', libelle: 'une collecte en continu' },
      { valeur: '65 000', libelle: 'passages analysés' },
      { valeur: '6 villes', libelle: 'bus, tram et métro avec Nora' },
    ],
    etapes: [
      {
        titre: 'Le problème',
        texte:
          "Les applications disent si un train EST en retard, jamais s'il RISQUE de l'être, la veille, pour choisir le bon.",
      },
      {
        titre: 'Les données',
        texte:
          'Les retards en temps réel de la SNCF, collectés toutes les 5 minutes sur une VM Google Cloud, plus les horaires et la météo.',
      },
      {
        titre: 'La méthode',
        texte:
          'Nettoyage (TER seulement, prévisions écartées), facteurs du retard, lissage bayésien, puis un modèle évalué sur des semaines jamais vues.',
      },
      {
        titre: 'Le résultat',
        texte:
          'Un site en ligne, indexé par Google, et Nora, une IA dont le code vérifie chaque réponse. Le modèle de prédiction arrive mi-novembre.',
      },
      {
        titre: "Ce que j'ai appris",
        texte: "Ne jamais croire le premier graphique ; une IA peut inventer, le code doit vérifier.",
      },
    ],
    outils: ['Python', 'Pandas', 'SQLite', 'React', 'Vite', 'FastAPI', 'Docker', 'Google Cloud', 'Firebase', 'Gemini', 'Vitest', 'Pytest'],
  },
  {
    id: 'iot',
    heure: '10:40',
    code: 'IOT ESP32',
    destination: 'Détecter les pannes de machines',
    destinationCourte: 'Détecter les pannes',
    etat: 'termine',
    titre: 'Maintenance prédictive IoT',
    contexte: 'EILCO · 2026 – 2027',
    texte:
      "Un capteur ESP32 écoute les vibrations d'une machine ; un modèle repère les défauts, suivis en temps réel sur Firebase.",
    outils: ['ESP32', 'Python', 'Machine learning', 'Firebase'],
    code_url: null,
  },
  {
    id: 'agent-rag',
    heure: '11:05',
    code: 'AGENT RAG',
    destination: "Répondre aux clients d'un hôtel",
    destinationCourte: 'Répondre aux clients',
    etat: 'termine',
    titre: 'Agent conversationnel LLM + RAG',
    contexte: 'Projet personnel · 2026',
    texte:
      "Un agent qui répond aux clients d'un hôtel en cherchant la réponse dans les documents de l'établissement.",
    outils: ['LLM', 'RAG', 'Python'],
    code_url: null,
  },
  {
    id: 'attrition',
    heure: '14:30',
    code: 'ATTRITION RH',
    destination: 'Prédire les départs et les prix',
    destinationCourte: 'Départs et prix',
    etat: 'termine',
    titre: 'Attrition RH et prix immobilier',
    contexte: 'Projets personnels · 2026',
    texte:
      "Prédire le départ d'un employé (régression logistique, Random Forest) et le prix d'une maison (Ridge, Lasso, GridSearchCV).",
    outils: ['Scikit-learn', 'Pandas', 'Random Forest'],
    code_url: 'https://github.com/Aly2001',
  },
  {
    id: 'avis-amazon',
    heure: '16:15',
    code: 'AVIS AMAZON',
    destination: '568 000 avis analysés',
    destinationCourte: '568 000 avis analysés',
    etat: 'termine',
    titre: 'Réputation client par le NLP',
    contexte: 'Projet personnel · 2025',
    texte:
      "568 000 avis Amazon analysés pour en tirer 5 causes d'insatisfaction : TF-IDF, régression logistique, LDA et séries temporelles.",
    outils: ['NLP', 'TF-IDF', 'LDA', 'Séries temporelles'],
    code_url: 'https://github.com/Aly2001/avis-clients-projet',
  },
  {
    id: 'rdv-medicaux',
    heure: '18:00',
    code: 'RDV MÉDICAUX',
    destination: 'Une application web complète',
    destinationCourte: 'Application web',
    etat: 'termine',
    titre: 'Rendez-vous médicaux',
    contexte: 'Fin de Licence · 2024 – 2025',
    texte: 'Une application web avec authentification, calendrier et dossiers patients.',
    outils: ['Django', 'SQLite', 'JavaScript'],
    code_url: 'https://github.com/Aly2001/Aly-Keita',
  },
]

export const parcours = [
  { annee: '2021', lieu: 'Kéniéba', pays: 'Mali', titre: 'Baccalauréat scientifique', detail: 'Lycée LKBA' },
  {
    annee: '2022 – 2024',
    lieu: 'Meknès',
    pays: 'Maroc',
    titre: 'Licence Mathématiques-Informatique',
    detail: 'Faculté des Sciences Moulay Ismail',
  },
  {
    annee: 'Été 2024',
    lieu: 'Bank Al-Maghreb',
    pays: 'Meknès',
    titre: 'Stagiaire Data Scientist',
    detail: 'Modèle de risque client, SQL et Python, tableaux de bord Power BI',
  },
  {
    annee: '2025 – 2027',
    lieu: 'Calais',
    pays: 'France',
    titre: 'Master 2 Ingénierie des Systèmes Complexes',
    detail: 'EILCO',
  },
]

export const langues = ['Français courant (C2)', 'Anglais intermédiaire', 'Bambara (langue maternelle)']

export const competences = [
  {
    pastille: 'D',
    domaine: 'Data et machine learning',
    outils: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PySpark', 'Hadoop', 'SQL'],
  },
  { pastille: 'IA', domaine: 'IA générative', outils: ['LLM', 'RAG', 'NLP'] },
  {
    pastille: 'W',
    domaine: 'Développement',
    outils: ['React', 'Node.js', 'FastAPI', 'Django', 'Flask', 'Java / Spring', 'C / C++', 'Tests', 'Git'],
  },
  { pastille: 'B', domaine: 'Bases de données', outils: ['Oracle', 'MySQL', 'MongoDB', 'Firebase'] },
  {
    pastille: 'C',
    domaine: 'Cloud et visualisation',
    outils: ['Google Cloud', 'Firebase', 'Docker', 'Power BI', 'Matplotlib', 'Seaborn'],
  },
]
