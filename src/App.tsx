import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { useAppDispatch, useAppSelector } from './app/hooks'
import { loadSession } from './features/auth/authSlice'

import RequireAuth from './routes/RequireAuth'
import RequireAdmin from './routes/RequireAdmin'

import PrivateLayout from './layouts/PrivateLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import AdminUsersPage from './pages/AdminUsersPage'
import NotFoundPage from './pages/NotFoundPage'

function AppBootstrap() {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((s) => s.auth.accessToken)
  const user = useAppSelector((s) => s.auth.user)
  const loading = useAppSelector((s) => s.auth.loading)

  useEffect(() => {
    if (accessToken && !user && !loading) {
      dispatch(loadSession())
    }
  }, [accessToken, dispatch, loading, user])

  return null
}

export default function App() {
  return (
    <>
      <AppBootstrap />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/app/dashboard" replace />}
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/app" element={<PrivateLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />

              <Route element={<RequireAdmin />}>
                <Route path="admin/users" element={<AdminUsersPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}
