// src/views/ResourceListView.tsx
// Explorador de SWAPI: listado paginado + búsqueda con retardo (debounce).
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { RESOURCE_META, isResourceName, type ResourceName } from '@/api/types'
import { ResourceCard } from '@/components/swapi/ResourceCard'
import { BaseButton } from '@/components/ui/BaseButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PaginationBar } from '@/components/ui/PaginationBar'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useSwapiList } from '@/hooks/useSwapi'
import NotFoundView from './NotFoundView'

export default function ResourceListView() {
  const { resource } = useParams<{ resource: string }>()

  // Guarda de tipo: si el segmento no es un recurso válido, mostramos el 404.
  if (!isResourceName(resource)) return <NotFoundView />

  // `key={resource}` remonta el hijo al cambiar de recurso y reinicia su
  // estado (página y búsqueda) sin escribir código extra.
  return <ResourceExplorer key={resource} resource={resource} />
}

function ResourceExplorer({ resource }: { resource: ResourceName }) {
  const meta = RESOURCE_META[resource]

  // Valor del input (se actualiza en cada tecla) y su versión con retardo.
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebouncedValue(term, 400)

  const { data, error, loading, reload, page, totalPages, goTo, setSearch } = useSwapiList(resource)

  // Empujamos al hook el término ya "debounced": así sólo se consulta a la API
  // cuando la persona deja de escribir durante 400 ms (lección 07).
  useEffect(() => {
    setSearch(debouncedTerm)
  }, [debouncedTerm, setSearch])

  const results = data?.results ?? []

  return (
    <div className="explorer stack">
      <header className="page-head">
        <div>
          <h1>
            <span aria-hidden="true">{meta.icon}</span> {meta.plural}
          </h1>
          <p className="muted">
            {data ? `${data.count} resultado(s) en SWAPI` : 'Consultando SWAPI…'}
          </p>
        </div>

        <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
          <label className="visually-hidden" htmlFor="explorer-search">
            Buscar
          </label>
          <input
            id="explorer-search"
            className="input input--grow"
            type="search"
            placeholder={`Buscar ${meta.plural.toLowerCase()}…`}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
          <BaseButton size="sm" variant="subtle" disabled={term === ''} onClick={() => setTerm('')}>
            Limpiar
          </BaseButton>
        </form>
      </header>

      {loading && <LoadingState variant="skeleton" count={6} />}

      {!loading && error && (
        <ErrorState
          title="No se pudieron cargar los datos"
          message={error.message}
          onRetry={() => void reload()}
        />
      )}

      {!loading && !error && results.length === 0 && (
        <EmptyState
          icon="🔍"
          title="Sin resultados"
          message={
            debouncedTerm
              ? `No hay coincidencias para «${debouncedTerm}».`
              : 'SWAPI no devolvió resultados para esta página.'
          }
        />
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <div className="grid">
            {results.map((item) => (
              <ResourceCard key={item.url} resource={resource} item={item} url={item.url} />
            ))}
          </div>
          <PaginationBar page={page} totalPages={totalPages} onPageChange={goTo} />
        </>
      )}
    </div>
  )
}
