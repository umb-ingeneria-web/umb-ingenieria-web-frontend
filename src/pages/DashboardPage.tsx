export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Panel Administrador</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Métricas globales
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[{ t: 'GMV Total', v: '$45,600', s: '↑ 23% vs mes anterior' }, { t: 'Ventas', v: '156', s: 'Últimos 30 días' }, { t: 'Vendedores', v: '48', s: 'Activos' }, { t: 'Empresas', v: '12', s: 'Registradas' }, { t: 'Servicios', v: '24', s: 'Publicados' }, { t: 'Take Rate', v: '8.5%', s: 'Promedio' }].map(
          (c) => (
            <div
              key={c.t}
              className="rounded-xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-4"
            >
              <div className="text-xs font-medium text-[var(--color-text-muted)]">
                {c.t}
              </div>
              <div className="mt-2 text-2xl font-semibold">{c.v}</div>
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">{c.s}</div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
