// src/api/http.ts
// Cliente HTTP mínimo sobre fetch() con manejo de errores y mirrors de respaldo.
// Es la única pieza que conoce cómo se conecta la app con SWAPI.

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export interface RequestOptions {
  signal?: AbortSignal
}

const DEFAULT_BASE = 'https://swapi.dev/api'
// Mirrors públicos por si la instancia principal no responde.
const FALLBACK_BASES = ['https://swapi.py4e.com/api', 'https://swapi.info/api']

function resolveBases(): string[] {
  const configured = import.meta.env.VITE_SWAPI_BASE_URL?.trim()
  const candidates = [configured, DEFAULT_BASE, ...FALLBACK_BASES].filter(
    (base): base is string => Boolean(base),
  )
  return [...new Set(candidates.map((base) => base.replace(/\/+$/, '')))]
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

async function requestJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  })

  if (response.status === 404) {
    throw new ApiError('Recurso no encontrado (404).', 404)
  }
  if (!response.ok) {
    throw new ApiError(`SWAPI respondió con estado ${response.status}.`, response.status)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('La respuesta de SWAPI no es JSON válido.', response.status)
  }
}

/**
 * GET a SWAPI probando la base configurada y, si falla la red, mirrors de respaldo.
 * - Los 404 se propagan de inmediato (no tiene sentido probar otro mirror).
 * - Las cancelaciones por AbortController también se propagan sin reintentos.
 */
export async function swapiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const attempts: string[] = []

  for (const base of resolveBases()) {
    try {
      return await requestJson<T>(`${base}${normalizedPath}`, options.signal)
    } catch (error) {
      if (isAbortError(error) || (error instanceof ApiError && error.status === 404)) {
        throw error
      }
      attempts.push(`${base} → ${(error as Error).message}`)
    }
  }

  throw new ApiError(`No se pudo conectar con la API SWAPI. Intentos: ${attempts.join(' | ')}`)
}

/** GET a una URL absoluta devuelta por SWAPI (p. ej. un `homeworld` o un film). */
export function swapiFetchUrl<T>(url: string, options: RequestOptions = {}): Promise<T> {
  return requestJson<T>(url, options.signal)
}

export { isAbortError }
