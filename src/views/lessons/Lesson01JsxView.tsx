// src/views/lessons/Lesson01JsxView.tsx
// Lección 01 · JSX y componentes
import type { ReactNode } from 'react'

import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { BaseBadge } from '@/components/ui/BaseBadge'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { getLesson } from '@/data/lessons'

const lesson = getLesson('01-jsx-componentes')!

interface Character {
  name: string
  role: string
  emoji: string
  force: boolean
  power: number
  skills: string[]
}

const crew: Character[] = [
  {
    name: 'Luke Skywalker',
    role: 'Comandante del Escuadrón Rojo',
    emoji: '🧑‍🚀',
    force: true,
    power: 92,
    skills: ['Sable de luz', 'Piloto de X-wing', 'Telequinesis'],
  },
  {
    name: 'Han Solo',
    role: 'Contrabandista · Capitán del Halcón Milenario',
    emoji: '🕵️',
    force: false,
    power: 74,
    skills: ['Puntería', 'Negociación', 'Pilotaje'],
  },
  {
    name: 'Ahsoka Tano',
    role: 'Ex-padawan de Anakin Skywalker',
    emoji: '🗡️',
    force: true,
    power: 88,
    skills: [],
  },
]

interface CharacterCardProps {
  character: Character
  /** Contenido libre: en React se pasa como children. */
  children?: ReactNode
}

// Un componente no es más que una función que devuelve JSX y empieza por
// mayúscula. Recibe un único argumento: las props.
function CharacterCard({ character, children }: CharacterCardProps) {
  return (
    <article className="card card--hover">
      <header className="card__header">
        <h3 className="card__title">
          {/* Expresión entre llaves */}
          <span aria-hidden="true">{character.emoji} </span>
          {character.name.toUpperCase()}
        </h3>
        <p className="card__subtitle">{character.role}</p>
      </header>

      <div className="card__body stack-sm">
        <div className="row">
          {/* Renderizado condicional con el operador ternario */}
          <BaseBadge variant={character.force ? 'accent' : 'primary'}>
            {character.force ? 'Sensible a la Fuerza' : 'Sin la Fuerza'}
          </BaseBadge>
          <span className="dim">
            Poder {character.power}/{100}
          </span>
        </div>

        {/* En JSX los atributos son camelCase: className, htmlFor, onClick… */}
        <div className="l01-power" aria-hidden="true">
          <span className="l01-power__fill" style={{ width: `${character.power}%` }} />
        </div>

        {/* Listas: siempre con una key estable */}
        <ul className="l01-skills">
          {character.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>

        {/* Condicional corto con && (sólo se pinta si es true) */}
        {character.skills.length === 0 && <p className="dim">Sin habilidades registradas.</p>}

        {children}
      </div>
    </article>
  )
}

const code = [
  '// 1) Un componente es una función que devuelve JSX',
  'function Badge({ text }) {',
  '  return <span className="badge">{text}</span>',
  '}',
  '',
  '// 2) Se usa como si fuera una etiqueta HTML, con props',
  '<Badge text="Jedi" />',
  '',
  '// 3) Expresiones, condicionales, listas y children',
  'function CharacterCard({ character, children }) {',
  '  return (',
  '    <article className="card">',
  '      <h3>{character.name.toUpperCase()}</h3>',
  '      {character.force ? <Badge text="Jedi" /> : <Badge text="Civil" />}',
  '      <ul>',
  '        {character.skills.map((skill) => (',
  '          <li key={skill}>{skill}</li>',
  '        ))}',
  '      </ul>',
  '      {children}',
  '    </article>',
  '  )',
  '}',
].join('\n')

const challenges = [
  'Añade un cuarto personaje al array `crew` y comprueba que la UI se actualiza sola.',
  'Cambia el ternario del badge por un `&&` y observa qué pasa cuando la condición es falsa.',
  'Quita la `key` de la lista y mira la consola: React te avisará.',
  'Pasa una `className` distinta a `CharacterCard` desde el padre… y verás que no llega. ¿Por qué?',
]

export default function Lesson01JsxView() {
  const totalPower = crew.reduce((sum, character) => sum + character.power, 0)

  return (
    <LessonShell
      lesson={lesson}
      code={<CodeBlock title="JSX en 20 líneas" code={code} />}
      challenges={<ChallengeList title="Ejercicios" items={challenges} />}
    >
      <p className="muted">
        Tres tarjetas generadas a partir de un array. Todo lo que ves sale de una función que
        devuelve JSX: expresiones entre llaves, clases dinámicas, listas con <code>key</code>,
        renderizado condicional y <code>children</code>.
      </p>

      <div className="l01-grid">
        {crew.map((character, index) => (
          <CharacterCard key={character.name} character={character}>
            <small className="dim">
              Tarjeta {index + 1} de {crew.length} · pasado como children
            </small>
          </CharacterCard>
        ))}
      </div>

      <p className="dim">
        Poder total del equipo: <strong>{totalPower}</strong> — una expresión calculada durante el
        render, sin estado ni efectos.
      </p>
    </LessonShell>
  )
}
