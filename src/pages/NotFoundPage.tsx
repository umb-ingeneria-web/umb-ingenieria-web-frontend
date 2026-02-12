import { Link } from 'react-router-dom'

import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-start justify-center gap-4">
      <div>
        <h1 className="text-xl font-semibold">Página no encontrada</h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          La ruta que intentas abrir no existe.
        </p>
      </div>

      <Link to="/app/profile">
        <Button>Ir al inicio</Button>
      </Link>
    </div>
  )
}
