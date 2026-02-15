import type { CSSProperties, ReactNode, SVGProps } from 'react'
import { useTheme } from '../../theme/useTheme'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isDark, toggle } = useTheme()

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)]">
      <button
        type="button"
        onClick={toggle}
        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--input-border)] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      </button>

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {children}
        <LateralInfo />
      </div>
    </div>
  )
}

function LateralInfo() {
  const bgStyle: CSSProperties = {
    backgroundColor: 'var(--color-primary)',
    backgroundImage:
      'radial-gradient(circle at 16px 16px, rgba(255,255,255,0.10) 2px, rgba(255,255,255,0.0) 2px)',
    backgroundSize: '28px 28px',
  }

  return (
    <div className="hidden lg:block" style={bgStyle}>
      <div className="flex h-full flex-col justify-center p-12 text-white">
        <div className="mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.22)] text-2xl font-semibold">
            U
          </div>
        </div>

        <h2 className="text-4xl font-bold leading-tight">
          UMB Planifica
        </h2>
        <p className="mt-4 max-w-md text-lg text-[rgba(255,255,255,0.90)]">
          Planifica tu próximo semestre y asegura tus cupos de forma anticipada.
        </p>

        <div className="mt-8 grid max-w-lg grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[rgba(0,0,0,0.10)] p-4">
            <div className="text-2xl font-bold">Mejor organización</div>
            <div className="mt-1 text-xs text-[rgba(255,255,255,0.90)]">
              Proyecta tus materias con anticipación
            </div>
          </div>
          <div className="rounded-2xl bg-[rgba(0,0,0,0.10)] p-4">
            <div className="text-2xl font-bold">Menos estrés</div>
            <div className="mt-1 text-xs text-[rgba(255,255,255,0.90)]">
              Inscripción equitativa y eficiente
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
