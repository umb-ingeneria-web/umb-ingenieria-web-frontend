export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Panel de control</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Resumen académico del semestre
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[{ t: 'Estudiantes registrados', v: '1,240', s: '↑ 15% vs semestre anterior' }, { t: 'Pre-registros', v: '856', s: 'Semestre actual' }, { t: 'Materias proyectadas', v: '124', s: 'Disponibles' }, { t: 'Jornadas', v: '3', s: 'Diurna, nocturna y virtual' }, { t: 'Historiales cargados', v: '720', s: 'PDFs procesados' }, { t: 'Tasa de cobertura', v: '92%', s: 'Cupos satisfechos' }].map(
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
