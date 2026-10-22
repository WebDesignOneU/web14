# Ruta de aprendizaje de React + TypeScript (SWAPI)

Showcase didáctico en **React 19 + Vite + TypeScript** que propone una **ruta de aprendizaje
progresiva en 10 lecciones** (~5 h 30 min). Cada lección combina tres cosas:

1. una **demo interactiva** que funciona de verdad,
2. el **código clave** que merece la pena leer,
3. una lista de **retos** para practicar lo aprendido.

Todos los ejemplos trabajan con datos reales de **[SWAPI](https://swapi.dev/)** (Star Wars API):
personajes, planetas, películas, naves y especies. La misma API alimenta un pequeño explorador con
paginación, búsqueda y favoritos que se usa como caso práctico transversal.

---

## Índice

- [Cómo ejecutarlo](#cómo-ejecutarlo)
- [Cómo recorrer la ruta](#cómo-recorrer-la-ruta)
- [Las 10 lecciones](#las-10-lecciones)
- [Mapa de rutas](#mapa-de-rutas)
- [El explorador SWAPI](#el-explorador-swapi)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Dónde se practica cada concepto](#dónde-se-practica-cada-concepto)
- [Estilos y tema](#estilos-y-tema)
- [Configuración](#configuración)
- [Verificación](#verificación)
- [Siguientes pasos](#ideas-para-seguir)

---

## Cómo iniciar un proyecto React + Vite + TypeScript

```bash
npm create vite@latest nombre-proyecto -- --template react-ts # crear proyecto
npm install  # instalar dependencias
npm run dev  # ejecutar proyecto
```

---

## Cómo ejecutarlo

**Requisitos:** Node.js ≥ 20.19 (probado con `v20.19.4`) y npm.

```bash
cd web14
npm install
npm run dev          # servidor de desarrollo en http://localhost:5174
```

Otros comandos disponibles:

| Script              | Qué hace                                                 |
| ------------------- | -------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo de Vite con HMR en el puerto 5174 |
| `npm run build`     | `tsc --noEmit` + `vite build` → genera `dist/`           |
| `npm run preview`   | Sirve el contenido de `dist/` localmente                 |
| `npm run typecheck` | Sólo comprobación de tipos con `tsc --noEmit`            |

> No hace falta clonar ni configurar nada más: la app funciona con la API pública por defecto. Si
> quieres apuntar a otro mirror, copia `.env.example` a `.env` y cambia `VITE_SWAPI_BASE_URL`.

---

## Cómo recorrer la ruta

La aplicación en sí es el material del curso. La forma recomendada de recorrerla es **en orden**,
porque cada lección reutiliza lo anterior:

- La **portada** (`/`) resume la ruta y muestra tu porcentaje de avance.
- La **barra lateral** lista las 10 lecciones y marca con ✓ las completadas.
- Al final de cada lección hay un botón **«Marcar como completada»**; el progreso se guarda en
  `localStorage` (clave `web14-completed-lessons`), así que puedes cerrar y volver.
- La lección 06 (`useSyncExternalStore`) y la 10 (`memo`) explican por dentro los mecanismos que
  usan el resto de la app.

Detalles pensados para el aprendizaje:

| Pieza                                            | Qué demuestra                                                                 |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| Botón **tema claro/oscuro** en la cabecera       | `Context API` + persistencia en `localStorage` (lección 08)                   |
| Estrella **☆ Favorito** en tarjetas y detalles   | Estado global con `Zustand` + middleware `persist` (lección 06)               |
| **Explorador SWAPI** con paginación y buscador   | `fetch`, `useEffect`, hooks personalizados y debounce (lecciones 03, 04 y 07) |
| **Rutas con carga diferida**                     | `React.lazy` + `Suspense` (lecciones 05 y 09)                                 |
| Vistas de **404** y de **recurso no encontrado** | Rutas comodín y validación de parámetros (lección 05)                         |

---

## Las 10 lecciones

|  #  | Ruta                                 | Título                             | Qué se practica                                                                                               |   Nivel    | Min |
| :-: | ------------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- | :--------: | :-: |
| 01  | `/lecciones/01-jsx-componentes`      | **JSX y componentes**              | JSX, props, condicionales, listas y `key`, `children`                                                         |  Inicial   | 25  |
| 02  | `/lecciones/02-estado-useState`      | **Estado con useState**            | `useState`, eventos, actualización funcional, inmutabilidad, estado derivado                                  |  Inicial   | 30  |
| 03  | `/lecciones/03-datos-asincronos`     | **Datos asíncronos con useEffect** | `useEffect`, `fetch`, `AbortController`, limpieza, `StrictMode`, los tres estados                             | Intermedio | 35  |
| 04  | `/lecciones/04-hooks-personalizados` | **Hooks personalizados**           | Hooks propios, genéricos, reglas de los hooks, paginación                                                     | Intermedio | 35  |
| 05  | `/lecciones/05-router`               | **React Router**                   | `Routes`/`Route`, `Link`/`NavLink`, `useParams`, `useNavigate`, rutas dinámicas                               | Intermedio | 40  |
| 06  | `/lecciones/06-estado-global`        | **Estado global con Zustand**      | Zustand, selectores, `persist`, `useSyncExternalStore`                                                        | Intermedio | 35  |
| 07  | `/lecciones/07-formularios`          | **Formularios y búsqueda**         | Inputs controlados, validación, `useMemo`, `debounce`, búsqueda en servidor                                   | Intermedio | 35  |
| 08  | `/lecciones/08-composicion`          | **Composición y Context**          | `children`, props como _slots_, _render props_, `createContext`/`useContext`, _prop drilling_                 |  Avanzado  | 30  |
| 09  | `/lecciones/09-animacion-ux`         | **Animaciones y UX de carga**      | Transiciones CSS, animar el desmontaje con `onTransitionEnd`, skeletons, `Suspense`, `prefers-reduced-motion` |  Avanzado  | 35  |
| 10  | `/lecciones/10-rendimiento`          | **Rendimiento y buenas prácticas** | `React.memo`, `useMemo`, `useCallback`, _code splitting_ y lista de comprobación                              |  Avanzado  | 30  |

**Total: 330 min (~5,5 h).** El código de cada lección vive en
`src/views/lessons/LessonNN…View.tsx`; sus metadatos (título, nivel, conceptos, duración) están en
`src/data/lessons.ts`.

---

## Mapa de rutas

| Ruta             | Vista                | Descripción                                                               |
| ---------------- | -------------------- | ------------------------------------------------------------------------- |
| `/`              | `HomeView`           | Portada con la ruta completa y tu progreso                                |
| `/lecciones/:id` | `Lesson01…10`        | Las 10 lecciones (carga diferida)                                         |
| `/favoritos`     | `FavoritesView`      | Favoritos guardados con Zustand                                           |
| `/:resource`     | `ResourceListView`   | Listado paginado de `people`, `planets`, `films`, `starships` o `species` |
| `/:resource/:id` | `ResourceDetailView` | Ficha de un recurso concreto                                              |
| `*`              | `NotFoundView`       | Cualquier ruta desconocida                                                |

Las rutas de lección se generan a partir del array `lessons` y del mapa `lessonViews` en
`src/App.tsx`: para añadir una lección basta con dar de alta sus metadatos y su vista.

---

## El explorador SWAPI

El explorador (`/people`, `/planets`, `/films`, `/starships`, `/species`) es el caso práctico que
recorre toda la ruta:

- **Paginación** de servidor usando `next`/`previous` que devuelve SWAPI.
- **Búsqueda** con `?search=` y `useDebouncedValue(…, 400)` para no disparar una petición por tecla.
- **Tres estados de UI**: cargando (`LoadingState`), error (`ErrorState`, con reintento) y vacío
  (`EmptyState`).
- **Favoritos** en tarjetas y fichas, compartidos con la página `/favoritos`.
- **Navegación entre recursos relacionados**: desde un personaje puedes saltar a su planeta, sus
  películas, naves y especies, porque las URLs de SWAPI se resuelven con `getResourceByUrl`.

Detalles de robustez del cliente HTTP (`src/api/http.ts`):

- Base configurable con `VITE_SWAPI_BASE_URL` (por defecto `https://swapi.dev/api`).
- **Mirrors de respaldo** automáticos (`swapi.py4e.com/api` y `swapi.info/api`) si el original
  falla.
- Los **404** y las peticiones **abortadas** no se reintentan contra otro mirror.

---

## Estructura del proyecto

```
web14/
├─ index.html                 # Script anti-parpadeo del tema + #root
├─ vite.config.ts             # Alias @ → src, servidor en 5174
├─ tsconfig.json              # ES2022, strict, jsx react-jsx, paths @/*
└─ src/
   ├─ main.tsx                # Monta <App> con StrictMode + ThemeProvider
   ├─ App.tsx                 # Cabecera, barra lateral, <Routes>, pie
   ├─ api/
   │  ├─ http.ts              # fetch + mirrors + ApiError
   │  ├─ swapi.ts             # listResource / getResource / getResourceByUrl
   │  └─ types.ts             # Tipos de SWAPI y utilidades (isResourceName, idFromUrl…)
   ├─ components/
   │  ├─ ui/                  # BaseButton, BaseBadge, BaseCard, CodeBlock, estados, paginación
   │  ├─ layout/              # AppHeader, AppSidebar, AppFooter
   │  ├─ swapi/               # ResourceCard, ResourceField, FavoriteButton, FavoriteLink
   │  ├─ lesson/              # LessonShell, LessonPager, ChallengeList
   │  └─ demo/                # LikeButton, RatingStars, DataList, Collapse
   ├─ context/ThemeContext.tsx # Tema claro/oscuro con Context API
   ├─ data/lessons.ts          # Fuente única de verdad de la ruta de aprendizaje
   ├─ hooks/                   # useAsyncData, useSwapi, useDebouncedValue, useProgress…
   ├─ router/lazyViews.ts      # Vistas con React.lazy (code splitting)
   ├─ store/                   # favorites.ts (Zustand) y progress.ts (módulo + useSyncExternalStore)
   ├─ styles/                  # global.css, components.css, views.css, lessons.css
   ├─ utils/cx.ts              # Utilidad para combinar clases
   └─ views/                   # Portada, listado, detalle, favoritos, 404 y las 10 lecciones
```

---

## Dónde se ve cada concepto

| Concepto                           | Archivo de referencia                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| Tipado de props y eventos          | `src/components/ui/*`, `src/views/**`                                           |
| Estado local y derivado            | `src/views/lessons/Lesson02EstadoView.tsx`                                      |
| `useEffect` + `AbortController`    | `src/views/lessons/Lesson03DatosView.tsx`                                       |
| Hook genérico reutilizable         | `src/hooks/useAsyncData.ts`                                                     |
| Hooks de dominio (SWAPI)           | `src/hooks/useSwapi.ts`                                                         |
| Rutas dinámicas y `useParams`      | `src/views/ResourceDetailView.tsx`                                              |
| Carga diferida por ruta            | `src/router/lazyViews.ts`, `src/App.tsx`                                        |
| Estado global con Zustand          | `src/store/favorites.ts`                                                        |
| Estado global sin librerías        | `src/store/progress.ts`, `src/hooks/useProgress.ts`                             |
| Formularios controlados y filtrado | `src/views/lessons/Lesson07FormulariosView.tsx`                                 |
| Composición, _slots_ y Context     | `src/views/lessons/Lesson08CompositionView.tsx`, `src/context/ThemeContext.tsx` |
| Animaciones y desmontaje           | `src/components/demo/Collapse.tsx`                                              |
| Optimización de renders            | `src/views/lessons/Lesson10RendimientoView.tsx`                                 |

---

## Estilos y tema

- **Cuatro hojas globales** importadas desde `src/main.tsx`: `global.css` (tokens y base),
  `components.css` (bloques reutilizables), `views.css` (portada, listado, detalle, favoritos) y
  `lessons.css` (paneles específicos de cada lección).
- **Clases tipo BEM** (`.lesson-card__title`, `.btn--primary`) y utilidades como `.row`,
  `.stack`, `.muted`, `.dim`, `.surface` y `.panel`.
- **Tema claro/oscuro** mediante variables CSS en `:root` y `[data-theme="light"]`, gestionado por
  `ThemeContext` y recordado en `localStorage`.
- Un **script inline en `index.html`** aplica el tema guardado antes de montar React para evitar el
  destello inicial.
- Se respeta **`prefers-reduced-motion`** para desactivar animaciones.

Si añades una lección nueva, reutiliza las clases existentes (`.panel`, `.surface`, `.row`,
`.field-label`, `.chip`, `.badge`) y, sólo si hace falta, añade estilos `.lNN-*` en `lessons.css`.

---

## Configuración

| Variable              | Por defecto             | Descripción                                                                |
| --------------------- | ----------------------- | -------------------------------------------------------------------------- |
| `VITE_SWAPI_BASE_URL` | `https://swapi.dev/api` | Base de la API; en Vite las variables de cliente deben empezar por `VITE_` |

Claves usadas en `localStorage`:

| Clave                     | Contenido                                        |
| ------------------------- | ------------------------------------------------ |
| `web14-theme`             | `dark` \| `light`                                |
| `web14-favorites`         | URLs de recursos favoritos (Zustand + `persist`) |
| `web14-completed-lessons` | Ids de lecciones completadas                     |

---

## Verificación

Este proyecto se ha comprobado con:

```bash
npm run typecheck   # tsc --noEmit → sin errores
npm run build       # tsc --noEmit && vite build → dist/ generado
```

Además se ejecutaron pruebas de humo (fuera del repositorio) con estos resultados:

- **Lógica pura** (metadatos de la ruta, utilidades de SWAPI, `cx` y ambos stores): 42 comprobaciones
  correctas.
- **Render real con DOM (jsdom)**: 20/20 rutas montan y pintan su contenido
  (portada, 5 listados, 2 detalles, favoritos, las 10 lecciones, 404 y recurso inexistente), sin
  avisos inesperados de React.
- **Servido del build** (`vite preview`): 26/26 comprobaciones HTTP (todas las rutas devuelven el
  HTML del SPA, con su bundle y su CSS).

---

## Ideas para seguir

- Añadir un recurso más del catálogo: sólo hay que tocar `RESOURCE_META`, los tipos y el mapa de
  rutas.
- Sustituir `Zustand` por `Context + useReducer` en el store de favoritos y comparar.
- Incorporar tests con Vitest + Testing Library reutilizando los mismos casos de humo.
- Añadir paginación por URL (`?page=3`) para que el estado del explorador sea compartible.

---

## Créditos

- Datos: [SWAPI](https://swapi.dev/) — _Star Wars API_.
- Hecho como material de estudio; Star Wars y sus personajes pertenecen a Lucasfilm/Disney.
