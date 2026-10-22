// src/components/demo/Collapse.tsx
// Anima la ENTRADA y la SALIDA de su contenido.
// React no anima el desmontaje por sí solo: hay que retrasar el unmount.
// Estrategia: mantener montado mientras dura la transición y desmontar en
// onTransitionEnd (lección 09).
import { useEffect, useState, type ReactNode } from 'react'

import { cx } from '@/utils/cx'

export interface CollapseProps {
  open: boolean
  children: ReactNode
  className?: string
}

export function Collapse({ open, children, className }: CollapseProps) {
  // `mounted` controla si el nodo existe en el DOM; `visible`, si tiene la
  // clase que dispara la transición.
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(open)

  useEffect(() => {
    if (open) {
      setMounted(true)
      // Esperamos un frame para que el navegador pinte el estado inicial
      // y la transición tenga de dónde salir.
      const frame = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(frame)
    }

    setVisible(false)
    return undefined
  }, [open])

  if (!mounted) return null

  return (
    <div
      className={cx('collapse', visible && 'collapse--open', className)}
      onTransitionEnd={(event) => {
        // Sólo desmontamos al terminar la transición de salida.
        if (!open && event.propertyName === 'opacity') setMounted(false)
      }}
    >
      {children}
    </div>
  )
}
