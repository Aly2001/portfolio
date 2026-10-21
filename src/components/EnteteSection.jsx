export default function EnteteSection({ id, titre, phrase }) {
  return (
    <div className="entete-section">
      <h2 id={id}>{titre}</h2>
      <p>{phrase}</p>
    </div>
  )
}
