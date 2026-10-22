// src/components/swapi/ResourceCard.tsx
// Tarjeta de un recurso de SWAPI. Recibe el item genérico y lo resume.
import { Link } from 'react-router-dom'

import {
  RESOURCE_META,
  idFromUrl,
  titleOf,
  type Person,
  type Planet,
  type ResourceName,
  type Species,
  type Starship,
  type SwapiResources,
} from '@/api/types'
import { FavoriteButton } from './FavoriteButton'

export interface ResourceCardProps {
  resource: ResourceName
  item: SwapiResources[ResourceName]
  url: string
}

interface Detail {
  label: string
  value: string
}

// Los props `resource` e `item` llegan por separado, así que estrechamos el
// item según el recurso para leer sus campos con seguridad de tipos.
function detailsFor(resource: ResourceName, item: SwapiResources[ResourceName]): Detail[] {
  switch (resource) {
    case 'people': {
      const person = item as Person
      return [
        { label: 'Nacimiento', value: person.birth_year },
        { label: 'Altura', value: person.height },
        { label: 'Género', value: person.gender },
      ]
    }
    case 'planets': {
      const planet = item as Planet
      return [
        { label: 'Clima', value: planet.climate },
        { label: 'Terreno', value: planet.terrain },
        { label: 'Población', value: planet.population },
      ]
    }
    case 'films': {
      const film = item as SwapiResources['films']
      return [
        { label: 'Episodio', value: String(film.episode_id) },
        { label: 'Director', value: film.director },
        { label: 'Estreno', value: film.release_date },
      ]
    }
    case 'starships': {
      const ship = item as Starship
      return [
        { label: 'Modelo', value: ship.model },
        { label: 'Clase', value: ship.starship_class },
        { label: 'Fabricante', value: ship.manufacturer },
      ]
    }
    case 'species': {
      const species = item as Species
      return [
        { label: 'Clasificación', value: species.classification },
        { label: 'Idioma', value: species.language },
        { label: 'Esperanza de vida', value: species.average_lifespan },
      ]
    }
  }
}

export function ResourceCard({ resource, item, url }: ResourceCardProps) {
  const meta = RESOURCE_META[resource]
  const title = titleOf(item)
  const details = detailsFor(resource, item)

  return (
    <article className="rcard">
      <div className="rcard__head">
        <Link className="rcard__main" to={`/${resource}/${idFromUrl(url)}`}>
          <span className="rcard__icon" aria-hidden="true">
            {meta.icon}
          </span>
          <span className="rcard__title">{title}</span>
        </Link>
        <FavoriteButton url={url} name={title} />
      </div>

      <dl className="rcard__details">
        {details.map((detail) => (
          <div key={detail.label} className="rcard__row">
            <dt>{detail.label}</dt>
            <dd>{detail.value || '—'}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}
