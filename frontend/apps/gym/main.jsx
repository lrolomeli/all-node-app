import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GymApp from './GymApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GymApp />
  </StrictMode>
)
