import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import * as api from '../api/periodoApi'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

function estadoBadge(estado: string) {
  if (estado === 'ACTIVO') return 'bg-[rgba(22,162,73,0.12)] text-[rgb(22,162,73)]'
  if (estado === 'FINALIZADO') return 'bg-[rgba(239,68,68,0.12)] text-[rgb(239,68,68)]'
  return 'bg-[rgba(245,158,11,0.12)] text-[rgb(245,158,11)]'
}

function estadoLabel(estado: string) {
  if (estado === 'ACTIVO') return 'Activo'
  if (estado === 'FINALIZADO') return 'Finalizado'
  return 'No iniciado'
}

function toLocalInput(iso: string) {
  if (!iso) return ''
  return iso.slice(0, 16)
}

function toOffsetDateTime(local: string) {
  if (!local) return ''
  return new Date(local).toISOString().replace('Z', '+00:00')
}

export default function PeriodoPage() {
  const [periodo, setPeriodo] = useState<api.PeriodoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ fechaInicio: '', fechaFin: '' })

  async function cargar() {
    setLoading(true)
    try {
      const data = await api.obtenerPeriodo()
      setPeriodo(data)
      if (data) {
        setForm({
          fechaInicio: toLocalInput(data.fechaInicio),
          fechaFin: toLocalInput(data.fechaFin),
        })
      }
    } catch {
      toast.error('Error al cargar el periodo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  async function guardar() {
    if (!form.fechaInicio || !form.fechaFin) return toast.error('Ambas fechas son requeridas')
    if (new Date(form.fechaFin) <= new Date(form.fechaInicio)) {
      return toast.error('La fecha de fin debe ser posterior a la de inicio')
    }
    setSaving(true)
    try {
      const data = await api.guardarPeriodo({
        fechaInicio: toOffsetDateTime(form.fechaInicio),
        fechaFin: toOffsetDateTime(form.fechaFin),
      })
      setPeriodo(data)
      toast.success('Periodo guardado exitosamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Periodo de Pre-registro</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Define el lapso de tiempo en que los estudiantes pueden realizar su pre-registro
        </p>
      </div>

      {periodo && (
        <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Estado actual</h2>
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${estadoBadge(periodo.estado)}`}>
              {estadoLabel(periodo.estado)}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-[var(--color-text-muted)]">Inicio</div>
              <div className="font-medium">{new Date(periodo.fechaInicio).toLocaleString('es-CO')}</div>
            </div>
            <div>
              <div className="text-[var(--color-text-muted)]">Fin</div>
              <div className="font-medium">{new Date(periodo.fechaFin).toLocaleString('es-CO')}</div>
            </div>
          </div>
          {periodo.estado === 'NO_INICIADO' && (
            <p className="mt-3 text-sm text-[rgb(245,158,11)]">El pre-registro aún no comienza.</p>
          )}
          {periodo.estado === 'FINALIZADO' && (
            <p className="mt-3 text-sm text-[rgb(239,68,68)]">El periodo de pre-registro ha finalizado.</p>
          )}
          {periodo.estado === 'ACTIVO' && (
            <p className="mt-3 text-sm text-[rgb(22,162,73)]">Los estudiantes pueden realizar su pre-registro.</p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">
          {periodo ? 'Actualizar periodo' : 'Configurar nuevo periodo'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Fecha y hora de inicio</label>
            <Input
              type="datetime-local"
              value={form.fechaInicio}
              onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Fecha y hora de fin</label>
            <Input
              type="datetime-local"
              value={form.fechaFin}
              onChange={(e) => setForm((f) => ({ ...f, fechaFin: e.target.value }))}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={guardar} disabled={saving || loading} className="h-10 rounded-xl px-6">
              {saving ? 'Guardando...' : 'Guardar periodo'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
