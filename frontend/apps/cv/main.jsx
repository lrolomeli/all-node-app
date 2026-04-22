import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './cv.css'
import CvApp from './CvApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CvApp />
  </StrictMode>,
)
