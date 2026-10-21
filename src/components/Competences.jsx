import { competences } from '../data/profil.js'
import Etiquettes from './Etiquettes.jsx'
import EnteteSection from './EnteteSection.jsx'

export default function Competences() {
  return (
    <section className="conteneur section" aria-labelledby="competences">
      <EnteteSection id="competences" titre="Compétences" phrase="Les outils que j'utilise, rangés par domaine." />
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
