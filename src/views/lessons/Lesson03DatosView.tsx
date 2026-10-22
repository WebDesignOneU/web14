// src/views/lessons/Lesson03DatosView.tsx
// Lección 03 · Datos asíncronos con useEffect
import { useEffect, useState } from 'react'

import { isAbortError, swapiFetch } from '@/api/http'
import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { BaseButton } from '@/components/ui/BaseButton'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { ErrorState } from '@/components/ui/ErrorState'
import { LoadingState } from '@/components/ui/LoadingState'
import { getLesson } from '@/data/lessons'

const lesson = getLesson('03-datos-asincronos')!

interface Character {
  name: string
  height: string
  mass: string
  birth_year: string
  gender: string
}

const options = [
  { id: '1', label: '1 · Luke Skywalker' },
  { id: '4', label: '4 · Darth Vader' },
  { id: '999', label: '999 · no existe (404)' },
]

export default function Lesson03DatosView() {
  const [id, setId] = useState('1')
  const [nonce, setNonce] = useState(0)

  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 1) Preparamos la cancelación ANTES de lanzar la petición.
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    async function load(): Promise<void> {
      try {
        const data = await swapiFetch<Character>(`/people/${id}/`, { signal: controller.signal })
        setCharacter(data)
        setLoading(false)
      } catch (caught) {
        // Cancelar no es un error: no pintamos nada.
        if (isAbortError(caught)) return
        setError(caught instanceof Error ? caught.message : 'Error desconocido')
        setCharacter(null)
        setLoading(false)
      }
    }

    void load()

    // 2) Función de limpieza: se ejecuta al desmontar o antes del siguiente
    //    efecto. Cancela la petición en curso y evita condiciones de carrera.
    return () => controller.abort()
    // 3) El efecto se repite cuando cambian sus dependencias.
  }, [id, nonce])

  return (
    <LessonShell
      lesson={lesson}
      code={
        <CodeBlock
          title="El patrón: efecto + AbortController + limpieza"
          code={[
            'useEffect(() => {',
            '  const controller = new AbortController()',
            '',
            '  async function load() {',
            '    try {',
            '      const res = await fetch(`/people/${id}/`, { signal: controller.signal })',
            '      setCharacter(await res.json())',
            '    } catch (error) {',
            '      if (error.name === "AbortError") return  // cancelado: no es error',
            '      setError(error.message)',
            '    } finally {',
            '      setLoading(false)',
            '    }',
            '  }',
            '',
            '  load()',
            '  return () => controller.abort()   // ← limpieza',
            '}, [id])                              // ← dependencias',
          ].join('\n')}
        />
      }
      challenges={
        <ChallengeList
          title="Ejercicios"
          items={[
            'Añade un tercer estado «vacío» para cuando la API devuelve una lista sin resultados.',
            'Quita la limpieza (`return () => controller.abort()`) y pulsa rápido entre personajes: ¿qué nombre se queda? Es una condición de carrera.',
            'Extrae todo este efecto a un hook `useCharacter(id)` dentro de `src/hooks`.',
            'Muestra también el `homeworld` haciendo una segunda petición encadenada.',
          ]}
        />
      }
    >
      <p className="muted">
        Este panel carga un personaje de SWAPI cada vez que cambia el <code>id</code>. El efecto
        cancela la petición anterior con <code>AbortController</code> y limpia al desmontar. Prueba
        a pulsar rápido entre botones: nunca verás datos de una petición vieja.
      </p>

      <div className="panel surface l03-panel">
        <div className="row">
          {options.map((option) => (
            <BaseButton
              key={option.id}
              size="sm"
              variant={id === option.id ? 'primary' : 'subtle'}
              onClick={() => setId(option.id)}
            >
              {option.label}
            </BaseButton>
          ))}
          <BaseButton size="sm" onClick={() => setNonce((current) => current + 1)}>
            ↻ Recargar
          </BaseButton>
        </div>

        <div className="l03-result">
          {loading && <LoadingState label="Consultando SWAPI…" />}

          {!loading && error && (
            <ErrorState
              title="No se pudo cargar el personaje"
              message={error}
              onRetry={() => setNonce((current) => current + 1)}
            />
          )}

          {!loading && !error && character && (
            <dl className="detail__fields l03-card">
              <div className="field">
                <dt className="field__label">Nombre</dt>
                <dd className="field__value">{character.name}</dd>
              </div>
              <div className="field">
                <dt className="field__label">Nacimiento</dt>
                <dd className="field__value">{character.birth_year}</dd>
              </div>
              <div className="field">
                <dt className="field__label">Altura</dt>
                <dd className="field__value">{character.height} cm</dd>
              </div>
              <div className="field">
                <dt className="field__label">Género</dt>
                <dd className="field__value">{character.gender}</dd>
              </div>
            </dl>
          )}
        </div>

        <p className="dim l03-note">
          ¿Ves dos peticiones en la pestaña Network? Es <code>StrictMode</code> en desarrollo:
          monta, desmonta y vuelve a montar cada efecto para obligarte a escribir una limpieza
          correcta. En producción sólo hay una.
        </p>
      </div>
    </LessonShell>
  )
}
