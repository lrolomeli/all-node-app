import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RequireAuth from '../../src/requireAuth.jsx'
import ShoppingListApp from './ShoppingListApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RequireAuth><ShoppingListApp /></RequireAuth>
  </StrictMode>,
)
