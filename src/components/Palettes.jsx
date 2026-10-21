import { useEffect, useState } from 'react'

// Un mot affiché en « palettes », comme les anciens panneaux de gare.
// Au chargement, chaque lettre fait défiler quelques lettres puis se fige
// sur la bonne, de gauche à droite. Si le visiteur a demandé moins
// d'animations à son système, le mot s'affiche directement.
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function moinsDanimation() {
  return typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export default function Palettes({ texte, taille = 'grande', delai = 0 }) {
  const lettres = [...texte]
  const [affiche, setAffiche] = useState(() =>
    moinsDanimation() ? lettres : lettres.map((c) => (c === ' ' || c === ':' ? c : ' ')),
  )

  useEffect(() => {
    if (moinsDanimation()) return undefined
    const debut = performance.now() + delai
    let id
    const tour = (maintenant) => {
      const ecoule = maintenant - debut
      const suivant = lettres.map((c, i) => {
        if (c === ' ' || c === ':') return c
        const finLettre = 350 + i * 90 // chaque lettre se fige un peu après la précédente
        if (ecoule < 0) return ' '
        if (ecoule >= finLettre) return c
        return ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
      })
      setAffiche(suivant)
      if (ecoule < 350 + lettres.length * 90) id = setTimeout(() => tour(performance.now()), 60)
    }
    id = setTimeout(() => tour(performance.now()), Math.max(0, delai))
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texte, delai])

  return (
    <span className={`palettes palettes--${taille}`} aria-hidden="true">
      {affiche.map((c, i) =>
        lettres[i] === ' ' ? (
          <span key={i} className="palettes__espace" />
        ) : lettres[i] === ':' ? (
          <span key={i} className="palettes__deux-points">:</span>
        ) : (
          <span key={i} className="palette">{c}</span>
        ),
      )}
    </span>
  )
}
