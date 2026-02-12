import clsx from 'clsx'

type Props = {
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
}

export default function Switch({ checked, onChange, disabled }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full border transition-colors',
        checked
          ? 'bg-[var(--color-success)] border-transparent'
          : 'bg-[rgba(255,255,255,0.08)] border-[var(--input-border)]',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span
        className={clsx(
          'inline-block h-5 w-5 transform rounded-full bg-white transition-transform',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  )
}
