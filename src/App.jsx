import Entete from './components/Entete.jsx'
import Accueil from './components/Accueil.jsx'
import Projets from './components/Projets.jsx'
import Competences from './components/Competences.jsx'
import Parcours from './components/Parcours.jsx'
import Contact from './components/Contact.jsx'
import Assistant from './components/Assistant.jsx'
import { profil } from './data/profil.js'

export default function App() {
  return (
    <>
      <a className="lien-evitement" href="#contenu">Aller au contenu</a>
      <Entete />
      <main id="contenu">
        <Accueil />
        <Projets />
        <Competences />
        <Parcours />
        <Contact />
      </main>
      <footer className="pied"><p className="conteneur">{profil.nom} · {profil.titre}</p></footer>
      <Assistant />
    </>
  )
}
