import { apiRequest } from './http'

export type CarreraResponse = {
  id: string
  nombre: string
  activo: boolean
}

export type CarreraRequest = {
  nombre: string
}

export function listarCarreras() {
  return apiRequest<CarreraResponse[]>('/api/v1/carreras')
}

export function listarCarrerasActivas() {
  return apiRequest<CarreraResponse[]>('/api/v1/carreras/activas')
}

export function crearCarrera(data: CarreraRequest) {
  return apiRequest<CarreraResponse>('/api/v1/carreras', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function actualizarCarrera(id: string, data: CarreraRequest) {
  return apiRequest<CarreraResponse>(`/api/v1/carreras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function toggleCarrera(id: string) {
  return apiRequest<{ message: string }>(`/api/v1/carreras/${id}/toggle`, {
    method: 'PATCH',
  })
}

export function eliminarCarrera(id: string) {
  return apiRequest<{ message: string }>(`/api/v1/carreras/${id}`, {
    method: 'DELETE',
  })
}
