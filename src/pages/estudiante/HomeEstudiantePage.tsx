import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as periodoApi from '../../api/periodoApi'
import * as estudianteApi from '../../api/estudianteApi'
import { useAppSelector } from '../../app/hooks'

function PeriodoBanner({ estado }: { estado: string | null }) {
  if (!estado || estado === 'NO_INICIADO') {
    return (
      <div className="rounded-2xl border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)] p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⏰</span>
          <div>
            <p className="font-medium text-[rgb(180,120,0)]">El pre-registro aún no comienza</p>
            <p className="text-sm text-[rgb(180,120,0)] opacity-80">
              Espera a que la institución habilite el período de pre-registro.
            </p>
          </div>
        </div>
      </div>
    )
  }
  if (estado === 'FINALIZADO') {
    return (
      <div className="rounded-2xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-medium text-[rgb(200,30,30)]">El periodo de pre-registro ha finalizado</p>
            <p className="text-sm text-[rgb(200,30,30)] opacity-80">Ya no es posible realizar cambios.</p>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="rounded-2xl border border-[rgba(22,162,73,0.3)] bg-[rgba(22,162,73,0.08)] p-4">
      <div className="flex items-center gap-3">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-medium text-[rgb(15,120,50)]">El pre-registro está abierto</p>
          <p className="text-sm text-[rgb(15,120,50)] opacity-80">Puedes seleccionar tus materias ahora.</p>
        </div>
      </div>
    </div>
  )
}

export default function HomeEstudiantePage() {
  const user = useAppSelector((s) => s.auth.user)
  const [periodo, setPeriodo] = useState<periodoApi.PeriodoResponse | null>(null)
  const [carrera, setCarrera] = useState<{ nombre: string } | null>(null)
  const [preregistroCount, setPreregistroCount] = useState(0)

  useEffect(() => {
    async function cargar() {
      try {
        const [p, c, pr] = await Promise.allSettled([
          periodoApi.obtenerPeriodo(),
          estudianteApi.obtenerCarreraEstudiante(),
          estudianteApi.obtenerPreregistro(),
        ])
        if (p.status === 'fulfilled') setPeriodo(p.value)
        if (c.status === 'fulfilled' && c.value) setCarrera(c.value)
        if (pr.status === 'fulfilled') setPreregistroCount(pr.value.length)
      } catch { /* silent */ }
    }
    cargar()
  }, [])

  const displayName = user?.fullName || user?.email || 'Estudiante'
  const estado = periodo?.estado ?? null

  const steps = [
    {
      num: 1,
      title: 'Selecciona tu carrera',
      desc: carrera ? `Carrera actual: ${carrera.nombre}` : 'Define la carrera que cursas actualmente',
      to: '/app/estudiante/carrera',
      done: !!carrera,
      icon: '🎓',
    },
    {
      num: 2,
      title: 'Carga tu historial académico',
      desc: 'Sube el PDF de notas para que el sistema identifique las materias que ya aprobaste',
      to: '/app/estudiante/historial',
      done: false,
      icon: '📄',
    },
    {
      num: 3,
      title: 'Selecciona tus materias',
      desc: preregistroCount > 0 ? `${preregistroCount} materia(s) en tu pre-registro` : 'Elige las materias y tu jornada preferida',
      to: '/app/estudiante/oferta',
      done: preregistroCount > 0,
      icon: '📚',
    },
    {
      num: 4,
      title: 'Revisa tu pre-registro',
      desc: 'Confirma y revisa tu selección final',
      to: '/app/estudiante/preregistro',
      done: false,
      icon: '✔️',
    },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Bienvenido, {displayName.split(' ')[0]}</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Completa los pasos para finalizar tu pre-registro
        </p>
      </div>

      <PeriodoBanner estado={estado} />

      <div className="space-y-3">
        {steps.map((step) => (
          <Link
            key={step.num}
            to={step.to}
            className="flex items-center gap-4 rounded-2xl border border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] p-4 shadow-sm transition-colors hover:bg-[rgba(17,24,39,0.02)]"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
              step.done
                ? 'bg-[rgba(22,162,73,0.12)]'
                : 'bg-[rgba(152,31,28,0.08)]'
            }`}>
              {step.done ? '✅' : step.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">Paso {step.num}</span>
                {step.done && (
                  <span className="rounded-full bg-[rgba(22,162,73,0.12)] px-2 py-0.5 text-xs font-medium text-[rgb(22,162,73)]">
                    Completado
                  </span>
                )}
              </div>
              <p className="font-medium">{step.title}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{step.desc}</p>
            </div>
            <svg className="h-5 w-5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
