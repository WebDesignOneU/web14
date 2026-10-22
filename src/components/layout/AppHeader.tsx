// src/components/layout/AppHeader.tsx
// Cabecera fija con marca, acceso a favoritos y conmutador de tema.
// El estado del menú móvil vive en <App> y baja por props (elevar el estado).
import { Link } from 'react-router-dom'

import { BaseButton } from '@/components/ui/BaseButton'
import { useTheme } from '@/context/ThemeContext'
import { selectCount, useFavoritesStore } from '@/store/favorites'

export interface AppHeaderProps {
  open: boolean
  onToggle: () => void
}

export function AppHeader({ open, onToggle }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme()
  // El selector hace que este componente sólo se re-renderice si cambia el número.
  const count = useFavoritesStore(selectCount)

  const themeLabel = theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'

  return (
    <header className="header">
      <div className="header__inner container">
        <BaseButton
          className="header__burger"
          variant="subtle"
          size="sm"
          aria-expanded={open}
          aria-controls="sidebar"
          onClick={onToggle}
        >
          ☰<span className="visually-hidden">Abrir menú de navegación</span>
        </BaseButton>

        <Link to="/" className="brand">
          <span className="brand__icon" aria-hidden="true">
            ⚛️
          </span>
          <span className="brand__text">
            <strong>Ruta de Aprendizaje React</strong>
            <small>React 19 · Vite · TypeScript · SWAPI</small>
          </span>
        </Link>

        <span className="spacer" />

        <Link to="/favoritos" className="fav-link" title="Ver favoritos">
          <span aria-hidden="true">⭐</span>
          <span className="fav-link__count">{count}</span>
          <span className="visually-hidden">favoritos guardados</span>
        </Link>

        <BaseButton variant="subtle" size="sm" title={themeLabel} onClick={toggleTheme}>
          <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span className="visually-hidden">{themeLabel}</span>
        </BaseButton>
      </div>
    </header>
  )
}
