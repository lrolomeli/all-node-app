import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RequireAuth from '../../src/requireAuth.jsx'
import './style.css'
import App from './Schedule.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RequireAuth><App /></RequireAuth>
  </StrictMode>,
)
