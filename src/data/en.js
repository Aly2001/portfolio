// ─────────────────────────────────────────────────────────────
// VERSION ANGLAISE DU CONTENU (textes validés par Aly)
// Même organisation que profil.js : chaque élément est retrouvé par son « id ».
// Seuls les textes sont ici ; les liens, chiffres et outils restent dans profil.js.
// ─────────────────────────────────────────────────────────────
import { quaiNord } from './profil.js'

// « 775 550 » -> « 775,550 » : un seul chiffre à mettre à jour, dans profil.js.
const passages = quaiNord.passages.replace(/\s/g, ',')

export const profilEn = {
  titre: 'Data Scientist & AI Developer',
  accroche: 'From real data to real users.',
  presentation:
    "a data scientist and AI developer, in the final year of a Master's in Complex Systems Engineering at EILCO (Calais, France). I collect, clean and model data, then turn it into tools people actually use.",
  mobilite: 'anywhere in France',
  specialite: 'Data & generative AI',
}

export const ETATS_EN = { 'en-ligne': 'Live', 'en-cours': 'In progress', termine: 'Completed' }

// Outils dont le nom se traduit (les autres, comme « Python », restent identiques).
export const OUTILS_EN = {
  'Régression logistique': 'Logistic regression',
  'Statistiques descriptives': 'Descriptive statistics',
  'Visualisation de données': 'Data visualization',
  Tests: 'Testing',
}

export const projetsEn = {
  'quai-nord': {
    contexte: 'Personal project · 2026',
    resume: 'Predicting the delay risk of a regional train in northern France before you leave.',
    texte: `SNCF delays are collected every 5 minutes and matched with timetables and weather: ${passages} train runs analyzed. Nora, an AI assistant, then guides travelers to the bus, tram or metro, and the code checks every one of her answers.`,
    chaine: ['Collection', 'Cleaning', 'Model', 'Website', 'Nora'],
    chaineActive: 'Model',
    alt: 'Map of regional train delays in Quai Nord',
  },
  iot: {
    titre: 'IoT predictive maintenance',
    contexte: 'EILCO · 2026 – 2027',
    texte: "An ESP32 sensor listens to a machine's vibrations; a model will detect faults, with real-time monitoring.",
    schema: [['Sensor', 'vibrations'], ['ESP32', 'measures'], ['Model', 'detects'], ['Firebase', 'monitoring']],
    alt: 'Diagram: sensor, ESP32, model, Firebase monitoring',
  },
  'agent-rag': {
    titre: 'LLM + RAG agent for a hotel',
    contexte: 'Personal project · 2026',
    texte: "An agent that answers guests by searching the hotel's own documents.",
    schema: [['Question', 'from guest'], ['Search', 'documents'], ['LLM', 'drafts'], ['Answer', 'with sources']],
    alt: 'Diagram: question, search, LLM, answer',
  },
  'avis-amazon': {
    titre: 'Customer reputation with NLP',
    contexte: 'Personal project · 2025',
    texte: '568,454 Amazon reviews analyzed: sentiment (93.5% accuracy), 5 complaint topics and monthly trends.',
    alt: 'Rating distribution of 568,454 Amazon reviews',
  },
  attrition: {
    titre: 'HR attrition',
    contexte: 'Personal project · 2026',
    texte: 'Predicting employee turnover (1,470 employees): logistic regression and Random Forest, evaluated on recall. Employees who work overtime leave about three times more often.',
    alt: 'Departures by overtime',
  },
  'prix-maisons': {
    titre: 'House prices',
    contexte: 'Personal project · 2026',
    texte: 'Predicting house sale prices: Ridge tuned with GridSearchCV, R² of 0.89 on the test set.',
    alt: 'Actual vs. predicted price from the Ridge model',
  },
  'rdv-medicaux': {
    titre: 'Medical appointments',
    contexte: "Bachelor's final project · 2024 – 2025",
    texte: 'A web application: authentication, calendar and patient records.',
    alt: 'Login page of the appointment application',
  },
}

export const PAYS_EN = { France: 'France', Maroc: 'Morocco', Mali: 'Mali' }

export const parcoursEn = {
  calais: { titre: "Master's in Complex Systems Engineering (final year)" },
  'bank-al-maghreb': {
    annee: 'Summer 2024',
    titre: 'Data Scientist Intern',
    points: [
      'Data cleaning and preparation in Python',
      'Data analysis in SQL and Python, with automated updates',
      'Power BI dashboards for decision-making',
    ],
  },
  meknes: { titre: "Bachelor's in Mathematics and Computer Science" },
  kenieba: { titre: 'Scientific Baccalaureate (high school diploma)' },
}

export const languesEn = ['French: fluent (C2)', 'English: upper-intermediate (B2)', 'Bambara (native language)']

export const competencesEn = {
  data: 'Data & machine learning',
  analyse: 'Analytics & BI',
  ia: 'Generative AI',
  dev: 'Development',
  bd: 'Databases',
  cloud: 'Cloud & visualization',
}
