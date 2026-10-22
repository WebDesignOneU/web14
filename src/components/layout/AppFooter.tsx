// src/components/layout/AppFooter.tsx
// Pie de página con créditos y enlaces de referencia.
export function AppFooter() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="dim">
          Showcase didáctico de <strong>React + Vite + TypeScript</strong>. Datos de{' '}
          <a href="https://swapi.dev" target="_blank" rel="noopener noreferrer">
            SWAPI
          </a>{' '}
          · hecho para aprender.
        </p>
        <p className="dim footer__links">
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            React
          </a>{' '}
          ·{' '}
          <a href="https://reactrouter.com" target="_blank" rel="noopener noreferrer">
            React Router
          </a>{' '}
          ·{' '}
          <a href="https://zustand.docs.pmnd.rs" target="_blank" rel="noopener noreferrer">
            Zustand
          </a>{' '}
          ·{' '}
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            Vite
          </a>
        </p>
      </div>
    </footer>
  )
}
