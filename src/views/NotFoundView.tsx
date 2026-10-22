// src/views/NotFoundView.tsx
// Vista 404: se usa también como catch-all de rutas desconocidas.
import { Link } from 'react-router-dom'

import { EmptyState } from '@/components/ui/EmptyState'

export default function NotFoundView() {
  return (
    <EmptyState
      icon="🛸"
      title="404 · Ruta perdida en el hiperespacio"
      message="La página que buscas no existe o cambió de coordenadas."
    >
      <div className="empty__actions">
        <Link className="btn btn--primary btn--md" to="/">
          Volver al inicio
        </Link>
      </div>
    </EmptyState>
  )
}
