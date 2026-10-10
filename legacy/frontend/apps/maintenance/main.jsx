import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RequireAuth from '../../src/requireAuth.jsx'
import MaintenanceApp from './MaintenanceApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RequireAuth><MaintenanceApp /></RequireAuth>
  </StrictMode>,
)
