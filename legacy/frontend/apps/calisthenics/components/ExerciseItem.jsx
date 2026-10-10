const FASE_ICONS = {
  Fuerza: '💪',
  Cardio: '🏃',
  Calentamiento: '🔥',
  Estiramiento: '🧘',
}

export default function ExerciseItem({ exercise, level, checked, onToggle }) {
  const { fase, enfoque, dosis, niveles } = exercise
  const name = niveles[level] || niveles[0]
  const icon = FASE_ICONS[fase] || '•'

  return (
    <li className={`cal-exercise-item${checked ? ' checked' : ''}`} onClick={onToggle}>
      <div className="cal-exercise-check">{checked ? '✓' : ''}</div>
      <div className="cal-exercise-info">
        <span className="cal-exercise-name">{name}</span>
        <div className="cal-exercise-meta">
          <span className="cal-fase">{icon} {fase}</span>
          <span className="cal-enfoque">{enfoque}</span>
          {dosis && <span className="cal-dosis">{dosis}</span>}
        </div>
      </div>
    </li>
  )
}
