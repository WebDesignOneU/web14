// src/components/demo/DataList.tsx
// Componente GENÉRICO + render prop: no decide cómo pintar cada elemento,
// delega en quien lo usa (el equivalente a un slot con scope en Vue).
import type { ReactNode } from 'react'

export interface DataListProps<T> {
  items: T[]
  /** El consumidor decide el marcado de cada fila. */
  renderItem: (item: T, index: number) => ReactNode
  keyOf?: (item: T, index: number) => string
  emptyText?: string
}

export function DataList<T>({
  items,
  renderItem,
  keyOf,
  emptyText = 'Sin elementos',
}: DataListProps<T>) {
  if (items.length === 0) return <p className="dim">{emptyText}</p>

  return (
    <ul className="data-list">
      {items.map((item, index) => (
        <li key={keyOf ? keyOf(item, index) : index} className="data-list__item">
          {renderItem(item, index)}
        </li>
      ))}
    </ul>
  )
}
