import { parcours, langues, lieu } from '../data/profil.js'
import EnteteSection from './EnteteSection.jsx'

export default function Parcours() {
  return (
    <section className="conteneur section" aria-labelledby="parcours">
      <EnteteSection id="parcours" titre="Parcours" phrase="Du Mali à la France, en passant par le Maroc." />
      <ol className="parcours">
        {parcours.map((e) => (
          <li key={e.id} id={`etape-${e.id}`} className={e.points || e.enCours ? 'est-marque' : undefined}>
            <span className="parcours__point" aria-hidden="true" />
            <span className="parcours__annee">
              {e.annee}
              {e.enCours && <span className="etat etat--en-cours parcours__etat"><span className="point" aria-hidden="true" />En cours</span>}
            </span>
            <div>
              <h3>{e.titre}</h3>
              <p className="parcours__lieu">{lieu(e)}</p>
              {e.points && <ul>{e.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>}
            </div>
          </li>
        ))}
      </ol>
      <p className="langues"><strong>Langues :</strong> {langues.join(', ')}.</p>
    </section>
  )
}
