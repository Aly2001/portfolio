import { projets, ETATS } from '../data/profil.js'
import Icone from './Icone.jsx'
import Etiquettes from './Etiquettes.jsx'
import EnteteSection from './EnteteSection.jsx'

// Un projet sans capture (pas fini, ou sans dépôt public) est montré par un
// schéma de sa démarche : on explique comment il marche, sans inventer de résultat.
function Schema({ etapes, alt }) {
  const largeur = 400, boite = 78, marge = 10
  const ecart = (largeur - 2 * marge - etapes.length * boite) / (etapes.length - 1)
  return (
    <svg className="schema" viewBox="0 0 400 200" role="img" aria-label={alt}>
      {etapes.map(([titre, sous], i) => {
        const x = marge + i * (boite + ecart)
        const actif = i === etapes.length - 2
        return (
          <g key={titre}>
            <rect x={x} y="62" width={boite} height="76" rx="4" className={actif ? 'schema__boite est-actif' : 'schema__boite'} />
            <text x={x + boite / 2} y="96" textAnchor="middle" className="schema__titre">{titre}</text>
            <text x={x + boite / 2} y="114" textAnchor="middle" className="schema__sous">{sous}</text>
            {i < etapes.length - 1 && (
              <path className="schema__fleche"
                d={`M${x + boite + 4} 100 H${x + boite + ecart - 6} M${x + boite + ecart - 10} 95 L${x + boite + ecart - 5} 100 L${x + boite + ecart - 10} 105`} />
            )}
          </g>
        )
      })}
    </svg>
  )
}

function Visuel({ v }) {
  if (v.schema) return <Schema etapes={v.schema} alt={v.alt} />
  return <img src={v.image} alt={v.alt} width={v.largeur} height={v.hauteur} loading="lazy" />
}

function Etat({ etat }) {
  if (etat === 'termine') return null
  return <span className={`etat etat--${etat}`}><span className="point" aria-hidden="true" />{ETATS[etat]}</span>
}

function Phare({ p }) {
  return (
    <article id={`projet-${p.id}`} className="phare" aria-labelledby={`titre-${p.id}`}>
      <div className="phare__texte">
        <p className="phare__haut"><Etat etat={p.etat} /> · projet phare</p>
        <h3 id={`titre-${p.id}`} className="phare__titre">{p.titre}</h3>
        <p className="phare__resume"><strong>{p.resume}</strong> {p.texte}</p>
        <ol className="chaine" aria-label="Les étapes du projet">
          {p.chaine.flatMap((c, i) => [
            i > 0 && <li key={`sep-${c}`} className="chaine__sep" aria-hidden="true">›</li>,
            <li key={c} className={c === p.chaineActive ? 'est-actif' : undefined}>{c}</li>,
          ])}
        </ol>
        <Etiquettes liste={p.outils} />
        <div className="rangee">
          <a className="bouton bouton--plein" href={p.site}>Voir le site <Icone nom="externe" taille={16} /></a>
          <a className="bouton bouton--contour" href={p.code}>Le code <Icone nom="externe" taille={16} /></a>
        </div>
      </div>
      <div className="phare__visuel"><Visuel v={p.visuel} /></div>
    </article>
  )
}

function LigneProjet({ p }) {
  return (
    <article id={`projet-${p.id}`} className="projet" aria-labelledby={`titre-${p.id}`}>
      <div className="projet__texte">
        <p className="projet__contexte">{p.contexte} <Etat etat={p.etat} /></p>
        <h3 id={`titre-${p.id}`}>{p.titre}</h3>
        <p className="projet__description">{p.texte}</p>
        <Etiquettes liste={p.outils} />
        {p.code
          ? <a className="lien-souligne" href={p.code}>Voir le code <Icone nom="externe" taille={14} /></a>
          : <span className="discret">Code bientôt publié</span>}
      </div>
      <div className="projet__visuel"><Visuel v={p.visuel} /></div>
    </article>
  )
}

export default function Projets() {
  const nombre = ['Zéro', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit', 'Neuf', 'Dix'][projets.length] ?? projets.length
  return (
    <section className="conteneur section" aria-labelledby="projets">
      <EnteteSection id="projets" titre="Projets"
        phrase={`${nombre} projets, de la collecte des données jusqu'à une application en ligne.`} />
      {projets.filter((p) => p.phare).map((p) => <Phare key={p.id} p={p} />)}
      <div className="projets">
        {projets.filter((p) => !p.phare).map((p) => <LigneProjet key={p.id} p={p} />)}
      </div>
    </section>
  )
}
