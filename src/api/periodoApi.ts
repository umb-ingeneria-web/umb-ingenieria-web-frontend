import { apiRequest } from './http'

export type PeriodoResponse = {
  id: string
  fechaInicio: string
  fechaFin: string
  activo: boolean
  estado: 'NO_INICIADO' | 'ACTIVO' | 'FINALIZADO'
}

export type PeriodoRequest = {
  fechaInicio: string
  fechaFin: string
}

export function obtenerPeriodo() {
  return apiRequest<PeriodoResponse | null>('/api/v1/periodo')
}

export function guardarPeriodo(data: PeriodoRequest) {
  return apiRequest<PeriodoResponse>('/api/v1/periodo', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
