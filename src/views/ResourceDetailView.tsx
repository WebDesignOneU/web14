// src/views/ResourceDetailView.tsx
// Ficha de un recurso concreto de SWAPI, cargada con useSwapiDetail.
import { Link, useParams } from 'react-router-dom'

import {
  RESOURCE_META,
  idFromUrl,
  isResourceName,
  resourceFromUrl,
  titleOf,
  type Film,
  type Person,
  type Planet,
  type ResourceName,
  type Species,
  type Starship,
  type SwapiResources,
} from '@/api/types'
import { FavoriteButton } from '@/components/swapi/FavoriteButton'
import { ResourceField } from '@/components/swapi/ResourceField'
import { EmptyState } from '@/components/ui/EmptyState'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { useSwapiDetail } from '@/hooks/useSwapi'
import NotFoundView from './NotFoundView'

export default function ResourceDetailView() {
  const { resource, id } = useParams<{ resource: string; id: string }>()

  if (!isResourceName(resource) || !id) return <NotFoundView />

  return <ResourceDetail resource={resource} id={id} />
}

interface Field {
  label: string
  value: string | number | null
}

function fieldsFor(resource: ResourceName, item: SwapiResources[ResourceName]): Field[] {
  switch (resource) {
    case 'people': {
      const person = item as Person
      return [
        { label: 'Año de nacimiento', value: person.birth_year },
        { label: 'Altura (cm)', value: person.height },
        { label: 'Masa (kg)', value: person.mass },
        { label: 'Color de pelo', value: person.hair_color },
        { label: 'Color de piel', value: person.skin_color },
        { label: 'Color de ojos', value: person.eye_color },
        { label: 'Género', value: person.gender },
      ]
    }
    case 'planets': {
      const planet = item as Planet
      return [
        { label: 'Periodo de rotación', value: planet.rotation_period },
        { label: 'Periodo orbital', value: planet.orbital_period },
        { label: 'Diámetro', value: planet.diameter },
        { label: 'Clima', value: planet.climate },
        { label: 'Gravedad', value: planet.gravity },
        { label: 'Terreno', value: planet.terrain },
        { label: 'Agua en superficie', value: planet.surface_water },
        { label: 'Población', value: planet.population },
      ]
    }
    case 'films': {
      const film = item as Film
      return [
        { label: 'Episodio', value: film.episode_id },
        { label: 'Director', value: film.director },
        { label: 'Productores', value: film.producer },
        { label: 'Estreno', value: film.release_date },
      ]
    }
    case 'starships': {
      const starship = item as Starship
      return [
        { label: 'Modelo', value: starship.model },
        { label: 'Fabricante', value: starship.manufacturer },
        { label: 'Coste', value: starship.cost_in_credits },
        { label: 'Longitud', value: starship.length },
        { label: 'Velocidad máx.', value: starship.max_atmosphering_speed },
        { label: 'Tripulación', value: starship.crew },
        { label: 'Pasajeros', value: starship.passengers },
        { label: 'Capacidad de carga', value: starship.cargo_capacity },
        { label: 'Clase', value: starship.starship_class },
      ]
    }
    case 'species': {
      const species = item as Species
      return [
        { label: 'Clasificación', value: species.classification },
        { label: 'Designación', value: species.designation },
        { label: 'Altura media', value: species.average_height },
        { label: 'Colores de piel', value: species.skin_colors },
        { label: 'Colores de pelo', value: species.hair_colors },
        { label: 'Colores de ojos', value: species.eye_colors },
        { label: 'Esperanza de vida', value: species.average_lifespan },
        { label: 'Idioma', value: species.language },
      ]
    }
  }
}

/** URLs absolutas del propio recurso que apuntan a otros de nuestros recursos. */
function relatedUrls(item: SwapiResources[ResourceName]): string[] {
  const urls = new Set<string>()
  for (const value of Object.values(item)) {
    const entries = Array.isArray(value) ? value : [value]
    for (const entry of entries) {
      if (typeof entry === 'string' && /^https?:/.test(entry) && entry !== item.url) {
        urls.add(entry)
      }
    }
  }
  return [...urls].filter((url) => resourceFromUrl(url) !== undefined)
}

function ResourceDetail({ resource, id }: { resource: ResourceName; id: string }) {
  const { data, error, loading, reload } = useSwapiDetail(resource, id)
  const meta = RESOURCE_META[resource]

  if (loading) return <LoadingState label={`Cargando ${meta.singular.toLowerCase()}…`} />

  if (error) {
    const notFound = error.message.includes('404')
    return notFound ? (
      <EmptyState
        icon="🛰️"
        title={`${meta.singular} #${id} no encontrado`}
        message="Puede que el identificador no exista en SWAPI."
      >
        <div className="empty__actions">
          <Link className="btn btn--primary btn--md" to={`/${resource}`}>
            Volver a {meta.plural.toLowerCase()}
          </Link>
        </div>
      </EmptyState>
    ) : (
      <ErrorState
        title="No se pudo cargar la ficha"
        message={error.message}
        onRetry={() => void reload()}
      />
    )
  }

  if (!data) return null

  const title = titleOf(data)
  const fields = fieldsFor(resource, data)
  const related = relatedUrls(data)

  return (
    <article className="detail stack">
      <nav className="breadcrumb" aria-label="Migas de pan">
        <Link to={`/${resource}`}>
          {meta.icon} {meta.plural}
        </Link>
        <span className="dim">/</span>
        <span aria-current="page">{title}</span>
      </nav>

      <header className="detail__head surface">
        <div className="detail__title">
          <span className="detail__icon" aria-hidden="true">
            {meta.icon}
          </span>
          <div>
            <h1>{title}</h1>
            <p className="dim">
              {meta.singular} #{idFromUrl(data.url)}
            </p>
          </div>
        </div>
        <FavoriteButton url={data.url} name={title} />
      </header>

      {'opening_crawl' in data && (
        <section className="detail__section surface">
          <h2>Texto de apertura</h2>
          <p className="detail__crawl">{data.opening_crawl}</p>
        </section>
      )}

      <section className="detail__section surface">
        <h2>Datos</h2>
        <dl className="detail__fields">
          {fields.map((field) => (
            <ResourceField key={field.label} label={field.label} value={field.value} />
          ))}
        </dl>
      </section>

      {related.length > 0 && (
        <section className="detail__section surface">
          <h2>Relacionados</h2>
          <div className="chips">
            {related.map((url) => {
              const relatedResource = resourceFromUrl(url)
              if (!relatedResource) return null
              return (
                <Link key={url} className="chip" to={`/${relatedResource}/${idFromUrl(url)}`}>
                  <span aria-hidden="true">{RESOURCE_META[relatedResource].icon}</span>
                  {RESOURCE_META[relatedResource].singular} #{idFromUrl(url)}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <p className="dim detail__source">
        Datos servidos por{' '}
        <a href={data.url} target="_blank" rel="noopener noreferrer">
          SWAPI
        </a>
        . Creado el {new Date(data.created).toLocaleDateString()}.
      </p>
    </article>
  )
}
