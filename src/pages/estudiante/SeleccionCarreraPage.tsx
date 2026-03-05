import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as carrerasApi from '../../api/carrerasApi'
import * as estudianteApi from '../../api/estudianteApi'
import Button from '../../components/ui/Button'

export default function SeleccionCarreraPage() {
  const navigate = useNavigate()
  const [carreras, setCarreras] = useState<carrerasApi.CarreraResponse[]>([])
  const [seleccionada, setSeleccionada] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function cargar() {
      setLoading(true)
      try {
        setCarreras(await carrerasApi.listarCarrerasActivas())
      } catch {
        toast.error('Error al cargar carreras')
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  async function guardar() {
    if (!seleccionada) return toast.error('Selecciona una carrera')
    setSaving(true)
    try {
      await estudianteApi.seleccionarCarrera(seleccionada)
      toast.success('Carrera seleccionada exitosamente')
      navigate('/app/estudiante/oferta')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(152,31,28,0.1)]">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-xl font-semibold">Selecciona tu carrera</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Esta información filtrará las materias disponibles para tu pre-registro
          </p>
        </div>

        {loading ? (
          <p className="text-center text-sm text-[var(--color-text-muted)]">Cargando carreras...</p>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {carreras.map((c) => (
                <label
                  key={c.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors ${
                    seleccionada === c.id
                      ? 'border-[var(--color-primary)] bg-[rgba(152,31,28,0.06)]'
                      : 'border-[rgba(17,24,39,0.08)] hover:border-[rgba(17,24,39,0.20)]'
                  }`}
                >
                  <input
                    type="radio"
                    name="carrera"
                    value={c.id}
                    checked={seleccionada === c.id}
                    onChange={() => setSeleccionada(c.id)}
                    className="h-4 w-4"
                  />
                  <span className="font-medium">{c.nombre}</span>
                </label>
              ))}
              {carreras.length === 0 && (
                <p className="text-center text-sm text-[var(--color-text-muted)]">
                  No hay carreras activas disponibles
                </p>
              )}
            </div>
            <Button onClick={guardar} disabled={saving || !seleccionada} className="w-full h-11 rounded-xl">
              {saving ? 'Guardando...' : 'Confirmar carrera'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
