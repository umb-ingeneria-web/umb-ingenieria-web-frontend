import { apiRequest } from './http'
import type { CarreraResponse } from './carrerasApi'
import type { MateriaResponse } from './materiasApi'

export type HistorialPdfResponse = {
  materiasDetectadas: MateriaResponse[]
  total: number
}

export type PreregistroItem = {
  id: string
  materiaId: string
  codigoMateria: string
  nombreMateria: string
  creditos: number
  jornada: 'DIURNA' | 'NOCTURNA' | 'INDIFERENTE'
}

export function obtenerCarreraEstudiante() {
  return apiRequest<CarreraResponse | null>('/api/v1/estudiante/carrera')
}

export function seleccionarCarrera(carreraId: string) {
  return apiRequest<CarreraResponse>('/api/v1/estudiante/carrera', {
    method: 'POST',
    body: JSON.stringify({ carreraId }),
  })
}

export async function parsearHistorialPdf(file: File): Promise<HistorialPdfResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return apiRequest<HistorialPdfResponse>('/api/v1/estudiante/historial/parsear', {
    method: 'POST',
    body: formData,
    headers: {},
  })
}

export function confirmarHistorial(materiaIds: string[]) {
  return apiRequest<{ message: string }>('/api/v1/estudiante/historial/confirmar', {
    method: 'POST',
    body: JSON.stringify({ materiaIds }),
  })
}

export function obtenerOferta() {
  return apiRequest<MateriaResponse[]>('/api/v1/estudiante/oferta')
}

export function obtenerPreregistro() {
  return apiRequest<PreregistroItem[]>('/api/v1/estudiante/preregistro')
}

export function agregarPreregistro(materiaId: string, jornada: string) {
  return apiRequest<PreregistroItem>('/api/v1/estudiante/preregistro', {
    method: 'POST',
    body: JSON.stringify({ materiaId, jornada }),
  })
}

export function eliminarPreregistro(materiaId: string) {
  return apiRequest<{ message: string }>(`/api/v1/estudiante/preregistro/${materiaId}`, {
    method: 'DELETE',
  })
}
