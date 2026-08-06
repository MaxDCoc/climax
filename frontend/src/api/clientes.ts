import { api } from '../lib/apiClient'
import type { Cliente, ClienteInput } from '../types'

export const clientesApi = {
  list: () => api.get<Cliente[]>('/api/v1/clientes'),
  get: (id: number) => api.get<Cliente>(`/api/v1/clientes/${id}`),
  create: (data: ClienteInput) => api.post<Cliente>('/api/v1/clientes', data),
  update: (id: number, data: ClienteInput) =>
    api.put<Cliente>(`/api/v1/clientes/${id}`, data),
  remove: (id: number) => api.delete<void>(`/api/v1/clientes/${id}`),
}
