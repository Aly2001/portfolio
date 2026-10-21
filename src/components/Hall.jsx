import { profil, projets, ETATS } from '../data/profil.js'
import Palettes from './Palettes.jsx'
import Icone from './Icone.jsx'
import { BoutonContact, BoutonCV } from './Boutons.jsx'

function Horloge() {
  return (
    <div className="horloge">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} aria-hidden="true" className={`horloge__trait${i % 3 === 0 ? ' horloge__trait--fort' : ''}`}
          style={{ '--angle': `${i * 30}deg` }} />
      ))}
      <img className="horloge__photo" src="/photo-aly-256.webp"
        srcSet="/photo-aly-256.webp 256w, /photo-aly-512.webp 512w"
        sizes="(max-width: 720px) 100px, 192px" width="192" height="192" alt="Portrait d'Aly Keita" />
    </div>
  )
}

function Etat({ etat }) {
  const e = ETATS[etat]
  return (
    <span className={`etat etat--${etat}`}>
      {etat !== 'termine' && <span className="voyant" aria-hidden="true" />}
      <span className="sr-only">{e.long}</span>
      <span className="cache-mobile" aria-hidden="true">{e.court}</span>
      {e.mobile && <span className="seul-mobile" aria-hidden="true">{e.mobile}</span>}
    </span>
  )
}

function TableauDeparts() {
  return (
    <section className="departs" aria-labelledby="titre-departs">
      <div className="departs__tete">
        <h2 id="titre-departs" className="departs__titre">Départs</h2>
        <span className="departs__aide">Choisissez une ligne pour voir son billet</span>
      </div>
      <div className="departs__colonnes" aria-hidden="true">
        <span>Heure</span><span>Projet</span><span className="cache-mobile">Destination</span>
        <span className="centre">Voie</span><span>État</span><span />
      </div>
      <ol className="departs__liste">
        {projets.map((p, i) => (
          <li key={p.id}>
            <a href={`#billet-${p.id}`} className={`depart${p.etat === 'en-ligne' ? ' depart--actif' : ''}`}>
              <span className="depart__heure"><span className="sr-only">{p.heure}</span><Palettes texte={p.heure} taille="petite" delai={500 + i * 120} /></span>
              <span className="depart__projet">
                <span className="depart__code">{p.code}</span>
                <span className="depart__destination-mobile">{p.destinationCourte}</span>
              </span>
              <span className="depart__destination cache-mobile">{p.destination}</span>
              <span className="depart__voie" aria-label={`Voie ${i + 1}`}>{i + 1}</span>
              <Etat etat={p.etat} />
              <span className="depart__fleche cache-mobile"><Icone nom="fleche" taille={18} /></span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Hall() {
  return (
    <section id="hall" className="hall" aria-labelledby="nom">
      <span className="hall__fond" aria-hidden="true">1</span>
      <div className="conteneur hall__haut">
        <Horloge />
        <div className="hall__texte">
          <p className="hall__voie">Voie 1, Data &amp; IA</p>
          <h1 id="nom" className="hall__nom">
            <span className="sr-only">{profil.nom}</span>
            <Palettes texte="ALY" />
            <Palettes texte="KEITA" delai={270} />
          </h1>
          <p className="hall__titre">{profil.titre}</p>
          <p className="hall__accroche">{profil.accroche}</p>
          <div className="hall__actions">
            <BoutonContact />
            <BoutonCV />
            {profil.disponible && (
              <span className="disponible"><span className="voyant" aria-hidden="true" />Ouvert aux opportunités</span>
            )}
          </div>
        </div>
      </div>
      <div className="conteneur hall__bas">
        <TableauDeparts />
      </div>
    </section>
  )
}
