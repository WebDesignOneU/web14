// src/main.tsx
// Punto de entrada: monta React en #root y envuelve la app con el router,
// el proveedor de tema y StrictMode.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from '@/App'
import { ThemeProvider } from '@/context/ThemeContext'

import '@/styles/global.css'
import '@/styles/components.css'
import '@/styles/views.css'
import '@/styles/lessons.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('No se encontró el elemento #root en index.html')
}

createRoot(container).render(
  // StrictMode sólo actúa en desarrollo: ejecuta los efectos dos veces para
  // detectar limpiezas incorrectas (lección 03).
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
