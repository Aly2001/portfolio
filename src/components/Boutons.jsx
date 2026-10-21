import { profil } from '../data/profil.js'
import Icone from './Icone.jsx'

// Les deux actions principales, réutilisées à plusieurs endroits.
// Le bouton CV n'apparaît que si un CV public est déclaré dans profil.js.
export function BoutonContact({ variante = 'plein' }) {
  return <a href="#contact" className={`bouton bouton--${variante}`}>Me contacter <Icone nom="fleche" taille={18} /></a>
}

export function BoutonCV({ variante = 'contour', libelle = 'Mon CV' }) {
  if (!profil.cvUrl) return null
  return (
    <a href={profil.cvUrl} className={`bouton bouton--${variante}`} download>
      <Icone nom="telecharger" taille={18} />{libelle}
    </a>
  )
}
