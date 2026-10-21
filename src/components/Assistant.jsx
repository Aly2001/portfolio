import { useEffect, useRef, useState } from 'react'
import { profil } from '../data/profil.js'
import Icone from './Icone.jsx'

// Le bouton « Une question sur moi ? ».
// Pour l'instant il ouvre un panneau qui annonce l'assistant et propose
// l'e-mail. Le vrai assistant RAG sera branché ici à l'étape 3.
export default function Assistant() {
  const [ouvert, setOuvert] = useState(false)
  const panneau = useRef(null)

  useEffect(() => {
    if (!ouvert) return undefined
    panneau.current?.focus()
    const echap = (e) => { if (e.key === 'Escape') setOuvert(false) }
    window.addEventListener('keydown', echap)
    return () => window.removeEventListener('keydown', echap)
  }, [ouvert])

  return (
    <div className="assistant">
      {ouvert && (
        <div ref={panneau} tabIndex={-1} className="assistant__panneau" role="dialog" aria-labelledby="titre-assistant">
          <div className="assistant__tete">
            <p id="titre-assistant">Information voyageurs</p>
            <button type="button" aria-label="Fermer" onClick={() => setOuvert(false)}><Icone nom="fermer" taille={20} /></button>
          </div>
          <p>Bientôt, vous pourrez poser ici vos questions sur mon parcours et mes projets : l'assistant répondra à partir de mon CV, en citant ses sources.</p>
          <p>En attendant, écrivez-moi directement :</p>
          <a className="bouton bouton--nuit" href={`mailto:${profil.email}`}><Icone nom="mail" taille={18} />{profil.email}</a>
        </div>
      )}
      <button type="button" className="assistant__bouton" aria-expanded={ouvert} onClick={() => setOuvert(!ouvert)}>
        <span className="assistant__rond"><Icone nom="bulle" taille={20} /></span>
        <span className="assistant__textes">
          <span className="assistant__petit">Information voyageurs</span>
          Une question sur moi ?
        </span>
      </button>
    </div>
  )
}
