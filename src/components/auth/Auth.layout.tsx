import type { CSSProperties, ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
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
            H
          </div>
        </div>

        <h2 className="text-4xl font-bold leading-tight">
          Transforma tu tiempo en ingresos
        </h2>
        <p className="mt-4 max-w-md text-lg text-[rgba(255,255,255,0.90)]">
          Únete a cientos de vendedores que ya generan ingresos extra vendiendo servicios
          de empresas líderes.
        </p>

        <div className="mt-8 grid max-w-lg grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[rgba(0,0,0,0.10)] p-4">
            <div className="text-2xl font-bold">$2M+</div>
            <div className="mt-1 text-xs text-[rgba(255,255,255,0.90)]">
              En comisiones pagadas
            </div>
          </div>
          <div className="rounded-2xl bg-[rgba(0,0,0,0.10)] p-4">
            <div className="text-2xl font-bold">500+</div>
            <div className="mt-1 text-xs text-[rgba(255,255,255,0.90)]">
              Vendedores activos
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}