// src/components/ui/BaseButton.tsx
// Botón base reutilizable. Extiende las props nativas de <button>, así que
// acepta onClick, disabled, aria-*, className, etc. sin envolverlas.
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '@/utils/cx'

export type ButtonVariant = 'primary' | 'accent' | 'ghost' | 'subtle' | 'danger'
export type ButtonSize = 'sm' | 'md'

export interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
  children?: ReactNode
}

export function BaseButton({
  variant = 'ghost',
  size = 'md',
  block = false,
  type = 'button',
  className,
  children,
  ...rest
}: BaseButtonProps) {
  return (
    <button
      type={type}
      className={cx('btn', `btn--${variant}`, `btn--${size}`, block && 'btn--block', className)}
      {...rest}
    >
      {children}
    </button>
  )
}
