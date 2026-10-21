import Bandeau from './components/Bandeau.jsx'
import Entete from './components/Entete.jsx'
import Hall from './components/Hall.jsx'
import Billets from './components/Billets.jsx'
import Ligne from './components/Ligne.jsx'
import Correspondances from './components/Correspondances.jsx'
import Contact from './components/Contact.jsx'
import Assistant from './components/Assistant.jsx'

export default function App() {
  return (
    <>
      <a className="lien-evitement" href="#contenu">Aller au contenu</a>
      <Bandeau />
      <Entete />
      <main id="contenu">
        <Hall />
        <Billets />
        <Ligne />
        <Correspondances />
        <Contact />
      </main>
      <footer className="pied">
        <p className="conteneur">Quai Aly, voie 1 · Aly Keita, Data Scientist &amp; Développeur IA</p>
      </footer>
      <Assistant />
    </>
  )
}
