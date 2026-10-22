// src/views/lessons/Lesson05RouterView.tsx
// Lección 05 · React Router
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { RESOURCE_META, RESOURCE_NAMES } from '@/api/types'
import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { BaseButton } from '@/components/ui/BaseButton'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { getLesson } from '@/data/lessons'

const lesson = getLesson('05-router')!

export default function Lesson05RouterView() {
  const location = useLocation()
  const navigate = useNavigate()
  const [targetId, setTargetId] = useState('1')

  return (
    <LessonShell
      lesson={lesson}
      code={
        <CodeBlock
          title="Rutas, navegación y carga diferida"
          code={[
            '// 1) Rutas: cada path apunta a un elemento',
            '<Routes>',
            '  <Route path="/" element={<HomeView />} />',
            '  <Route path="/lecciones/:lessonId" element={<LessonView />} />',
            '  <Route path="/:resource/:id" element={<ResourceDetailView />} />',
            '  <Route path="*" element={<NotFoundView />} />',
            '</Routes>',
            '',
            '// 2) Navegar con enlaces (nunca <a href> en una SPA)',
            '<Link to="/people/1">Luke Skywalker</Link>',
            '',
            '// 3) Leer la URL',
            'const { id } = useParams()        // parámetros de ruta',
            'const location = useLocation()    // pathname, search, hash',
            '',
            '// 4) Navegar por código',
            'const navigate = useNavigate()',
            'navigate("/people/1")',
            'navigate(-1)                      // equivalente a "atrás"',
            '',
            '// 5) Carga diferida: una vista, un chunk',
            'const HomeView = lazy(() => import("@/views/HomeView"))',
            '<Suspense fallback={<LoadingState />}>…</Suspense>',
          ].join('\n')}
        />
      }
      challenges={
        <ChallengeList
          title="Ejercicios"
          items={[
            'Añade un enlace al detalle del planeta 1 usando `<Link>` desde esta lección.',
            'Lee el parámetro `lessonId` con `useParams()` y muéstralo en pantalla.',
            'Sincroniza el buscador del explorador con `?search=` usando `useSearchParams`.',
            'Comprueba en Network que cada vista se descarga como un archivo `.js` distinto.',
          ]}
        />
      }
    >
      <p className="muted">
        Esta misma lección es una ruta más: las 10 lecciones, el explorador y los favoritos se
        declaran en <code>src/App.tsx</code> con <code>&lt;Routes&gt;</code>. Abre DevTools →
        Network y navega: verás cómo cada vista llega en su propio trozo de código.
      </p>

      <div className="panel surface l05-panel">
        <span className="field-label">useLocation()</span>
        <pre className="l05-json">
          {JSON.stringify(
            { pathname: location.pathname, search: location.search, hash: location.hash },
            null,
            2,
          )}
        </pre>
      </div>

      <div className="panel surface l05-panel">
        <span className="field-label">useNavigate(): ir a /people/:id</span>
        <div className="row">
          <label className="visually-hidden" htmlFor="l05-id">
            Identificador
          </label>
          <input
            id="l05-id"
            className="input input--auto"
            inputMode="numeric"
            value={targetId}
            onChange={(event) => setTargetId(event.target.value.replace(/\D/g, '') || '1')}
          />
          <BaseButton
            size="sm"
            variant="primary"
            onClick={() => navigate(`/people/${targetId}`)}
          >
            Ir a /people/{targetId}
          </BaseButton>
          <BaseButton size="sm" onClick={() => navigate(-1)}>
            ← Atrás
          </BaseButton>
          <BaseButton size="sm" variant="subtle" onClick={() => navigate('/favoritos')}>
            Favoritos
          </BaseButton>
        </div>
      </div>

      <div className="panel surface l05-panel">
        <span className="field-label">&lt;Link&gt; a cada recurso del explorador</span>
        <div className="chips">
          {RESOURCE_NAMES.map((name) => (
            <Link key={name} className="chip" to={`/${name}`}>
              <span aria-hidden="true">{RESOURCE_META[name].icon}</span>
              {RESOURCE_META[name].plural}
            </Link>
          ))}
        </div>
      </div>
    </LessonShell>
  )
}
