import { competences, T } from '../data/langue.js'
import Etiquettes from './Etiquettes.jsx'
import EnteteSection from './EnteteSection.jsx'

export default function Competences() {
  return (
    <section className="conteneur section" aria-labelledby="competences">
      <EnteteSection id="competences" titre={T.competencesTitre} phrase={T.competencesPhrase} />
      <ul className="competences">
        {competences.map((c) => (
          <li key={c.id} id={`competence-${c.id}`}>
            <h3>{c.domaine}</h3>
            <Etiquettes liste={c.outils} />
          </li>
        ))}
      </ul>
    </section>
  )
}
