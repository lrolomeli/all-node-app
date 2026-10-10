import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RequireAuth from '../../src/requireAuth.jsx'
import './calisthenics.css'
import CalisthenicsApp from './CalisthenicsApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RequireAuth><CalisthenicsApp /></RequireAuth>
  </StrictMode>,
)
