import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { useAppDispatch, useAppSelector } from './app/hooks'
import { loadSession } from './features/auth/authSlice'

import RequireAuth from './routes/RequireAuth'
import RequireAdmin from './routes/RequireAdmin'
import RequireRole from './routes/RequireRole'

import PrivateLayout from './layouts/PrivateLayout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import AdminUsersPage from './pages/AdminUsersPage'
import CarrerasPage from './pages/CarrerasPage'
import MateriasPage from './pages/MateriasPage'
import PeriodoPage from './pages/PeriodoPage'
import HomeEstudiantePage from './pages/estudiante/HomeEstudiantePage'
import SeleccionCarreraPage from './pages/estudiante/SeleccionCarreraPage'
import HistorialPage from './pages/estudiante/HistorialPage'
import OfertaPage from './pages/estudiante/OfertaPage'
import MiPreregistroPage from './pages/estudiante/MiPreregistroPage'
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
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<RequireAuth />}>
            <Route path="/app" element={<PrivateLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />

              {/* Admin only */}
              <Route element={<RequireAdmin />}>
                <Route path="admin/users" element={<AdminUsersPage />} />
                <Route path="admin/periodo" element={<PeriodoPage />} />
              </Route>

              {/* Admin + Gestor */}
              <Route element={<RequireRole roles={['ADMIN', 'GESTOR']} />}>
                <Route path="gestor/carreras" element={<CarrerasPage />} />
                <Route path="gestor/materias" element={<MateriasPage />} />
              </Route>

              {/* Estudiante */}
              <Route element={<RequireRole roles={['ESTUDIANTE']} redirectTo="/app/dashboard" />}>
                <Route path="estudiante/home" element={<HomeEstudiantePage />} />
                <Route path="estudiante/carrera" element={<SeleccionCarreraPage />} />
                <Route path="estudiante/historial" element={<HistorialPage />} />
                <Route path="estudiante/oferta" element={<OfertaPage />} />
                <Route path="estudiante/preregistro" element={<MiPreregistroPage />} />
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
