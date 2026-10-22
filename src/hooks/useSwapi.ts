// src/hooks/useSwapi.ts
// Hooks específicos de SWAPI construidos SOBRE useAsyncData.
// Demuestran cómo combinar varios hooks en uno propio (lección 04).
import { useCallback, useEffect, useState } from 'react'

import { getResource, listResource } from '@/api/swapi'
import type { ResourceName, SwapiListResponse, SwapiResources } from '@/api/types'
import { useAsyncData } from './useAsyncData'

/**
 * Lista paginada de un recurso, con búsqueda y navegación de páginas.
 * `search` es una búsqueda del lado del servidor (`?search=`): al cambiarla,
 * la página vuelve a 1.
 */
export function useSwapiList<K extends ResourceName>(resource: K, initialPage = 1) {
  const [page, setPage] = useState(initialPage)
  const [search, setSearchState] = useState('')

  const state = useAsyncData<SwapiListResponse<SwapiResources[K]>>(
    (signal) => listResource(resource, page, { search, signal }),
    // `immediate: false`: la primera carga la dispara el efecto de abajo.
    // Así evitamos lanzar dos peticiones idénticas al montar.
    { immediate: false },
  )
  const { execute } = state

  useEffect(() => {
    void execute()
  }, [execute, resource, page, search])

  // React agrupa las dos actualizaciones de estado en un único render,
  // de modo que el efecto de arriba sólo se ejecuta una vez.
  const setSearch = useCallback((value: string) => {
    setSearchState(value)
    setPage(1)
  }, [])

  const total = state.data?.count ?? 0
  const pageSize = state.data?.results.length ?? 0
  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1
  const hasNext = state.data?.next != null
  const hasPrevious = state.data?.previous != null

  const next = useCallback(() => {
    if (hasNext) setPage((current) => current + 1)
  }, [hasNext])

  const previous = useCallback(() => {
    if (hasPrevious) setPage((current) => current - 1)
  }, [hasPrevious])

  const goTo = useCallback(
    (target: number) => {
      setPage(Math.min(Math.max(1, target), totalPages))
    },
    [totalPages],
  )

  return {
    ...state,
    page,
    setPage,
    search,
    setSearch,
    total,
    pageSize,
    totalPages,
    hasNext,
    hasPrevious,
    next,
    previous,
    goTo,
    reload: execute,
  }
}

/** Detalle de un recurso. Se recarga automáticamente cuando cambia el id. */
export function useSwapiDetail<K extends ResourceName>(resource: K, id: string) {
  const state = useAsyncData<SwapiResources[K]>(
    (signal) => getResource(resource, id, { signal }),
    { immediate: false },
  )
  const { execute } = state

  useEffect(() => {
    void execute()
  }, [execute, resource, id])

  return { ...state, reload: execute }
}
