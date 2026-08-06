import { api } from '../lib/apiClient'
import type { Equipo } from '../types'

export const equiposApi = {
  listByCliente: (clienteId: number) =>
    api.get<Equipo[]>(`/api/v1/clientes/${clienteId}/equipos`),
  get: (id: number) => api.get<Equipo>(`/api/v1/equipos/${id}`),
  create: (clienteId: number, data: Record<string, unknown>) =>
    api.post<Equipo>(`/api/v1/clientes/${clienteId}/equipos`, data),
  update: (id: number, data: Record<string, unknown>) =>
    api.put<Equipo>(`/api/v1/equipos/${id}`, data),
  remove: (id: number) => api.delete<void>(`/api/v1/equipos/${id}`),
}
