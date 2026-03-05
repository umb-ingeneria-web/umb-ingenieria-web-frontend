import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import * as api from '../api/carrerasApi'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function CarrerasPage() {
  const [carreras, setCarreras] = useState<api.CarreraResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<api.CarreraResponse | null>(null)
  const [nombre, setNombre] = useState('')
  const [saving, setSaving] = useState(false)

  async function cargar() {
    setLoading(true)
    try {
      setCarreras(await api.listarCarreras())
    } catch {
      toast.error('Error al cargar carreras')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  function abrirCrear() {
    setEditando(null)
    setNombre('')
    setModalOpen(true)
  }

  function abrirEditar(c: api.CarreraResponse) {
    setEditando(c)
    setNombre(c.nombre)
    setModalOpen(true)
  }

  async function guardar() {
    if (!nombre.trim()) return toast.error('El nombre es obligatorio')
    setSaving(true)
    try {
      if (editando) {
        await api.actualizarCarrera(editando.id, { nombre })
        toast.success('Carrera actualizada')
      } else {
        await api.crearCarrera({ nombre })
        toast.success('Carrera creada')
      }
      setModalOpen(false)
      cargar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActivo(c: api.CarreraResponse) {
    try {
      await api.toggleCarrera(c.id)
      toast.success(c.activo ? 'Carrera desactivada' : 'Carrera activada')
      cargar()
    } catch {
      toast.error('Error al cambiar estado')
    }
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta carrera?')) return
    try {
      await api.eliminarCarrera(id)
      toast.success('Carrera eliminada')
      cargar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Carreras</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Gestiona las carreras universitarias del sistema
          </p>
        </div>
        <Button onClick={abrirCrear} className="h-10 rounded-xl px-5">
          + Nueva carrera
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[rgba(17,24,39,0.03)] text-xs uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {carreras.map((c) => (
                <tr key={c.id} className="border-t border-[rgba(17,24,39,0.06)]">
                  <td className="px-4 py-3 font-medium">{c.nombre}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      c.activo
                        ? 'bg-[rgba(22,162,73,0.12)] text-[rgb(22,162,73)]'
                        : 'bg-[rgba(239,68,68,0.12)] text-[rgb(239,68,68)]'
                    }`}>
                      {c.activo ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => abrirEditar(c)}>
                        Editar
                      </Button>
                      <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => toggleActivo(c)}>
                        {c.activo ? 'Desactivar' : 'Activar'}
                      </Button>
                      <Button variant="danger" className="h-8 px-3 text-xs" onClick={() => eliminar(c.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && carreras.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-sm text-[var(--color-text-muted)]">
                    No hay carreras registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[var(--color-surface)] p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">
              {editando ? 'Editar carrera' : 'Nueva carrera'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Nombre de la carrera</label>
                <Input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Ingeniería de Software"
                  onKeyDown={(e) => e.key === 'Enter' && guardar()}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>
                  Cancelar
                </Button>
                <Button onClick={guardar} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
