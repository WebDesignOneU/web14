// src/components/ui/LoadingState.tsx
// Indicador de carga: spinner o rejilla de "skeletons".
import { cx } from '@/utils/cx'

export interface LoadingStateProps {
  label?: string
  variant?: 'spinner' | 'skeleton'
  count?: number
  className?: string
}

export function LoadingState({
  label = 'Cargando…',
  variant = 'spinner',
  count = 6,
  className,
}: LoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div className={cx('grid', className)} role="status" aria-live="polite">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="sk" aria-hidden="true">
            <div className="sk__line sk__line--title" />
            <div className="sk__line" />
            <div className="sk__line sk__line--short" />
          </div>
        ))}
        <span className="visually-hidden">{label}</span>
      </div>
    )
  }

  return (
    <div className={cx('spinner-wrap', className)} role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="muted">{label}</span>
    </div>
  )
}
