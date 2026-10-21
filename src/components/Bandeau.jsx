import { direct, profil } from '../data/profil.js'

// Le bandeau jaune « information voyageurs » qui défile en haut.
// Les messages sont construits à partir des données : si le chiffre
// en direct n'est pas encore branché, son message n'apparaît pas.
export default function Bandeau() {
  const messages = []
  if (direct.pourcentageRisque !== null) {
    messages.push(`En direct de Quai Nord : ${direct.pourcentageRisque} % des TER à risque de retard`)
  } else {
    messages.push('En direct de Quai Nord : le risque de retard des TER, ligne par ligne')
  }
  if (profil.disponible) messages.push(`Information voyageurs : ${profil.nom} est ouvert aux opportunités`)
  messages.push('Prochain départ : votre équipe')
  const texte = messages.join('   ·   ')

  return (
    <div className="bandeau">
      <p className="sr-only">{texte}</p>
      <div className="bandeau__piste" aria-hidden="true">
        <span>● {texte}   ·   </span>
        <span>● {texte}   ·   </span>
      </div>
    </div>
  )
}
