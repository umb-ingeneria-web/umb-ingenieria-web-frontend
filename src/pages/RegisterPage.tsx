import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { registerUser } from '../features/auth/authSlice'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import AuthLayout from '../components/auth/Auth.layout'
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, PhoneIcon, UserIcon } from '../components/icons/Icons.component'

export default function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const loading = useAppSelector((s) => s.auth.loading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  // const [accountType, setAccountType] = useState<'SELLER' | 'COMPANY'>('SELLER')


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!acceptedTerms) {
      toast.error('Debes aceptar los términos para continuar')
      return
    }

    try {
      await dispatch(
        registerUser({
          email,
          password,
          phoneCountryCode: '57',
          phoneNumber: phone,
          fullName: fullName ? fullName : undefined,
        }),
      ).unwrap()

      toast.success('Registro exitoso. Ahora puedes iniciar sesión.')
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No fue posible registrarse')
    }
  }

  return (
    <AuthLayout>
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white font-semibold">
              H
            </div>
            <div className="text-lg font-semibold">Harold Software</div>
          </div>

          <div className="mt-10">
            <h1 className="text-4xl font-semibold">Crea tu cuenta</h1>
            <p className="mt-3 text-base text-[var(--color-text-muted)]">
              Empieza a vender y ganar comisiones
            </p>
          </div>

          <div className="mt-6 text-sm text-[var(--color-text-muted)]">
            ¿Ya tienes cuenta?{' '}
            <Link className="font-medium text-[var(--color-primary)]" to="/login">
              Inicia sesión
            </Link>
          </div>

          {/* <div className="mt-8 rounded-xl bg-[rgba(17,24,39,0.04)] p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setAccountType('SELLER')}
                className={
                  accountType === 'SELLER'
                    ? 'flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[var(--color-text)] shadow-sm'
                    : 'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)]'
                }
              >
                <UserIcon className="h-4 w-4" />
                Vendedor
              </button>

              <button
                type="button"
                onClick={() => setAccountType('COMPANY')}
                className={
                  accountType === 'COMPANY'
                    ? 'flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[var(--color-text)] shadow-sm'
                    : 'flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-muted)]'
                }
              >
                <BuildingIcon className="h-4 w-4" />
                Empresa
              </button>
            </div>
          </div> */}

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium">Nombre completo</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--color-text-muted)]">
                  <UserIcon className="h-4 w-4" />
                </div>
                <Input
                  className="pl-8"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Pérez"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Teléfono</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--color-text-muted)]">
                  <PhoneIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                  className="pl-8"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="300 123 4567"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Correo electrónico</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--color-text-muted)]">
                  <MailIcon className="h-4 w-4" />
                </div>
                <Input
                  className="pl-8"
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
              <label className="mb-1 block text-sm font-medium">Contraseña</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--color-text-muted)]">
                  <LockIcon className="h-4 w-4" />
                </div>
                <Input
                  className="pl-8 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-[var(--input-border)]"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <span>
                Acepto los{' '}
                <button
                  type="button"
                  className="text-[var(--color-primary)] hover:underline"
                  onClick={() => toast.info('Funcionalidad pendiente')}
                >
                  términos de servicio
                </button>{' '}
                y la{' '}
                <button
                  type="button"
                  className="text-[var(--color-primary)] hover:underline"
                  onClick={() => toast.info('Funcionalidad pendiente')}
                >
                  política de privacidad
                </button>
              </span>
            </label>

            <Button
              type="submit"
              className="w-full rounded-xl py-3"
              disabled={loading || !acceptedTerms}
            >
              Crear cuenta
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}
