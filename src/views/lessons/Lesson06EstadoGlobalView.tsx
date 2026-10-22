// src/views/lessons/Lesson06EstadoGlobalView.tsx
// Lección 06 · Estado global con Zustand
import { FavoriteButton } from '@/components/swapi/FavoriteButton'
import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { BaseButton } from '@/components/ui/BaseButton'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { EmptyState } from '@/components/ui/EmptyState'
import { getLesson } from '@/data/lessons'
import { useProgress } from '@/hooks/useProgress'
import { selectCount, selectItems, useFavoritesStore } from '@/store/favorites'

const lesson = getLesson('06-estado-global')!

const candidates = [
  { url: 'https://swapi.dev/api/people/1/', name: 'Luke Skywalker', icon: '🧑‍🚀' },
  { url: 'https://swapi.dev/api/planets/1/', name: 'Tatooine', icon: '🪐' },
  { url: 'https://swapi.dev/api/films/1/', name: 'A New Hope', icon: '🎬' },
  { url: 'https://swapi.dev/api/starships/9/', name: 'Death Star', icon: '🚀' },
]

export default function Lesson06EstadoGlobalView() {
  // Selectores: cada componente se suscribe sólo a la parte que necesita.
  const count = useFavoritesStore(selectCount)
  const items = useFavoritesStore(selectItems)
  const clear = useFavoritesStore((state) => state.clear)
  const toggle = useFavoritesStore((state) => state.toggle)

  // El progreso usa una técnica distinta (estado de módulo) para comparar.
  const progress = useProgress()

  return (
    <LessonShell
      lesson={lesson}
      code={
        <CodeBlock
          title="Un store de Zustand en 12 líneas"
          code={[
            'import { create } from "zustand"',
            'import { persist } from "zustand/middleware"',
            '',
            'export const useFavoritesStore = create()(',
            '  persist(',
            '    (set) => ({',
            '      items: [],',
            '      toggle: (url) =>',
            '        set((state) => ({',
            '          items: state.items.includes(url)',
            '            ? state.items.filter((item) => item !== url)',
            '            : [...state.items, url],',
            '        })),',
            '      clear: () => set({ items: [] }),',
            '    }),',
            '    { name: "web14-favorites" },  // ← persistencia en localStorage',
            '  ),',
            ')',
            '',
            '// En un componente:',
            'const count = useFavoritesStore((state) => state.items.length)',
          ].join('\n')}
        />
      }
      challenges={
        <ChallengeList
          title="Ejercicios"
          items={[
            'Añade una acción `add(url)` que no duplique valores ya guardados.',
            'Crea un selector `selectPeople` que devuelva sólo las URLs de personajes.',
            'Añade `localStorage.removeItem("web14-favorites")` a un botón y explica qué ocurre al recargar.',
            'Compara: ¿por qué el progreso usa `useSyncExternalStore` y los favoritos un store?',
          ]}
        />
      }
    >
      <p className="muted">
        Los favoritos se comparten entre la cabecera, el explorador y esta lección sin pasar props
        de padre a hijo. Y como el store usa el middleware <code>persist</code>, sobreviven a un
        recargado de página: haz la prueba.
      </p>

      <div className="panel surface l06-panel">
        <div className="row row--between">
          <div>
            <span className="field-label">Estado del store</span>
            <p>
              <strong>{count}</strong> favorito(s) guardado(s)
            </p>
          </div>
          <div className="row">
            <BaseButton size="sm" variant="danger" disabled={count === 0} onClick={clear}>
              Vaciar
            </BaseButton>
          </div>
        </div>

        <div className="l06-candidates">
          {candidates.map((candidate) => {
            const saved = items.includes(candidate.url)
            return (
              <div key={candidate.url} className="l06-candidate">
                <span aria-hidden="true">{candidate.icon}</span>
                <strong>{candidate.name}</strong>
                <FavoriteButton url={candidate.url} name={candidate.name} />
                <BaseButton
                  size="sm"
                  variant="subtle"
                  onClick={() => toggle(candidate.url)}
                  title="Alterna desde fuera del componente de favoritos"
                >
                  {saved ? 'Quitar del store' : 'Añadir al store'}
                </BaseButton>
              </div>
            )
          })}
        </div>
      </div>

      {count === 0 ? (
        <EmptyState
          icon="⭐"
          title="El store está vacío"
          message="Pulsa una estrella: cualquier componente que lea el store se actualizará al instante."
        />
      ) : (
        <div className="fav-list">
          {items.map((url) => (
            <div key={url} className="l06-saved">
              <code className="inline-code">{url}</code>
              <BaseButton size="sm" variant="danger" onClick={() => toggle(url)}>
                Quitar
              </BaseButton>
            </div>
          ))}
        </div>
      )}

      <div className="panel surface l06-compare">
        <span className="field-label">Otra estrategia: estado de módulo</span>
        <p className="muted">
          El progreso de la ruta ({progress.done}/{progress.total}, {progress.percent}%) vive en{' '}
          <code>src/store/progress.ts</code> como una variable de módulo expuesta a React con{' '}
          <code>useSyncExternalStore</code>. Sin librerías, pero con más código a mano. Elige según
          la complejidad: <strong>Zustand</strong> para estado global con acciones y persistencia.
        </p>
      </div>
    </LessonShell>
  )
}
