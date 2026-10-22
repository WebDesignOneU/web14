// src/components/ui/BaseCard.tsx
// Tarjeta contenedora. En React no existen los slots de Vue: los "huecos"
// se pasan como props de tipo ReactNode (header, footer) y el contenido
// principal, como children. Es el ejemplo central de la lección 08.
import type { ReactNode } from 'react'

import { cx } from '@/utils/cx'

export interface BaseCardProps {
  as?: 'div' | 'article' | 'section' | 'li'
  title?: string
  subtitle?: string
  /** "Slot" con nombre: reemplaza a title/subtitle si se pasa. */
  header?: ReactNode
  /** "Slot" con nombre: pie de la tarjeta. */
  footer?: ReactNode
  hoverable?: boolean
  flush?: boolean
  className?: string
  children?: ReactNode
}

export function BaseCard({
  as: Tag = 'div',
  title,
  subtitle,
  header,
  footer,
  hoverable = false,
  flush = false,
  className,
  children,
}: BaseCardProps) {
  const hasHeader = header != null || title != null || subtitle != null

  return (
    <Tag className={cx('card', hoverable && 'card--hover', flush && 'card--flush', className)}>
      {hasHeader && (
        <header className="card__header">
          {header ?? (
            <>
              {title && <h3 className="card__title">{title}</h3>}
              {subtitle && <p className="card__subtitle">{subtitle}</p>}
            </>
          )}
        </header>
      )}

      <div className="card__body">{children}</div>

      {footer != null && <footer className="card__footer">{footer}</footer>}
    </Tag>
  )
}
