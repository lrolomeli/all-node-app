import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RoomMonitor from './RoomMonitor.jsx'
import './style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoomMonitor />
  </StrictMode>,
)
