const DAY_LABELS = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles',
  4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
}

function ExCells({ exercises, blockClass }) {
  if (!exercises.length) return <span style={{ color: '#333' }}>—</span>
  return (
    <div className="day-exercises">
      {exercises.map((ex, i) => (
        <div key={i} className={`ex-cell${blockClass === 'b' ? ' block-b-cell' : ''}`}>
          <div className="ex-name">{ex.name}</div>
          {ex.muscle && <div className="ex-muscle">{ex.muscle}</div>}
          {(ex.sets || ex.reps) && (
            <div className="ex-stats">
              {ex.sets ? `${ex.sets} series` : ''}{ex.reps ? ` × ${ex.reps}` : ''}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function FullView({ routine, view, currentBlock }) {
  const blocks = view === 'both' ? ['A', 'B'] : [currentBlock]
  const activeDays = [1, 2, 3, 4, 5, 6, 7].filter(day => {
    if (view === 'both') {
      return (routine['A'] || {})[day]?.length || (routine['B'] || {})[day]?.length
    }
    return (routine[blocks[0]] || {})[day]?.length
  })

  return (
    <div className="full-view visible">
      <table className="full-table">
        <thead>
          <tr>
            <th>Día</th>
            {view === 'both'
              ? <><th>Bloque A</th><th>Bloque B</th></>
              : <th>Ejercicios — Bloque {blocks[0]}</th>
            }
          </tr>
        </thead>
        <tbody>
          {activeDays.map(day => (
            <tr key={day}>
              <td style={{ color: '#888', fontWeight: 700, whiteSpace: 'nowrap' }}>
                {DAY_LABELS[day] || `Día ${day}`}
              </td>
              {view === 'both' ? (
                <>
                  <td className="day-col">
                    <ExCells exercises={(routine['A'] || {})[day] || []} blockClass="a" />
                  </td>
                  <td className="day-col">
                    <ExCells exercises={(routine['B'] || {})[day] || []} blockClass="b" />
                  </td>
                </>
              ) : (
                <td className="day-col">
                  <ExCells
                    exercises={(routine[blocks[0]] || {})[day] || []}
                    blockClass={blocks[0].toLowerCase()}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
