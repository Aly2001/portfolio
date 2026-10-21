import { profil } from '../data/profil.js'
import Icone from './Icone.jsx'
import { BoutonCV } from './Boutons.jsx'

export default function Contact() {
  return (
    <section id="contact" className="section conteneur" aria-labelledby="titre-contact">
      <div className="aller-simple">
        <div className="aller-simple__corps">
          <p className="petit-titre petit-titre--jaune">Billet aller simple</p>
          <h2 id="titre-contact" className="aller-simple__titre">Prochain arrêt :<br /><span className="jaune">votre équipe ?</span></h2>
          <p className="aller-simple__texte">Un stage, un projet data ou simplement une question : écrivez-moi, je réponds vite.</p>
          <dl className="trajet trajet--trois">
            <div><dt>De</dt><dd>Calais</dd></div>
            <div><dt>Vers</dt><dd>Votre équipe</dd></div>
            <div><dt>Classe</dt><dd>Data &amp; IA</dd></div>
          </dl>
        </div>
        <div className="aller-simple__talon">
          <span className="encoche encoche--a" aria-hidden="true" />
          <span className="encoche encoche--b" aria-hidden="true" />
          <a className="contact-mail" href={`mailto:${profil.email}`}><Icone nom="mail" taille={22} />{profil.email}</a>
          <div className="contact-reseaux">
            <a href={profil.linkedin}>LinkedIn <Icone nom="externe" taille={18} /></a>
            <a href={profil.github}>GitHub <Icone nom="externe" taille={18} /></a>
          </div>
          <BoutonCV variante="blanc" libelle="Télécharger mon CV (PDF)" />
        </div>
      </div>
    </section>
  )
}
