// src/views/lessons/Lesson04HooksView.tsx
// Lección 04 · Hooks personalizados
import { ResourceCard } from '@/components/swapi/ResourceCard'
import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { BaseButton } from '@/components/ui/BaseButton'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { PaginationBar } from '@/components/ui/PaginationBar'
import { getLesson } from '@/data/lessons'
import { useSwapiList } from '@/hooks/useSwapi'
import { useToggle } from '@/hooks/useToggle'

const lesson = getLesson('04-hooks-personalizados')!

export default function Lesson04HooksView() {
  // Un solo hook nos da datos, estados y paginación de los planetas.
  const planets = useSwapiList('planets')
  // Hook propio diminuto: gestiona un booleano.
  const [showCards, toggleCards] = useToggle(true)

  const results = planets.data?.results ?? []

  return (
    <LessonShell
      lesson={lesson}
      code={
        <CodeBlock
          title="Dos hooks propios"
          code={[
            '// Un hook es una función que empieza por "use" y llama a otros hooks.',
            'function useToggle(initial = false) {',
            '  const [value, setValue] = useState(initial)',
            '  const toggle = useCallback((next) => {',
            '    setValue((current) => (typeof next === "boolean" ? next : !current))',
            '  }, [])',
            '  return [value, toggle]',
            '}',
            '',
            '// useAsyncData encapsula data / error / loading / execute…',
            'export function useAsyncData(loader, { immediate = true } = {}) {',
            '  const [state, setState] = useState({ data: null, error: null, loading: immediate })',
            '  // …AbortController, limpieza y setState seguro',
            '  return { ...state, execute }',
            '}',
            '',
            '// …y useSwapiList lo compone con la paginación:',
            'const planets = useSwapiList("planets")',
            'planets.data     // SwapiListResponse<Planet> | null',
            'planets.loading  // boolean',
            'planets.goTo(3)  // salta a la página 3',
          ].join('\n')}
        />
      }
      challenges={
        <ChallengeList
          title="Ejercicios"
          items={[
            'Crea un hook `useFavorites(url)` que devuelva `{ isFavorite, toggle }` usando el store.',
            'Añade a `useToggle` un tercer valor de retorno con el número de veces que se ha alternado.',
            'Haz `useSwapiDetail("people", id)` para el detalle y muéstralo en una tarjeta.',
            'Rompe la regla de los hooks: llama a `useToggle` dentro de un `if` y lee el error de la consola.',
          ]}
        />
      }
    >
      <p className="muted">
        Exactamente la misma carga de datos y paginación que en la lección 03, pero reducida a{' '}
        <code>useSwapiList('planets')</code>. Los hooks personalizados son sólo funciones que
        combinan otros hooks: así se reutiliza lógica, no UI.
      </p>

      <div className="panel surface l04-panel">
        <div className="row row--between">
          <div>
            <span className="field-label">Hook en uso</span>
            <code className="inline-code">useSwapiList('planets')</code>
          </div>
          <BaseButton size="sm" variant="subtle" onClick={() => toggleCards()}>
            {showCards ? '🙈 Ocultar tarjetas' : '👀 Mostrar tarjetas'}
          </BaseButton>
        </div>

        <div className="row l04-stats">
          <span className="badge">Página {planets.page}</span>
          <span className="badge">de {planets.totalPages}</span>
          <span className="badge badge--primary">{planets.total} planetas</span>
          <span className="badge">{planets.loading ? 'cargando…' : 'listo'}</span>
        </div>
      </div>

      {showCards && (
        <>
          {planets.loading && <LoadingState variant="skeleton" count={6} />}

          {!planets.loading && planets.error && (
            <ErrorState
              title="No se pudieron cargar los planetas"
              message={planets.error.message}
              onRetry={() => void planets.reload()}
            />
          )}

          {!planets.loading && !planets.error && (
            <div className="grid">
              {results.map((planet) => (
                <ResourceCard key={planet.url} resource="planets" item={planet} url={planet.url} />
              ))}
            </div>
          )}

          {!planets.loading && !planets.error && (
            <PaginationBar
              page={planets.page}
              totalPages={planets.totalPages}
              onPageChange={planets.goTo}
            />
          )}
        </>
      )}
    </LessonShell>
  )
}
