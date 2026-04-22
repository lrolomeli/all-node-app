export default function ExerciseCard({ exercise, media, onAddMedia, onDeleteMedia }) {
  const links = media || []
  return (
    <div className="exercise-card">
      <div className="exercise-name">{exercise.name}</div>
      {exercise.muscle && <div className="exercise-muscle">{exercise.muscle}</div>}
      <div className="exercise-stats">
        {exercise.sets && <div className="stat"><span>Series</span><span>{exercise.sets}</span></div>}
        {exercise.reps && <div className="stat"><span>Reps</span><span>{exercise.reps}</span></div>}
      </div>
      {exercise.notes && <div className="exercise-notes">📝 {exercise.notes}</div>}
      <div className="media-section">
        <div className="media-links">
          {links.map(m => (
            <a key={m.id} href={m.url} target="_blank" rel="noreferrer" className="media-link">
              🎬 {m.label || 'Ver'}
              <button
                className="delete-media"
                onClick={e => { e.preventDefault(); onDeleteMedia(exercise.name, m.id) }}
              >
                ✕
              </button>
            </a>
          ))}
        </div>
        <button className="add-media-btn" onClick={() => onAddMedia(exercise.name)}>
          + video / imagen
        </button>
      </div>
    </div>
  )
}
