// src/views/lessons/Lesson10RendimientoView.tsx
// Lección 10 · Rendimiento y buenas prácticas
import { memo, useCallback, useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'

import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { BaseButton } from '@/components/ui/BaseButton'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { getLesson } from '@/data/lessons'
import { useToggle } from '@/hooks/useToggle'
import { cx } from '@/utils/cx'

const lesson = getLesson('10-rendimiento')!

// Una lista grande y estable: siempre la misma referencia.
const stormtroopers = Array.from({ length: 200 }, (_, index) => ({
  id: index + 1,
  name: `Stormtrooper ${String(index + 1).padStart(3, '0')}`,
}))

interface RowProps {
  id: number
  name: string
  selected: boolean
  onSelect: (id: number) => void
}

function RowBase({ id, name, selected, onSelect }: RowProps) {
  // Contador de renders: usar una ref y mutarla en el render es "impuro",
  // pero es la forma más directa de visualizar el problema. (En StrictMode
  // los números son el doble: cada render se ejecuta dos veces en desarrollo.)
  const renders = useRef(0)
  renders.current += 1

  return (
    <li className={cx('l10-row', selected && 'l10-row--selected')}>
      <button type="button" className="l10-row__btn" onClick={() => onSelect(id)}>
        {name}
      </button>
      <span className="l10-row__count dim">renders: {renders.current}</span>
    </li>
  )
}

// React.memo compara las props y evita el re-render si no han cambiado.
const MemoRow = memo(RowBase)

function RowsDemo() {
  const [selected, setSelected] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const [memoOn, toggleMemo] = useToggle(true)

  // useCallback: la identidad de la función se mantiene entre renders.
  // Sin esto, `onSelect` sería una prop nueva y memo no serviría de nada.
  const handleSelect = useCallback((id: number) => setSelected(id), [])

  // useMemo: sólo recalcula cuando cambia la búsqueda.
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return needle
      ? stormtroopers.filter((trooper) => trooper.name.toLowerCase().includes(needle))
      : stormtroopers
  }, [query])

  // Alternamos entre la versión memorizada y la normal para comparar.
  const Row: ComponentType<RowProps> = memoOn ? MemoRow : RowBase

  return (
    <div className="panel surface l10-panel">
      <div className="row row--between">
        <div className="row">
          <BaseButton
            size="sm"
            variant={memoOn ? 'primary' : 'subtle'}
            onClick={() => toggleMemo()}
          >
            React.memo {memoOn ? '✅ activado' : '❌ desactivado'}
          </BaseButton>
          <span className="dim">
            Seleccionado: <strong>{selected ?? 'ninguno'}</strong>
          </span>
        </div>

        <label className="check">
          <span className="visually-hidden">Filtrar</span>
          <input
            className="input input--auto"
            type="search"
            placeholder="filtrar filas…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <p className="dim">
        {visible.length} de {stormtroopers.length} filas. Pulsa una fila y mira los contadores:
        {memoOn
          ? ' con memo sólo cambian la fila pulsada y la anterior.'
          : ' sin memo se vuelven a renderizar todas las filas.'}
      </p>

      <ul className="l10-list">
        {visible.map((trooper) => (
          <Row
            key={trooper.id}
            id={trooper.id}
            name={trooper.name}
            selected={selected === trooper.id}
            onSelect={handleSelect}
          />
        ))}
      </ul>
    </div>
  )
}

export default function Lesson10RendimientoView() {
  return (
    <LessonShell
      lesson={lesson}
      code={
        <CodeBlock
          title="Las tres herramientas, en su sitio"
          code={[
            '// 1) React.memo: evita re-render si las props no cambian',
            'const Row = memo(function Row({ item, selected, onSelect }) { … })',
            '',
            '// 2) useCallback: props estables para componentes memorizados',
            'const onSelect = useCallback((id) => setSelected(id), [])',
            '',
            '// 3) useMemo: cálculos caros que no deben repetirse en cada render',
            'const visible = useMemo(',
            '  () => trooper.filter((t) => t.name.includes(query)),',
            '  [query],',
            ')',
            '',
            '// 4) Code splitting: una vista, un chunk (ya en uso)',
            'const HomeView = lazy(() => import("@/views/HomeView"))',
            '<Suspense fallback={<LoadingState />}>…</Suspense>',
            '',
            '// 5) Listas largas: keys estables, nunca el índice si el orden cambia',
            '{items.map((item) => <Row key={item.id} … />)}',
          ].join('\n')}
        />
      }
      challenges={
        <ChallengeList
          title="Ejercicios"
          items={[
            'Quita `useCallback` y comprueba que `React.memo` deja de evitar renders. ¿Por qué?',
            'Envuelve la lista en `useDeferredValue(query)` para mantener el teclado fluido.',
            'Reduce `memo` a comparar sólo `selected` con un segundo argumento `areEqual`.',
            'Mide antes de optimizar: envuelve el render en `console.time` / `performance.now()`.',
          ]}
        />
      }
    >
      <p className="muted">
        Memorizar es la guinda, no la tarta: primero escribe código claro y mide. Aquí hay una lista
        de 200 filas con un contador de renders propio para que veas el efecto de{' '}
        <code>React.memo</code>, <code>useCallback</code> y <code>useMemo</code> con tus ojos.
      </p>

      <RowsDemo />

      <div className="panel surface l10-checklist">
        <span className="field-label">Checklist antes de optimizar</span>
        <ul>
          <li>¿El problema es real? Mide con Profiler o <code>console.time</code> antes de tocar nada.</li>
          <li>¿La clave de las listas es estable? Las <code>key</code> con índice provocan re-montajes.</li>
          <li>¿El estado vive lo más abajo posible? Cada <code>setState</code> re-renderiza su subárbol.</li>
          <li>¿El trabajo pesado está en <code>useMemo</code> o fuera del render?</li>
          <li>¿Las props que cruzan un <code>memo</code> son estables (<code>useCallback</code>)?</li>
          <li>¿Cada ruta se carga con <code>lazy</code> + <code>Suspense</code>?</li>
          <li>¿He evitado mutar el estado y derivarlo en lugar de duplicarlo?</li>
        </ul>
      </div>
    </LessonShell>
  )
}
