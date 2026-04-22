import { useState, useEffect } from 'react'
import './gym.css'
import { buildRoutineFromCsvText } from './utils'
import Header from './components/Header'
import BlockTabs from './components/BlockTabs'
import ViewToggle from './components/ViewToggle'
import DayNav from './components/DayNav'
import ExerciseGrid from './components/ExerciseGrid'
import FullView from './components/FullView'
import MediaModal from './components/MediaModal'
import RoutineEditorModal from './components/RoutineEditorModal'
import MusclesSection from './components/MusclesSection'

export default function GymApp() {
  const [routine, setRoutine] = useState({})
  const [gymMedia, setGymMedia] = useState({})
  const [currentBlock, setCurrentBlock] = useState('A')
  const [currentDay, setCurrentDay] = useState(null)
  const [currentView, setCurrentView] = useState('day')
  const [routineCsvRaw, setRoutineCsvRaw] = useState('')
  const [mediaModal, setMediaModal] = useState({ open: false, exercise: null })
  const [routineModalOpen, setRoutineModalOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/gym/routine').then(r => r.text()),
      fetch('/api/gym/media').then(r => r.json()).catch(() => ({})),
    ]).then(([csvText, media]) => {
      setRoutineCsvRaw(csvText)
      setRoutine(buildRoutineFromCsvText(csvText))
      setGymMedia(media)
    })
  }, [])

  useEffect(() => {
    if (currentView !== 'day') return
    const days = Object.keys(routine[currentBlock] || {}).map(Number).sort((a, b) => a - b)
    if (!days.includes(currentDay)) setCurrentDay(days[0] ?? null)
  }, [routine, currentBlock, currentView])

  function handleBlockChange(block) {
    setCurrentBlock(block)
    setCurrentDay(null)
  }

  async function saveMedia(exercise, url, label) {
    const res = await window.pinAuth.authenticatedFetch('/api/gym/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exercise, url, label }),
    })
    const data = await res.json()
    setGymMedia(prev => ({ ...prev, [exercise]: data.media }))
  }

  async function deleteMedia(exercise, id) {
    await window.pinAuth.authenticatedFetch(
      `/api/gym/media/${encodeURIComponent(exercise)}/${id}`,
      { method: 'DELETE' }
    )
    setGymMedia(prev => {
      const updated = { ...prev }
      if (updated[exercise]) {
        updated[exercise] = updated[exercise].filter(m => m.id !== id)
        if (!updated[exercise].length) delete updated[exercise]
      }
      return updated
    })
  }

  function downloadRoutine() {
    if (!routineCsvRaw) return
    const blob = new Blob([routineCsvRaw], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'gym-routine.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  async function saveRoutine(csv) {
    const res = await window.pinAuth.authenticatedFetch('/api/gym/routine', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || err.error || 'No se pudo guardar')
    }
    const trimmed = csv.replace(/^﻿/, '')
    setRoutineCsvRaw(trimmed)
    setRoutine(buildRoutineFromCsvText(trimmed))
    setRoutineModalOpen(false)
  }

  const exercises = (routine[currentBlock] || {})[currentDay] || []

  return (
    <>
      <Header onDownload={downloadRoutine} onEditRoutine={() => setRoutineModalOpen(true)} />
      <BlockTabs
        currentBlock={currentBlock}
        onSelect={handleBlockChange}
        hidden={currentView === 'both'}
      />
      <ViewToggle currentView={currentView} onSelect={setCurrentView} />

      {currentView === 'day' && (
        <>
          <DayNav
            routine={routine}
            currentBlock={currentBlock}
            currentDay={currentDay}
            onSelect={setCurrentDay}
          />
          <ExerciseGrid
            exercises={exercises}
            gymMedia={gymMedia}
            onAddMedia={exercise => setMediaModal({ open: true, exercise })}
            onDeleteMedia={deleteMedia}
          />
        </>
      )}

      {currentView !== 'day' && (
        <FullView routine={routine} view={currentView} currentBlock={currentBlock} />
      )}

      <MusclesSection />

      <MediaModal
        open={mediaModal.open}
        exercise={mediaModal.exercise}
        onClose={() => setMediaModal({ open: false, exercise: null })}
        onSave={saveMedia}
      />
      <RoutineEditorModal
        open={routineModalOpen}
        routine={routine}
        csvRaw={routineCsvRaw}
        onClose={() => setRoutineModalOpen(false)}
        onSave={saveRoutine}
      />
    </>
  )
}
