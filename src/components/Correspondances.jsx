import { competences } from '../data/profil.js'
import Etiquettes from './Etiquettes.jsx'

export default function Correspondances() {
  return (
    <section id="correspondances" className="section conteneur correspondances" aria-labelledby="titre-comp">
      <div className="correspondances__intro">
        <p className="petit-titre">Correspondances</p>
        <h2 id="titre-comp" className="grand-titre">Mes compétences</h2>
        <p className="texte-intro">Cinq lignes qui se croisent dans chacun de mes projets, de la donnée brute jusqu'à l'écran.</p>
      </div>
      <ul className="lignes-comp">
        {competences.map((c) => (
          <li key={c.domaine}>
            <span className="rond-ligne" aria-hidden="true">{c.pastille}</span>
            <div>
              <h3>{c.domaine}</h3>
              <Etiquettes liste={c.outils} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
