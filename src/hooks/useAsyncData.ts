// src/hooks/useAsyncData.ts
// Hook genérico que envuelve una carga asíncrona en el patrón
// data / error / loading / execute, cancelando la petición anterior
// con AbortController (lecciones 03 y 04).
import { useCallback, useEffect, useRef, useState } from 'react'

export interface AsyncDataOptions {
  /** Si es false, no lanza la carga al montar el componente (por defecto true). */
  immediate?: boolean
}

export interface AsyncDataState<T> {
  data: T | null
  error: Error | null
  loading: boolean
  loaded: boolean
}

export interface AsyncDataResult<T> extends AsyncDataState<T> {
  /** Vuelve a lanzar la carga (cancelando la que estuviera en curso). */
  execute: () => Promise<void>
}

export function useAsyncData<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  options: AsyncDataOptions = {},
): AsyncDataResult<T> {
  const { immediate = true } = options

  const [state, setState] = useState<AsyncDataState<T>>({
    data: null,
    error: null,
    loading: immediate,
    loaded: false,
  })

  // El loader se guarda en una ref: así `execute` es estable aunque el
  // componente padre pase una función nueva en cada render.
  const loaderRef = useRef(loader)
  loaderRef.current = loader

  const controllerRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  const execute = useCallback(async () => {
    // Cancela la petición anterior: sólo nos interesa la última respuesta.
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    setState((previous) => ({ ...previous, loading: true, error: null }))

    try {
      const data = await loaderRef.current(controller.signal)
      // Si el componente se desmontó o la petición fue cancelada, no tocamos el estado.
      if (!mountedRef.current || controller.signal.aborted) return
      setState({ data, error: null, loading: false, loaded: true })
    } catch (caught) {
      if (!mountedRef.current || controller.signal.aborted) return
      if ((caught as Error)?.name === 'AbortError') return // cancelar no es un error
      setState((previous) => ({
        ...previous,
        error: caught instanceof Error ? caught : new Error(String(caught)),
        loading: false,
      }))
    }
  }, [])

  useEffect(() => {
    // En desarrollo, StrictMode monta, desmonta y vuelve a montar el efecto:
    // la primera petición se cancela en el cleanup y la segunda es la que vale.
    mountedRef.current = true
    if (immediate) void execute()
    return () => {
      mountedRef.current = false
      controllerRef.current?.abort()
    }
  }, [execute, immediate])

  return { ...state, execute }
}
