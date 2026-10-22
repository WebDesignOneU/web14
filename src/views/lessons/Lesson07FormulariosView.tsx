// src/views/lessons/Lesson07FormulariosView.tsx
// Lección 07 · Formularios y búsqueda
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { listResource } from '@/api/swapi'
import { RESOURCE_META, RESOURCE_NAMES, idFromUrl, titleOf } from '@/api/types'
import type { ResourceName } from '@/api/types'
import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { getLesson } from '@/data/lessons'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

const lesson = getLesson('07-formularios')!

export default function Lesson07FormulariosView() {
  // 1) Estado de los controles: un único origen de verdad para cada valor.
  const [resource, setResource] = useState<ResourceName>('people')
  const [term, setTerm] = useState('')
  const [onlyShort, setOnlyShort] = useState(false)

  // 2) El valor "debounced" es el que se usa para consultar la API.
  const debouncedTerm = useDebouncedValue(term, 450)

  // 3) Carga con búsqueda en servidor (?search=).
  const { data, error, loading, execute } = useAsyncData(
    (signal) => listResource(resource, 1, { search: debouncedTerm, signal }),
    { immediate: false },
  )

  useEffect(() => {
    void execute()
  }, [execute, resource, debouncedTerm])

  // 4) Filtrado local memoizado: no se recalcula si no cambian sus deps.
  const results = useMemo(() => {
    const items = data?.results ?? []
    return onlyShort ? items.filter((item) => titleOf(item).length <= 10) : items
  }, [data, onlyShort])

  const total = data?.results.length ?? 0
  const meta = RESOURCE_META[resource]
  const searching = term !== debouncedTerm

  return (
    <LessonShell
      lesson={lesson}
      code={
        <CodeBlock
          title="Input controlado + debounce + búsqueda"
          code={[
            'const [term, setTerm] = useState("")',
            'const debouncedTerm = useDebouncedValue(term, 450)',
            '',
            '// Input CONTROLADO: value viene del estado y onChange lo actualiza.',
            '<input value={term} onChange={(e) => setTerm(e.target.value)} />',
            '<select value={resource} onChange={(e) => setResource(e.target.value)}>…</select>',
            '<input type="checkbox" checked={onlyShort}',
            '       onChange={(e) => setOnlyShort(e.target.checked)} />',
            '',
            '// Sólo se consulta a la API cuando el término se estabiliza:',
            'useEffect(() => {',
            '  execute()          // listResource(resource, 1, { search: debouncedTerm })',
            '}, [execute, resource, debouncedTerm])',
            '',
            '// Filtro local barato, memorizado:',
            'const results = useMemo(',
            '  () => (onlyShort ? items.filter((i) => titleOf(i).length <= 10) : items),',
            '  [data, onlyShort],',
            ')',
          ].join('\n')}
        />
      }
      challenges={
        <ChallengeList
          title="Ejercicios"
          items={[
            'Añade un botón «Limpiar» que devuelva `term`, `resource` y `onlyShort` a sus valores iniciales.',
            'Muestra la hora de la última consulta con `new Date().toLocaleTimeString()` dentro del effect.',
            'Cambia el filtro local por «sólo naves con hyperdrive_rating > 1» usando `useMemo`.',
            'Quita el debounce y compara cuántas peticiones hace el navegador en cada tecla.',
          ]}
        />
      }
    >
      <p className="muted">
        Escribe en el buscador: la API sólo se consulta cuando dejas de teclear 450&nbsp;ms. El
        buscador usa <code>?search=</code> (servidor) y el checkbox filtra lo ya recibido (cliente)
        con <code>useMemo</code>.
      </p>

      <form className="panel surface l07-form" onSubmit={(event) => event.preventDefault()}>
        <div className="l07-controls">
          <div className="l07-field">
            <label className="field-label" htmlFor="l07-resource">
              Recurso
            </label>
            <select
              id="l07-resource"
              className="input"
              value={resource}
              onChange={(event) => setResource(event.target.value as ResourceName)}
            >
              {RESOURCE_NAMES.map((name) => (
                <option key={name} value={name}>
                  {RESOURCE_META[name].icon} {RESOURCE_META[name].plural}
                </option>
              ))}
            </select>
          </div>

          <div className="l07-field l07-field--grow">
            <label className="field-label" htmlFor="l07-term">
              Buscar en {meta.plural.toLowerCase()}
            </label>
            <input
              id="l07-term"
              className="input"
              type="search"
              placeholder="p. ej. luke, tatooine, falcon…"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            />
          </div>

          <label className="check l07-check">
            <input
              type="checkbox"
              checked={onlyShort}
              onChange={(event) => setOnlyShort(event.target.checked)}
            />
            Sólo nombres cortos (≤ 10)
          </label>
        </div>

        <p className="dim l07-status">
          {searching ? '⌛ esperando a que dejes de escribir…' : '📡 consultando SWAPI…'}
          {data && (
            <>
              {' '}
              · {total} resultado(s) del servidor · mostrando <strong>{results.length}</strong>
            </>
          )}
        </p>
      </form>

      {loading && <LoadingState variant="skeleton" count={4} />}

      {!loading && error && (
        <ErrorState
          title="La búsqueda falló"
          message={error.message}
          onRetry={() => void execute()}
        />
      )}

      {!loading && !error && results.length === 0 && (
        <EmptyState
          icon="🔍"
          title="Nada por aquí"
          message={
            debouncedTerm
              ? `Sin coincidencias para «${debouncedTerm}».`
              : 'Prueba a escribir algo o quita el filtro local.'
          }
        />
      )}

      {!loading && !error && results.length > 0 && (
        <ul className="l07-results">
          {results.map((item) => (
            <li key={item.url}>
              <Link to={`/${resource}/${idFromUrl(item.url)}`}>
                <span aria-hidden="true">{meta.icon}</span> {titleOf(item)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </LessonShell>
  )
}
