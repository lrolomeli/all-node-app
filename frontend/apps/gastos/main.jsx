import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import GastosApp from './GastosApp.jsx'
import './style.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GastosApp />
  </StrictMode>,
)
