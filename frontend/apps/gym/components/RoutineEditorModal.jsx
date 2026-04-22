import { useState, useEffect } from 'react'
import { routineToFlat, rowsToCsv, buildRoutineFromCsvText } from '../utils'

const DAY_LABELS = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles',
  4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
}

function newRow(defaults = {}) {
  return { bloque: 'A', dia: 1, muscle: '', name: '', sets: '', reps: '', notes: '', ...defaults }
}

export default function RoutineEditorModal({ open, routine, csvRaw, onClose, onSave }) {
  const [tab, setTab] = useState('table')
  const [rows, setRows] = useState([])
  const [csvText, setCsvText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    const flat = routineToFlat(routine)
    setRows(flat.length ? flat : [newRow()])
    setCsvText(csvRaw || rowsToCsv(flat))
    setTab('table')
  }, [open])

  function switchTab(t) {
    if (t === 'csv' && tab === 'table') setCsvText(rowsToCsv(rows))
    if (t === 'table' && tab === 'csv') {
      const flat = routineToFlat(buildRoutineFromCsvText(csvText))
      setRows(flat.length ? flat : [newRow()])
    }
    setTab(t)
  }

  function updateRow(i, field, value) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }

  function addRow() {
    const last = rows[rows.length - 1]
    setRows(prev => [...prev, newRow({ bloque: last?.bloque || 'A', dia: last?.dia || 1 })])
  }

  async function handleSave() {
    const csv = tab === 'csv' ? csvText : rowsToCsv(rows)
    setSaving(true)
    try {
      await onSave(csv)
    } catch (e) {
      alert(e.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal routine-editor-modal">
        <h3>Editar rutina</h3>
        <p className="routine-editor-intro">
          Modifica filas en la tabla o usa la pestaña CSV para pegar desde una hoja de cálculo.
          Al guardar se pide la sesión (misma invitación que para los videos).
        </p>
        <div className="routine-editor-tabs">
          <button
            type="button"
            className={`routine-tab${tab === 'table' ? ' active' : ''}`}
            onClick={() => switchTab('table')}
          >
            Tabla
          </button>
          <button
            type="button"
            className={`routine-tab${tab === 'csv' ? ' active' : ''}`}
            onClick={() => switchTab('csv')}
          >
            CSV avanzado
          </button>
        </div>

        {tab === 'table' && (
          <div className="routine-pane routine-pane-table visible">
            <div className="routine-toolbar">
              <button type="button" onClick={addRow}>+ Añadir fila</button>
            </div>
            <div className="routine-table-scroll">
              <table className="routine-edit-table">
                <thead>
                  <tr>
                    <th className="re-col-bloque">Bloque</th>
                    <th className="re-col-dia">Día</th>
                    <th>Músculo</th>
                    <th>Ejercicio</th>
                    <th className="re-col-sets">Series</th>
                    <th className="re-col-reps">Reps</th>
                    <th>Notas</th>
                    <th className="re-col-del"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="re-col-bloque">
                        <select value={row.bloque} onChange={e => updateRow(i, 'bloque', e.target.value)}>
                          <option value="A">A</option>
                          <option value="B">B</option>
                        </select>
                      </td>
                      <td className="re-col-dia">
                        <select value={row.dia} onChange={e => updateRow(i, 'dia', Number(e.target.value))}>
                          {[1,2,3,4,5,6,7].map(d => (
                            <option key={d} value={d}>{d} · {DAY_LABELS[d]}</option>
                          ))}
                        </select>
                      </td>
                      <td><input type="text" value={row.muscle} onChange={e => updateRow(i, 'muscle', e.target.value)} /></td>
                      <td><input type="text" value={row.name} onChange={e => updateRow(i, 'name', e.target.value)} /></td>
                      <td className="re-col-sets"><input type="text" value={row.sets} onChange={e => updateRow(i, 'sets', e.target.value)} /></td>
                      <td className="re-col-reps"><input type="text" value={row.reps} onChange={e => updateRow(i, 'reps', e.target.value)} /></td>
                      <td><input type="text" value={row.notes} onChange={e => updateRow(i, 'notes', e.target.value)} /></td>
                      <td className="re-col-del">
                        <button
                          type="button"
                          className="re-del"
                          onClick={() => setRows(prev => prev.filter((_, idx) => idx !== i))}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="routine-hint">Día 1 = Lunes … 7 = Domingo. Las filas sin ejercicio se ignoran al guardar.</p>
          </div>
        )}

        {tab === 'csv' && (
          <div className="routine-pane routine-pane-csv visible">
            <textarea
              className="routine-csv"
              spellCheck={false}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
            />
            <p className="routine-hint">
              Encabezado obligatorio: <code>bloque,dia,muscle,ejercicio,series,repeticiones,notas</code>
            </p>
          </div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
