/// <reference types="vite/client" />

// Tipado de las variables de entorno propias del proyecto.
// Vite expone al cliente sólo las que empiezan por "VITE_".
interface ImportMetaEnv {
  /** Base de la API SWAPI (opcional). Si no se define, se usa https://swapi.dev/api. */
  readonly VITE_SWAPI_BASE_URL?: string
}
