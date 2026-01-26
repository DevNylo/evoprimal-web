import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // O CSS Global (Tailwind + Reset)
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)