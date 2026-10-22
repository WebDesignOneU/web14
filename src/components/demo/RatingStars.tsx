// src/components/demo/RatingStars.tsx
// Componente CONTROLADO: el valor entra por props y los cambios salen por
// onChange. En Vue esto sería defineModel(); en React se hace así.
import { cx } from '@/utils/cx'

export interface RatingStarsProps {
  value: number
  onChange: (value: number) => void
  max?: number
  label?: string
}

export function RatingStars({
  value,
  onChange,
  max = 5,
  label = 'Valoración',
}: RatingStarsProps) {
  return (
    <div className="rating" role="radiogroup" aria-label={label}>
      {Array.from({ length: max }, (_, index) => index + 1).map((star) => {
        const on = star <= value
        return (
          <button
            key={star}
            type="button"
            className={cx('rating__star', on && 'rating__star--on')}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(value === star ? 0 : star)}
          >
            <span aria-hidden="true">★</span>
            <span className="visually-hidden">Valorar con {star}</span>
          </button>
        )
      })}
      <span className="rating__value muted">
        {value} / {max}
      </span>
    </div>
  )
}
