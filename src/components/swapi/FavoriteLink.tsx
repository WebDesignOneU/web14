// src/components/swapi/FavoriteLink.tsx
// Un favorito guardado como URL. El componente resuelve el nombre por su
// cuenta: demuestra que cada componente puede cargar sus propios datos.
import { Link } from 'react-router-dom'

import { getResourceByUrl } from '@/api/swapi'
import { RESOURCE_META, idFromUrl, resourceFromUrl } from '@/api/types'
import { BaseButton } from '@/components/ui/BaseButton'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useFavoritesStore } from '@/store/favorites'

interface NamedResource {
  name?: string
  title?: string
}

export interface FavoriteLinkProps {
  url: string
}

export function FavoriteLink({ url }: FavoriteLinkProps) {
  const remove = useFavoritesStore((state) => state.remove)

  const { data, loading, error } = useAsyncData<NamedResource>((signal) =>
    getResourceByUrl<NamedResource>(url, { signal }),
  )

  const resource = resourceFromUrl(url)
  const id = idFromUrl(url)
  const icon = resource ? RESOURCE_META[resource].icon : '🔗'
  const label = data?.title ?? data?.name ?? `#${id}`

  return (
    <div className="fav-row">
      <span className="fav-row__icon" aria-hidden="true">
        {icon}
      </span>

      <div className="fav-row__body">
        {resource ? (
          <Link className="fav-row__link" to={`/${resource}/${id}`}>
            {label}
          </Link>
        ) : (
          <span className="fav-row__link">{label}</span>
        )}
        <small className="dim">{url}</small>
      </div>

      {loading && <span className="fav-row__state dim">cargando…</span>}
      {!loading && error && <span className="fav-row__state dim">sin conexión</span>}

      <BaseButton size="sm" variant="danger" onClick={() => remove(url)}>
        Quitar
      </BaseButton>
    </div>
  )
}
