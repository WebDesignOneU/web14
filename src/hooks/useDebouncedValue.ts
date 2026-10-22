// src/hooks/useDebouncedValue.ts
// Devuelve una copia del valor que sólo se actualiza cuando dejan de
// producirse cambios durante `delay` milisegundos (lección 07).
import { useEffect, useState } from 'react'

export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    // Si el valor cambia antes de que termine el temporizador, se cancela.
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
