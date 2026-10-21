import { parcours, langues } from '../data/profil.js'
import EnteteSection from './EnteteSection.jsx'

export default function Parcours() {
  return (
    <section className="conteneur section" aria-labelledby="parcours">
      <EnteteSection id="parcours" titre="Parcours" phrase="De Kéniéba à Calais, en passant par Meknès." />
      <ol className="parcours">
        {parcours.map((e) => (
          <li key={e.id} id={`etape-${e.id}`} className={e.points ? 'est-marque' : undefined}>
            <span className="parcours__point" aria-hidden="true" />
            <span className="parcours__annee">{e.annee}</span>
            <div>
              <h3>{e.titre}</h3>
              <p className="parcours__lieu">{e.lieu}</p>
              {e.points && <ul>{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>}
            </div>
          </li>
        ))}
      </ol>
      <p className="langues"><strong>Langues :</strong> {langues.join(', ')}.</p>
    </section>
  )
}
