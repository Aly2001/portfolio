// ─────────────────────────────────────────────────────────────
// Fabrique les « fiches » de l'assistant à partir de profil.js.
// Le site et l'assistant lisent la MÊME source : ils ne peuvent
// pas se contredire. À relancer après chaque changement de profil.js :
//     npm run fiches
// ─────────────────────────────────────────────────────────────
import { writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { profil, projets, parcours, langues, competences, ETATS } from '../src/data/profil.js'

const fiches = []
const ajouter = (id, source, texte) => {
  fiches.push({ id, source, texte, empreinte: createHash('sha256').update(texte).digest('hex').slice(0, 16) })
}

ajouter('profil', { libelle: 'Présentation', sous: 'ACCUEIL', ancre: '#hall' },
  `${profil.nom} est ${profil.titre}. ${profil.accroche} ` +
  'Il est étudiant en Master 2 Ingénierie des Systèmes Complexes à l\'EILCO (Calais). ' +
  'Domaines : data analyse, data science, data engineering, machine learning et IA générative.')

ajouter('disponibilite', { libelle: 'Me contacter', sous: 'CONTACT', ancre: '#contact' },
  `${profil.nom} est ${profil.disponible ? 'ouvert aux opportunités : stage, projet data ou collaboration' : 'actuellement en poste'}. ` +
  `${profil.mobilite}. Pour en discuter, le plus simple est de lui écrire à ${profil.email}.`)

ajouter('contact', { libelle: 'Me contacter', sous: 'CONTACT', ancre: '#contact' },
  `Pour contacter ${profil.nom} : e-mail ${profil.email}, LinkedIn ${profil.linkedin}, GitHub ${profil.github}. ` +
  'Son CV est téléchargeable sur le site.')

// Un projet = plusieurs petites fiches plutôt qu'une longue.
// Règle générale : une fiche trop longue « dilue » son sens, et la
// recherche la retrouve moins bien (Quai Nord n'atteignait que 0,55).
// Toutes les fiches d'un projet pointent vers le même billet.
projets.forEach((p, i) => {
  const source = { libelle: p.titre, sous: `BILLET ${i + 1}`, ancre: `#billet-${p.id}` }
  const nom = `Le projet ${p.titre}`
  const resume = [`${nom}${p.contexte ? ` (${p.contexte})` : ''} : ${p.sousTitre ?? p.texte}`]
  resume.push(`État : ${ETATS[p.etat].long.toLowerCase()}.`)
  if (p.site) resume.push(`Site en ligne : ${p.site}.`)
  if (p.code_url) resume.push(`Code : ${p.code_url}.`)
  ajouter(`projet-${p.id}`, source, resume.join(' '))

  if (p.etapes) {
    ajouter(`projet-${p.id}-demarche`, source,
      `${nom}, la démarche. ` + p.etapes.map((e) => `${e.titre} : ${e.texte}`).join(' '))
  }
  if (p.complement) ajouter(`projet-${p.id}-complement`, source, `${nom}, en détail. ${p.complement}`)
  const technique = [`${nom}, les outils : ${p.outils.join(', ')}.`]
  if (p.chiffres) technique.push('Chiffres : ' + p.chiffres.map((c) => `${c.valeur} ${c.libelle}`).join(', ') + '.')
  ajouter(`projet-${p.id}-outils`, source, technique.join(' '))
})

parcours.forEach((g) => {
  ajouter(`parcours-${g.id}`, { libelle: g.lieu, sous: 'LIGNE A', ancre: `#gare-${g.id}` },
    `${g.annee}, ${g.lieu} (${g.pays}) : ${g.titre}, ${g.detail}.`)
})

ajouter('langues', { libelle: 'Langues', sous: 'LIGNE A', ancre: '#ligne' },
  `Langues parlées par ${profil.nom} : ${langues.join(', ')}.`)

competences.forEach((c) => {
  ajouter(`competences-${c.pastille.toLowerCase()}`, { libelle: c.domaine, sous: 'CORRESPONDANCES', ancre: '#correspondances' },
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
