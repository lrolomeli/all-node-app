import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ShoppingListApp from './ShoppingListApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShoppingListApp />
  </StrictMode>,
)
