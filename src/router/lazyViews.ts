// src/router/lazyViews.ts
// React.lazy exige una exportación por defecto y divide el código: cada vista
// acaba en su propio archivo .js en el build. Así la página inicial sólo
// descarga lo que necesita (lecciones 05 y 10).
import { lazy } from 'react'

export const HomeView = lazy(() => import('@/views/HomeView'))
export const FavoritesView = lazy(() => import('@/views/FavoritesView'))
export const ResourceListView = lazy(() => import('@/views/ResourceListView'))
export const ResourceDetailView = lazy(() => import('@/views/ResourceDetailView'))
export const NotFoundView = lazy(() => import('@/views/NotFoundView'))

export const Lesson01View = lazy(() => import('@/views/lessons/Lesson01JsxView'))
export const Lesson02View = lazy(() => import('@/views/lessons/Lesson02EstadoView'))
export const Lesson03View = lazy(() => import('@/views/lessons/Lesson03DatosView'))
export const Lesson04View = lazy(() => import('@/views/lessons/Lesson04HooksView'))
export const Lesson05View = lazy(() => import('@/views/lessons/Lesson05RouterView'))
export const Lesson06View = lazy(() => import('@/views/lessons/Lesson06EstadoGlobalView'))
export const Lesson07View = lazy(() => import('@/views/lessons/Lesson07FormulariosView'))
export const Lesson08View = lazy(() => import('@/views/lessons/Lesson08CompositionView'))
export const Lesson09View = lazy(() => import('@/views/lessons/Lesson09AnimacionView'))
export const Lesson10View = lazy(() => import('@/views/lessons/Lesson10RendimientoView'))
