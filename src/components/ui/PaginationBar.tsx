// src/components/ui/PaginationBar.tsx
// Controles de paginación. Es un componente CONTROLADO: no guarda la página,
// la recibe por props y avisa de los cambios con onPageChange.
import { BaseButton } from './BaseButton'

export interface PaginationBarProps {
  page: number
  totalPages?: number
  onPageChange: (page: number) => void
}

export function PaginationBar({ page, totalPages = 1, onPageChange }: PaginationBarProps) {
  const goTo = (target: number): void => {
    onPageChange(Math.min(Math.max(1, target), totalPages))
  }

  return (
    <nav className="pagination" aria-label="Paginación">
      <BaseButton size="sm" variant="subtle" disabled={page <= 1} onClick={() => goTo(1)}>
        « Primera
      </BaseButton>
      <BaseButton size="sm" disabled={page <= 1} onClick={() => goTo(page - 1)}>
        ← Anterior
      </BaseButton>
      <span className="pagination__info muted">
        Página <strong>{page}</strong> / {totalPages}
      </span>
      <BaseButton size="sm" disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
        Siguiente →
      </BaseButton>
      <BaseButton size="sm" variant="subtle" disabled={page >= totalPages} onClick={() => goTo(totalPages)}>
        Última »
      </BaseButton>
    </nav>
  )
}
