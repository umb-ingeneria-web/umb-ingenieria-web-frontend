import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function Button({ variant = 'primary', className, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer',
        variant === 'primary' &&
          'bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-bg-hover)]',
        variant === 'secondary' &&
          'bg-[var(--color-surface-2)] text-[var(--color-text)] hover:bg-[var(--color-surface)]',
        variant === 'danger' &&
          'bg-[var(--color-danger)] text-white hover:opacity-90',
        className,
      )}
      {...rest}
    />
  )
}
