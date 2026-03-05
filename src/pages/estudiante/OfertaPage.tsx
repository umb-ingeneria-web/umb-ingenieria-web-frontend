import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import * as api from '../../api/estudianteApi'
import type { MateriaResponse } from '../../api/materiasApi'
import type { PreregistroItem } from '../../api/estudianteApi'
import Select from '../../components/ui/Select'

const MAX_MATERIAS = 9
const MAX_CREDITOS = 22

type Jornada = 'DIURNA' | 'NOCTURNA' | 'INDIFERENTE'

export default function OfertaPage() {
  const [oferta, setOferta] = useState<MateriaResponse[]>([])
  const [preregistro, setPreregistro] = useState<PreregistroItem[]>([])
  const [loading, setLoading] = useState(false)
  const [jornadas, setJornadas] = useState<Record<string, Jornada>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [periodoEstado, setPeriodoEstado] = useState<'ACTIVO' | 'NO_INICIADO' | 'FINALIZADO' | null>(null)

  async function cargar() {
    setLoading(true)
    try {
      const [ofertaData, preregistroData] = await Promise.all([
        api.obtenerOferta(),
        api.obtenerPreregistro(),
      ])
      setOferta(ofertaData)
      setPreregistro(preregistroData)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('carrera')) {
        toast.warn('Primero debes seleccionar tu carrera')
      } else if (msg.includes('pre-registro aún no')) {
        setPeriodoEstado('NO_INICIADO')
      } else if (msg.includes('pre-registro ha finalizado')) {
        setPeriodoEstado('FINALIZADO')
      } else {
        toast.error('Error al cargar la oferta')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const creditosActuales = preregistro.reduce((sum, p) => sum + p.creditos, 0)
  const materiasSeleccionadas = preregistro.length

  function estaSeleccionada(materiaId: string) {
    return preregistro.some((p) => p.materiaId === materiaId)
  }

  async function toggleMateria(materia: MateriaResponse) {
    if (estaSeleccionada(materia.id)) {
      setSaving((p) => ({ ...p, [materia.id]: true }))
      try {
        await api.eliminarPreregistro(materia.id)
        await cargar()
        toast.success('Materia removida del pre-registro')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error al remover')
      } finally {
        setSaving((p) => ({ ...p, [materia.id]: false }))
      }
    } else {
      if (materiasSeleccionadas >= MAX_MATERIAS) {
        return toast.error(`No puedes agregar esta materia. Excedes el límite de materias (máx. ${MAX_MATERIAS})`)
      }
      if (creditosActuales + materia.creditos > MAX_CREDITOS) {
        return toast.error(`No puedes agregar esta materia. Excedes el límite de créditos (máx. ${MAX_CREDITOS})`)
      }
      const jornada = jornadas[materia.id] ?? 'INDIFERENTE'
      setSaving((p) => ({ ...p, [materia.id]: true }))
      try {
        await api.agregarPreregistro(materia.id, jornada)
        await cargar()
        toast.success('Materia agregada al pre-registro')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error al agregar')
      } finally {
        setSaving((p) => ({ ...p, [materia.id]: false }))
      }
    }
  }

  if (periodoEstado === 'NO_INICIADO') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
        <div className="text-5xl mb-4">⏰</div>
        <h2 className="text-xl font-semibold mb-2">El pre-registro aún no comienza</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Por favor espera a que la institución habilite el período.</p>
      </div>
    )
  }

  if (periodoEstado === 'FINALIZADO') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center p-6">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-semibold mb-2">El periodo de pre-registro ha finalizado</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Ya no es posible realizar cambios en tu pre-registro.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Oferta Académica</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Materias disponibles para tu pre-registro. Selecciona y elige tu jornada preferida.
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <div className="rounded-xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] px-4 py-2">
            <span className="text-[var(--color-text-muted)]">Materias:</span>{' '}
            <span className={`font-bold ${materiasSeleccionadas >= MAX_MATERIAS ? 'text-[var(--color-danger)]' : ''}`}>
              {materiasSeleccionadas}/{MAX_MATERIAS}
            </span>
          </div>
          <div className="rounded-xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] px-4 py-2">
            <span className="text-[var(--color-text-muted)]">Créditos:</span>{' '}
            <span className={`font-bold ${creditosActuales >= MAX_CREDITOS ? 'text-[var(--color-danger)]' : ''}`}>
              {creditosActuales}/{MAX_CREDITOS}
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-sm text-[var(--color-text-muted)]">Cargando oferta...</div>
      ) : oferta.length === 0 ? (
        <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-10 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <p className="font-medium">¡Excelente! No tienes materias pendientes.</p>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Todas las materias de tu carrera ya han sido aprobadas o pre-registradas.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {oferta.map((materia) => {
            const seleccionada = estaSeleccionada(materia.id)
            const cargando = saving[materia.id]
            const jornada = jornadas[materia.id] ?? 'INDIFERENTE'
            const bloqueada = !seleccionada && (
              materiasSeleccionadas >= MAX_MATERIAS ||
              creditosActuales + materia.creditos > MAX_CREDITOS
            )

            return (
              <div
                key={materia.id}
                className={`rounded-2xl border-2 p-4 transition-all ${
                  seleccionada
                    ? 'border-[var(--color-primary)] bg-[rgba(152,31,28,0.04)]'
                    : bloqueada
                    ? 'border-[rgba(17,24,39,0.06)] opacity-50'
                    : 'border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] hover:border-[rgba(17,24,39,0.20)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={seleccionada}
                    disabled={cargando || (bloqueada)}
                    onChange={() => toggleMateria(materia)}
                    className="mt-1 h-4 w-4 rounded cursor-pointer"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-[var(--color-primary)]">
                        {materia.codigo}
                      </span>
                      <span className="rounded-full bg-[rgba(152,31,28,0.08)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                        {materia.creditos} cr.
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-tight">{materia.nombre}</p>
                  </div>
                </div>

                {seleccionada && (
                  <div className="mt-3 pt-3 border-t border-[rgba(17,24,39,0.06)]">
                    <label className="text-xs font-medium text-[var(--color-text-muted)] block mb-1">
                      Jornada preferida
                    </label>
                    <Select
                      value={preregistro.find((p) => p.materiaId === materia.id)?.jornada ?? jornada}
                      onChange={async (e) => {
                        const newJornada = e.target.value as Jornada
                        setSaving((p) => ({ ...p, [materia.id]: true }))
                        try {
                          await api.eliminarPreregistro(materia.id)
                          await api.agregarPreregistro(materia.id, newJornada)
                          await cargar()
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : 'Error')
                        } finally {
                          setSaving((p) => ({ ...p, [materia.id]: false }))
                        }
                      }}
                      className="text-xs h-8"
                      disabled={cargando}
                    >
                      <option value="DIURNA">🌅 Diurna</option>
                      <option value="NOCTURNA">🌙 Nocturna</option>
                      <option value="INDIFERENTE">↔ Indiferente</option>
                    </Select>
                  </div>
                )}

                {!seleccionada && (
                  <div className="mt-3 pt-3 border-t border-[rgba(17,24,39,0.06)]">
                    <label className="text-xs font-medium text-[var(--color-text-muted)] block mb-1">
                      Jornada preferida
                    </label>
                    <Select
                      value={jornada}
                      onChange={(e) => setJornadas((p) => ({ ...p, [materia.id]: e.target.value as Jornada }))}
                      className="text-xs h-8"
                      disabled={bloqueada}
                    >
                      <option value="DIURNA">🌅 Diurna</option>
                      <option value="NOCTURNA">🌙 Nocturna</option>
                      <option value="INDIFERENTE">↔ Indiferente</option>
                    </Select>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
