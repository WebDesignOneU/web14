// src/components/demo/LikeButton.tsx
// Componente de presentación: recibe datos por props y avisa con callbacks.
// No guarda estado: es el componente padre quien decide qué hacer (lección 01).
export interface LikeButtonProps {
  label: string
  count: number
  onLike: () => void
}

export function LikeButton({ label, count, onLike }: LikeButtonProps) {
  return (
    <button type="button" className="like" onClick={onLike}>
      <span aria-hidden="true">👍</span>
      <span className="like__label">{label}</span>
      <strong className="like__count">{count}</strong>
    </button>
  )
}
