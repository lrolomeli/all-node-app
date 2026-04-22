import { useState, useEffect } from 'react'
import { useAuth } from '../../src/useAuth.js'
import './maintenance.css'

const TYPES = ['Water Filter', 'Air Filter', 'HVAC System', 'Appliance', 'Vehicle', 'Equipment', 'Other']

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function nowTimeStr() {
  return new Date().toTimeString().slice(0, 5)
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(timeStr) {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h)
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
}

const EMPTY_FORM = { itemType: '', itemName: '', date: todayStr(), time: nowTimeStr(), description: '', notes: '' }

export default function MaintenanceApp() {
  const { checking } = useAuth()
  const [records, setRecords] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('/api/maintenance', { credentials: 'include' })
      .then(r => r.json())
      .then(setRecords)
      .catch(console.error)
  }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    const record = { id: Date.now().toString(), ...form, createdAt: new Date().toISOString() }

    const res = await fetch('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(record),
    })

    if (res.ok) {
      setRecords(prev => [...prev, record])
      setForm({ ...EMPTY_FORM, date: todayStr(), time: nowTimeStr() })
    }
  }

  async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this maintenance record?')) return
    await fetch(`/api/maintenance/${id}`, { method: 'DELETE', credentials: 'include' })
    setRecords(prev => prev.filter(r => r.id !== id))
  }

  const filtered = (filter ? records.filter(r => r.itemType === filter) : records)
    .slice()
    .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`))

  if (checking) return null

  return (
    <div className="container">
      <div className="header">
        <div className="back-home">
          <a href="/" className="btn-home">← Home</a>
        </div>
        <h1>🔧 Maintenance Tracker</h1>
        <p>Keep track of all your maintenance activities</p>
      </div>

      <div className="form-section">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Item Type</label>
              <select value={form.itemType} onChange={set('itemType')} required>
                <option value="">Select type...</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Item Name</label>
              <input value={form.itemName} onChange={set('itemName')} placeholder="e.g., Kitchen Water Filter" required />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.date} onChange={set('date')} required />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input type="time" value={form.time} onChange={set('time')} required />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea value={form.description} onChange={set('description')} placeholder="What maintenance was performed?" required />
            </div>

            <div className="form-group full-width">
              <label>Additional Notes (optional)</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="Any additional information..." />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">Add Maintenance Record</button>
        </form>
      </div>

      <div className="records-section">
        <div className="records-header">
          <h2>Maintenance History</h2>
          <div className="filter-group">
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="">All Types</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3>No maintenance records yet</h3>
            <p>Start by adding your first maintenance record above</p>
          </div>
        ) : (
          filtered.map(record => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <div className="record-title">
                  <h3>{record.itemName}</h3>
                  <span className="record-type">{record.itemType}</span>
                </div>
                <button className="btn btn-delete" onClick={() => deleteRecord(record.id)}>Delete</button>
              </div>
              <div className="record-meta">
                <span>📅 {formatDate(record.date)}</span>
                <span>🕐 {formatTime(record.time)}</span>
              </div>
              <div className="record-description">{record.description}</div>
              {record.notes && <div className="record-notes">Note: {record.notes}</div>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
