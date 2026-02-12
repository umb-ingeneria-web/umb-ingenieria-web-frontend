import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAppSelector } from '../app/hooks'

export default function RequireAuth() {
  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const location = useLocation()

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
