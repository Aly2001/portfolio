// Icônes au trait, dessinées en SVG : elles prennent la couleur du texte.
const TRACES = {
  externe: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  telecharger: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  bulle: 'M4 5h16v11H9l-5 4z',
  fleche: 'M5 12h14M13 6l6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  fermer: 'M6 6l12 12M18 6L6 18',
}

export default function Icone({ nom, taille = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={taille} height={taille} aria-hidden="true" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone">
      <path d={TRACES[nom]} />
    </svg>
  )
}
