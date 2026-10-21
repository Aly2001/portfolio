export default function Etiquettes({ liste }) {
  return <ul className="etiquettes">{liste.map((t) => <li key={t}>{t}</li>)}</ul>
}
