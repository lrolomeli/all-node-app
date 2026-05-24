import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RequireAuth from '../../src/requireAuth.jsx'
import './cv.css'
import CvApp from './CvApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RequireAuth><CvApp /></RequireAuth>
  </StrictMode>,
)
