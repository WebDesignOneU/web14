// src/views/HomeView.tsx
// Portada: presentación de la ruta de aprendizaje y accesos al resto de la app.
import { Link } from 'react-router-dom'

import { RESOURCE_META, RESOURCE_NAMES } from '@/api/types'
import type { BadgeVariant } from '@/components/ui/BaseBadge'
import type { LessonLevel } from '@/data/lessons'
import { lessons, totalDuration } from '@/data/lessons'
import { useProgress } from '@/hooks/useProgress'
import { cx } from '@/utils/cx'

const levelVariant: Record<LessonLevel, BadgeVariant> = {
  Inicial: 'success',
  Intermedio: 'primary',
  Avanzado: 'accent',
}

export default function HomeView() {
  const { isCompleted, percent, done, total } = useProgress()

  return (
    <div className="home stack">
      <section className="hero surface">
        <p className="hero__eyebrow">Showcase didáctico</p>
        <h1 className="hero__title">
          Ruta de aprendizaje de <span className="hero__mark">React</span> + TypeScript
        </h1>
        <p className="hero__lead muted">
          Diez lecciones progresivas para ir de los primeros componentes al rendimiento, con
          ejemplos reales contra la API de <strong>SWAPI</strong> (Star Wars). Cada lección incluye
          una demo interactiva, el código clave y retos para practicar.
        </p>

        <div className="hero__actions">
          <Link className="btn btn--primary btn--md" to={`/lecciones/${lessons[0].id}`}>
            Empezar por la lección 01
          </Link>
          <Link className="btn btn--ghost btn--md" to="/people">
            Explorar SWAPI →
          </Link>
        </div>

        <div className="hero__stats">
          <div className="stat">
            <strong>{total}</strong>
            <span className="dim">lecciones</span>
          </div>
          <div className="stat">
            <strong>~{Math.round(totalDuration / 60)} h</strong>
            <span className="dim">de contenido</span>
          </div>
          <div className="stat">
            <strong>{percent}%</strong>
            <span className="dim">
              completado ({done}/{total})
            </span>
          </div>
        </div>
      </section>

      <section className="section" id="lecciones">
        <div className="section__head">
          <h2>La ruta, paso a paso</h2>
          <p className="muted">
            Recomendado en orden: cada lección reutiliza lo aprendido en las anteriores.
          </p>
        </div>

        <ol className="lesson-grid">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="lesson-card-item">
              <Link
                to={`/lecciones/${lesson.id}`}
                className={cx('lesson-card', isCompleted(lesson.id) && 'lesson-card--done')}
              >
                <div className="lesson-card__top">
                  <span className="lesson-card__order">{String(lesson.order).padStart(2, '0')}</span>
                  <span className={`badge badge--${levelVariant[lesson.level]}`}>{lesson.level}</span>
                  <span className="lesson-card__state" aria-hidden="true">
                    {isCompleted(lesson.id) ? '✓' : ''}
                  </span>
                </div>
                <h3 className="lesson-card__title">{lesson.title}</h3>
                <p className="lesson-card__subtitle">{lesson.subtitle}</p>
                <p className="lesson-card__summary dim">{lesson.summary}</p>
                <ul className="lesson-card__concepts">
                  {lesson.concepts.slice(0, 4).map((concept) => (
                    <li key={concept}>{concept}</li>
                  ))}
                </ul>
                <span className="lesson-card__cta">~{lesson.duration} min →</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="section__head">
          <h2>Explorador SWAPI</h2>
          <p className="muted">
            Los mismos datos con los que trabajan las lecciones. Pruébalo cuando quieras.
          </p>
        </div>
        <div className="resource-grid">
          {RESOURCE_NAMES.map((name) => (
            <Link key={name} className="resource-tile" to={`/${name}`}>
              <span aria-hidden="true">{RESOURCE_META[name].icon}</span>
              <strong>{RESOURCE_META[name].plural}</strong>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
