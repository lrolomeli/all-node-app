import { useState, useEffect } from 'react'
import LevelNav from './components/LevelNav.jsx'
import SessionView from './components/SessionView.jsx'
import { parseRutina } from './utils.js'

function checkedKey(level, session) {
  return `cal_checked_${level}_${session}`
}

function loadChecked(level, session) {
  try {
    const raw = localStorage.getItem(checkedKey(level, session))
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

function saveChecked(level, session, set) {
  localStorage.setItem(checkedKey(level, session), JSON.stringify([...set]))
}

export default function CalisthenicsApp() {
  const [sessions, setSessions] = useState([])
  const [level, setLevel] = useState(0)
  const [currentSession, setCurrentSession] = useState(1)
  const [checked, setChecked] = useState(new Set())
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (!ready) return
    setChecked(loadChecked(level, currentSession))
  }, [level, currentSession, ready])

  async function init() {
    try {
      const rutinaRes = await fetch('/api/calisthenics/rutina', { credentials: 'include' })
      const csv = await rutinaRes.text()
      setSessions(parseRutina(csv))

      const progressRes = await fetch('/api/calisthenics/progress', { credentials: 'include' })
      if (progressRes.ok) {
        const data = await progressRes.json()
        setLevel(data.level ?? 0)
        setCurrentSession(data.currentSession ?? 1)
      }

      setReady(true)
    } catch {
      setError('No se pudo cargar la rutina. Recarga la página.')
    }
  }

  async function saveProgress(newLevel, newSession) {
    try {
      await fetch('/api/calisthenics/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ level: newLevel, currentSession: newSession }),
      })
    } catch {
      // non-critical
    }
  }

  function toggleExercise(idx) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
      } else {
        next.add(idx)
      }
      saveChecked(level, currentSession, next)
      return next
    })
  }

  async function handleLevelChange(newLevel) {
    setLevel(newLevel)
    await saveProgress(newLevel, currentSession)
  }

  async function advanceSession() {
    const total = sessions.length
    const next = currentSession >= total ? 1 : currentSession + 1
    localStorage.removeItem(checkedKey(level, currentSession))
    setCurrentSession(next)
    setChecked(new Set())
    await saveProgress(level, next)
  }

  if (error) {
    return (
      <div className="cal-state-screen">
        <p className="cal-error-msg">{error}</p>
        <button className="cal-retry-btn" onClick={() => { setError(null); init() }}>
          Reintentar
        </button>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="cal-state-screen">
        <div className="cal-spinner" />
        <p>Cargando rutina…</p>
      </div>
    )
  }

  const sessionExercises = sessions[currentSession - 1] || []
  const allChecked = sessionExercises.length > 0 && checked.size === sessionExercises.length

  return (
    <div className="cal-app">
      <header className="cal-header">
        <h1 className="cal-title">Calistenia</h1>
        <span className="cal-session-badge">
          {currentSession} / {sessions.length}
        </span>
      </header>

      <LevelNav level={level} onChange={handleLevelChange} />

      <SessionView
        exercises={sessionExercises}
        level={level}
        checked={checked}
        onToggle={toggleExercise}
        sessionNumber={currentSession}
        totalSessions={sessions.length}
      />

      {allChecked && (
        <div className="cal-next-container">
          <button className="cal-next-btn" onClick={advanceSession}>
            Siguiente Rutina →
          </button>
        </div>
      )}
    </div>
  )
}
