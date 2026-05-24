import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RequireAuth from '../../src/requireAuth.jsx'
import BudgetApp from './BudgetApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RequireAuth><BudgetApp /></RequireAuth>
  </StrictMode>,
)
