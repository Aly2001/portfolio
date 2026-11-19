import { useEffect, useRef, useState } from 'react'
import { profil, T, LANGUE, traduireSource } from '../data/langue.js'
import { ASSISTANT_URL } from '../config.js'
import Icone from './Icone.jsx'

const { suggestions: SUGGESTIONS, accueil: ACCUEIL, horsService: HORS_SERVICE, indisponible: INDISPONIBLE, tropLong: TROP_LONG } = T.assistant
// Au-delà, on arrête d'attendre : le serveur abandonne de lui-même après 20 s par appel.
const DELAI_MAX_MS = 30000

// Ces statuts proposent tous le même bouton « Écrire à Aly » : une seule règle.
// Qui affiche quoi, décidé à UN seul endroit selon le statut et la famille du message :
// - « Écrire à Aly » quand l'assistant ne peut pas aider (info absente, limite, panne, au revoir) ;
// - les questions suggérées pour relancer (accueil, politesse, question hors sujet).
function avecEmail(m) {
  if (m.statut === 'refus') return m.famille !== 'hors-sujet'
  return ['limite', 'erreur', 'hors-service'].includes(m.statut) || m.famille === 'revoir'
}
function avecSuggestions(m) {
  if (m.famille === 'revoir') return false
  return ['accueil', 'politesse'].includes(m.statut) || (m.statut === 'refus' && m.famille === 'hors-sujet')
}

// Rend cliquables les adresses web et e-mail d'une réponse. Le serveur a déjà vérifié
// que chaque lien figure dans les informations sur Aly : aucune adresse inconnue n'arrive ici.
const MOTIF_LIEN = /([\w.+-]+@[\w-]+\.[\w.]+|(?:https?:\/\/)?(?:[a-z0-9-]+\.)+(?:com|fr|app|io|net|org|dev|me|ai)(?:\/[^\s),;]*)?)/gi
function TexteAvecLiens({ texte }) {
  return texte.split(MOTIF_LIEN).map((morceau, i) => {
    if (i % 2 === 0) return morceau
    const propre = morceau.replace(/[.,;:!?»]+$/, '')
    const reste = morceau.slice(propre.length)
    const href = propre.includes('@') ? `mailto:${propre}` : (propre.startsWith('http') ? propre : `https://${propre}`)
    return (
      <span key={i}>
        <a className="annonce__lien" href={href} target={propre.includes('@') ? undefined : '_blank'} rel="noopener noreferrer">{propre}</a>{reste}
      </span>
    )
  })
}

function BoutonEmail() {
  return <a className="annonce__email" href={`mailto:${profil.email}`}><Icone nom="mail" taille={16} />{T.assistant.ecrire}</a>
}

