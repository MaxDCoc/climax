import { api } from '../lib/apiClient'
import type { Oportunidad, Servicio } from '../types'

export interface ServicioInput {
  tipo_servicio: Servicio['tipo_servicio']
  fecha_serv: string
  observaciones?: string | null
}

export const serviciosApi = {
  listByEquipo: (equipoId: number) =>
    api.get<Servicio[]>(`/api/v1/equipos/${equipoId}/servicios`),
  get: (id: number) => api.get<Servicio>(`/api/v1/servicios/${id}`),
  create: (equipoId: number, data: ServicioInput) =>
    api.post<Servicio>(`/api/v1/equipos/${equipoId}/servicios`, data),
  update: (id: number, data: ServicioInput) =>
    api.put<Servicio>(`/api/v1/servicios/${id}`, data),
  remove: (id: number) => api.delete<void>(`/api/v1/servicios/${id}`),
  oportunidades: (dias = 30) =>
    api.get<Oportunidad[]>(`/api/v1/servicios/oportunidades?dias=${dias}`),
}
