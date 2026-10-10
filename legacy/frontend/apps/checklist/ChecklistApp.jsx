import { useState, useEffect } from 'react'
import { useAuth } from '../../src/useAuth.js'
import './checklist.css'

export default function ChecklistApp() {
  const { checking } = useAuth()
  const [state, setState] = useState({})

  useEffect(() => {
    fetch('/api/checklist', { credentials: 'include' })
      .then(r => r.json())
      .then(setState)
      .catch(console.error)
  }, [])

  async function toggle(id, checked) {
    setState(prev => ({ ...prev, [id]: checked }))
    try {
      await fetch('/api/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, checked }),
      })
    } catch {
      setState(prev => ({ ...prev, [id]: !checked }))
    }
  }

  if (checking) return null

  const arr = [
    { title: "hello", items: ["hacer tal cosa", "comprar jabon"] },
    { title: "naso", items: ["falsdsjfdsaj", "otra cosa"] },
  ]

  return (
    <>
      <div className="back-home">
        <a href="/" className="btn-home">← Home</a>
      </div>

      <h1>✅ Lista del Super – Familia Hermosos</h1>

      {arr.map((element) => (
        <div key={element.title}>
          <h2>{element.title}</h2>
          {element.items.map((label) => (
            <label key={`${element.title}-${label}`} className="check-label">
              <input
                type="checkbox"
                checked={state[label] || false}
                onChange={e => toggle(label, e.target.checked)}
              />
              {label}
            </label>
          ))}
        </div>
      ))}
    </>
  )
}
