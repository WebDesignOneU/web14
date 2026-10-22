// src/components/ui/CodeBlock.tsx
// Bloque de código con botón "copiar". En JSX el contenido se escapa de
// forma automática, así que basta con interpolar el texto.
import { useState } from 'react'

import { BaseButton } from './BaseButton'

export interface CodeBlockProps {
  code: string
  title?: string
  lang?: string
}

export function CodeBlock({ code, title, lang }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* el portapapeles puede no estar disponible según el contexto */
    }
  }

  return (
    <figure className="code">
      <figcaption className="code__bar">
        <span className="code__title">{title ?? lang ?? 'código'}</span>
        <BaseButton size="sm" variant="subtle" onClick={() => void copy()}>
          {copied ? '✓ Copiado' : 'Copiar'}
        </BaseButton>
      </figcaption>
      <pre className="code__pre">
        <code>{code}</code>
      </pre>
    </figure>
  )
}
