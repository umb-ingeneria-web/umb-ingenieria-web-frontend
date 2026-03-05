import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

type Props = {
  roles: string[]
  redirectTo?: string
}

export default function RequireRole({ roles, redirectTo = '/app/dashboard' }: Props) {
  const activeRole = useAppSelector((s) => s.auth.activeRole)

  if (!activeRole || !roles.includes(activeRole)) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}
