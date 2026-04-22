import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './calisthenics.css'
import CalisthenicsApp from './CalisthenicsApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CalisthenicsApp />
  </StrictMode>,
)
