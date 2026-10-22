// src/views/lessons/Lesson08ComposicionView.tsx
// Lección 08 · Composición y Context
import { ChallengeList } from '@/components/lesson/ChallengeList'
import { LessonShell } from '@/components/lesson/LessonShell'
import { DataList } from '@/components/demo/DataList'
import { BaseBadge } from '@/components/ui/BaseBadge'
import { BaseCard } from '@/components/ui/BaseCard'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { useTheme } from '@/context/ThemeContext'
import { getLesson } from '@/data/lessons'

const lesson = getLesson('08-composicion')!

interface CrewMember {
  name: string
  role: string
  force: boolean
}

const crew: CrewMember[] = [
  { name: 'Leia Organa', role: 'Princesa de Alderaan', force: true },
  { name: 'Chewbacca', role: 'Copiloto y mecánico', force: false },
  { name: 'R2-D2', role: 'Droide astromecánico', force: false },
  { name: 'Obi-Wan Kenobi', role: 'Maestro Jedi', force: true },
]

// Este componente lee el tema del contexto: no recibe ninguna prop.
// Sin Context, habría que pasarla por todos los niveles intermedios.
function ThemeReadout() {
  const { theme } = useTheme()
  return (
    <p className="dim l08-readout">
      Soy un componente anidado y leo el tema directamente del contexto:{' '}
      <strong>{theme === 'dark' ? '🌙 oscuro' : '☀️ claro'}</strong>. Cero props.
    </p>
  )
}

export default function Lesson08CompositionView() {
  const { theme, toggleTheme } = useTheme()

  return (
    <LessonShell
      lesson={lesson}
      code={
        <CodeBlock
          title="children, slots por props, render props y Context"
          code={[
            '// a) children: el contenido se decide desde fuera',
            '<BaseCard title="Panel">',
            '  <p>Esto llega como children.</p>',
            '</BaseCard>',
            '',
            '// b) "slots" con nombre: props de tipo ReactNode',
            '<BaseCard',
            '  header={<strong>Con cabecera propia</strong>}',
            '  footer={<small>pie</small>}',
            '>',
            '  contenido',
            '</BaseCard>',
            '',
            '// c) render props: el consumidor decide cómo pintar cada fila',
            '<DataList',
            '  items={crew}',
            '  keyOf={(member) => member.name}',
            '  renderItem={(member, index) => <span>{index + 1}. {member.name}</span>}',
            '/>',
            '',
            '// d) Context: como provide/inject, sin prop drilling',
            'const ThemeContext = createContext(null)',
            '',
            'export function ThemeProvider({ children }) {',
            '  const [theme, setTheme] = useState("dark")',
            '  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>',
            '}',
            '',
            'export function useTheme() {',
            '  const context = useContext(ThemeContext)',
            '  if (!context) throw new Error("Falta <ThemeProvider>")',
            '  return context',
            '}',
          ].join('\n')}
        />
      }
      challenges={
        <ChallengeList
          title="Ejercicios"
          items={[
            'Crea un componente `<Panel>` con props `title` y `actions` (slot) y úsalo aquí.',
            'Convierte `DataList` en un componente que reciba `header` y `empty` como props.',
            'Añade al `ThemeProvider` una tercera opción de tema y comprueba que todos los consumidores reaccionan.',
            'Imagina compartir el idioma de la app (es/en) por contexto y esboza el `LanguageProvider`.',
          ]}
        />
      }
    >
      <p className="muted">
        React no tiene slots: se pasa <code>children</code> para el contenido principal, props de
        tipo <code>ReactNode</code> para huecos con nombre (<code>header</code>,{' '}
        <code>footer</code>) y funciones (render props) cuando el consumidor decide el marcado.
      </p>

      <BaseCard
        header={
          <div className="row row--between">
            <strong>Panel de mando</strong>
            <BaseBadge variant="primary">header pasado por prop</BaseBadge>
          </div>
        }
        footer={<small className="dim">Pie pasado por la prop `footer`.</small>}
        className="l08-card"
      >
        <p>
          Esta tarjeta es el componente <code>BaseCard</code>. Cabeza, cuerpo y pie se rellenan
          desde esta lección, no desde dentro del componente.
        </p>
        <div className="row">
          <button type="button" className="btn btn--primary btn--md" onClick={toggleTheme}>
            Cambiar tema (el actual es «{theme}»)
          </button>
          <ThemeReadout />
        </div>
      </BaseCard>

      <div className="panel surface l08-panel">
        <span className="field-label">
          Render prop: el padre decide cómo se pinta cada miembro
        </span>
        <DataList
          items={crew}
          keyOf={(member) => member.name}
          emptyText="Sin tripulación a bordo."
          renderItem={(member, index) => (
            <div className="l08-row">
              <span className="l08-index">#{index + 1}</span>
              <strong>{member.name}</strong>
              <span className="dim">{member.role}</span>
              <BaseBadge variant={member.force ? 'accent' : 'default'}>
                {member.force ? 'Jedi' : 'Aliado'}
              </BaseBadge>
            </div>
          )}
        />
      </div>

      <ThemeReadout />
    </LessonShell>
  )
}
