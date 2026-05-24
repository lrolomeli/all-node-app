import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RequireAuth from '../../src/requireAuth.jsx'
import ChecklistApp from './ChecklistApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RequireAuth><ChecklistApp /></RequireAuth>
  </StrictMode>,
)
