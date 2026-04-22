const MUSCLE_LINKS = {
  'Triceps':         'https://musclewiki.com/exercises/male/triceps',
  'Pecho':           'https://musclewiki.com/machine/male/chest',
  'Cuadriceps':      'https://musclewiki.com/machine/male/quads',
  'Pantorrilla':     'https://musclewiki.com/machine/male/calves',
  'Oblicuos':        'https://musclewiki.com/machine/male/obliques',
  'Espalda Media':   'https://musclewiki.com/machine/male/traps-middle',
  'Espalda Lateral': 'https://musclewiki.com/machine/male/lats',
  'Espalda Baja':    'https://musclewiki.com/machine/male/lowerback',
  'Biceps':          'https://musclewiki.com/machine/male/biceps',
  'Antebrazo':       'https://musclewiki.com/exercises/male/forearms',
  'Hombro':          'https://musclewiki.com/exercises/male/front-shoulders',
  'Trapecio':        'https://musclewiki.com/exercises/male/traps',
  'Abdomen':         'https://musclewiki.com/exercises/male/abdominals',
  'Femoral':         'https://musclewiki.com/exercises/male/hamstrings',
  'Gluteos':         'https://musclewiki.com/exercises/male/glutes',
}

export default function MusclesSection() {
  return (
    <div className="muscles-section">
      <h3>Referencia de músculos</h3>
      <div className="muscles-grid">
        {Object.entries(MUSCLE_LINKS).map(([muscle, url]) => (
          <a key={muscle} href={url} target="_blank" rel="noreferrer" className="muscle-link">
            {muscle}
          </a>
        ))}
      </div>
    </div>
  )
}
