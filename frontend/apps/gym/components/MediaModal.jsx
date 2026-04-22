import { useState, useEffect } from 'react'

export default function MediaModal({ open, exercise, onClose, onSave }) {
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) { setUrl(''); setLabel('') }
  }, [open])

  async function handleSave() {
    if (!url.trim()) return
    setSaving(true)
    try {
      await onSave(exercise, url.trim(), label.trim())
      onClose()
    } catch {
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>Agregar referencia</h3>
        <p>{exercise}</p>
        <input
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="URL del video o imagen (YouTube, etc.)"
          autoFocus
        />
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="Etiqueta (opcional)"
        />
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
