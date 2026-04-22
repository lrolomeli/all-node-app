const VIEWS = [
  { id: 'day', label: '📅 Por día' },
  { id: 'block', label: '📋 Bloque completo' },
  { id: 'both', label: '🗓 Ambos bloques' },
]

export default function ViewToggle({ currentView, onSelect }) {
  return (
    <div className="view-toggle">
      {VIEWS.map(({ id, label }) => (
        <button
          key={id}
          className={`view-btn${currentView === id ? ' active' : ''}`}
          onClick={() => onSelect(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
