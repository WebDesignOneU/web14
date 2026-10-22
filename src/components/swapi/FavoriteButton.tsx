// src/components/swapi/FavoriteButton.tsx
// Botón de favorito conectado al store de Zustand (lección 06).
import { selectIsFavorite, useFavoritesStore } from '@/store/favorites'
import { cx } from '@/utils/cx'

export interface FavoriteButtonProps {
  url: string
  name?: string
  className?: string
}

export function FavoriteButton({ url, name, className }: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore(selectIsFavorite(url))
  const toggle = useFavoritesStore((state) => state.toggle)

  const title = isFavorite ? `Quitar ${name ?? 'de favoritos'}` : `Añadir ${name ?? 'a favoritos'}`

  return (
    <button
      type="button"
      className={cx('fav', isFavorite && 'fav--on', className)}
      aria-pressed={isFavorite}
      title={title}
      onClick={(event) => {
        // Si el botón vive dentro de un enlace, evitamos navegar.
        event.preventDefault()
        event.stopPropagation()
        toggle(url)
      }}
    >
      <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
      <span className="visually-hidden">Alternar favorito</span>
    </button>
  )
}
