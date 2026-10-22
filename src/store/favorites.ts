// src/store/favorites.ts
// Store global con Zustand (el equivalente a Pinia en Vue): estado + acciones
// en un mismo sitio, fuera del árbol de componentes, y persistido en
// localStorage con el middleware `persist` (lección 06).
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FavoritesState {
  items: string[]
  toggle: (url: string) => void
  remove: (url: string) => void
  clear: () => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (url) =>
        set((state) => ({
          items: state.items.includes(url)
            ? state.items.filter((item) => item !== url)
            : [...state.items, url],
        })),
      remove: (url) => set((state) => ({ items: state.items.filter((item) => item !== url) })),
      clear: () => set({ items: [] }),
    }),
    { name: 'web14-favorites' },
  ),
)

// --- Selectores ------------------------------------------------------------
// Un componente que llama a useFavoritesStore(selector) sólo se vuelve a
// renderizar si el valor devuelto por el selector cambia.
export const selectItems = (state: FavoritesState): string[] => state.items
export const selectCount = (state: FavoritesState): number => state.items.length
export const selectIsFavorite =
  (url: string) =>
  (state: FavoritesState): boolean =>
    state.items.includes(url)
