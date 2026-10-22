// src/api/types.ts
// Tipos de los recursos de SWAPI (https://swapi.dev/documentation).

/** Respuesta paginada estándar de SWAPI. */
export interface SwapiListResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface Person {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: string
  homeworld: string
  films: string[]
  species: string[]
  vehicles: string[]
  starships: string[]
  created: string
  edited: string
  url: string
}

export interface Planet {
  name: string
  rotation_period: string
  orbital_period: string
  diameter: string
  climate: string
  gravity: string
  terrain: string
  surface_water: string
  population: string
  residents: string[]
  films: string[]
  created: string
  edited: string
  url: string
}

export interface Film {
  title: string
  episode_id: number
  opening_crawl: string
  director: string
  producer: string
  release_date: string
  characters: string[]
  planets: string[]
  starships: string[]
  vehicles: string[]
  species: string[]
  created: string
  edited: string
  url: string
}

export interface Starship {
  name: string
  model: string
  manufacturer: string
  cost_in_credits: string
  length: string
  max_atmosphering_speed: string
  crew: string
  passengers: string
  cargo_capacity: string
  consumables: string
  hyperdrive_rating: string
  MGLT: string
  starship_class: string
  pilots: string[]
  films: string[]
  created: string
  edited: string
  url: string
}

export interface Species {
  name: string
  classification: string
  designation: string
  average_height: string
  skin_colors: string
  hair_colors: string
  eye_colors: string
  average_lifespan: string
  homeworld: string | null
  language: string
  people: string[]
  films: string[]
  created: string
  edited: string
  url: string
}

/** Mapa recurso -> tipo de entidad. Permite genéricos potentes (lección 04). */
export interface SwapiResources {
  people: Person
  planets: Planet
  films: Film
  starships: Starship
  species: Species
}

export type ResourceName = keyof SwapiResources

export interface ResourceMeta {
  singular: string
  plural: string
  icon: string
}

export const RESOURCE_META: Record<ResourceName, ResourceMeta> = {
  people: { singular: 'Personaje', plural: 'Personajes', icon: '🧑‍🚀' },
  planets: { singular: 'Planeta', plural: 'Planetas', icon: '🪐' },
  films: { singular: 'Película', plural: 'Películas', icon: '🎬' },
  starships: { singular: 'Nave', plural: 'Naves', icon: '🚀' },
  species: { singular: 'Especie', plural: 'Especies', icon: '👽' },
}

export const RESOURCE_NAMES: ResourceName[] = ['people', 'planets', 'films', 'starships', 'species']

/** Guarda de tipo: comprueba si un valor es un nombre de recurso válido. */
export function isResourceName(value: unknown): value is ResourceName {
  return typeof value === 'string' && (RESOURCE_NAMES as string[]).includes(value)
}

/** Extrae el id numérico de una URL de SWAPI: ".../people/1/" -> "1". */
export function idFromUrl(url: string): string {
  const match = url.match(/\/(\d+)\/?$/)
  return match ? match[1] : url
}

/** Nombre legible del recurso a partir de su URL. */
export function resourceFromUrl(url: string): ResourceName | undefined {
  const match = url.match(/\/([a-z]+)\/\d+\/?$/)
  const candidate = match?.[1]
  return RESOURCE_NAMES.find((name) => name === candidate)
}

/** Título visible de cualquier recurso de SWAPI (unos usan `name`, otros `title`). */
export function titleOf(item: SwapiResources[ResourceName]): string {
  return 'title' in item ? item.title : item.name
}
