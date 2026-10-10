import ExerciseItem from './ExerciseItem.jsx'

export default function SessionView({ exercises, level, checked, onToggle, sessionNumber, totalSessions }) {
  const done = checked.size
  const total = exercises.length

  return (
    <div className="cal-session">
      <div className="cal-session-header">
        <h2 className="cal-session-title">Sesión {sessionNumber}</h2>
        <span className="cal-progress-text">{done}/{total} completados</span>
      </div>
      <div className="cal-progress-bar">
        <div className="cal-progress-fill" style={{ width: total ? `${(done / total) * 100}%` : '0%' }} />
      </div>
      <ul className="cal-exercise-list">
        {exercises.map((ex, idx) => (
          <ExerciseItem
            key={idx}
            exercise={ex}
            level={level}
            checked={checked.has(idx)}
            onToggle={() => onToggle(idx)}
          />
        ))}
      </ul>
    </div>
  )
}
