import { Navigate, Outlet } from 'react-router-dom'

import { useAppSelector } from '../app/hooks'

export default function RequireAdmin() {
  const activeRole = useAppSelector((s) => s.auth.activeRole)

  if (activeRole !== 'ADMIN') {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}
