// ─────────────────────────────────────────────────────────────
// LA LANGUE DE LA PAGE, et le contenu dans cette langue.
// alykeita.com = français, alykeita.com/en = anglais. Changer de langue = changer de page :
// chaque version a sa propre adresse, que Google indexe et qu'on peut partager.
// Les composants lisent leur contenu ICI (jamais directement dans profil.js).
// ─────────────────────────────────────────────────────────────
import * as fr from './profil.js'
import { profilEn, ETATS_EN, OUTILS_EN, projetsEn, PAYS_EN, parcoursEn, languesEn, competencesEn } from './en.js'

export const LANGUE =
  typeof window !== 'undefined' && /^\/en(\/|$)/.test(window.location.pathname) ? 'en' : 'fr'
export const EN = LANGUE === 'en'

// Adresse de chaque version (pour le sélecteur et les liens).
export const ADRESSES = { fr: '/', en: '/en' }

const outils = (liste) => (EN ? liste.map((o) => OUTILS_EN[o] ?? o) : liste)

export const profil = EN ? { ...fr.profil, ...profilEn } : fr.profil
export const ETATS = EN ? ETATS_EN : fr.ETATS
export const langues = EN ? languesEn : fr.langues

export const projets = fr.projets.map((p) => {
  if (!EN) return p
  const t = projetsEn[p.id] ?? {}
  const visuel = { ...p.visuel, ...(t.alt && { alt: t.alt }), ...(t.schema && { schema: t.schema }) }
  return { ...p, ...t, visuel, outils: outils(p.outils) }
})

export const parcours = EN ? fr.parcours.map((e) => ({ ...e, ...parcoursEn[e.id], pays: PAYS_EN[e.pays] ?? e.pays })) : fr.parcours

export const competences = fr.competences.map((c) =>
  EN ? { ...c, domaine: competencesEn[c.id] ?? c.domaine, outils: outils(c.outils) } : c)

export const lieu = fr.lieu

// Les sources renvoyées par l'assistant sont écrites en français (elles viennent des fiches) :
// on les traduit avec les mêmes données, sans liste à tenir à part.
const SOURCES_EN = {
  Accueil: 'Home', Présentation: 'About', 'Assistant IA': 'AI assistant',
  Contact: 'Contact', 'Me contacter': 'Contact me', Projet: 'Project',
  Compétences: 'Skills', Parcours: 'Background', Langues: 'Languages',
  ...Object.fromEntries(fr.projets.map((p) => [p.titre, projetsEn[p.id]?.titre ?? p.titre])),
  ...Object.fromEntries(fr.parcours.map((e) => [e.titre, parcoursEn[e.id]?.titre ?? e.titre])),
  ...Object.fromEntries(fr.competences.map((c) => [c.domaine, competencesEn[c.id] ?? c.domaine])),
}
export const traduireSource = (texte) => (EN ? SOURCES_EN[texte] ?? texte : texte)

