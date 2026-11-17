// ─────────────────────────────────────────────────────────────
// Fabrique les « fiches » de l'assistant à partir de profil.js.
// Le site et l'assistant lisent la MÊME source : ils ne peuvent
// pas se contredire. À relancer après chaque changement de profil.js :
//     npm run fiches
// ─────────────────────────────────────────────────────────────
import { writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { profil, projets, parcours, langues, competences, ETATS, lieu, quaiNord, recherche, formations, interets, assistant, methode } from '../src/data/profil.js'

const fiches = []
const ajouter = (id, source, texte) => {
  fiches.push({ id, source, texte, empreinte: createHash('sha256').update(texte).digest('hex').slice(0, 16) })
}

ajouter('profil', { libelle: 'Présentation', sous: 'Accueil', ancre: '#accueil' },
  `${profil.nom} est ${profil.titre}, étudiant en Master 2 Ingénierie des Systèmes Complexes à l'EILCO (Calais). ` +
  `Sa devise : « ${profil.accroche} » Il collecte, nettoie et modélise les données, puis en fait des outils que les gens utilisent vraiment. ` +
  'Domaines : data analyse, data science, data engineering, machine learning et IA générative.')

// Disponibilité : une fiche par façon de poser la question (date, type de poste),
// pour que la recherche par le sens la retrouve quelle que soit la formulation.
ajouter('disponibilite', { libelle: 'Me contacter', sous: 'Contact', ancre: '#contact' },
  `${profil.nom} recherche un ${recherche.type}, disponible à partir de ${recherche.debut}, ` +
  `avec une mobilité ${recherche.mobilite}. Il vit à Boulogne-sur-Mer et étudie à ${profil.ville}. ` +
  `Pour lui proposer un stage ou un entretien, il suffit de lui écrire à ${profil.email}.`)

ajouter('recherche-postes', { libelle: 'Me contacter', sous: 'Contact', ancre: '#contact' },
  `Postes de stage recherchés par ${profil.nom} : ${recherche.postes.join(' ou ')}. ` +
  `Domaines visés : ${recherche.domaines}. Stage de 6 mois à partir de ${recherche.debut}, partout en France. ` +
  `Sa motivation : ${recherche.motivation}`)

// Les atouts : uniquement des faits déjà présents dans le profil, rassemblés pour
// répondre à « Pourquoi le recruter ? » ou « Quels sont ses points forts ? ».
const phare = projets.find((p) => p.phare)
ajouter('atouts', { libelle: 'Présentation', sous: 'Accueil', ancre: '#accueil' },
  `Points forts d'${profil.nom}, pourquoi le recruter : il mène un projet de bout en bout, de la collecte ` +
  `des données jusqu'à une application en ligne (${phare.titre}, ${quaiNord.passages} passages analysés, site public) ; ` +
  `il a une expérience en entreprise comme stagiaire Data Scientist chez Bank Al-Maghreb ; ` +
  `il obtient des résultats mesurés (93,5 % d'exactitude en analyse de sentiment, R² de 0,89 en régression) ; ` +
  `il couvre à la fois l'analyse de données (SQL, Power BI) et le machine learning et l'IA générative (RAG, Gemini) ; ` +
  `il déploie dans le cloud (Google Cloud, Docker, Firebase) et ajoute des contrôles par le code et des tests automatisés.`)

// Un recruteur dit « certificats », « certifications » ou « formations » : la fiche
// emploie ces trois mots, pour être retrouvée quelle que soit la formulation.
ajouter('formations-complementaires', { libelle: 'Parcours', sous: 'Parcours', ancre: '#parcours' },
  `Certifications, certificats et formations complémentaires d'${profil.nom} : ${formations.join(' ; ')}. ` +
  'Il s\'agit de formations suivies en dehors de son master.')

// L'assistant lui-même : « Comment es-tu conçu ? », « Es-tu une IA ? », « Sur quoi te bases-tu ? ».
ajouter('assistant', { libelle: 'Assistant IA', sous: 'Accueil', ancre: '#accueil' },
  `L'assistant IA de ce portfolio (celui qui répond aux visiteurs). ` +
  `Présentation à donner telle quelle, à la première personne, quand on demande qui il est ou comment il fonctionne : « ${assistant.presentation} » ` +
  `Détails techniques, à donner SEULEMENT si on les demande explicitement, en deux phrases simples : ${assistant.technique}. ` +
  `Limites : ${assistant.limites}.`)

ajouter('methode', { libelle: 'Présentation', sous: 'Accueil', ancre: '#accueil' },
  `Méthode de travail d'${profil.nom}, sa façon de mener un projet data ou IA : ${methode.join(' ; ')}.`)

ajouter('interets', { libelle: 'Présentation', sous: 'Accueil', ancre: '#accueil' },
  `Centres d'intérêt de ${profil.nom} : ${interets.join(' ; ')}.`)

ajouter('contact', { libelle: 'Me contacter', sous: 'Contact', ancre: '#contact' },
  `Pour contacter ${profil.nom} : e-mail ${profil.email}, LinkedIn ${profil.linkedin}, GitHub ${profil.github}. ` +
  'Son CV est téléchargeable sur le site.')

// Tous les liens d'Aly, réunis : seuls ceux renseignés dans profil.js apparaissent.
// Le portfolio est le site où se trouve déjà le visiteur.
const liens = [
  ['LinkedIn', profil.linkedin], ['GitHub', profil.github], ['site de Quai Nord', projets.find((p) => p.site)?.site],
  ['chaîne YouTube', profil.youtube], ['TikTok', profil.tiktok],
].filter(([, url]) => url)
ajouter('liens', { libelle: 'Me contacter', sous: 'Contact', ancre: '#contact' },
  `Liens d'${profil.nom} : ` + liens.map(([nom, url]) => `${nom} : ${url}`).join(' ; ') + '. ' +
  `Son portfolio est ${profil.site} : c'est le site sur lequel se trouve le visiteur.`)

// Un projet = plusieurs petites fiches plutôt qu'une longue.
// Règle générale : une fiche trop longue « dilue » son sens, et la
// recherche la retrouve moins bien (Quai Nord n'atteignait que 0,55).
// Toutes les fiches d'un projet pointent vers le même billet.
projets.forEach((p) => {
  const source = { libelle: p.titre, sous: 'Projet', ancre: `#projet-${p.id}` }
  const nom = `Le projet ${p.titre}`
  const resume = [`${nom} (${p.contexte}) : ${p.resume ? p.resume + ' ' : ''}${p.texte}`]
  resume.push(`État : ${ETATS[p.etat].toLowerCase()}.`)
  if (p.site) resume.push(`Site en ligne : ${p.site}.`)
  resume.push(p.code ? `Code : ${p.code}.` : 'Le code n\'est pas encore publié.')
  ajouter(`projet-${p.id}`, source, resume.join(' '))
  if (p.etapes) {
    ajouter(`projet-${p.id}-demarche`, source,
      `${nom}, la démarche. ` + p.etapes.map((e) => `${e.titre} : ${e.texte}`).join(' '))
  }
  if (p.complement) ajouter(`projet-${p.id}-complement`, source, `${nom}, en détail. ${p.complement}`)
  ajouter(`projet-${p.id}-outils`, source, `${nom}, les outils : ${p.outils.join(', ')}.`)
})

parcours.forEach((e) => {
  ajouter(`parcours-${e.id}`, { libelle: e.titre, sous: 'Parcours', ancre: `#etape-${e.id}` },
    `${e.annee} : ${e.titre}, ${lieu(e)}${e.enCours ? ', en cours' : ''}.` + (e.points ? ' ' + e.points.join(' ; ') + '.' : ''))
})

ajouter('langues', { libelle: 'Langues', sous: 'Parcours', ancre: '#parcours' },
  `Langues parlées par ${profil.nom} : ${langues.join(', ')}.`)

competences.forEach((c) => {
  ajouter(`competences-${c.id}`, { libelle: c.domaine, sous: 'Compétences', ancre: `#competence-${c.id}` },
    `Compétences d'Aly Keita, domaine « ${c.domaine} » : ${c.outils.join(', ')}.`)
})

// Garde-fou général : aucune fiche ne doit contenir un numéro de téléphone.
const telephone = /(\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}/
const fautives = fiches.filter((f) => telephone.test(f.texte))
if (fautives.length) {
  console.error('ARRÊT : numéro de téléphone trouvé dans', fautives.map((f) => f.id).join(', '))
  process.exit(1)
}

writeFileSync(new URL('../api/fiches.json', import.meta.url), JSON.stringify(fiches, null, 2) + '\n')
console.log(`${fiches.length} fiches écrites dans api/fiches.json`)
