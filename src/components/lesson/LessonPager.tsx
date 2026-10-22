// src/components/lesson/LessonPager.tsx
// Navegación "lección anterior / siguiente" usando los metadatos de la ruta.
import { Link } from 'react-router-dom'

import { getAdjacentLessons } from '@/data/lessons'

export interface LessonPagerProps {
  lessonId: string
}

export function LessonPager({ lessonId }: LessonPagerProps) {
  const { previous, next } = getAdjacentLessons(lessonId)

  return (
    <nav className="pager" aria-label="Navegación entre lecciones">
      {previous ? (
        <Link className="pager__link" to={`/lecciones/${previous.id}`}>
          <small className="dim">← Lección anterior</small>
          <strong>{previous.title}</strong>
        </Link>
      ) : (
        <span className="pager__spacer" />
      )}

      {next && (
        <Link className="pager__link pager__link--next" to={`/lecciones/${next.id}`}>
          <small className="dim">Siguiente lección →</small>
          <strong>{next.title}</strong>
        </Link>
      )}
    </nav>
  )
}
