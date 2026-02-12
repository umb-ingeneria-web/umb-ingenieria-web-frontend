import { type InputHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = InputHTMLAttributes<HTMLInputElement>

export default function Input({ className, ...rest }: Props) {
  return (
    <input
      className={clsx(
        'w-full rounded-xl border bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)]',
        'border-[var(--input-border)] focus:border-[var(--input-border-focus)]',
        className,
      )}
      {...rest}
    />
  )
}
