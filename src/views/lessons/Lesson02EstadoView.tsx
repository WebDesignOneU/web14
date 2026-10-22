// src/views/lessons/Lesson02EstadoView.tsx
// Lección 02 · Estado con useState
import { useState } from 'react'

import { LikeButton } from '@/components/demo/LikeButton'
import { RatingStars } from '@/components/demo/RatingStars'
import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { BaseBadge } from '@/components/ui/BaseBadge'
import { BaseButton } from '@/components/ui/BaseButton'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { getLesson } from '@/data/lessons'
import { cx } from '@/utils/cx'

const lesson = getLesson('02-estado-useState')!

const rankTable = [
  { min: 13000, label: 'Maestro Jedi' },
  { min: 10000, label: 'Caballero Jedi' },
  { min: 6000, label: 'Padawan' },
  { min: 0, label: 'Iniciado' },
]

type Side = 'luz' | 'sombra'

export default function Lesson02EstadoView() {
  // Cuatro estados independientes: texto, número, unión de literales y array.
  const [name, setName] = useState('Ezra Bridger')
  const [midichlorians, setMidichlorians] = useState(8200)
  const [side, setSide] = useState<Side>('luz')
  const [log, setLog] = useState<string[]>([])
  // Estado de componentes reutilizables: el valor vive aquí y baja por props.
  const [rating, setRating] = useState(0)
  const [likes, setLikes] = useState(0)

  // VALOR DERIVADO: se calcula en cada render a partir del estado.
  // No se guarda con useState porque se puede deducir.
  const rank = rankTable.find((entry) => midichlorians >= entry.min)?.label ?? 'Iniciado'

  function pushLog(message: string): void {
    // Actualización funcional + inmutabilidad: creamos un array nuevo.
    setLog((previous) => [message, ...previous].slice(0, 5))
  }

  function changeMidichlorians(amount: number): void {
    setMidichlorians((current) => Math.max(0, current + amount))
    pushLog(`${amount > 0 ? '+' : ''}${amount} midiclorianos`)
  }

  function switchSide(next: Side): void {
    setSide(next)
    pushLog(`Se cambia al lado ${next}`)
  }

  return (
    <LessonShell
      lesson={lesson}
      code={
        <CodeBlock
          title="useState: lo esencial"
          code={[
            'const [midichlorians, setMidichlorians] = useState(8200)',
            '',
            '// ✅ Actualización funcional: parte del valor anterior',
            'setMidichlorians((current) => current + 1000)',
            '',
            '// ❌ Mutar el estado no vuelve a renderizar',
            'log.push("nuevo evento")',
            '',
            '// ✅ Objetos y arrays: crear copias',
            'setLog((previous) => [message, ...previous])',
            '',
            '// ✅ Valor derivado: se calcula, no se guarda',
            'const rank = rankTable.find((r) => midichlorians >= r.min)?.label',
          ].join('\n')}
        />
      }
      challenges={
        <ChallengeList
          title="Ejercicios"
          items={[
            'Añade un botón «duplicar» que multiplique los midiclorianos por 2 con actualización funcional.',
            'Guarda el nombre en un objeto `{ value, updatedAt }` y actualízalo sin mutarlo.',
            'Convierte `rank` en un useState y observa por qué se queda desincronizado.',
            'Añade un estado `training` (boolean) y muestra un aviso mientras esté activo.',
          ]}
        />
      }
    >
      <p className="muted">
        Cada control de este panel cambia una pieza de estado local. Fíjate en que el rango se{' '}
        <strong>calcula</strong> a partir de los midiclorianos: nunca se guarda.
      </p>

      <div className="panel surface l02-panel">
        <div className="l02-field">
          <label className="field-label" htmlFor="l02-name">
            Nombre del padawan
          </label>
          <input
            id="l02-name"
            className="input"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="l02-field">
          <span className="field-label">Midiclorianos: {midichlorians.toLocaleString('es-ES')}</span>
          <div className="row">
            <BaseButton size="sm" onClick={() => changeMidichlorians(-1000)}>
              −1000
            </BaseButton>
            <BaseButton size="sm" variant="primary" onClick={() => changeMidichlorians(1000)}>
              +1000
            </BaseButton>
            <BaseButton
              size="sm"
              variant="subtle"
              onClick={() => {
                setMidichlorians(8200)
                setLog([])
              }}
            >
              Reiniciar
            </BaseButton>
          </div>
        </div>

        <div className="l02-field">
          <span className="field-label">Lado de la Fuerza</span>
          <div className="row">
            <BaseButton
              size="sm"
              variant={side === 'luz' ? 'primary' : 'subtle'}
              onClick={() => switchSide('luz')}
            >
              ☀️ Luminoso
            </BaseButton>
            <BaseButton
              size="sm"
              variant={side === 'sombra' ? 'danger' : 'subtle'}
              onClick={() => switchSide('sombra')}
            >
              🌑 Oscuro
            </BaseButton>
          </div>
        </div>

        <div className="l02-summary">
          <p>
            <strong>{name || 'Sin nombre'}</strong>{' '}
            {name ? `es ${rank.toLowerCase()}` : 'aún no tiene rango'}.
          </p>
          <BaseBadge variant={side === 'luz' ? 'primary' : 'danger'}>
            {side === 'luz' ? 'Lado luminoso' : 'Lado oscuro'}
          </BaseBadge>
        </div>

        <div className="l02-log">
          <span className="field-label">Registro de eventos (máx. 5)</span>
          {log.length === 0 ? (
            <p className="dim">Sin actividad todavía.</p>
          ) : (
            <ol className="l02-log__list">
              {log.map((entry, index) => (
                <li key={`${entry}-${index}`} className={cx(index === 0 && 'l02-log__item--new')}>
                  {entry}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div className="panel surface l02-panel">
        <span className="field-label">Componentes controlados y presentacionales</span>
        <p className="muted">
          Ninguno de estos dos componentes guarda estado propio: <code>RatingStars</code> es{' '}
          <strong>controlado</strong> (<code>value</code> + <code>onChange</code>) y{' '}
          <code>LikeButton</code> es puramente <strong>presentacional</strong> (
          <code>count</code> + <code>onLike</code>). El estado vive en esta vista y baja por props.
        </p>

        <div className="row row--between">
          <div className="l02-field">
            <span className="field-label">Valora el episodio</span>
            <RatingStars value={rating} onChange={setRating} />
            <small className="dim">
              {rating === 0 ? 'Sin valorar todavía.' : `Has dado ${rating} de 5 estrellas.`}
            </small>
          </div>

          <div className="l02-field">
            <span className="field-label">Reacciones del público</span>
            <LikeButton
              label="Me gusta"
              count={likes}
              onLike={() => {
                setLikes((current) => current + 1)
                pushLog('👍 Me gusta')
              }}
            />
          </div>
        </div>
      </div>
    </LessonShell>
  )
}
