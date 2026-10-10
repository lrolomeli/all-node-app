import { useState, useEffect } from 'react'
import './shopping-list.css'

let _password = ''

function api(action, body) {
  return fetch('/api/shopping-list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action, password: _password, ...body }),
  }).then(r => {
    if (!r.ok) throw new Error('Error')
    return r.json()
  })
}

export default function ShoppingListApp() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    fetch('/api/shopping-list', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function unlock() {
    if (!pw.trim()) return
    _password = pw.trim()
    setPw('')
    setPwError('')
    setUnlocked(true)
  }

  async function addItem() {
    const trimmed = text.trim()
    if (!trimmed) return
    try {
      const next = await api('add', { text: trimmed })
      setData(next)
      setText('')
    } catch {
      alert('Contraseña incorrecta')
      setUnlocked(false)
      _password = ''
    }
  }

  async function toggleItem(id) {
    try {
      const next = await api('toggle', { id })
      setData(next)
    } catch {
      alert('Contraseña incorrecta')
      setUnlocked(false)
      _password = ''
    }
  }

  async function removeItem(id) {
    if (!confirm('¿Eliminar este elemento?')) return
    try {
      const next = await api('remove', { id })
      setData(next)
    } catch {
      alert('Contraseña incorrecta')
      setUnlocked(false)
      _password = ''
    }
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditText(item.text)
  }

  async function saveEdit(id) {
    const trimmed = editText.trim()
    if (!trimmed) return
    try {
      const next = await api('edit', { id, text: trimmed })
      setData(next)
    } catch {
      alert('Contraseña incorrecta')
      setUnlocked(false)
      _password = ''
    }
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  if (loading) return null

  const uncheckedItems = data.items.filter(item => !item.checked)

  return (
    <div className="sl-container">
      <div className="back-home">
        <a href="/" className="btn-home">← Home</a>
      </div>

      <h1>Shopping List</h1>

      {!unlocked ? (
        <div className="sl-unlock">
          <input
            type="password"
            className="sl-input"
            placeholder="Contraseña para editar"
            value={pw}
            onChange={e => { setPw(e.target.value); setPwError('') }}
            onKeyDown={e => { if (e.key === 'Enter') unlock() }}
          />
          <button className="sl-add-btn" onClick={unlock}>Desbloquear</button>
          {pwError && <div className="sl-error">{pwError}</div>}
        </div>
      ) : (
        <div className="sl-input-row">
          <input
            type="text"
            className="sl-input"
            placeholder="Agregar artículo..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addItem() }}
          />
          <button className="sl-add-btn" onClick={addItem}>Agregar</button>
        </div>
      )}

      <div className="sl-list">
        {uncheckedItems.length === 0 ? (
          <div className="sl-empty">Sin artículos aún</div>
        ) : (
          uncheckedItems.map(item => (
            <div key={item.id} className="sl-item">
              {unlocked && (
                <input
                  type="checkbox"
                  className="sl-checkbox"
                  checked={false}
                  onChange={() => toggleItem(item.id)}
                />
              )}
              {editingId === item.id ? (
                <input
                  type="text"
                  className="sl-edit-input"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') saveEdit(item.id)
                    if (e.key === 'Escape') cancelEdit()
                  }}
                  onBlur={() => saveEdit(item.id)}
                  autoFocus
                />
              ) : (
                <span className="sl-text">{item.text}</span>
              )}
              {unlocked && (
                <>
                  <button className="sl-icon-btn" onClick={() => startEdit(item)} title="Editar">✏️</button>
                  <button className="sl-icon-btn sl-del-btn" onClick={() => removeItem(item.id)} title="Eliminar">🗑️</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
