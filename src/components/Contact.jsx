import { profil } from '../data/profil.js'
import Icone from './Icone.jsx'

export default function Contact() {
  return (
    <section id="contact" className="conteneur contact-section" aria-labelledby="titre-contact">
      <div className="contact">
        <div>
          <h2 id="titre-contact">Travaillons ensemble.</h2>
          <p>Un stage, un projet data ou une simple question : écrivez-moi, je réponds vite.</p>
        </div>
        <div className="contact__liens">
          <a className="contact__mail" href={`mailto:${profil.email}`}>{profil.email} <Icone nom="mail" taille={20} /></a>
          <div className="contact__autres">
            <a href={profil.linkedin}>LinkedIn</a>
            <a href={profil.github}>GitHub</a>
            {profil.cvUrl && <a href={profil.cvUrl} download>CV</a>}
          </div>
        </div>
      </div>
    </section>
  )
}
