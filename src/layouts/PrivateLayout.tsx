import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState, type ReactNode, type SVGProps } from 'react'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loggedOut, loadSession, switchActiveRole } from '../features/auth/authSlice'
import Select from '../components/ui/Select'
import Switch from '../components/ui/Switch'
import { useTheme } from '../theme/useTheme'
import {
  BellIcon,
  ChevronDownIcon,
  DashboardIcon,
} from '../components/ui/Icons'
import { UserIcon } from '../components/icons/Icons.component'

export default function PrivateLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { isDark, toggle } = useTheme()

  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const user = useAppSelector((s) => s.auth.user)
  const activeRole = useAppSelector((s) => s.auth.activeRole)
  const loading = useAppSelector((s) => s.auth.loading)

  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const prevPathnameRef = useRef(location.pathname)

  const canSeeAdmin = activeRole === 'ADMIN'
  const canSeeGestor = activeRole === 'ADMIN' || activeRole === 'GESTOR'
  const isEstudiante = activeRole === 'ESTUDIANTE'

  useEffect(() => {
    if (accessToken && !user && !loading) {
      dispatch(loadSession())
    }
  }, [accessToken, dispatch, loading, user])

  useEffect(() => {
    if (!userMenuOpen) return

    function onMouseDown(e: MouseEvent) {
      const el = userMenuRef.current
      if (!el) return
      if (e.target instanceof Node && !el.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setUserMenuOpen(false)
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [userMenuOpen])

  useEffect(() => {
    if (prevPathnameRef.current === location.pathname) return
    prevPathnameRef.current = location.pathname

    const t = window.setTimeout(() => {
      setSidebarOpen(false)
      setUserMenuOpen(false)
    }, 0)

    return () => window.clearTimeout(t)
  }, [location.pathname])

  useEffect(() => {
    if (!sidebarOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSidebarOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [sidebarOpen])

  if (!accessToken) {
    return <Navigate to="/login" replace />
  }

  const displayName = user?.fullName || user?.email || 'Usuario'
  const roleLabelMap: Record<string, string> = {
    ADMIN: 'Administrador',
    GESTOR: 'Gestor',
    ESTUDIANTE: 'Estudiante',
    USER: 'Usuario',
  }
  const roleBadge = roleLabelMap[activeRole ?? ''] ?? activeRole ?? 'Usuario'

  const sectionTitle = getSectionTitle(location.pathname)

  const menuItems: Array<{
    to: string
    label: string
    icon: ReactNode
    show: boolean
  }> = [
      { to: '/app/estudiante/home', label: 'Inicio', icon: <HomeIcon className="h-4 w-4" />, show: isEstudiante },
      { to: '/app/estudiante/carrera', label: 'Mi carrera', icon: <GraduationIcon className="h-4 w-4" />, show: isEstudiante },
      { to: '/app/estudiante/historial', label: 'Historial PDF', icon: <FileIcon className="h-4 w-4" />, show: isEstudiante },
      { to: '/app/estudiante/oferta', label: 'Oferta académica', icon: <BookIcon className="h-4 w-4" />, show: isEstudiante },
      { to: '/app/estudiante/preregistro', label: 'Mi pre-registro', icon: <ListIcon className="h-4 w-4" />, show: isEstudiante },
      { to: '/app/dashboard', label: 'Dashboard', icon: <DashboardIcon className="h-4 w-4" />, show: !isEstudiante },
      { to: '/app/gestor/carreras', label: 'Carreras', icon: <GraduationIcon className="h-4 w-4" />, show: canSeeGestor },
      { to: '/app/gestor/materias', label: 'Materias', icon: <BookIcon className="h-4 w-4" />, show: canSeeGestor },
      { to: '/app/admin/periodo', label: 'Periodo', icon: <CalendarIcon className="h-4 w-4" />, show: canSeeAdmin },
      { to: '/app/admin/users', label: 'Usuarios', icon: <UserIcon className="h-4 w-4" />, show: canSeeAdmin },
    ]

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
      <div className="flex min-h-screen">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)] transition-transform md:static md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:transform-none`}
        >
          <div className="flex h-full flex-col p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white">
                  U
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">UMB Planifica</div>
                </div>
              </div>

              <button
                type="button"
                className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(17,24,39,0.10)] text-[var(--color-text-muted)] hover:bg-[rgba(17,24,39,0.04)]"
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar menú"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              <span className="inline-flex items-center rounded-full bg-[rgb(22,162,73)] px-3 py-1 text-xs font-medium text-white">
                {roleBadge}
              </span>
            </div>

            <nav className="mt-4 flex flex-col gap-1">
              {menuItems
                .filter((i) => i.show)
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${isActive
                        ? 'bg-[var(--sidebar-active-bg)] text-[var(--color-primary)]'
                        : 'text-[var(--color-text-muted)] hover:bg-[rgba(17,24,39,0.04)] hover:text-[var(--color-text)]'
                      }`
                    }
                  >
                    <span className="opacity-90">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
            </nav>

            <div className="mt-auto space-y-3">
              <div ref={userMenuRef} className="relative cursor-pointer">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl bg-[rgba(17,24,39,0.04)] p-3 hover:bg-[rgba(17,24,39,0.06)] cursor-pointer"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(152,31,28,0.12)] text-sm font-semibold text-[var(--color-primary)]">
                      {displayName.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0 text-left">
                      <div className="truncate text-sm font-semibold">{displayName}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{roleBadge}</div>
                    </div>
                  </div>

                  <ChevronDownIcon
                    className={`h-4 w-4 text-[var(--color-text-muted)] transition-transform ${userMenuOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-2xl border border-[rgba(17,24,39,0.10)] bg-[var(--color-surface)] shadow-lg cursor-default"
                  >

                                      <NavLink
                    key={'/app/profile'}
                    to={'/app/profile'}
                    onClick={() => {
                      setUserMenuOpen(false)
                      setSidebarOpen(false)
                    }}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors mx-4 mt-3 ${isActive
                        ? 'bg-[var(--sidebar-active-bg)] text-[var(--color-primary)]'
                        : 'text-[var(--color-text-muted)] hover:bg-[rgba(17,24,39,0.04)] hover:text-[var(--color-text)]'
                      }`
                    }
                  >
                    <span className="opacity-90"><UserIcon className="h-4 w-4" /></span>
                    <span className="font-medium">Mi perfil</span>
                  </NavLink>

                    <div className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[var(--color-text)]">Tema</div>
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {isDark ? 'Modo oscuro' : 'Modo claro'}
                        </div>
                      </div>

                      <Switch
                        checked={isDark}
                        onChange={(next) => {
                          if (next !== isDark) toggle()
                        }}
                      />
                    </div>

                    {user?.roles && user.roles.length > 1 && (
                      <div className="flex items-center justify-between px-4 py-3 ">
                        <div className="mb-1 text-xs font-medium text-[var(--color-text-muted)]">
                          Cambiar rol
                        </div>
                        <Select
                          className='max-w-[120px] max-h-[32px] p-0'
                          value={activeRole ?? ''}
                          onChange={(e) => dispatch(switchActiveRole(e.target.value))}
                        >
                          {user.roles.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </Select>
                      </div>
                    )}

                    <div className="h-px bg-[rgba(17,24,39,0.10)]" />

                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--color-danger)] hover:bg-[rgba(17,24,39,0.04)] cursor-pointer"
                      onClick={() => {
                        setUserMenuOpen(false)
                        dispatch(loggedOut())
                        navigate('/login', { replace: true })
                      }}
                    >
                      <LogoutIcon className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>


            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 md:ml-0">
          <div className="sticky top-0 z-10 border-b border-[rgba(17,24,39,0.08)] bg-[var(--color-surface)]">
            <div className="flex items-center justify-between px-4 py-4 md:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(17,24,39,0.10)] text-[var(--color-text-muted)] hover:bg-[rgba(17,24,39,0.04)]"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Abrir menú"
                >
                  <MenuIcon className="h-4 w-4" />
                </button>

                <div className="truncate text-sm font-semibold">{sectionTitle}</div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(17,24,39,0.10)] text-[var(--color-text-muted)] hover:bg-[rgba(17,24,39,0.04)]"
                  onClick={() => navigate('/app/dashboard')}
                  aria-label="Notificaciones"
                >
                  <BellIcon className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-6 md:py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function getSectionTitle(pathname: string) {
  if (pathname.startsWith('/app/estudiante/home')) return 'Inicio'
  if (pathname.startsWith('/app/estudiante/carrera')) return 'Selección de carrera'
  if (pathname.startsWith('/app/estudiante/historial')) return 'Historial académico'
  if (pathname.startsWith('/app/estudiante/oferta')) return 'Oferta académica'
  if (pathname.startsWith('/app/estudiante/preregistro')) return 'Mi pre-registro'
  if (pathname.startsWith('/app/dashboard')) return 'Dashboard'
  if (pathname.startsWith('/app/admin/users')) return 'Usuarios'
  if (pathname.startsWith('/app/admin/periodo')) return 'Periodo de pre-registro'
  if (pathname.startsWith('/app/gestor/carreras')) return 'Carreras'
  if (pathname.startsWith('/app/gestor/materias')) return 'Materias'
  if (pathname.startsWith('/app/profile')) return 'Perfil'
  return 'Panel'
}

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v11h14V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GraduationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M22 9L12 5 2 9l10 4 10-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6 11v5c0 2.21 2.69 4 6 4s6-1.79 6-4v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 9v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function BookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  )
}

function FileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M10 17H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 12H10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}
