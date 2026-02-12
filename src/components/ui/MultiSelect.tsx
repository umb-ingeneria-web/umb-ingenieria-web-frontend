import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'

type Option = {
  value: string
  label: string
}

type Props = {
  options: Option[]
  value: string[]
  disabled?: boolean
  onApply: (next: string[]) => void
}

export default function MultiSelect({ options, value, disabled, onApply }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<string[]>(value)
  const [query, setQuery] = useState('')
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const el = rootRef.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false)
        setQuery('')
        setDraft(value)
      }
    }

    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [value])

  const selectedLabels = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o.label]))
    return draft.map((v) => map.get(v) ?? v)
  }, [draft, options])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    )
  }, [options, query])

  function toggleValue(v: string) {
    setDraft((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]))
  }

  const isDirty = useMemo(() => {
    const a = [...value].sort().join('|')
    const b = [...draft].sort().join('|')
    return a !== b
  }, [draft, value])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
          'bg-[var(--input-bg)] text-[var(--color-text)]',
          'border-[var(--input-border)] hover:border-[var(--input-border-focus)]',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
          {selectedLabels.length === 0 ? (
            <span className="text-[var(--color-text-muted)]">Sin roles</span>
          ) : (
            selectedLabels.slice(0, 3).map((l) => (
              <span
                key={l}
                className="rounded-full bg-[rgba(255,255,255,0.08)] px-2 py-0.5 text-xs"
              >
                {l}
              </span>
            ))
          )}
          {selectedLabels.length > 3 && (
            <span className="text-xs text-[var(--color-text-muted)]">
              +{selectedLabels.length - 3}
            </span>
          )}
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">Editar</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-[rgba(255,255,255,0.10)] bg-[var(--color-surface)] p-3 shadow-xl">
          <div className="mb-2 flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar rol..."
              className="w-full rounded-md border bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors border-[var(--input-border)] focus:border-[var(--input-border-focus)]"
            />
          </div>

          <div className="max-h-48 overflow-auto rounded-md border border-[rgba(255,255,255,0.06)]">
            {filtered.map((o) => {
              const checked = draft.includes(o.value)
              return (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-[rgba(255,255,255,0.04)]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleValue(o.value)}
                  />
                  <span className="flex-1">{o.label}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">{o.value}</span>
                </label>
              )
            })}

            {filtered.length === 0 && (
              <div className="px-3 py-4 text-sm text-[var(--color-text-muted)]">
                Sin resultados
              </div>
            )}
          </div>

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm text-[var(--color-text-muted)] hover:bg-[rgba(255,255,255,0.06)]"
              onClick={() => {
                setOpen(false)
                setQuery('')
                setDraft(value)
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!isDirty || disabled}
              className={clsx(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                !isDirty || disabled
                  ? 'cursor-not-allowed bg-[rgba(255,255,255,0.08)] text-[var(--color-text-muted)]'
                  : 'bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-bg-hover)]',
              )}
              onClick={() => {
                onApply(draft)
                setOpen(false)
                setQuery('')
              }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
