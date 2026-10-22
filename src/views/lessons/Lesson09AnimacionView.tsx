// src/views/lessons/Lesson09AnimacionView.tsx
// Lección 09 · Animaciones y UX de carga
import { useState } from 'react'

import { Collapse } from '@/components/demo/Collapse'
import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { BaseButton } from '@/components/ui/BaseButton'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { LoadingState } from '@/components/ui/LoadingState'
import { getLesson } from '@/data/lessons'
import { useToggle } from '@/hooks/useToggle'
import { cx } from '@/utils/cx'

const lesson = getLesson('09-animacion-ux')!

const initialCrew = ['Leia Organa', 'Chewbacca', 'R2-D2']

export default function Lesson09AnimacionView() {
  const [open, toggleOpen] = useToggle(false)
  const [fakeLoading, toggleFakeLoading] = useToggle(true)

  const [crew, setCrew] = useState<string[]>(initialCrew)
  const [leaving, setLeaving] = useState<string[]>([])
  const [counter, setCounter] = useState(initialCrew.length)

  function addMember(): void {
    const next = counter + 1
    setCounter(next)
    setCrew((current) => [...current, `Recluta ${String(next).padStart(2, '0')}`])
  }

  // La salida se hace en dos fases: primero marcamos y animamos, y sólo
  // cuando termina la animación lo quitamos de verdad (onAnimationEnd).
  function removeMember(name: string): void {
    setLeaving((current) => (current.includes(name) ? current : [...current, name]))
  }

  function finishLeave(name: string): void {
    setCrew((current) => current.filter((member) => member !== name))
    setLeaving((current) => current.filter((item) => item !== name))
  }

  return (
    <LessonShell
      lesson={lesson}
      code={
        <CodeBlock
          title="Animar la salida y animar la entrada"
          code={[
            '/* Entrada: basta con una animación CSS al montar */',
            '@keyframes slide-in {',
            '  from { opacity: 0; transform: translateY(-8px); }',
            '  to   { opacity: 1; transform: none; }',
            '}',
            '.item { animation: slide-in 220ms ease-out }',
            '',
            '/* Salida: React no la anima sola. Dos pasos:',
            '   1) marcamos la fila como "saliendo"',
            ' 2) desmontamos cuando termina la animación      */',
            'const [leaving, setLeaving] = useState([])',
            '',
            '<li',
            '  className={cx("item", leaving.includes(name) && "l09-item--leaving")}',
            '  onAnimationEnd={() => leaving.includes(name) && finishLeave(name)}',
            '>',
            '  {name}',
            '</li>',
            '',
            '// Alternativa para bloques completos: mantener montado hasta onTransitionEnd',
            '<Collapse open={open}>contenido</Collapse>',
          ].join('\n')}
        />
      }
      challenges={
        <ChallengeList
          title="Ejercicios"
          items={[
            'Cambia la duración de las animaciones en `src/styles/lessons.css` y ajústala a tu gusto.',
            'Haz que las filas entren desde la izquierda en vez de desvanecerse.',
            'Añade un `aria-live="polite"` a la lista para que se anuncie quién entra y sale.',
            'Sustituye el `requestAnimationFrame` de `Collapse` por `useLayoutEffect` y explica la diferencia.',
          ]}
        />
      }
    >
      <p className="muted">
        Con CSS y estado es suficiente para el 90&nbsp;% de las animaciones. Lo difícil no es
        animar la entrada (basta un <code>@keyframes</code> al montar), sino la <strong>salida</strong>:
        React desmonta al instante, así que hay que retrasar el desmontaje.
      </p>

      <div className="panel surface l09-panel">
        <span className="field-label">1 · Animar el desmontaje con transición</span>
        <BaseButton size="sm" variant="primary" onClick={() => toggleOpen()}>
          {open ? 'Ocultar panel' : 'Mostrar panel'}
        </BaseButton>
        <Collapse open={open} className="l09-collapse">
          <p>
            Este bloque no desaparece de golpe: al cerrar, la clase <code>collapse--open</code>{' '}
            desaparece, arranca la transición y <code>onTransitionEnd</code> desmonta el nodo.
          </p>
        </Collapse>
      </div>

      <div className="panel surface l09-panel">
        <span className="field-label">2 · Lista con entrada y salida animadas</span>
        <div className="row">
          <BaseButton
            size="sm"
            variant="primary"
            onClick={() => {
              addMember()
            }}
          >
            + Añadir miembro
          </BaseButton>
          <BaseButton size="sm" variant="subtle" onClick={() => setCrew(initialCrew)}>
            Reiniciar lista
          </BaseButton>
        </div>

        <ul className="l09-list">
          {crew.map((member) => (
            <li
              key={member}
              className={cx('l09-item', leaving.includes(member) && 'l09-item--leaving')}
              onAnimationEnd={() => {
                if (leaving.includes(member)) finishLeave(member)
              }}
            >
              <span>{member}</span>
              <BaseButton size="sm" variant="danger" onClick={() => removeMember(member)}>
                Quitar
              </BaseButton>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel surface l09-panel">
        <span className="field-label">2b · Skeletons mientras llegan los datos</span>
        <BaseButton size="sm" variant="subtle" onClick={() => toggleFakeLoading()}>
          {fakeLoading ? '✅ Simular carga terminada' : '⏳ Simular carga'}
        </BaseButton>

        {fakeLoading ? (
          <LoadingState variant="skeleton" count={3} />
        ) : (
          <div className="grid l09-loaded">
            {crew.map((name) => (
              <div key={name} className="card">
                <div className="card__body">
                  <strong>{name}</strong>
                  <p className="dim">Datos cargados.</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LessonShell>
  )
}
