export default function Header({ onDownload, onEditRoutine }) {
  return (
    <div className="header">
      <a href="/" className="btn-home">← Inicio</a>
      <button type="button" className="btn-download-routine" onClick={onDownload}>
        📥 Descargar rutina
      </button>
      <button type="button" className="btn-edit-routine" onClick={onEditRoutine}>
        ✏️ Editar rutina
      </button>
      <h1>💪 Gym Routine</h1>
      <p>Selecciona tu bloque y día</p>
    </div>
  )
}
