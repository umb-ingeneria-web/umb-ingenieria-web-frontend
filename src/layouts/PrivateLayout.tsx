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
  const roleBadge = activeRole === 'ADMIN' ? 'Administrador' : activeRole ?? 'Usuario'

  const sectionTitle = getSectionTitle(location.pathname)

  const menuItems: Array<{
    to: string
    label: string
    icon: ReactNode
    adminOnly?: boolean
  }> = [
      { to: '/app/dashboard', label: 'Dashboard', icon: <DashboardIcon className="h-4 w-4" /> },
      { to: '/app/admin/users', label: 'Usuarios', icon: <UserIcon className="h-4 w-4" />, adminOnly: true },
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
                .filter((i) => (i.adminOnly ? canSeeAdmin : true))
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
  if (pathname.startsWith('/app/dashboard')) return 'Dashboard'
  if (pathname.startsWith('/app/admin/users')) return 'Usuarios'
  if (pathname.startsWith('/app/pre-registro')) return 'Pre-registro'
  if (pathname.startsWith('/app/historial')) return 'Historial académico'
  if (pathname.startsWith('/app/materias')) return 'Materias'
  if (pathname.startsWith('/app/horarios')) return 'Horarios'
  if (pathname.startsWith('/app/demanda')) return 'Analítica de demanda'
  if (pathname.startsWith('/app/settings')) return 'Configuración'
  if (pathname.startsWith('/app/profile')) return 'Perfil'
  return 'Dashboard'
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
