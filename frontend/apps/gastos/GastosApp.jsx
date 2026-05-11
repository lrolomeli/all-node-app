import { useState, useEffect } from 'react'
import { useAuth } from '../../src/useAuth.js'

const WEEKLY_AMOUNT = 1750

function getMondaysSince(lastDateStr) {
  if (!lastDateStr) return []
  const mondays = []
  const last = new Date(lastDateStr)
  last.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cursor = new Date(last)
  cursor.setDate(cursor.getDate() + 1)
  while (cursor <= today) {
    if (cursor.getDay() === 1) mondays.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return mondays
}

function fmt(n) {
  return '$' + Math.abs(parseFloat(n || 0)).toFixed(2)
}

function nextId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export default function GastosApp() {
  const { checking } = useAuth()
  const [data, setData] = useState(null)
  const [display, setDisplay] = useState('0')
  const [description, setDescription] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (checking) return
    setLoading(true)
    fetch('/api/gastos', { credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error('Error ' + r.status + ': No autorizado o servidor no disponible')
        return r.json()
      })
      .then(saved => {
        const mondays = getMondaysSince(saved.lastMonday)
        if (mondays.length > 0) {
          saved.balance += mondays.length * WEEKLY_AMOUNT
          saved.lastMonday = new Date().toISOString()
          for (const m of mondays) {
            saved.transactions.push({
              id: nextId(),
              type: 'deposit',
              amount: WEEKLY_AMOUNT,
              description: 'Depósito semanal',
              date: m.toISOString(),
            })
          }
          fetch('/api/gastos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(saved),
          })
        }
        setData(saved)
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudo conectar con el servidor. Inicia sesión e intenta de nuevo.')
        setLoading(false)
      })
  }, [checking])

  async function save(next) {
    const r = await fetch('/api/gastos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(next),
    })
    if (!r.ok) throw new Error('Error al guardar')
  }

  function appendDigit(d) {
    setDisplay(prev => {
      if (prev === '0' && d !== '.') return d
      if (d === '.' && prev.includes('.')) return prev
      if (prev.includes('.') && prev.split('.')[1].length >= 2) return prev
      if (prev.length >= 10) return prev
      return prev + d
    })
  }

  function clearDisplay() {
    setDisplay('0')
  }

  function deleteLast() {
    setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'))
  }

  async function spend() {
    const amount = parseFloat(display)
    if (isNaN(amount) || amount <= 0) return
    if (amount > data.balance) {
      alert('No tienes suficiente saldo disponible')
      return
    }
    const next = { ...data }
    next.balance -= amount
    next.transactions.push({
      id: nextId(),
      type: 'expense',
      amount,
      description: description.trim() || 'Gasto',
      date: new Date().toISOString(),
    })
    try {
      await save(next)
      setData(next)
      setDisplay('0')
      setDescription('')
    } catch {
      alert('Error al guardar en el servidor')
    }
  }

  async function deleteTransaction(id) {
    const tx = data.transactions.find(t => t.id === id)
    if (!tx || tx.type !== 'expense') return
    if (!confirm('¿Reembolsar este gasto?')) return
    const next = { ...data }
    next.balance += tx.amount
    next.transactions = next.transactions.filter(t => t.id !== id)
    try {
      await save(next)
      setData(next)
    } catch {
      alert('Error al guardar en el servidor')
    }
  }

  async function resetBalance() {
    if (!confirm('¿Reiniciar saldo a $0?')) return
    const next = { balance: 0, lastMonday: new Date().toISOString(), transactions: [] }
    try {
      await save(next)
      setData(next)
    } catch {
      alert('Error al guardar en el servidor')
    }
  }

  if (checking || loading) return null

  if (error) {
    return (
      <div className="gastos-container">
        <div className="gastos-header" style={{ textAlign: 'left' }}>
          <a href="/" className="btn-home">← Home</a>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: 40,
          textAlign: 'center',
          color: 'white',
          marginTop: 40,
        }}>
          <p style={{ fontSize: '1.1em', marginBottom: 12 }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 28px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '1em',
              cursor: 'pointer',
            }}
          >Reintentar</button>
        </div>
      </div>
    )
  }

  const recentTransactions = data.transactions.filter(t => t.type === 'expense').reverse().slice(0, 50)
  const balanceClass = data.balance < 0 ? 'negative' : data.balance < 100 ? 'warning' : ''

  return (
    <div className="gastos-container">
      <div className="gastos-header">
        <div className="back-home">
          <a href="/" className="btn-home">← Home</a>
        </div>
        <h1>Calculadora de Gastos</h1>
      </div>

      <div className={`balance-card ${balanceClass}`}>
        <span className="balance-label">Disponible</span>
        <span className="balance-amount">{fmt(data.balance)}</span>
        <span className="balance-weekly">+${WEEKLY_AMOUNT} cada lunes</span>
      </div>

      <div className="calculator">
        <div className="calc-display">
          <span className="calc-display-value">${display}</span>
        </div>

        <div className="calc-description">
          <input
            type="text"
            placeholder="¿Qué compraste? (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') spend() }}
          />
        </div>

        <div className="calc-numpad">
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <button key={n} className="num-btn" onClick={() => appendDigit(String(n))}>{n}</button>
          ))}
          <button className="num-btn zero-btn" onClick={() => appendDigit('0')}>0</button>
          <button className="num-btn" onClick={() => appendDigit('.')}>.</button>
          <button className="num-btn del-btn" onClick={deleteLast}>⌫</button>
          <button className="num-btn clear-btn" onClick={clearDisplay}>C</button>
          <button className="enter-btn" onClick={spend}>GASTAR</button>
        </div>
      </div>

      <div className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? '▲ Ocultar historial' : '▼ Ver historial de gastos'}
      </div>

      {showHistory && (
        <div className="history">
          {recentTransactions.length === 0 ? (
            <div className="history-empty">Aún no hay gastos registrados</div>
          ) : (
            recentTransactions.map(tx => (
              <div key={tx.id} className="history-item" onClick={() => deleteTransaction(tx.id)} title="Click para reembolsar">
                <div className="history-info">
                  <span className="history-desc">{tx.description}</span>
                  <span className="history-date">{new Date(tx.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</span>
                </div>
                <span className="history-amount">-{fmt(tx.amount)}</span>
              </div>
            ))
          )}
        </div>
      )}

      <button className="reset-btn" onClick={resetBalance}>Reiniciar saldo</button>
    </div>
  )
}