// Les textes de l'interface.
const TEXTES = {
  fr: {
    evitement: 'Aller au contenu',
    nav: { projets: 'Projets', competences: 'Compétences', parcours: 'Parcours', contact: 'Contact' },
    menuOuvrir: 'Ouvrir le menu', menuFermer: 'Fermer le menu', sections: 'Sections', langue: 'Langue',
    disponible: 'Ouvert aux opportunités',
    jeSuis: 'Je suis',
    voirProjets: 'Voir mes projets', meContacter: 'Me contacter',
    baseA: 'Basé à', specialite: 'Spécialité', languesTitre: 'Langues', languesCourtes: 'Français, anglais, bambara', languesDeuxPoints: 'Langues :',
    portrait: "Portrait d'Aly Keita",
    projetsTitre: 'Projets',
    projetsPhrase: (n) => `${['Zéro', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf', 'Dix'][n] ?? n} projets, de la collecte des données jusqu'à une application en ligne.`,
    phare: 'projet phare', etapes: 'Les étapes du projet',
    voirSite: 'Voir le site', leCode: 'Le code', voirCode: 'Voir le code', codeBientot: 'Code bientôt publié',
    competencesTitre: 'Compétences', competencesPhrase: "Les outils que j'utilise, rangés par domaine.",
    parcoursTitre: 'Parcours', parcoursPhrase: 'Du Mali à la France, en passant par le Maroc.', enCours: 'En cours',
    contactTitre: 'Travaillons ensemble.',
    contactPhrase: 'Un stage, un projet data ou une simple question : écrivez-moi, je réponds vite.',
    assistant: {
      suggestions: [
        'Quel stage recherche-t-il, et à partir de quand ?',
        'Quelle est son expérience en data science ?',
        'Quelles sont ses compétences en analyse de données ?',
        'Présentez-moi le projet Quai Nord',
      ],
      accueil: "Bonjour et bienvenue. Je suis l'assistant virtuel d'Aly Keita : je peux vous renseigner sur son parcours, ses compétences, ses projets et sa disponibilité.",
      horsService: "L'assistant n'est pas encore disponible. Je vous invite à contacter Aly directement par e-mail.",
      indisponible: "L'assistant est momentanément indisponible. Je vous invite à réessayer dans un instant, ou à contacter Aly directement par e-mail.",
      tropLong: 'La réponse prend plus de temps que prévu. Je vous invite à réessayer dans un instant, ou à contacter Aly directement par e-mail.',
      ecrire: 'Écrire à Aly', enSavoirPlus: 'Pour en savoir plus',
      titre: 'Assistant IA', sousTitre: 'Posez-moi vos questions sur Aly', fermer: "Fermer l'assistant",
      reflechit: "L'assistant réfléchit…", votreQuestion: 'Votre question', placeholder: 'Votre question…',
      demain: "Revenez demain pour d'autres questions", bientot: 'Bientôt disponible', envoyer: 'Envoyer la question',
      note: 'Réponses générées par une IA, qui peut se tromper. Pour un échange, écrivez à Aly.',
      bouton: 'Assistant IA', boutonSuite: ' : une question sur moi ?',
    },
  },
  en: {
    evitement: 'Skip to content',
    nav: { projets: 'Projects', competences: 'Skills', parcours: 'Background', contact: 'Contact' },
    menuOuvrir: 'Open the menu', menuFermer: 'Close the menu', sections: 'Sections', langue: 'Language',
    disponible: 'Open to opportunities',
    jeSuis: "I'm",
    voirProjets: 'See my projects', meContacter: 'Contact me',
    baseA: 'Based in', specialite: 'Focus', languesTitre: 'Languages', languesCourtes: 'French, English, Bambara', languesDeuxPoints: 'Languages:',
    portrait: 'Portrait of Aly Keita',
    projetsTitre: 'Projects',
    projetsPhrase: (n) => `${['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'][n] ?? n} projects, from data collection to a live application.`,
    phare: 'featured project', etapes: 'Project steps',
    voirSite: 'Visit the site', leCode: 'Source code', voirCode: 'View the code', codeBientot: 'Code coming soon',
    competencesTitre: 'Skills', competencesPhrase: 'The tools I use, grouped by field.',
    parcoursTitre: 'Background', parcoursPhrase: 'From Mali to France, by way of Morocco.', enCours: 'Current',
    contactTitre: "Let's work together.",
    contactPhrase: 'An internship, a data project or just a question: write to me, I reply quickly.',
    assistant: {
      suggestions: [
        'What internship is he looking for, and from when?',
        'What is his data science experience?',
        'What are his data analysis skills?',
        'Tell me about the Quai Nord project',
      ],
      accueil: "Hello and welcome. I'm Aly Keita's virtual assistant: I can tell you about his background, skills, projects and availability.",
      horsService: 'The assistant is not available yet. Please contact Aly directly by email.',
      indisponible: 'The assistant is temporarily unavailable. Please try again in a moment, or contact Aly directly by email.',
      tropLong: 'The answer is taking longer than expected. Please try again in a moment, or contact Aly directly by email.',
      ecrire: 'Email Aly', enSavoirPlus: 'Learn more',
      titre: 'AI assistant', sousTitre: 'Ask me anything about Aly', fermer: 'Close the assistant',
      reflechit: 'The assistant is thinking…', votreQuestion: 'Your question', placeholder: 'Your question…',
      demain: 'Come back tomorrow for more questions', bientot: 'Coming soon', envoyer: 'Send the question',
      note: 'Answers are generated by an AI, which can make mistakes. To get in touch, email Aly.',
      bouton: 'AI assistant', boutonSuite: ': a question about me?',
    },
  },
}

export const T = TEXTES[LANGUE]
