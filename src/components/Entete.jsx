import { useState } from 'react'
import { profil } from '../data/profil.js'
import Icone from './Icone.jsx'

const LIENS = [
  { href: '#projets', texte: 'Projets' },
  { href: '#competences', texte: 'Compétences' },
  { href: '#parcours', texte: 'Parcours' },
  { href: '#contact', texte: 'Contact' },
]

export default function Entete() {
  const [ouvert, setOuvert] = useState(false)
  return (
    <header className="entete">
      <div className="conteneur entete__ligne">
        <a href="#accueil" className="entete__nom">{profil.nom}<span className="ocre">.</span></a>
        <button type="button" className="entete__menu" aria-expanded={ouvert} aria-controls="navigation"
          aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOuvert(!ouvert)}>
          <Icone nom={ouvert ? 'fermer' : 'menu'} taille={20} />
        </button>
        <nav id="navigation" aria-label="Sections" className={`entete__nav${ouvert ? ' est-ouvert' : ''}`}>
          {LIENS.map((l) => <a key={l.href} href={l.href} onClick={() => setOuvert(false)}>{l.texte}</a>)}
          {profil.cvUrl && (
            <a className="bouton bouton--plein bouton--petit" href={profil.cvUrl} download>CV <Icone nom="telecharger" taille={16} /></a>
          )}
        </nav>
      </div>
    </header>
  )
}
