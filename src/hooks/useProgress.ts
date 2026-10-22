// src/hooks/useProgress.ts
// Conecta el store de módulo (src/store/progress.ts) con React a través de
// useSyncExternalStore: la forma "oficial" de leer un store externo.
import { useCallback, useSyncExternalStore } from 'react'

import { lessons } from '@/data/lessons'
import { getSnapshot, resetProgress, subscribe, toggleLesson } from '@/store/progress'
import type { Progress } from '@/store/progress'

export function useProgress(): Progress {
  // `getSnapshot` se usa también como valor en el servidor (tercer argumento).
  const completed = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const isCompleted = useCallback((id: string) => completed.includes(id), [completed])
  const toggle = useCallback((id: string) => toggleLesson(id), [])
  const reset = useCallback(() => resetProgress(), [])

  // Los valores derivados se calculan en cada render: no se guardan en estado.
  const total = lessons.length
  const done = lessons.filter((lesson) => completed.includes(lesson.id)).length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return { completed, isCompleted, toggle, reset, total, done, percent }
}
