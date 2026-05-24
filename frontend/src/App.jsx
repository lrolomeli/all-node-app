import { useState, useEffect } from 'react'
import Login from './Login.jsx'

const APPS = [
  { href: '/apps/schedule',      icon: '📅', title: 'Schedule' },
  // { href: '/apps/checklist',     icon: '✅', title: 'Checklist' },
  { href: '/apps/maintenance',   icon: '🔧', title: 'Maintenance' },
  { href: '/apps/cv',            icon: '📄', title: 'CV' },
  { href: '/apps/diet',          icon: '🥗', title: 'Diet' },
  { href: '/apps/calisthenics',  icon: '🤸', title: 'Calistenia' },
  { href: '/apps/budget',        icon: '💰', title: 'Budget' },
  { href: '/apps/gastos',        icon: '💳', title: 'Gastos' },
  { href: '/apps/room-monitor',  icon: '🌡️', title: 'Room Monitor' },
  { href: '/apps/shopping-list', icon: '🛒', title: 'Shopping List' },
]

export default function App() {
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (data?.user) setUser(data.user) })
      .finally(() => setChecking(false))
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  if (checking) return null

  if (!user) return <Login onLogin={() => setUser({ username: 'admin' })} />

  return (
    <div className="hub">
      <div className="hub-header">
        <h1>Apps</h1>
        <p>Select an application</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      <div className="apps-grid">
        {APPS.map(({ href, icon, title }) => (
          <a key={href} href={href} className="app-card">
            <span className="app-icon">{icon}</span>
            <span className="app-title">{title}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
