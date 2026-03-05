import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import * as materiasApi from '../api/materiasApi'
import * as carrerasApi from '../api/carrerasApi'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function MateriasPage() {
  const [materias, setMaterias] = useState<materiasApi.MateriaResponse[]>([])
  const [carreras, setCarreras] = useState<carrerasApi.CarreraResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState<materiasApi.MateriaResponse | null>(null)
  const [form, setForm] = useState({ codigo: '', nombre: '', creditos: 1, carreraIds: [] as string[] })
  const [saving, setSaving] = useState(false)

  async function cargar() {
    setLoading(true)
    try {
      const [m, c] = await Promise.all([materiasApi.listarMaterias(), carrerasApi.listarCarreras()])
      setMaterias(m)
      setCarreras(c)
    } catch {
      toast.error('Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  function abrirCrear() {
    setEditando(null)
    setForm({ codigo: '', nombre: '', creditos: 1, carreraIds: [] })
    setModalOpen(true)
  }

  function abrirEditar(m: materiasApi.MateriaResponse) {
    setEditando(m)
    setForm({ codigo: m.codigo, nombre: m.nombre, creditos: m.creditos, carreraIds: m.carreraIds })
    setModalOpen(true)
  }

  async function guardar() {
    if (!form.codigo.trim() || !form.nombre.trim()) return toast.error('Código y nombre son obligatorios')
    if (form.creditos < 1) return toast.error('Los créditos deben ser un entero positivo')
    setSaving(true)
    try {
      if (editando) {
        await materiasApi.actualizarMateria(editando.id, form)
        toast.success('Materia actualizada')
      } else {
        await materiasApi.crearMateria(form)
        toast.success('Materia creada')
      }
      setModalOpen(false)
      cargar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta materia?')) return
    try {
      await materiasApi.eliminarMateria(id)
      toast.success('Materia eliminada')
      cargar()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al eliminar')
    }
  }

  function toggleCarreraId(id: string) {
    setForm((prev) => ({
      ...prev,
      carreraIds: prev.carreraIds.includes(id)
        ? prev.carreraIds.filter((c) => c !== id)
        : [...prev.carreraIds, id],
    }))
  }

  function getNombresCarreras(ids: string[]) {
    return ids.map((id) => carreras.find((c) => c.id === id)?.nombre ?? id).join(', ')
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Materias</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Gestiona el catálogo de materias y sus asociaciones a carreras
          </p>
        </div>
        <Button onClick={abrirCrear} className="h-10 rounded-xl px-5">
          + Nueva materia
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] shadow-sm">
        <div className="overflow-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-[rgba(17,24,39,0.03)] text-xs uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3 text-center">Créditos</th>
                <th className="px-4 py-3">Carreras</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((m) => (
                <tr key={m.id} className="border-t border-[rgba(17,24,39,0.06)]">
                  <td className="px-4 py-3 font-mono font-semibold text-[var(--color-primary)]">{m.codigo}</td>
                  <td className="px-4 py-3 font-medium">{m.nombre}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-[rgba(152,31,28,0.08)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
                      {m.creditos} cr.
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">
                    {m.carreraIds.length > 0 ? getNombresCarreras(m.carreraIds) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" className="h-8 px-3 text-xs" onClick={() => abrirEditar(m)}>
                        Editar
                      </Button>
                      <Button variant="danger" className="h-8 px-3 text-xs" onClick={() => eliminar(m.id)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && materias.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-sm text-[var(--color-text-muted)]">
                    No hay materias registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[var(--color-surface)] p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">
              {editando ? 'Editar materia' : 'Nueva materia'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Código único</label>
                  <Input
                    value={form.codigo}
                    onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value.toUpperCase() }))}
                    placeholder="Ej: MAT101"
                    disabled={!!editando}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Créditos</label>
                  <Input
                    type="number"
                    min={1}
                    value={form.creditos}
                    onChange={(e) => setForm((f) => ({ ...f, creditos: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Nombre de la materia</label>
                <Input
                  value={form.nombre}
                  onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                  placeholder="Ej: Cálculo Diferencial"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Asociar a carreras</label>
                <div className="max-h-40 overflow-y-auto space-y-1 rounded-xl border border-[var(--input-border)] p-3">
                  {carreras.map((c) => (
                    <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={form.carreraIds.includes(c.id)}
                        onChange={() => toggleCarreraId(c.id)}
                        className="h-4 w-4 rounded"
                      />
                      {c.nombre}
                    </label>
                  ))}
                  {carreras.length === 0 && (
                    <p className="text-xs text-[var(--color-text-muted)]">Sin carreras disponibles</p>
                  )}
                </div>
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
