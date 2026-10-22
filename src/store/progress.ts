// src/store/progress.ts
// Estado compartido a nivel de MÓDULO (singleton) + useSyncExternalStore.
// Es una alternativa ligera a una librería de estado: contrástala con
// Zustand en la lección 06.
const STORAGE_KEY = 'web14-completed-lessons'

function loadCompleted(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

// Una única lista compartida por toda la aplicación.
let completed: string[] = loadCompleted()
const listeners = new Set<() => void>()

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  } catch {
    /* ignora errores de almacenamiento */
  }
}

function emit(): void {
  for (const listener of listeners) listener()
}

/** React se suscribe aquí: cuando llamamos a emit(), se vuelve a renderizar. */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Debe devolver SIEMPRE la misma referencia mientras el estado no cambie;
 * si no, React entraría en un bucle infinito de renders.
 */
export function getSnapshot(): string[] {
  return completed
}

export function toggleLesson(id: string): void {
  completed = completed.includes(id)
    ? completed.filter((item) => item !== id)
    : [...completed, id]
  persist()
  emit()
}

export function resetProgress(): void {
  completed = []
  persist()
  emit()
}

export interface Progress {
  completed: string[]
  isCompleted: (id: string) => boolean
  toggle: (id: string) => void
  reset: () => void
  total: number
  done: number
  percent: number
}
