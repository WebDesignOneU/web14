// src/components/lesson/LessonShell.tsx
// Contenedor común de una lección: cabecera, secciones, botón de completada
// y navegación anterior/siguiente. Los "huecos" opcionales (code, challenges)
// se pasan como props de tipo ReactNode (el equivalente a los slots de Vue).
import type { ReactNode } from 'react'

import { BaseBadge, type BadgeVariant } from '@/components/ui/BaseBadge'
import { BaseButton } from '@/components/ui/BaseButton'
import type { Lesson, LessonLevel } from '@/data/lessons'
import { useProgress } from '@/hooks/useProgress'
import { LessonPager } from './LessonPager'

const levelVariant: Record<LessonLevel, BadgeVariant> = {
  Inicial: 'success',
  Intermedio: 'primary',
  Avanzado: 'accent',
}

export interface LessonShellProps {
  lesson: Lesson
  /** Demo interactiva: contenido principal de la lección. */
  children: ReactNode
  /** Bloque "Código clave". */
  code?: ReactNode
  /** Bloque "Retos para practicar". */
  challenges?: ReactNode
}

export function LessonShell({ lesson, children, code, challenges }: LessonShellProps) {
  const { isCompleted, toggle } = useProgress()
  const completed = isCompleted(lesson.id)

  return (
    <article className="lesson stack">
      <header className="lesson__head">
        <div className="row">
          <BaseBadge variant="accent">Lección {String(lesson.order).padStart(2, '0')}</BaseBadge>
          <BaseBadge variant={levelVariant[lesson.level]}>{lesson.level}</BaseBadge>
          <BaseBadge>~{lesson.duration} min</BaseBadge>
        </div>
        <h1 className="lesson__title">{lesson.title}</h1>
        <p className="lesson__subtitle muted">{lesson.subtitle}</p>
        <p className="lesson__summary">{lesson.summary}</p>
        <ul className="concepts" aria-label="Conceptos de la lección">
          {lesson.concepts.map((concept) => (
            <li key={concept} className="concepts__item">
              {concept}
            </li>
          ))}
        </ul>
      </header>

      <section className="lesson__section">
        <h2 className="lesson__h2">🧪 Demo interactiva</h2>
        {children}
      </section>

      {code && (
        <section className="lesson__section">
          <h2 className="lesson__h2">🔍 Código clave</h2>
          <div className="stack">{code}</div>
        </section>
      )}

      {challenges && (
        <section className="lesson__section">
          <h2 className="lesson__h2">🏁 Retos para practicar</h2>
          {challenges}
        </section>
      )}

      <div className="lesson__actions">
        <BaseButton
          variant={completed ? 'accent' : 'primary'}
          onClick={() => toggle(lesson.id)}
          aria-pressed={completed}
        >
          {completed ? '✓ Lección completada' : 'Marcar como completada'}
        </BaseButton>
      </div>

      <LessonPager lessonId={lesson.id} />
    </article>
  )
}
