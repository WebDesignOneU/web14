// src/components/ui/BaseBadge.tsx
// Etiqueta/insignia de estado o categoría.
import type { ReactNode } from 'react'

import { cx } from '@/utils/cx'

export type BadgeVariant = 'default' | 'accent' | 'primary' | 'success' | 'danger'

export interface BaseBadgeProps {
  variant?: BadgeVariant
  className?: string
  children?: ReactNode
}

export function BaseBadge({ variant = 'default', className, children }: BaseBadgeProps) {
  return <span className={cx('badge', `badge--${variant}`, className)}>{children}</span>
}
