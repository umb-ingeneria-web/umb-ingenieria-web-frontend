import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import * as api from '../../api/estudianteApi'
import type { MateriaResponse } from '../../api/materiasApi'
import Button from '../../components/ui/Button'

export default function HistorialPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [detectadas, setDetectadas] = useState<MateriaResponse[] | null>(null)
  const [seleccionadas, setSeleccionadas] = useState<string[]>([])
  const [parsing, setParsing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [confirmado, setConfirmado] = useState(false)

  async function parsear() {
    if (!file) return toast.error('Selecciona un archivo PDF')
    setParsing(true)
    try {
      const res = await api.parsearHistorialPdf(file)
      setDetectadas(res.materiasDetectadas)
      setSeleccionadas(res.materiasDetectadas.map((m) => m.id))
      toast.success(`Se detectaron ${res.total} materias aprobadas`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al procesar el PDF')
    } finally {
      setParsing(false)
    }
  }

  async function confirmar() {
    setConfirming(true)
    try {
      await api.confirmarHistorial(seleccionadas)
      setConfirmado(true)
      toast.success('Historial guardado correctamente')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al confirmar')
    } finally {
      setConfirming(false)
    }
  }

  function toggleMateria(id: string) {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  if (confirmado) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-semibold mb-2">Historial guardado</h2>
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          {seleccionadas.length} materias aprobadas registradas en el sistema.
        </p>
        <Button onClick={() => { setConfirmado(false); setDetectadas(null); setFile(null) }}>
          Cargar otro PDF
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Historial Académico</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Sube el PDF de notas de tu plataforma universitaria para detectar materias aprobadas
        </p>
      </div>

      {/* Upload */}
      <div className="rounded-2xl border-2 border-dashed border-[rgba(17,24,39,0.15)] bg-[var(--color-surface)] p-8">
        <div className="text-center">
          <div className="text-4xl mb-3">📄</div>
          <p className="text-sm font-medium mb-1">
            {file ? file.name : 'Arrastra tu PDF aquí o haz clic para seleccionar'}
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mb-4">
            Solo archivos .pdf del sistema universitario
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null)
              setDetectadas(null)
              setConfirmado(false)
            }}
          />
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => inputRef.current?.click()}>
              Seleccionar PDF
            </Button>
            <Button onClick={parsear} disabled={!file || parsing}>
              {parsing ? 'Procesando...' : 'Analizar PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {detectadas !== null && (
        <div className="rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-6 shadow-sm space-y-4">
          <div>
            <h2 className="font-semibold">
              Hemos detectado que ya aprobaste estas {detectadas.length} materias:
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Verifica la lista y desmarca las que no correspondan antes de confirmar.
            </p>
          </div>

          {detectadas.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              No se detectaron materias aprobadas en el documento. Asegúrate de usar el PDF correcto.
            </p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {detectadas.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-[rgba(17,24,39,0.08)] p-3 hover:bg-[rgba(17,24,39,0.02)]"
                >
                  <input
                    type="checkbox"
                    checked={seleccionadas.includes(m.id)}
                    onChange={() => toggleMateria(m.id)}
                    className="h-4 w-4 rounded"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-xs font-semibold text-[var(--color-primary)] mr-2">{m.codigo}</span>
                    <span className="text-sm">{m.nombre}</span>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">{m.creditos} cr.</span>
                </label>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-[rgba(17,24,39,0.06)]">
            <p className="text-sm text-[var(--color-text-muted)]">
              {seleccionadas.length} de {detectadas.length} seleccionadas
            </p>
            <Button onClick={confirmar} disabled={confirming}>
              {confirming ? 'Guardando...' : 'Confirmar y Guardar'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
