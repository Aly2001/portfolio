// Fabrique dist/en.html, la page anglaise (alykeita.com/en), à partir de dist/index.html.
// Même application ; seuls la langue et les textes lus par Google et les réseaux changent,
// pour que la version anglaise ait son propre titre, sa description et son adresse officielle.
import { readFileSync, writeFileSync } from 'node:fs'

const page = readFileSync('dist/index.html', 'utf8')
const remplacements = [
  ['<html lang="fr">', '<html lang="en">'],
  ['<title>Aly Keita · Data Scientist &amp; Développeur IA</title>', '<title>Aly Keita · Data Scientist &amp; AI Developer</title>'],
  [/<meta name="description" content="[^"]*" \/>/, '<meta name="description" content="Aly Keita, Data Scientist and AI Developer: Quai Nord (train delay prediction), machine learning, NLP and generative AI. Open to opportunities." />'],
  ['content="Aly Keita · Data Scientist & Développeur IA"', 'content="Aly Keita · Data Scientist & AI Developer"'],
  [`content="Des vraies données jusqu'aux utilisateurs."`, 'content="From real data to real users."'],
  ['<meta property="og:url" content="https://alykeita.com/" />', '<meta property="og:url" content="https://alykeita.com/en" />'],
  ['<meta property="og:locale" content="fr_FR" />', '<meta property="og:locale" content="en_US" />'],
  ['<link rel="canonical" href="https://alykeita.com/" />', '<link rel="canonical" href="https://alykeita.com/en" />'],
  ['"url": "https://alykeita.com/",', '"url": "https://alykeita.com/en",'],
  ['"jobTitle": "Data Scientist & Développeur IA",', '"jobTitle": "Data Scientist & AI Developer",'],
  [/"description": "Data scientist et[^"]*",/, `"description": "Data scientist and AI developer, in the final year of a Master's in Complex Systems Engineering at EILCO (Calais, France).",`],
  ['"IA générative",', '"Generative AI",'],
]
let en = page
for (const [avant, apres] of remplacements) {
  const suivant = en.replace(avant, apres)
  if (suivant === en) throw new Error(`Texte introuvable dans index.html : ${avant}`) // jamais de page à moitié traduite
  en = suivant
}
writeFileSync('dist/en.html', en)
console.log('dist/en.html écrite (version anglaise).')
