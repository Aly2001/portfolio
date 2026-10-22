// ─────────────────────────────────────────────────────────────
// Fabrique les « fiches » de l'assistant à partir de profil.js.
// Le site et l'assistant lisent la MÊME source : ils ne peuvent
// pas se contredire. À relancer après chaque changement de profil.js :
//     npm run fiches
// ─────────────────────────────────────────────────────────────
import { writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { profil, projets, parcours, langues, competences, ETATS, lieu } from '../src/data/profil.js'

const fiches = []
const ajouter = (id, source, texte) => {
  fiches.push({ id, source, texte, empreinte: createHash('sha256').update(texte).digest('hex').slice(0, 16) })
}

ajouter('profil', { libelle: 'Présentation', sous: 'Accueil', ancre: '#accueil' },
  `${profil.nom} est ${profil.titre}, étudiant en Master 2 Ingénierie des Systèmes Complexes à l'EILCO (Calais). ` +
  `Sa devise : « ${profil.accroche} » Il collecte, nettoie et modélise les données, puis en fait des outils que les gens utilisent vraiment. ` +
  'Domaines : data analyse, data science, data engineering, machine learning et IA générative.')

ajouter('disponibilite', { libelle: 'Me contacter', sous: 'Contact', ancre: '#contact' },
  `${profil.nom} est ${profil.disponible ? 'ouvert aux opportunités : stage, projet data ou collaboration' : 'actuellement en poste'}, ` +
  `mobile ${profil.mobilite}. Il est basé à ${profil.ville}. Pour en discuter, le plus simple est de lui écrire à ${profil.email}.`)

ajouter('contact', { libelle: 'Me contacter', sous: 'Contact', ancre: '#contact' },
  `Pour contacter ${profil.nom} : e-mail ${profil.email}, LinkedIn ${profil.linkedin}, GitHub ${profil.github}. ` +
  'Son CV est téléchargeable sur le site.')

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
    `Compétences en ${c.domaine.toLowerCase()} : ${c.outils.join(', ')}.`)
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
