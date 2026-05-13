import { useState, useEffect } from 'react'
import { useAuth } from '../../src/useAuth.js'

const WEEKLY_AMOUNT = 1750

function fmt(n) {
  return '$' + Math.abs(parseFloat(n || 0)).toFixed(2)
}

function api(action, body) {
  return fetch('/api/gastos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action, ...body }),
  }).then(r => {
    if (!r.ok) throw new Error('Error al guardar')
    return r.json()
  })
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
        setData(saved)
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudo conectar con el servidor. Inicia sesión e intenta de nuevo.')
        setLoading(false)
      })
  }, [checking])

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
    try {
      const next = await api('spend', { amount, description })
      setData(next)
      setDisplay('0')
      setDescription('')
    } catch {
      alert('Error al guardar en el servidor')
    }
  }

  async function deleteTransaction(id) {
    const tx = data.transactions.find(t => t.id === id)
    if (!tx) return
    const msg = tx.type === 'expense' ? '¿Reembolsar este gasto?' : '¿Deshacer este depósito?'
    if (!confirm(msg)) return
    try {
      const next = await api('refund', { transactionId: id })
      setData(next)
    } catch {
      alert('Error al guardar en el servidor')
    }
  }

  async function deposit() {
    const amount = parseFloat(display)
    if (isNaN(amount) || amount <= 0) return
    try {
      const next = await api('deposit', { amount, description })
      setData(next)
      setDisplay('0')
      setDescription('')
    } catch {
      alert('Error al guardar en el servidor')
    }
  }

  async function resetBalance() {
    if (!confirm('¿Reiniciar saldo a $0?')) return
    try {
      const next = await api('reset')
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

  const recentTransactions = [...data.transactions].reverse().slice(0, 50)
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
          <button className="action-btn deposit-btn" onClick={deposit}>AGREGAR</button>
          <button className="action-btn spend-btn" onClick={spend}>GASTAR</button>
        </div>
      </div>

      <div className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? '▲ Ocultar historial' : '▼ Ver historial de gastos'}
      </div>

      {showHistory && (
        <div className="history">
          {recentTransactions.length === 0 ? (
            <div className="history-empty">Aún no hay movimientos registrados</div>
          ) : (
            recentTransactions.map(tx => {
              const sign = tx.type === 'expense' ? '-' : '+'
              const cls = tx.type === 'expense' ? 'history-item' : 'history-item history-deposit'
              return (
                <div key={tx.id} className={cls} onClick={() => deleteTransaction(tx.id)} title={tx.type === 'expense' ? 'Click para reembolsar' : 'Click para deshacer'}>
                  <div className="history-info">
                    <span className="history-desc">{tx.description}</span>
                    <span className="history-date">{new Date(tx.date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <span className="history-amount">{sign}{fmt(tx.amount)}</span>
                </div>
              )
            })
          )}
        </div>
      )}

      <button className="reset-btn" onClick={resetBalance}>Reiniciar saldo</button>
    </div>
  )
}
