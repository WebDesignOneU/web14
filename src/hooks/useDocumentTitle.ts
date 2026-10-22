// src/hooks/useDocumentTitle.ts
// Mantiene el <title> del navegador en sincronía con la ruta actual.
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { RESOURCE_META, isResourceName } from '@/api/types'
import { getLesson } from '@/data/lessons'

/** Deduce un título legible a partir del pathname. */
export function titleForPath(pathname: string): string {
  if (pathname === '/') return 'Ruta de aprendizaje'

  const [first, second] = pathname.split('/').filter(Boolean)

  if (first === 'lecciones' && second) return getLesson(second)?.title ?? 'Lección'
  if (first === 'favoritos') return 'Favoritos'
  if (isResourceName(first)) {
    return second ? `${RESOURCE_META[first].singular} #${second}` : RESOURCE_META[first].plural
  }
  return 'Página no encontrada'
}

export function useDocumentTitle(): void {
  const { pathname } = useLocation()

  useEffect(() => {
    document.title = `${titleForPath(pathname)} · Ruta de aprendizaje React`
  }, [pathname])
}
