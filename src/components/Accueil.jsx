import { profil, T } from '../data/langue.js'
import Icone from './Icone.jsx'

export default function Accueil() {
  // La phrase d'accroche : le dernier mot est mis en couleur, sans le couper du reste.
  const mots = profil.accroche.split(' ')
  const dernier = mots.pop()
  return (
    <section id="accueil" className="conteneur accueil" aria-labelledby="titre-accueil">
      <div className="accueil__texte">
        {profil.disponible && (
          <p className="disponible"><span className="point point--vert" aria-hidden="true" />{T.disponible}, {profil.mobilite}</p>
        )}
        <h1 id="titre-accueil" className="accueil__titre">
          {mots.join(' ')} <span className="ocre">{dernier}</span>
        </h1>
        <p className="accueil__presentation">{T.jeSuis} <strong>{profil.nom}</strong>, {profil.presentation}</p>
        <div className="rangee">
          <a className="bouton bouton--plein" href="#projets">{T.voirProjets} <Icone nom="fleche" taille={16} /></a>
          <a className="bouton bouton--contour" href="#contact">{T.meContacter}</a>
        </div>
        <dl className="faits">
          <div><dt>{T.baseA}</dt><dd>{profil.ville}</dd></div>
          <div><dt>{T.specialite}</dt><dd>{profil.specialite}</dd></div>
          <div><dt>{T.languesTitre}</dt><dd>{T.languesCourtes}</dd></div>
        </dl>
      </div>
      <figure className="accueil__photo">
        <img src="/photo-aly-512.webp" srcSet="/photo-aly-256.webp 256w, /photo-aly-512.webp 512w"
          sizes="(max-width: 720px) 140px, 440px" width="512" height="512" alt={T.portrait} />
      </figure>
    </section>
  )
}
