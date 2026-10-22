// src/data/lessons.ts
// Metadatos de la ruta de aprendizaje. El componente de cada lección se
// asocia en src/router/lazyViews.ts y se registra en src/App.tsx.

export type LessonLevel = 'Inicial' | 'Intermedio' | 'Avanzado'

export interface Lesson {
  /** Identificador estable (también se usa como último segmento de la URL). */
  id: string
  /** Posición dentro de la ruta de aprendizaje (1..N). */
  order: number
  title: string
  subtitle: string
  summary: string
  /** Conceptos de React/TS que se practican en la lección. */
  concepts: string[]
  level: LessonLevel
  /** Duración estimada en minutos. */
  duration: number
}

export const lessons: Lesson[] = [
  {
    id: '01-jsx-componentes',
    order: 1,
    title: 'JSX y componentes',
    subtitle: 'Pintar UI con JavaScript, props y listas',
    summary:
      'El punto de partida: funciones que devuelven JSX. Veremos expresiones dentro de las llaves, atributos y className, renderizado condicional, listas con keys, composición con children y cómo descomponer la interfaz en componentes que reciben props.',
    concepts: ['JSX', 'componentes funcionales', 'props', 'renderizado condicional', 'listas y keys', 'children'],
    level: 'Inicial',
    duration: 25,
  },
  {
    id: '02-estado-useState',
    order: 2,
    title: 'Estado con useState',
    subtitle: 'Interacción, eventos y estado local',
    summary:
      'Los componentes cobran vida con useState: estado numérico, de texto, booleano, arrays y objetos. Aprenderás la actualización funcional, el principio de inmutabilidad y a calcular valores derivados en lugar de guardarlos.',
    concepts: ['useState', 'eventos', 'actualización funcional', 'inmutabilidad', 'estado derivado'],
    level: 'Inicial',
    duration: 30,
  },
  {
    id: '03-datos-asincronos',
    order: 3,
    title: 'Datos asíncronos con useEffect',
    subtitle: 'fetch, limpieza y efectos',
    summary:
      'Cargamos datos de SWAPI con useEffect: AbortController para cancelar peticiones, funciones de limpieza, los tres estados (cargando, error, datos) y por qué StrictMode ejecuta los efectos dos veces en desarrollo.',
    concepts: ['useEffect', 'fetch', 'AbortController', 'función de limpieza', 'StrictMode', 'tres estados'],
    level: 'Intermedio',
    duration: 35,
  },
  {
    id: '04-hooks-personalizados',
    order: 4,
    title: 'Hooks personalizados',
    subtitle: 'Extraer lógica reutilizable',
    summary:
      'Extraemos la carga asíncrona a un hook propio (useAsyncData) y construimos useSwapiList con paginación encima. Repasamos las reglas de los hooks y cómo combinar varios hooks en uno.',
    concepts: ['custom hooks', 'useAsyncData', 'reglas de los hooks', 'genéricos', 'paginación'],
    level: 'Intermedio',
    duration: 35,
  },
  {
    id: '05-router',
    order: 5,
    title: 'React Router',
    subtitle: 'Navegación, rutas dinámicas y lazy loading',
    summary:
      'Navegamos entre vistas con Link y NavLink, leemos la URL con useParams y useLocation, navegamos por código con useNavigate, definimos rutas dinámicas y cargamos cada vista con React.lazy + Suspense.',
    concepts: ['Routes / Route', 'Link y NavLink', 'useParams', 'useNavigate', 'React.lazy', 'Suspense'],
    level: 'Intermedio',
    duration: 40,
  },
  {
    id: '06-estado-global',
    order: 6,
    title: 'Estado global con Zustand',
    subtitle: 'Compartir estado y persistirlo',
    summary:
      'Los favoritos de la galaxia deben sobrevivir a la navegación. Creamos un store de Zustand con acciones y el middleware persist, y comparamos tres formas de compartir estado: props, store externo y estado de módulo con useSyncExternalStore.',
    concepts: ['Zustand', 'selectores', 'middleware persist', 'useSyncExternalStore', 'estado compartido'],
    level: 'Intermedio',
    duration: 35,
  },
  {
    id: '07-formularios',
    order: 7,
    title: 'Formularios y búsqueda',
    subtitle: 'Inputs controlados, filtrado y debounce',
    summary:
      'Entrada de texto con inputs controlados (value + onChange), select y checkbox, filtrado con useMemo y una búsqueda contra la API con retardo (debounce) usando un hook propio para no saturar el servidor.',
    concepts: ['inputs controlados', 'useMemo', 'debounce', 'búsqueda en servidor', 'filtrado'],
    level: 'Intermedio',
    duration: 35,
  },
  {
    id: '08-composicion',
    order: 8,
    title: 'Composición y Context',
    subtitle: 'children, render props y Context API',
    summary:
      'Componemos componentes con children, "slots" con nombre a través de props, render props para ceder el renderizado al consumidor y Context API para compartir dependencias (como el tema) sin prop drilling.',
    concepts: ['children', 'props como slots', 'render props', 'createContext', 'useContext', 'prop drilling'],
    level: 'Avanzado',
    duration: 30,
  },
  {
    id: '09-animacion-ux',
    order: 9,
    title: 'Animaciones y UX de carga',
    subtitle: 'Transiciones CSS, animar el desmontaje y skeletons',
    summary:
      'Animamos con transiciones CSS, aprendemos a animar la salida de un componente (que React no hace por sí solo), mostramos skeletons mientras llegan los datos y respetamos prefers-reduced-motion.',
    concepts: ['transiciones CSS', 'onTransitionEnd', 'animar desmontaje', 'skeletons', 'Suspense', 'prefers-reduced-motion'],
    level: 'Avanzado',
    duration: 35,
  },
  {
    id: '10-rendimiento',
    order: 10,
    title: 'Rendimiento y buenas prácticas',
    subtitle: 'memo, useMemo, useCallback y code splitting',
    summary:
      'Cierres: cómo evitar renders innecesarios con React.memo, useMemo y useCallback, cuándo NO optimizar, code splitting con React.lazy y una checklist para tus proyectos.',
    concepts: ['React.memo', 'useMemo', 'useCallback', 'code splitting', 'checklist'],
    level: 'Avanzado',
    duration: 30,
  },
]

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id)
}

export function getAdjacentLessons(id: string): { previous?: Lesson; next?: Lesson } {
  const index = lessons.findIndex((lesson) => lesson.id === id)
  if (index === -1) return {}
  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index < lessons.length - 1 ? lessons[index + 1] : undefined,
  }
}

export const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0)
