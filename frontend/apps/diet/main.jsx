import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DietApp from './DietApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DietApp />
  </StrictMode>,
)
