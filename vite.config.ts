import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite: plugin de React + alias "@" -> "./src"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Puerto distinto al de web13 para poder tener ambos showcases en marcha.
    port: 5174,
  },
})
