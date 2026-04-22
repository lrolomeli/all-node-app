const APPS = [
  { href: '/apps/schedule',      icon: '📅', title: 'Schedule' },
  { href: '/apps/checklist',     icon: '✅', title: 'Checklist' },
  { href: '/apps/maintenance',   icon: '🔧', title: 'Maintenance' },
  { href: '/apps/cv',           icon: '📄', title: 'CV' },
  { href: '/apps/diet',          icon: '🥗', title: 'Diet' },
  { href: '/apps/gym',          icon: '💪', title: 'Gym' },
  { href: '/apps/calisthenics', icon: '🤸', title: 'Calistenia' },
  { href: '/apps/budget',        icon: '💰', title: 'Budget' },
  { href: '/apps/expediente',    icon: '🏥', title: 'Expediente' },
]

export default function App() {
  return (
    <div className="hub">
      <div className="hub-header">
        <h1>Apps</h1>
        <p>Select an application</p>
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
