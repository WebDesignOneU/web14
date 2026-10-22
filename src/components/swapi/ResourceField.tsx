// src/components/swapi/ResourceField.tsx
// Fila etiqueta/valor para las fichas de detalle.
export interface ResourceFieldProps {
  label: string
  value?: string | number | null
}

export function ResourceField({ label, value }: ResourceFieldProps) {
  const raw = value === null || value === undefined ? '' : String(value)
  const display = raw === '' || raw === 'unknown' || raw === 'n/a' || raw === 'none' ? '—' : raw

  return (
    <div className="field">
      <dt className="field__label">{label}</dt>
      <dd className="field__value">{display}</dd>
    </div>
  )
}
