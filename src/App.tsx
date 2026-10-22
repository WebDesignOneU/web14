// src/App.tsx
// Estructura de la aplicación: cabecera, barra lateral, contenido y pie.
// El contenido es el <Routes> con todas las rutas de la app.
import { Suspense, useEffect, useState } from 'react'
import type { ComponentType } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { AppFooter } from '@/components/layout/AppFooter'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { LoadingState } from '@/components/ui/LoadingState'
import { lessons } from '@/data/lessons'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import {
  FavoritesView,
  HomeView,
  Lesson01View,
  Lesson02View,
  Lesson03View,
  Lesson04View,
  Lesson05View,
  Lesson06View,
  Lesson07View,
  Lesson08View,
  Lesson09View,
  Lesson10View,
  NotFoundView,
  ResourceDetailView,
  ResourceListView,
} from '@/router/lazyViews'

// Cada lección se asocia a su vista aquí, a partir de los datos de
// src/data/lessons.ts. Añadir una lección sólo requiere tocar esos dos sitios.
const lessonViews: Record<string, ComponentType> = {
  '01-jsx-componentes': Lesson01View,
  '02-estado-useState': Lesson02View,
  '03-datos-asincronos': Lesson03View,
  '04-hooks-personalizados': Lesson04View,
  '05-router': Lesson05View,
  '06-estado-global': Lesson06View,
  '07-formularios': Lesson07View,
  '08-composicion': Lesson08View,
  '09-animacion-ux': Lesson09View,
  '10-rendimiento': Lesson10View,
}

export function App() {
  // El estado del menú móvil vive aquí (el ancestro común) y baja por props.
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  // Actualiza <title> en cada navegación.
  useDocumentTitle()

  // Al cambiar de ruta: cerramos el menú móvil y subimos al principio.
  useEffect(() => {
    setSidebarOpen(false)
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="app">
      <AppHeader open={sidebarOpen} onToggle={() => setSidebarOpen((current) => !current)} />

      <div className="app__body container">
        <AppSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

        <main className="app__main" id="main">
          {/* Las vistas llegan por lazy: Suspense muestra el respaldo mientras cargan. */}
          <Suspense fallback={<LoadingState label="Cargando vista…" />}>
            <Routes>
              <Route path="/" element={<HomeView />} />

              {lessons.map((lesson) => {
                const View = lessonViews[lesson.id]
                return (
                  <Route
                    key={lesson.id}
                    path={`/lecciones/${lesson.id}`}
                    element={View ? <View /> : <NotFoundView />}
                  />
                )
              })}

              <Route path="/favoritos" element={<FavoritesView />} />
              <Route path="/:resource" element={<ResourceListView />} />
              <Route path="/:resource/:id" element={<ResourceDetailView />} />

              {/* Cualquier otra ruta cae aquí. */}
              <Route path="*" element={<NotFoundView />} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <AppFooter />
    </div>
  )
}
