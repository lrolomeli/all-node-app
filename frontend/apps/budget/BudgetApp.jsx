import { useState, useEffect } from 'react'
import { useAuth } from '../../src/useAuth.js'
import './budget.css'

const EMPTY = { income: [], expenses: [], savings: [], funMoney: [] }

function fmt(n) {
  return `$${parseFloat(n || 0).toFixed(2)}`
}

function EmptyState({ message, sub }) {
  return (
    <div className="empty-state">
      <h4>{message}</h4>
      <p>{sub}</p>
    </div>
  )
}

export default function BudgetApp() {
  const { checking } = useAuth()
  const [data, setData] = useState(EMPTY)
  const [tab, setTab] = useState('income')

  useEffect(() => {
    fetch('/api/budget', { credentials: 'include' })
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
  }, [])

  async function save(next) {
    await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(next),
    })
  }

  function addItem(type, item) {
    const next = { ...data, [type]: [...data[type], item] }
    setData(next)
    save(next)
  }

  async function deleteItem(type, id) {
    await fetch(`/api/budget/${type}/${id}`, { method: 'DELETE', credentials: 'include' })
    setData(prev => ({ ...prev, [type]: prev[type].filter(i => i.id !== id) }))
  }

  const totalIncome   = data.income.reduce((s, i) => s + parseFloat(i.amount || 0), 0)
  const totalExpenses = data.expenses.reduce((s, i) => s + parseFloat(i.amount || 0), 0)
  const totalSavings  = data.savings.reduce((s, i) => s + parseFloat(i.monthlyAmount || 0), 0)
  const totalFun      = data.funMoney.reduce((s, i) => s + parseFloat(i.amount || 0), 0)
  const available     = totalIncome - totalExpenses - totalSavings - totalFun

  const availableClass = available < 0 ? 'negative' : available < 100 ? 'warning' : 'positive'

  if (checking) return null

  return (
    <div className="container">
      <div className="header">
        <div className="back-home">
          <a href="/" className="btn-home">← Home</a>
        </div>
        <h1>💰 Budget Manager</h1>
        <p>Track your income, expenses, and savings goals</p>
      </div>

      <div className="dashboard">
        <div className="summary-card income">
          <h3>Monthly Income</h3>
          <div className="amount">{fmt(totalIncome)}</div>
        </div>
        <div className="summary-card expenses">
          <h3>Fixed Expenses</h3>
          <div className="amount">{fmt(totalExpenses)}</div>
        </div>
        <div className="summary-card savings">
          <h3>Savings Goals</h3>
          <div className="amount">{fmt(totalSavings)}</div>
        </div>
        <div className="summary-card available">
          <h3>Available</h3>
          <div className={`amount ${availableClass}`}>{fmt(available)}</div>
        </div>
      </div>

      <div className="tabs">
        {[['income','💵 Income'],['expenses','💸 Fixed Expenses'],['savings','🎯 Savings Goals'],['funMoney','💕 Fun Money']].map(([key, label]) => (
          <button key={key} className={`tab${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
            {label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === 'income'   && <IncomeTab   items={data.income}   onAdd={i => addItem('income', i)}   onDelete={id => deleteItem('income', id)} />}
        {tab === 'expenses' && <ExpensesTab items={data.expenses} onAdd={i => addItem('expenses', i)} onDelete={id => deleteItem('expenses', id)} />}
        {tab === 'savings'  && <SavingsTab  items={data.savings}  onAdd={i => addItem('savings', i)}  onDelete={id => deleteItem('savings', id)} />}
        {tab === 'funMoney' && <FunTab      items={data.funMoney} onAdd={i => addItem('funMoney', i)} onDelete={id => deleteItem('funMoney', id)} />}
      </div>
    </div>
  )
}

function IncomeTab({ items, onAdd, onDelete }) {
  const [form, setForm] = useState({ name: '', amount: '', notes: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    onAdd({ id: Date.now().toString(), ...form, createdAt: new Date().toISOString() })
    setForm({ name: '', amount: '', notes: '' })
  }

  return (
    <>
      <div className="form-section">
        <h3>Add Income Source</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Income Source *</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g., Salary, Freelance" required />
            </div>
            <div className="form-group">
              <label>Monthly Amount *</label>
              <input type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" step="0.01" required />
            </div>
            <div className="form-group full-width">
              <label>Notes (optional)</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="Additional details..." />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Income</button>
        </form>
      </div>
      <div className="items-list">
        <h3>Income Sources</h3>
        {items.length === 0
          ? <EmptyState message="No income sources yet" sub="Add your income sources to get started" />
          : items.map(item => (
            <div key={item.id} className="item">
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                {item.notes && <div className="item-category">{item.notes}</div>}
              </div>
              <div className="item-amount">{fmt(item.amount)}</div>
              <div className="item-actions">
                <button className="btn btn-danger" onClick={() => { if (confirm('Delete this item?')) onDelete(item.id) }}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

function ExpensesTab({ items, onAdd, onDelete }) {
  const [form, setForm] = useState({ name: '', amount: '', category: 'Housing', dueDate: '', notes: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    onAdd({ id: Date.now().toString(), ...form, createdAt: new Date().toISOString() })
    setForm({ name: '', amount: '', category: 'Housing', dueDate: '', notes: '' })
  }

  return (
    <>
      <div className="form-section">
        <h3>Add Fixed Expense</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Expense Name *</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g., Rent, Utilities" required />
            </div>
            <div className="form-group">
              <label>Monthly Amount *</label>
              <input type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={set('category')}>
                {['Housing','Utilities','Transportation','Food','Insurance','Debt','Subscriptions','Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="number" value={form.dueDate} onChange={set('dueDate')} placeholder="Day of month (1-31)" min="1" max="31" />
            </div>
            <div className="form-group full-width">
              <label>Notes (optional)</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="Additional details..." />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Expense</button>
        </form>
      </div>
      <div className="items-list">
        <h3>Fixed Expenses</h3>
        {items.length === 0
          ? <EmptyState message="No fixed expenses yet" sub="Add your monthly expenses to track your budget" />
          : items.map(item => (
            <div key={item.id} className="item">
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-category">{item.category}{item.dueDate ? ` • Due: ${item.dueDate}` : ''}</div>
                {item.notes && <div className="item-category">{item.notes}</div>}
              </div>
              <div className="item-amount">{fmt(item.amount)}</div>
              <div className="item-actions">
                <button className="btn btn-danger" onClick={() => { if (confirm('Delete this item?')) onDelete(item.id) }}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

function SavingsTab({ items, onAdd, onDelete }) {
  const [form, setForm] = useState({ name: '', targetAmount: '', monthlyAmount: '', currentAmount: '0', notes: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    onAdd({ id: Date.now().toString(), ...form, createdAt: new Date().toISOString() })
    setForm({ name: '', targetAmount: '', monthlyAmount: '', currentAmount: '0', notes: '' })
  }

  return (
    <>
      <div className="form-section">
        <h3>Add Savings Goal</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Goal Name *</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g., Emergency Fund, Vacation" required />
            </div>
            <div className="form-group">
              <label>Target Amount *</label>
              <input type="number" value={form.targetAmount} onChange={set('targetAmount')} placeholder="0.00" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Monthly Contribution *</label>
              <input type="number" value={form.monthlyAmount} onChange={set('monthlyAmount')} placeholder="0.00" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Current Amount</label>
              <input type="number" value={form.currentAmount} onChange={set('currentAmount')} placeholder="0.00" step="0.01" />
            </div>
            <div className="form-group full-width">
              <label>Notes (optional)</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="Why is this goal important to you?" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Savings Goal</button>
        </form>
      </div>
      <div className="items-list">
        <h3>Savings Goals</h3>
        {items.length === 0
          ? <EmptyState message="No savings goals yet" sub="Set your savings goals to build your future" />
          : items.map(item => {
            const progress = (parseFloat(item.currentAmount || 0) / parseFloat(item.targetAmount)) * 100
            const months = Math.ceil((parseFloat(item.targetAmount) - parseFloat(item.currentAmount || 0)) / parseFloat(item.monthlyAmount))
            return (
              <div key={item.id} className="item">
                <div className="item-info" style={{ flex: 2 }}>
                  <div className="item-name">{item.name}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>
                  <div className="progress-text">
                    {fmt(item.currentAmount)} of {fmt(item.targetAmount)} ({progress.toFixed(1)}%)
                    {months > 0 ? ` • ${months} months to go` : ' • Goal reached!'}
                  </div>
                  {item.notes && <div className="item-category">{item.notes}</div>}
                </div>
                <div className="item-amount">{fmt(item.monthlyAmount)}/mo</div>
                <div className="item-actions">
                  <button className="btn btn-danger" onClick={() => { if (confirm('Delete this item?')) onDelete(item.id) }}>Delete</button>
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

function FunTab({ items, onAdd, onDelete }) {
  const [form, setForm] = useState({ name: '', amount: '', category: 'Date Nights', priority: 'High', notes: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function submit(e) {
    e.preventDefault()
    onAdd({ id: Date.now().toString(), ...form, createdAt: new Date().toISOString() })
    setForm({ name: '', amount: '', category: 'Date Nights', priority: 'High', notes: '' })
  }

  return (
    <>
      <div className="form-section">
        <h3>Fun Money Budget</h3>
        <form onSubmit={submit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Activity/Category *</label>
              <input value={form.name} onChange={set('name')} placeholder="e.g., Date nights, Entertainment" required />
            </div>
            <div className="form-group">
              <label>Monthly Budget *</label>
              <input type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" step="0.01" required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.category} onChange={set('category')}>
                {['Date Nights','Entertainment','Hobbies','Travel','Shopping','Dining Out','Other'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={set('priority')}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Notes (optional)</label>
              <textarea value={form.notes} onChange={set('notes')} placeholder="What makes this special?" />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Add Fun Budget</button>
        </form>
      </div>
      <div className="items-list">
        <h3>Fun Money Allocations</h3>
        {items.length === 0
          ? <EmptyState message="No fun money budget yet" sub="Allocate money for activities and date nights" />
          : items.map(item => (
            <div key={item.id} className="item">
              <div className="item-info">
                <div className="item-name">{item.name}</div>
                <div className="item-category">{item.category} • {item.priority} Priority</div>
                {item.notes && <div className="item-category">{item.notes}</div>}
              </div>
              <div className="item-amount">{fmt(item.amount)}</div>
              <div className="item-actions">
                <button className="btn btn-danger" onClick={() => { if (confirm('Delete this item?')) onDelete(item.id) }}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}