function Reponse({ m, onSource }) {
  return (
    <div className="annonce">
      <div className="annonce__bulle">
        <p><TexteAvecLiens texte={m.texte} /></p>
        {avecEmail(m) && <BoutonEmail />}
      </div>
      {m.sources?.length > 0 && (
        <div className="annonce__sources">
          <span className="annonce__libelle">{T.assistant.enSavoirPlus}</span>
          <div className="annonce__billets">
            {m.sources.map((s) => (
              <a key={s.id} href={s.ancre} className="source" onClick={onSource}>
                <span className="source__icone" aria-hidden="true"><Icone nom="lien" taille={15} /></span>
                <span className="source__textes"><span className="source__sous">{traduireSource(s.sous)}</span>{traduireSource(s.libelle)}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Assistant() {
  const [ouvert, setOuvert] = useState(false)
  const [messages, setMessages] = useState(() => [
    { de: 'assistant', statut: ASSISTANT_URL ? 'accueil' : 'hors-service', texte: ASSISTANT_URL ? ACCUEIL : HORS_SERVICE },
  ])
  const [saisie, setSaisie] = useState('')
  const [attente, setAttente] = useState(false)
  const [bloque, setBloque] = useState(!ASSISTANT_URL)
  const panneau = useRef(null)
  const champ = useRef(null)
  const bas = useRef(null)
  const bouton = useRef(null)
  const rendreFocus = useRef(false)
  const [accueilVisible, setAccueilVisible] = useState(true)

  // Le bouton n'apparaît qu'une fois l'accueil à moitié dépassé.
  useEffect(() => {
    const accueil = document.getElementById('accueil')
    if (!accueil || !('IntersectionObserver' in window)) { setAccueilVisible(false); return undefined }
    const obs = new IntersectionObserver(([e]) => setAccueilVisible(e.intersectionRatio > 0.5), { threshold: [0, 0.5, 1] })
    obs.observe(accueil)
    return () => obs.disconnect()
  }, [])

  // Ouverture : focus dans le panneau, Échap pour fermer, et on bloque le
  // défilement de la page derrière (sur téléphone le panneau est plein écran).
  useEffect(() => {
    if (!ouvert) return undefined
    ;(champ.current && !champ.current.disabled ? champ.current : panneau.current)?.focus()
    const echap = (e) => { if (e.key === 'Escape') fermer() }
    window.addEventListener('keydown', echap)
    document.body.classList.add('assistant-ouvert')
    return () => {
      window.removeEventListener('keydown', echap)
      document.body.classList.remove('assistant-ouvert')
    }
  }, [ouvert])

  useEffect(() => { bas.current?.scrollIntoView({ block: 'end' }) }, [messages, attente])

  // Après fermeture, le focus revient sur le bouton (règle d'accessibilité),
  // sauf si on a cliqué une source : on laisse alors la page aller à la section.
  useEffect(() => {
    if (!ouvert && rendreFocus.current) bouton.current?.focus()
    rendreFocus.current = false
  }, [ouvert])

  function fermer() {
    rendreFocus.current = true
    setOuvert(false)
  }

  function allerALaSource() {
    setOuvert(false)
  }

  async function poser(question) {
    const q = question.trim()
    if (!q || attente || bloque) return
    setSaisie('')
    // Mémoire courte : les 2 dernières questions du visiteur, pour comprendre « et ses projets ? »
    const precedentes = messages.filter((m) => m.de === 'visiteur').slice(-2).map((m) => m.texte)
    setMessages((m) => [...m, { de: 'visiteur', texte: q }])
    setAttente(true)
    let r
    const arret = new AbortController()
    const minuteur = setTimeout(() => arret.abort(), DELAI_MAX_MS)
    try {
      const rep = await fetch(`${ASSISTANT_URL}/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, langue: LANGUE, precedentes }),
        signal: arret.signal,
      })
      r = await rep.json()
    } catch (e) {
      r = { statut: 'erreur', reponse: e.name === 'AbortError' ? TROP_LONG : INDISPONIBLE, sources: [] }
    } finally {
      clearTimeout(minuteur)
    }
    setAttente(false)
    if (r.statut === 'limite') setBloque(true)
    setMessages((m) => [...m, { de: 'assistant', statut: r.statut, famille: r.famille, texte: r.reponse, sources: r.sources }])
  }

  // Les suggestions s'affichent sous le DERNIER message, s'il les appelle.
  const dernier = messages[messages.length - 1]
  const montrerSuggestions = !bloque && !attente && dernier.de === 'assistant' && avecSuggestions(dernier)

  return (
    <>
      {ouvert && <div className="assistant__voile" aria-hidden="true" onClick={fermer} />}
      {ouvert && (
        <aside ref={panneau} tabIndex={-1} className="guichet" role="dialog" aria-modal="true" aria-labelledby="titre-guichet">
          <div className="guichet__tete">
            <img src="/photo-aly-256.webp" alt="" width="44" height="44" />
            <div className="guichet__titres">
              <h2 id="titre-guichet">{T.assistant.titre}</h2>
              <p className="guichet__sous">{T.assistant.sousTitre}</p>
            </div>
            <button type="button" className="guichet__fermer" aria-label={T.assistant.fermer} onClick={fermer}><Icone nom="fermer" taille={20} /></button>
          </div>

          <div className="guichet__fil" aria-live="polite">
            {messages.map((m, i) =>
              m.de === 'visiteur'
                ? <p key={i} className="question-visiteur">{m.texte}</p>
                : <Reponse key={i} m={m} onSource={allerALaSource} />,
            )}
            {montrerSuggestions && (
              <div className="suggestions">
                {SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => poser(s)}>{s}</button>)}
              </div>
            )}
            {attente && <p className="annonce__attente"><span className="point" aria-hidden="true" />{T.assistant.reflechit}</p>}
            <div ref={bas} />
          </div>

          <form className="guichet__pied" onSubmit={(e) => { e.preventDefault(); poser(saisie) }}>
            <div className="guichet__saisie">
              <label htmlFor="question-assistant" className="sr-only">{T.assistant.votreQuestion}</label>
              <input ref={champ} id="question-assistant" type="text" maxLength={300} autoComplete="off"
                value={saisie} onChange={(e) => setSaisie(e.target.value)} disabled={bloque}
                placeholder={bloque ? (ASSISTANT_URL ? T.assistant.demain : T.assistant.bientot) : T.assistant.placeholder} />
              <button type="submit" aria-label={T.assistant.envoyer} disabled={bloque || attente || !saisie.trim()}>
                <Icone nom="envoyer" taille={20} />
              </button>
            </div>
            <p className="guichet__note">{T.assistant.note}</p>
          </form>
        </aside>
      )}

      {!ouvert && (
        <button ref={bouton} type="button" className={`assistant__bouton${accueilVisible ? ' est-cache' : ''}`}
          onClick={() => setOuvert(true)}>
          <Icone nom="bulle" taille={18} />
          <span>{T.assistant.bouton}<span className="assistant__suite">{T.assistant.boutonSuite}</span></span>
        </button>
      )}
    </>
  )
}
