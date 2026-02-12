import { type SelectHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = SelectHTMLAttributes<HTMLSelectElement>

export default function Select({ className, ...rest }: Props) {
  return (
    <select
      className={clsx(
        'cursor-pointer w-full rounded-md border bg-[var(--input-bg)] px-2 py-1 text-sm text-[var(--color-text)] outline-none transition-colors',
        'border-[var(--input-border)] focus:border-[var(--input-border-focus)]',
        className,
      )}
      {...rest}
    />
  )
}
