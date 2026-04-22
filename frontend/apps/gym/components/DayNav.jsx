const DAY_LABELS = {
  1: 'Lunes', 2: 'Martes', 3: 'Miércoles',
  4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo',
}

export default function DayNav({ routine, currentBlock, currentDay, onSelect }) {
  const days = Object.keys(routine[currentBlock] || {}).map(Number).sort((a, b) => a - b)
  return (
    <div className="days-nav">
      {days.map(day => (
        <button
          key={day}
          className={`day-tab${currentDay === day ? ' active' : ''}`}
          onClick={() => onSelect(day)}
        >
          {DAY_LABELS[day] || `Día ${day}`}
        </button>
      ))}
    </div>
  )
}
