// src/components/ui/ErrorState.tsx
// Estado de error con acción de reintento opcional.
import { BaseButton } from './BaseButton'

export interface ErrorStateProps {
  title?: string
  message?: string
  retryable?: boolean
  onRetry?: () => void
}

export function ErrorState({
  title = 'Algo salió mal',
  message = '',
  retryable = true,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="error" role="alert">
      <span className="error__icon" aria-hidden="true">
        ⚠️
      </span>
      <div>
        <h3 className="error__title">{title}</h3>
        {message && <p className="error__msg muted">{message}</p>}
      </div>
      {retryable && (
        <BaseButton size="sm" variant="danger" onClick={onRetry}>
          Reintentar
        </BaseButton>
      )}
    </div>
  )
}
