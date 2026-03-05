import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as api from '../../api/estudianteApi'
import type { PreregistroItem } from '../../api/estudianteApi'
import Button from '../../components/ui/Button'

const MAX_MATERIAS = 9
const MAX_CREDITOS = 22

function jornadaBadge(jornada: string) {
  if (jornada === 'DIURNA') return { label: '🌅 Diurna', class: 'bg-[rgba(245,158,11,0.12)] text-[rgb(180,120,0)]' }
  if (jornada === 'NOCTURNA') return { label: '🌙 Nocturna', class: 'bg-[rgba(124,58,237,0.12)] text-[rgb(124,58,237)]' }
  return { label: '↔ Indiferente', class: 'bg-[rgba(17,24,39,0.06)] text-[var(--color-text-muted)]' }
}

export default function MiPreregistroPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState<PreregistroItem[]>([])
  const [loading, setLoading] = useState(false)
  const [removing, setRemoving] = useState<Record<string, boolean>>({})

  async function cargar() {
    setLoading(true)
    try {
      setItems(await api.obtenerPreregistro())
    } catch {
      toast.error('Error al cargar el pre-registro')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  async function eliminar(item: PreregistroItem) {
    if (!confirm(`¿Remover ${item.nombreMateria} del pre-registro?`)) return
    setRemoving((p) => ({ ...p, [item.materiaId]: true }))
    try {
      await api.eliminarPreregistro(item.materiaId)
      await cargar()
      toast.success('Materia removida')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al remover')
    } finally {
      setRemoving((p) => ({ ...p, [item.materiaId]: false }))
    }
  }

  const totalCreditos = items.reduce((sum, i) => sum + i.creditos, 0)

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mi Pre-registro</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Resumen de las materias que has seleccionado
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate('/app/estudiante/oferta')} className="h-10 rounded-xl px-4">
          + Agregar materias
        </Button>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-2xl border-2 p-4 ${items.length >= MAX_MATERIAS ? 'border-[var(--color-danger)]' : 'border-[rgba(17,24,39,0.08)]'} bg-[var(--color-surface)]`}>
          <div className="text-xs text-[var(--color-text-muted)]">Materias seleccionadas</div>
          <div className={`text-3xl font-bold mt-1 ${items.length >= MAX_MATERIAS ? 'text-[var(--color-danger)]' : ''}`}>
            {items.length} <span className="text-lg font-normal text-[var(--color-text-muted)]">/ {MAX_MATERIAS}</span>
          </div>
        </div>
        <div className={`rounded-2xl border-2 p-4 ${totalCreditos >= MAX_CREDITOS ? 'border-[var(--color-danger)]' : 'border-[rgba(17,24,39,0.08)]'} bg-[var(--color-surface)]`}>
          <div className="text-xs text-[var(--color-text-muted)]">Total de créditos</div>
          <div className={`text-3xl font-bold mt-1 ${totalCreditos >= MAX_CREDITOS ? 'text-[var(--color-danger)]' : ''}`}>
            {totalCreditos} <span className="text-lg font-normal text-[var(--color-text-muted)]">/ {MAX_CREDITOS}</span>
          </div>
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-10 text-sm text-[var(--color-text-muted)]">Cargando...</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-10 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-medium">Tu pre-registro está vacío</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1 mb-4">
            Agrega materias desde la oferta académica
          </p>
          <Button onClick={() => navigate('/app/estudiante/oferta')}>
            Ver oferta académica
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[rgba(17,24,39,0.03)] text-xs uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3">Materia</th>
                <th className="px-4 py-3 text-center">Créditos</th>
                <th className="px-4 py-3 text-center">Jornada</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const badge = jornadaBadge(item.jornada)
                return (
                  <tr key={item.id} className="border-t border-[rgba(17,24,39,0.06)]">
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-[var(--color-primary)] mr-2">{item.codigoMateria}</span>
                        <span className="font-medium">{item.nombreMateria}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="rounded-full bg-[rgba(152,31,28,0.08)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                        {item.creditos} cr.
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${badge.class}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="danger"
                        className="h-8 px-3 text-xs"
                        disabled={removing[item.materiaId]}
                        onClick={() => eliminar(item)}
                      >
                        Remover
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[rgba(17,24,39,0.1)] bg-[rgba(17,24,39,0.02)]">
                <td className="px-4 py-3 font-semibold">Total</td>
                <td className="px-4 py-3 text-center font-bold">{totalCreditos} cr.</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
