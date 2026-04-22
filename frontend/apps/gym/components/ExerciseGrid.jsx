import ExerciseCard from './ExerciseCard'

export default function ExerciseGrid({ exercises, gymMedia, onAddMedia, onDeleteMedia }) {
  if (!exercises.length) {
    return (
      <div className="exercises-grid">
        <div className="empty-day">
          <h3>Sin ejercicios</h3>
          <p>No hay ejercicios para este día</p>
        </div>
      </div>
    )
  }
  return (
    <div className="exercises-grid">
      {exercises.map((ex, i) => (
        <ExerciseCard
          key={`${ex.name}-${i}`}
          exercise={ex}
          media={gymMedia[ex.name]}
          onAddMedia={onAddMedia}
          onDeleteMedia={onDeleteMedia}
        />
      ))}
    </div>
  )
}
