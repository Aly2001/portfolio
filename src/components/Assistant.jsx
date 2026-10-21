import { useEffect, useRef, useState } from 'react'
import { profil } from '../data/profil.js'
import { ASSISTANT_URL } from '../config.js'
import Icone from './Icone.jsx'

const SUGGESTIONS = [
  'Quelle expérience en machine learning ?',
  'Parle-moi de Quai Nord',
  'Quelles technologies cloud ?',
  'Est-il disponible pour un stage ?',
]
const ACCUEIL =
  "Bonjour ! Je suis l'assistant d'Aly. Posez-moi une question sur son parcours, ses compétences ou ses projets : je réponds uniquement à partir de son CV, en citant mes sources."
const HORS_SERVICE =
  "L'assistant n'est pas encore branché. En attendant, vous pouvez écrire directement à Aly."
const INDISPONIBLE = "L'assistant est momentanément indisponible. Vous pouvez écrire directement à Aly."
const TROP_LONG = "L'assistant met trop de temps à répondre. Réessayez dans un instant, ou écrivez directement à Aly."
// Au-delà, on arrête d'attendre : le serveur abandonne de lui-même après 20 s par appel.
const DELAI_MAX_MS = 30000

// Ces statuts proposent tous le même bouton « Écrire à Aly » : une seule règle.
const AVEC_EMAIL = new Set(['refus', 'limite', 'erreur', 'hors-service'])
// Après un « bonjour » ou un « merci », on repropose les questions suggérées.
const AVEC_SUGGESTIONS = new Set(['accueil', 'politesse'])

function BoutonEmail() {
  return <a className="annonce__email" href={`mailto:${profil.email}`}><Icone nom="mail" taille={16} />Écrire à Aly</a>
}

function Annonce({ m, onSource }) {
  return (
    <div className="annonce">
      <span className="annonce__libelle">Annonce</span>
      <div className="annonce__bulle">
        <p>{m.texte}</p>
        {(AVEC_EMAIL.has(m.statut) || m.famille === 'revoir') && <BoutonEmail />}
      </div>
      {m.sources?.length > 0 && (
        <div className="annonce__sources">
          <span className="annonce__libelle">Sources</span>
          <div className="annonce__billets">
            {m.sources.map((s) => (
              <a key={s.id} href={s.ancre} className="billet-source" onClick={onSource}>
                <span className="billet-source__icone" aria-hidden="true"><Icone nom="billet" taille={16} /></span>
                <span className="billet-source__textes"><span className="billet-source__sous">{s.sous}</span>{s.libelle}</span>
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
  // sauf si on a cliqué une source : on laisse alors la page aller au billet.
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
    setMessages((m) => [...m, { de: 'visiteur', texte: q }])
    setAttente(true)
    let r
    const arret = new AbortController()
    const minuteur = setTimeout(() => arret.abort(), DELAI_MAX_MS)
    try {
      const rep = await fetch(`${ASSISTANT_URL}/question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
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
  const montrerSuggestions = !bloque && !attente && dernier.de === 'assistant' && AVEC_SUGGESTIONS.has(dernier.statut)
    && !(dernier.statut === 'politesse' && dernier.famille === 'revoir')

  return (
    <>
      {ouvert && <div className="assistant__voile" aria-hidden="true" onClick={fermer} />}
      {ouvert && (
        <aside ref={panneau} tabIndex={-1} className="guichet" role="dialog" aria-modal="true" aria-labelledby="titre-guichet">
          <div className="guichet__tete">
            <img src="/photo-aly-256.webp" alt="" width="44" height="44" />
            <div className="guichet__titres">
              <p className="guichet__petit">Information voyageurs</p>
              <h2 id="titre-guichet">Une question sur Aly ?</h2>
              <p className="guichet__sous">Répond à partir de mon CV et de mes projets</p>
            </div>
            <button type="button" className="guichet__fermer" aria-label="Fermer l'assistant" onClick={fermer}><Icone nom="fermer" taille={20} /></button>
          </div>

          <div className="guichet__fil" aria-live="polite">
            {messages.map((m, i) =>
              m.de === 'visiteur'
                ? <p key={i} className="question-visiteur">{m.texte}</p>
                : <Annonce key={i} m={m} onSource={allerALaSource} />,
            )}
            {montrerSuggestions && (
              <div className="suggestions">
                {SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => poser(s)}>{s}</button>)}
              </div>
            )}
            {attente && <p className="annonce__attente"><span className="voyant" aria-hidden="true" />L'annonce arrive…</p>}
            <div ref={bas} />
          </div>

          <form className="guichet__pied" onSubmit={(e) => { e.preventDefault(); poser(saisie) }}>
            <div className="guichet__saisie">
              <label htmlFor="question-assistant" className="sr-only">Votre question</label>
              <input ref={champ} id="question-assistant" type="text" maxLength={300} autoComplete="off"
                value={saisie} onChange={(e) => setSaisie(e.target.value)} disabled={bloque}
                placeholder={bloque ? (ASSISTANT_URL ? "Revenez demain pour d'autres questions" : 'Bientôt disponible') : 'Votre question…'} />
              <button type="submit" aria-label="Envoyer la question" disabled={bloque || attente || !saisie.trim()}>
                <Icone nom="envoyer" taille={20} />
              </button>
            </div>
            <p className="guichet__note">Assistant IA : il ne répond qu'à partir de mon CV et peut se tromper. Pour un échange, écrivez-moi.</p>
          </form>
        </aside>
      )}

      {!ouvert && (
        <button ref={bouton} type="button" className="assistant__bouton" onClick={() => setOuvert(true)}>
          <span className="assistant__rond"><Icone nom="bulle" taille={20} /></span>
          <span className="assistant__textes">
            <span className="assistant__petit">Information voyageurs</span>
            Une question sur moi ?
          </span>
        </button>
      )}
    </>
  )
}
