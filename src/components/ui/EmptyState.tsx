// src/components/ui/EmptyState.tsx
// Estado vacío: cuando no hay datos que mostrar.
import type { ReactNode } from 'react'

export interface EmptyStateProps {
  icon?: string
  title?: string
  message?: string
  children?: ReactNode
}

export function EmptyState({
  icon = '🛰️',
  title = 'Nada por aquí',
  message,
  children,
}: EmptyStateProps) {
  return (
    <div className="empty">
      <span className="empty__icon" aria-hidden="true">
        {icon}
      </span>
      <h3 className="empty__title">{title}</h3>
      {message && <p className="muted">{message}</p>}
      {children}
    </div>
  )
}
