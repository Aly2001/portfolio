export default function Etiquettes({ liste, sombre = false }) {
  return (
    <ul className={`etiquettes${sombre ? ' etiquettes--sombre' : ''}`}>
      {liste.map((t) => <li key={t}>{t}</li>)}
    </ul>
  )
}
