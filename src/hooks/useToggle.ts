// src/hooks/useToggle.ts
// El hook personalizado más pequeño posible: un booleano que se alterna.
// Sirve para ilustrar el patrón y las reglas de los hooks (lección 04).
import { useCallback, useState } from 'react'

export type Toggle = (next?: boolean) => void

export function useToggle(initialValue = false): [boolean, Toggle] {
  const [value, setValue] = useState(initialValue)

  // `useCallback` mantiene la misma función entre renders.
  const toggle = useCallback<Toggle>((next) => {
    setValue((current) => (typeof next === 'boolean' ? next : !current))
  }, [])

  return [value, toggle]
}
