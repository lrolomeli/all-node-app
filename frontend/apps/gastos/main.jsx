import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RequireAuth from '../../src/requireAuth.jsx'
import GastosApp from './GastosApp.jsx'
import './style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RequireAuth><GastosApp /></RequireAuth>
  </StrictMode>,
)
