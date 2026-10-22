// src/views/FavoritesView.tsx
// Lista de favoritos guardados en el store de Zustand (lección 06).
import { FavoriteLink } from '@/components/swapi/FavoriteLink'
import { BaseButton } from '@/components/ui/BaseButton'
import { EmptyState } from '@/components/ui/EmptyState'
import { selectCount, selectItems, useFavoritesStore } from '@/store/favorites'

export default function FavoritesView() {
  const items = useFavoritesStore(selectItems)
  const count = useFavoritesStore(selectCount)
  const clear = useFavoritesStore((state) => state.clear)

  return (
    <div className="stack">
      <header className="page-head">
        <div>
          <h1>⭐ Favoritos</h1>
          <p className="muted">
            {count === 0
              ? 'Todavía no has guardado ningún recurso.'
              : `${count} recurso(s) guardado(s). Se conservan al recargar porque el store está persistido.`}
          </p>
        </div>
        <BaseButton variant="danger" disabled={count === 0} onClick={clear}>
          Vaciar lista
        </BaseButton>
      </header>

      {count === 0 ? (
        <EmptyState
          icon="⭐"
          title="Sin favoritos"
          message="Pulsa la estrella de cualquier tarjeta del explorador para guardarla aquí."
        />
      ) : (
        <div className="fav-list">
          {items.map((url) => (
            <FavoriteLink key={url} url={url} />
          ))}
        </div>
      )}
    </div>
  )
}
