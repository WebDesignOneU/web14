// src/components/lesson/ChallengeList.tsx
// Lista numerada de retos/ejercicios de una lección.
export interface ChallengeListProps {
  items: string[]
  title?: string
}

export function ChallengeList({ items, title }: ChallengeListProps) {
  return (
    <div className="challenges">
      {title && <p className="challenges__title muted">{title}</p>}
      <ol className="challenges__list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ol>
    </div>
  )
}
