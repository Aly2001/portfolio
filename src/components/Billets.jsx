import { projets, ETATS } from '../data/profil.js'
import Icone from './Icone.jsx'
import Etiquettes from './Etiquettes.jsx'

function CarteEmbarquement({ p }) {
  return (
    <article id={`billet-${p.id}`} className="embarquement" aria-labelledby={`titre-${p.id}`}>
      <div className="embarquement__corps">
        <div className="embarquement__tete">
          <div>
            <p className="petit-titre petit-titre--brun">Carte d'embarquement, étude de cas</p>
            <h3 id={`titre-${p.id}`} className="embarquement__titre">{p.titre}</h3>
            <p className="embarquement__sous-titre">{p.sousTitre}</p>
          </div>
          <span className={`pastille-etat pastille-etat--${p.etat}`}><span className="voyant" aria-hidden="true" />{ETATS[p.etat].long}</span>
        </div>

        <ol className="chaine" aria-label="La chaîne complète du projet">
          {p.chaine.map((c) => (
            <li key={c} className={c === p.chaineActive ? 'est-actif' : ''}>
              <span className="chaine__arret" aria-hidden="true" />{c}
            </li>
          ))}
        </ol>

        <ol className="etapes">
          {p.etapes.map((e, i) => (
            <li key={e.titre}>
              <span className="etapes__numero" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div><h4>{e.titre}</h4><p>{e.texte}</p></div>
            </li>
          ))}
        </ol>

        <div className="rangee-boutons">
          <a className="bouton bouton--nuit" href={p.site}>Voir le site <Icone nom="externe" taille={16} /></a>
          <a className="bouton bouton--contour-nuit" href={p.code_url}>Le code <Icone nom="externe" taille={16} /></a>
        </div>
      </div>

      <div className="embarquement__talon">
        <span className="encoche encoche--a" aria-hidden="true" />
        <span className="encoche encoche--b" aria-hidden="true" />
        <dl className="trajet">
          <div><dt>Départ</dt><dd>Données SNCF</dd></div>
          <div><dt>Arrivée</dt><dd>Voyageurs</dd></div>
        </dl>
        <dl className="chiffres">
          {p.chiffres.map((c) => (
            <div key={c.libelle}><dt>{c.libelle}</dt><dd>{c.valeur}</dd></div>
          ))}
        </dl>
        <div className="talon__outils">
          <p className="talon__libelle">À bord</p>
          <Etiquettes liste={p.outils} sombre />
        </div>
      </div>
    </article>
  )
}

function Billet({ p, voie }) {
  return (
    <article id={`billet-${p.id}`} className="billet" aria-labelledby={`titre-${p.id}`}>
      <div className="billet__corps">
        <p className="petit-titre petit-titre--brun">{p.contexte}</p>
        <h3 id={`titre-${p.id}`} className="billet__titre">{p.titre}</h3>
        <p className="billet__texte">{p.texte}</p>
        <Etiquettes liste={p.outils} />
        <div className="billet__pied">
          {p.code_url
            ? <a className="lien-fort" href={p.code_url}>Voir le code <Icone nom="externe" taille={16} /></a>
            : <span className="discret">Code non public</span>}
          {p.etat !== 'termine' && <span className={`pastille-etat pastille-etat--${p.etat}`}><span className="voyant" aria-hidden="true" />{ETATS[p.etat].long}</span>}
        </div>
      </div>
      <div className="billet__talon">
        <span className="encoche encoche--a" aria-hidden="true" />
        <span className="encoche encoche--b" aria-hidden="true" />
        <span className="billet__voie-libelle">Voie</span>
        <span className="billet__voie">{voie}</span>
      </div>
    </article>
  )
}

export default function Billets() {
  return (
    <section id="billets" className="section conteneur" aria-labelledby="titre-billets">
      <p className="petit-titre">Vos billets</p>
      <h2 id="titre-billets" className="grand-titre">Mes projets</h2>
      <div className="billets">
        {projets.map((p, i) =>
          p.phare ? <CarteEmbarquement key={p.id} p={p} /> : <Billet key={p.id} p={p} voie={i + 1} />,
        )}
      </div>
    </section>
  )
}
