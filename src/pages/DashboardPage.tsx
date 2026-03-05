import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import * as api from '../api/dashboardApi'
import { exportarExcel } from '../api/dashboardApi'
import { useAppSelector } from '../app/hooks'
import Button from '../components/ui/Button'

const COLORS = ['#981f1c', '#c0392b', '#e74c3c', '#e55a5a', '#f08080',
  '#d35400', '#e67e22', '#f39c12', '#f1c40f', '#f9ca24']

const JORNADA_COLORS = ['#981f1c', '#2c3e50', '#7f8c8d']

export default function DashboardPage() {
  const [data, setData] = useState<api.DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const accessToken = useAppSelector((s) => s.auth.accessToken)

  async function cargar() {
    setLoading(true)
    try {
      setData(await api.obtenerDashboard())
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al cargar dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  async function handleExport() {
    setExporting(true)
    try {
      await exportarExcel(accessToken)
      toast.success('Archivo descargado')
    } catch {
      toast.error('Error al exportar')
    } finally {
      setExporting(false)
    }
  }

  const jornadaData = data ? [
    { name: 'Diurna', value: data.totalDiurna },
    { name: 'Nocturna', value: data.totalNocturna },
    { name: 'Indiferente', value: data.totalIndiferente },
  ] : []

  const barData = data?.topMaterias.map((m) => ({
    name: m.codigo.length > 10 ? m.codigo.slice(0, 10) : m.codigo,
    fullName: m.nombre,
    total: m.totalSolicitudes,
    diurna: m.solicitudesDiurna,
    nocturna: m.solicitudesNocturna,
  })) ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard de Demanda</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Métricas en tiempo real del proceso de pre-registro
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={cargar} disabled={loading} className="h-10 rounded-xl px-4">
            {loading ? 'Cargando...' : '↺ Actualizar'}
          </Button>
          <Button onClick={handleExport} disabled={exporting} className="h-10 rounded-xl px-4">
            {exporting ? 'Exportando...' : '⬇ Exportar Excel'}
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Estudiantes pre-registrados"
          value={data?.totalEstudiantes ?? '—'}
          subtitle="con al menos 1 materia"
          color="var(--color-primary)"
        />
        <KpiCard
          title="Materias demandadas"
          value={data?.totalMateriasDemandadas ?? '—'}
          subtitle="materias únicas solicitadas"
          color="#2563eb"
        />
        <KpiCard
          title="Solicitudes diurnas"
          value={data?.totalDiurna ?? '—'}
          subtitle="preferencia jornada diurna"
          color="#d97706"
        />
        <KpiCard
          title="Solicitudes nocturnas"
          value={data?.totalNocturna ?? '—'}
          subtitle="preferencia jornada nocturna"
          color="#7c3aed"
        />
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Barra: Top 10 materias */}
        <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="mb-1 font-semibold">Top 10 Materias con Mayor Demanda</h2>
          <p className="mb-4 text-xs text-[var(--color-text-muted)]">Total de solicitudes por materia</p>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(17,24,39,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => [val, name === 'total' ? 'Total' : name === 'diurna' ? 'Diurna' : 'Nocturna']}
                  labelFormatter={(label) => barData.find(d => d.name === label)?.fullName ?? label}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="Sin datos de demanda aún" />
          )}
        </div>

        {/* Torta: Distribución jornada */}
        <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="mb-1 font-semibold">Distribución de Preferencia de Jornada</h2>
          <p className="mb-4 text-xs text-[var(--color-text-muted)]">Porcentaje por tipo de jornada preferida</p>
          {jornadaData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={jornadaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  labelLine
                >
                  {jornadaData.map((_, i) => (
                    <Cell key={i} fill={JORNADA_COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(val) => [val, 'Solicitudes']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState text="Sin datos de jornada aún" />
          )}
        </div>
      </div>

      {/* Tabla detalle */}
      {data && data.topMaterias.length > 0 && (
        <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[rgba(17,24,39,0.06)]">
            <h2 className="font-semibold">Detalle de demanda por materia</h2>
          </div>
          <div className="overflow-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[rgba(17,24,39,0.03)] text-xs uppercase text-[var(--color-text-muted)]">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center">Diurna</th>
                  <th className="px-4 py-3 text-center">Nocturna</th>
                  <th className="px-4 py-3 text-center">Indiferente</th>
                  <th className="px-4 py-3 text-center">Créditos</th>
                </tr>
              </thead>
              <tbody>
                {data.topMaterias.map((m) => (
                  <tr key={m.materiaId} className="border-t border-[rgba(17,24,39,0.06)]">
                    <td className="px-4 py-3 font-mono font-semibold text-[var(--color-primary)]">{m.codigo}</td>
                    <td className="px-4 py-3">{m.nombre}</td>
                    <td className="px-4 py-3 text-center font-semibold">{m.totalSolicitudes}</td>
                    <td className="px-4 py-3 text-center text-[#d97706]">{m.solicitudesDiurna}</td>
                    <td className="px-4 py-3 text-center text-[#7c3aed]">{m.solicitudesNocturna}</td>
                    <td className="px-4 py-3 text-center text-[var(--color-text-muted)]">{m.solicitudesIndiferente}</td>
                    <td className="px-4 py-3 text-center">{m.creditos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function KpiCard({ title, value, subtitle, color }: { title: string; value: number | string; subtitle: string; color: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="text-xs font-medium text-[var(--color-text-muted)]">{title}</div>
      <div className="mt-2 text-3xl font-bold" style={{ color }}>{value}</div>
      <div className="mt-1 text-xs text-[var(--color-text-muted)]">{subtitle}</div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-[var(--color-text-muted)]">
      {text}
    </div>
  )
}
