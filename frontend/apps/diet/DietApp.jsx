import { useState } from 'react'
import './diet.css'

const DIETA = [
  { comida: 'Pre-Entreno', proteinas: 1, cereales: 1, leguminosas: 0, frutas: 2, verduras: 0, lacteos: 2, grasas: 0, azucar: 3 },
  { comida: 'Desayuno',    proteinas: 5, cereales: 3, leguminosas: 1, frutas: 2, verduras: 0, lacteos: 1, grasas: 1, azucar: 0 },
  { comida: 'Comida',      proteinas: 4, cereales: 3, leguminosas: 0, frutas: 0, verduras: 3, lacteos: 0, grasas: 3, azucar: 0 },
  { comida: 'Cena',        proteinas: 4, cereales: 3, leguminosas: 0, frutas: 2, verduras: 1, lacteos: 0, grasas: 0, azucar: 0 },
]

const COLS = ['proteinas', 'cereales', 'leguminosas', 'frutas', 'verduras', 'lacteos', 'grasas', 'azucar']
const HEADERS = ['Proteína', 'Cereales', 'Leguminosas', 'Frutas', 'Verduras', 'Lácteos', 'Grasas', 'Azúcar']

function loadState() {
  const s = {}
  DIETA.forEach((_, r) => COLS.forEach((_, c) => {
    s[`${r}-${c}`] = localStorage.getItem(`check-${r}-${c}`) === 'true'
  }))
  return s
}

export default function DietApp() {
  const [checked, setChecked] = useState(loadState)

  function toggle(key) {
    setChecked(prev => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem(`check-${key}`, next[key])
      return next
    })
  }

  function reset() {
    localStorage.clear()
    setChecked(loadState())
  }

  return (
    <div className="diet-container">
      <div className="diet-header">
        <a href="/" className="btn-home">← Volver al Inicio</a>
        <h1>Mi Plan de Dieta</h1>
      </div>

      <table className="diet-table">
        <thead>
          <tr>
            <th>Comida</th>
            {HEADERS.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {DIETA.map((row, r) => (
            <tr key={row.comida}>
              <td>{row.comida}</td>
              {COLS.map((col, c) => {
                const key = `${r}-${c}`
                const done = checked[key]
                return (
                  <td key={col}>
                    <div className={`cell-content${done ? ' done' : ''}`}>
                      <span>{row[col]}</span>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={() => toggle(key)}
                      />
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="reset-row">
        <button className="btn-reset" onClick={reset}>Desmarcar Todas</button>
      </div>
    </div>
  )
}
