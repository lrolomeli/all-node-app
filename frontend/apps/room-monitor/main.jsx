import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RequireAuth from '../../src/requireAuth.jsx'
import RoomMonitor from './RoomMonitor.jsx'
import './style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RequireAuth><RoomMonitor /></RequireAuth>
  </StrictMode>,
)
