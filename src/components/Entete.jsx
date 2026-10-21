import { useState } from 'react'
import Icone from './Icone.jsx'

const LIENS = [
  { href: '#billets', texte: 'Billets' },
  { href: '#ligne', texte: 'Ligne A' },
  { href: '#correspondances', texte: 'Correspondances' },
  { href: '#contact', texte: 'Contact' },
]

export default function Entete() {
  const [ouvert, setOuvert] = useState(false)
  return (
    <header className="entete">
      <div className="conteneur entete__ligne">
        <a href="#hall" className="entete__marque">
          <span className="voie" aria-hidden="true">1</span>
          <span>QUAI <span className="jaune">ALY</span></span>
        </a>
        <button type="button" className="entete__menu" aria-expanded={ouvert}
          aria-controls="navigation" aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
          onClick={() => setOuvert(!ouvert)}>
          <Icone nom={ouvert ? 'fermer' : 'menu'} taille={22} />
        </button>
        <nav id="navigation" aria-label="Sections" className={`entete__nav${ouvert ? ' est-ouvert' : ''}`}>
          {LIENS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOuvert(false)}>{l.texte}</a>
          ))}
        </nav>
      </div>
    </header>
  )
}
