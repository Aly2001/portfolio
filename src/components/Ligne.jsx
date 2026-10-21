import { parcours, langues } from '../data/profil.js'
import { BoutonContact } from './Boutons.jsx'

export default function Ligne() {
  return (
    <section id="ligne" className="ligne" aria-labelledby="titre-ligne">
      <div className="conteneur section">
        <div className="ligne__tete">
          <div>
            <p className="petit-titre petit-titre--jaune">Ligne A, de Kéniéba à votre équipe</p>
            <h2 id="titre-ligne" className="grand-titre">Mon parcours</h2>
          </div>
          <div className="langues">
            <p className="langues__libelle">Langues à bord</p>
            <p>{langues.join(' · ')}</p>
          </div>
        </div>
        <ol className="gares">
          {parcours.map((g) => (
            <li key={g.id} id={`gare-${g.id}`} className="gare">
              <span className="gare__point" aria-hidden="true" />
              <p className="gare__annee">{g.annee}</p>
              <h3 className="gare__lieu">{g.lieu} <span className="gare__pays">{g.pays}</span></h3>
              <p className="gare__texte"><strong>{g.titre}</strong>, {g.detail}</p>
            </li>
          ))}
          <li className="gare gare--prochaine">
            <span className="gare__point" aria-hidden="true" />
            <p className="gare__annee">Prochain arrêt</p>
            <h3 className="gare__lieu">Votre équipe ?</h3>
            <BoutonContact />
          </li>
        </ol>
      </div>
    </section>
  )
}
