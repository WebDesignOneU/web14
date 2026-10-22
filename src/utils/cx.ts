// src/utils/cx.ts
// Une clases CSS ignorando los valores falsy. Evita depender de una librería
// sólo para esto: cx('btn', isActive && 'btn--active').
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
