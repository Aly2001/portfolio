import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/figtree/400.css'
import '@fontsource/figtree/600.css'
import '@fontsource/figtree/700.css'
import '@fontsource/bricolage-grotesque/700.css'
import './styles.css'
import App from './App.jsx'
import { LANGUE, ADRESSES } from './data/langue.js'

// Première visite sur la page française avec un navigateur qui n'est pas en français :
// on propose directement la version anglaise. Jamais si le visiteur a déjà choisi sa langue
// avec le sélecteur, ni pour les robots des moteurs de recherche (Google doit voir les deux pages).
function langueDuNavigateur() {
  try {
    if (localStorage.getItem('langue')) return null
  } catch { /* stockage bloqué : on décide sans */ }
  if (/bot|crawl|spider|slurp|preview|facebookexternalhit|linkedin/i.test(navigator.userAgent)) return null
  const prefere = (navigator.languages?.[0] || navigator.language || 'fr').toLowerCase()
  return prefere.startsWith('fr') ? 'fr' : 'en'
}
if (LANGUE === 'fr' && langueDuNavigateur() === 'en') {
  window.location.replace(ADRESSES.en + window.location.hash)
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
