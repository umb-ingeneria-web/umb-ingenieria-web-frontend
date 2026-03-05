import { apiRequest } from './http'

export type MateriaResponse = {
  id: string
  codigo: string
  nombre: string
  creditos: number
  carreraIds: string[]
}

export type MateriaRequest = {
  codigo: string
  nombre: string
  creditos: number
  carreraIds: string[]
}

export function listarMaterias() {
  return apiRequest<MateriaResponse[]>('/api/v1/materias')
}

export function listarMateriasPorCarrera(carreraId: string) {
  return apiRequest<MateriaResponse[]>(`/api/v1/materias/carrera/${carreraId}`)
}

export function crearMateria(data: MateriaRequest) {
  return apiRequest<MateriaResponse>('/api/v1/materias', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function actualizarMateria(id: string, data: MateriaRequest) {
  return apiRequest<MateriaResponse>(`/api/v1/materias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function eliminarMateria(id: string) {
  return apiRequest<{ message: string }>(`/api/v1/materias/${id}`, {
    method: 'DELETE',
  })
}
