// src/api/swapi.ts
// Endpoints tipados de SWAPI. Gracias al mapa SwapiResources, el tipo de
// retorno se deduce del nombre del recurso (genéricos + keyof).
import { swapiFetch, swapiFetchUrl, type RequestOptions } from './http'
import type { ResourceName, SwapiListResponse, SwapiResources } from './types'

export interface ListOptions extends RequestOptions {
  /** Búsqueda por nombre/título soportada por SWAPI (`?search=`). */
  search?: string
}

/** Lista paginada de un recurso: listResource('people', 2, { search: 'luke' }). */
export function listResource<K extends ResourceName>(
  resource: K,
  page = 1,
  options: ListOptions = {},
): Promise<SwapiListResponse<SwapiResources[K]>> {
  const params = new URLSearchParams()
  if (page > 1) params.set('page', String(page))
  const search = options.search?.trim()
  if (search) params.set('search', search)
  const query = params.toString() ? `?${params.toString()}` : ''
  return swapiFetch<SwapiListResponse<SwapiResources[K]>>(`/${resource}/${query}`, options)
}

/** Un recurso por id: getResource('planets', 1). */
export function getResource<K extends ResourceName>(
  resource: K,
  id: string | number,
  options: RequestOptions = {},
): Promise<SwapiResources[K]> {
  return swapiFetch<SwapiResources[K]>(`/${resource}/${id}/`, options)
}

/** Sigue una URL absoluta devuelta por SWAPI (homeworld, films, residents...). */
export function getResourceByUrl<T>(url: string, options: RequestOptions = {}): Promise<T> {
  return swapiFetchUrl<T>(url, options)
}
