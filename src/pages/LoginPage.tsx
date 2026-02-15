import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loginUser } from '../features/auth/authSlice'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import AuthLayout from '../components/auth/Auth.layout'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from '../components/icons/Icons.component'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loading = useAppSelector((s) => s.auth.loading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      await dispatch(loginUser({ email, password })).unwrap()
      toast.success('Bienvenido')
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No fue posible iniciar sesión')
    }
  }

  return (
    <AuthLayout>
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <span className="text-lg">←</span>
              Volver al inicio
            </Link> */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white font-semibold">
              U
            </div>
            <div className="text-lg font-semibold">UMB Planifica</div>
          </div>

          <div className="mt-8">
            <h1 className="text-3xl font-semibold">Inicia sesión</h1>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Accede a tu panel de control
            </p>
          </div>

          <div className="mt-3 text-sm text-[var(--color-text-muted)]">
            ¿No tienes cuenta?{' '}
            <Link className="font-medium text-[var(--color-primary)]" to="/register">
              Regístrate
            </Link>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium">Correo electrónico</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--color-text-muted)]">
                  <MailIcon className="h-5 w-5" />
                </div>
                <Input
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Contraseña</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--color-text-muted)]">
                  <LockIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <button
                  type="button"
                  className="text-sm text-[var(--color-primary)] hover:underline"
                  onClick={() => toast.info('Funcionalidad pendiente')}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl py-3"
              disabled={loading}
            >
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}


