import { apiRequest } from './http'

export type MateriaDemandasDto = {
  materiaId: string
  codigo: string
  nombre: string
  totalSolicitudes: number
  solicitudesDiurna: number
  solicitudesNocturna: number
  solicitudesIndiferente: number
  creditos: number
}

export type DashboardData = {
  totalEstudiantes: number
  totalMateriasDemandadas: number
  topMaterias: MateriaDemandasDto[]
  totalDiurna: number
  totalNocturna: number
  totalIndiferente: number
}

export function obtenerDashboard() {
  return apiRequest<DashboardData>('/api/v1/dashboard')
}

export async function exportarExcel(accessToken: string | null): Promise<void> {
  const headers: Record<string, string> = {}
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`
  const res = await fetch('/api/v1/dashboard/exportar', { headers })
  if (!res.ok) throw new Error('Error al exportar')
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'demanda_academica.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
