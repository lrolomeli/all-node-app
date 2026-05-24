import { useState, useEffect } from 'react'
import { useAuth } from '../../src/useAuth.js'
import './shopping-list.css'

function api(action, body) {
  return fetch('/api/shopping-list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action, ...body }),
  }).then(r => {
    if (!r.ok) throw new Error('Error')
    return r.json()
  })
}

export default function ShoppingListApp() {
  const { checking } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    if (checking) return
    fetch('/api/shopping-list', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [checking])

  async function addItem() {
    const trimmed = text.trim()
    if (!trimmed) return
    try {
      const next = await api('add', { text: trimmed })
      setData(next)
      setText('')
    } catch {
      alert('Error saving')
    }
  }

  async function toggleItem(id) {
    try {
      const next = await api('toggle', { id })
      setData(next)
    } catch {
      alert('Error saving')
    }
  }

  async function removeItem(id) {
    if (!confirm('Remove this item?')) return
    try {
      const next = await api('remove', { id })
      setData(next)
    } catch {
      alert('Error saving')
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
      alert('Error saving')
    }
    setEditingId(null)
  }

  function cancelEdit() {
    setEditingId(null)
  }

  if (checking || loading) return null

  const uncheckedItems = data.items.filter(item => !item.checked)

  return (
    <div className="sl-container">
      <div className="back-home">
        <a href="/" className="btn-home">← Home</a>
      </div>

      <h1>Shopping List</h1>

      <div className="sl-input-row">
        <input
          type="text"
          className="sl-input"
          placeholder="Add item..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') addItem() }}
        />
        <button className="sl-add-btn" onClick={addItem}>Add</button>
      </div>

      <div className="sl-list">
        {uncheckedItems.length === 0 ? (
          <div className="sl-empty">No items yet</div>
        ) : (
          uncheckedItems.map(item => (
            <div key={item.id} className="sl-item">
              <input
                type="checkbox"
                className="sl-checkbox"
                checked={false}
                onChange={() => toggleItem(item.id)}
              />
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
              <button className="sl-icon-btn" onClick={() => startEdit(item)} title="Edit">✏️</button>
              <button className="sl-icon-btn sl-del-btn" onClick={() => removeItem(item.id)} title="Remove">🗑️</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
