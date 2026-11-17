import { useState } from 'react'
import { profil, T, LANGUE, ADRESSES } from '../data/langue.js'
import Icone from './Icone.jsx'

const LIENS = ['projets', 'competences', 'parcours', 'contact'].map((id) => ({ href: `#${id}`, texte: T.nav[id] }))

// Sélecteur FR | EN (maquette B validée) : chaque langue est une vraie page, donc un vrai lien.
// Le choix est mémorisé pour ne plus être redirigé automatiquement (voir main.jsx).
function Langues() {
  const choisir = (l) => { try { localStorage.setItem('langue', l) } catch { /* navigation privée : sans importance */ } }
  return (
    <span className="langues-choix" role="group" aria-label={T.langue}>
      {['fr', 'en'].map((l) => (
        <a key={l} href={ADRESSES[l]} hrefLang={l} lang={l} onClick={() => choisir(l)}
          className={l === LANGUE ? 'est-actif' : undefined} aria-current={l === LANGUE ? 'true' : undefined}>
          {l.toUpperCase()}
        </a>
      ))}
    </span>
  )
}

export default function Entete() {
  const [ouvert, setOuvert] = useState(false)
  return (
    <header className="entete">
      <div className="conteneur entete__ligne">
        <a href="#accueil" className="entete__nom">{profil.nom}<span className="ocre">.</span></a>
        <button type="button" className="entete__menu" aria-expanded={ouvert} aria-controls="navigation"
          aria-label={ouvert ? T.menuFermer : T.menuOuvrir} onClick={() => setOuvert(!ouvert)}>
          <Icone nom={ouvert ? 'fermer' : 'menu'} taille={20} />
        </button>
        <nav id="navigation" aria-label={T.sections} className={`entete__nav${ouvert ? ' est-ouvert' : ''}`}>
          {LIENS.map((l) => <a key={l.href} href={l.href} onClick={() => setOuvert(false)}>{l.texte}</a>)}
          <Langues />
          {profil.cvUrl && (
            <a className="bouton bouton--plein bouton--petit" href={profil.cvUrl} download>CV <Icone nom="telecharger" taille={16} /></a>
          )}
        </nav>
      </div>
    </header>
  )
}
