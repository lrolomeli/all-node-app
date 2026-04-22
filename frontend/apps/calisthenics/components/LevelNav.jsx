const LEVELS = ['Principiante', 'Intermedio', 'Avanzado']

export default function LevelNav({ level, onChange }) {
  return (
    <nav className="cal-level-nav">
      {LEVELS.map((name, i) => (
        <button
          key={i}
          className={`cal-level-btn${level === i ? ' active' : ''}`}
          onClick={() => onChange(i)}
        >
          {name}
        </button>
      ))}
    </nav>
  )
}
