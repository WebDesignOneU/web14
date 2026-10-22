// src/components/layout/AppSidebar.tsx
// Barra lateral: progreso de la ruta de aprendizaje y accesos al explorador.
import { NavLink } from 'react-router-dom'

import { RESOURCE_META, RESOURCE_NAMES } from '@/api/types'
import { BaseBadge, type BadgeVariant } from '@/components/ui/BaseBadge'
import { BaseButton } from '@/components/ui/BaseButton'
import { lessons, totalDuration } from '@/data/lessons'
import type { LessonLevel } from '@/data/lessons'
import { useProgress } from '@/hooks/useProgress'
import { cx } from '@/utils/cx'

const levelVariant: Record<LessonLevel, BadgeVariant> = {
  Inicial: 'success',
  Intermedio: 'primary',
  Avanzado: 'accent',
}

export interface AppSidebarProps {
  open: boolean
  onNavigate: () => void
}

export function AppSidebar({ open, onNavigate }: AppSidebarProps) {
  const { isCompleted, percent, done, total, reset } = useProgress()

  return (
    <aside id="sidebar" className={cx('sidebar', open && 'sidebar--open')}>
      <section className="side-panel surface">
        <div className="panel__row">
          <span className="muted">Tu progreso</span>
          <strong className="panel__percent">{percent}%</strong>
        </div>
        <div
          className="bar"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="bar__fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="panel__row panel__row--foot">
          <small className="dim">
            {done} de {total} lecciones · ~{Math.round(totalDuration / 60)} h
          </small>
          <BaseButton size="sm" variant="subtle" disabled={done === 0} onClick={reset}>
            Reiniciar
          </BaseButton>
        </div>
      </section>

      <nav className="nav" aria-label="Ruta de aprendizaje">
        <p className="nav__title">Ruta de aprendizaje</p>
        <ul className="nav__list">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <NavLink
                to={`/lecciones/${lesson.id}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cx(
                    'lesson-link',
                    isActive && 'lesson-link--active',
                    isCompleted(lesson.id) && 'lesson-link--done',
                  )
                }
              >
                <span className="lesson-link__order">{String(lesson.order).padStart(2, '0')}</span>
                <span className="lesson-link__body">
                  <span className="lesson-link__title">{lesson.title}</span>
                  <span className="lesson-link__meta">
                    <BaseBadge variant={levelVariant[lesson.level]}>{lesson.level}</BaseBadge>
                    <small className="dim">{lesson.duration} min</small>
                  </span>
                </span>
                <span className="lesson-link__check" aria-hidden="true">
                  {isCompleted(lesson.id) ? '✓' : ''}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="nav" aria-label="Explorador de SWAPI">
        <p className="nav__title">Explorador SWAPI</p>
        <ul className="nav__list nav__list--compact">
          {RESOURCE_NAMES.map((name) => (
            <li key={name}>
              <NavLink
                to={`/${name}`}
                onClick={onNavigate}
                className={({ isActive }) => cx('resource-link', isActive && 'resource-link--active')}
              >
                <span aria-hidden="true">{RESOURCE_META[name].icon}</span>
                <span>{RESOURCE_META[name].plural}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
