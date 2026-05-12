import { useState } from 'react'

const FASE_OPTIONS = ['Calentamiento', 'Fuerza', 'Cardio', 'Estiramiento']

function cloneSessions(sessions) {
  return sessions.map(s => s.map(ex => ({ ...ex, niveles: [...ex.niveles] })))
}

export default function RoutineEditor({ sessions, onSave, onCancel }) {
  const [data, setData] = useState(() => cloneSessions(sessions))

  function update(sessionIdx, exerciseIdx, field, value) {
    setData(prev => {
      const next = structuredClone(prev)
      if (field === 'nivel') {
        next[sessionIdx][exerciseIdx].niveles[value.index] = value.val
      } else {
        next[sessionIdx][exerciseIdx][field] = value
      }
      return next
    })
  }

  function handleSave() {
    onSave(data)
  }

  return (
    <div className="cal-editor">
      <div className="cal-editor-actions">
        <button className="cal-btn-save" onClick={handleSave}>Guardar</button>
        <button className="cal-btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>

      {data.map((session, si) => (
        <div key={si} className="cal-editor-session">
          <h3 className="cal-editor-session-title">Sesión {si + 1}</h3>
          {session.map((ex, ei) => (
            <div key={ei} className="cal-editor-row">
              <span className="cal-editor-idx">{ei + 1}</span>

              <select
                className="cal-editor-select"
                value={ex.fase}
                onChange={e => update(si, ei, 'fase', e.target.value)}
              >
                {FASE_OPTIONS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <input
                className="cal-editor-input"
                value={ex.enfoque}
                onChange={e => update(si, ei, 'enfoque', e.target.value)}
                placeholder="Enfoque"
              />

              <input
                className="cal-editor-input cal-editor-input-sm"
                value={ex.dosis}
                onChange={e => update(si, ei, 'dosis', e.target.value)}
                placeholder="Dosis"
              />

              <input
                className="cal-editor-input"
                value={ex.niveles[0]}
                onChange={e => update(si, ei, 'nivel', { index: 0, val: e.target.value })}
                placeholder="Principiante"
              />

              <input
                className="cal-editor-input"
                value={ex.niveles[1]}
                onChange={e => update(si, ei, 'nivel', { index: 1, val: e.target.value })}
                placeholder="Intermedio"
              />

              <input
                className="cal-editor-input"
                value={ex.niveles[2]}
                onChange={e => update(si, ei, 'nivel', { index: 2, val: e.target.value })}
                placeholder="Avanzado"
              />
            </div>
          ))}
        </div>
      ))}

      <div className="cal-editor-actions">
        <button className="cal-btn-save" onClick={handleSave}>Guardar</button>
        <button className="cal-btn-cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  )
}
