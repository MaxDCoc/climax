import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { serviciosApi } from '../api/servicios'
import { ApiError } from '../lib/apiClient'
import type { TipoServicio } from '../types'

const TIPO_LABEL: Record<TipoServicio, string> = {
  INSTALACION: 'Instalación',
  SERVICE: 'Service',
  REPARACION: 'Reparación',
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-3 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'

export default function ServicioForm() {
  const { equipoId, id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()

  const [tipoServicio, setTipoServicio] = useState<TipoServicio>('SERVICE')
  const [fechaServ, setFechaServ] = useState(() => new Date().toISOString().slice(0, 10))
  const [observaciones, setObservaciones] = useState('')
  const [equipoIdDestino, setEquipoIdDestino] = useState<number | null>(
    equipoId ? Number(equipoId) : null,
  )
  const [loading, setLoading] = useState(editando)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!editando) return
    serviciosApi
      .get(Number(id))
      .then((servicio) => {
        setTipoServicio(servicio.tipo_servicio)
        setFechaServ(servicio.fecha_serv)
        setObservaciones(servicio.observaciones ?? '')
        setEquipoIdDestino(servicio.equipo_id)
      })
      .catch(() => setError('No se pudo cargar el servicio'))
      .finally(() => setLoading(false))
  }, [editando, id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      tipo_servicio: tipoServicio,
      fecha_serv: fechaServ,
      observaciones: observaciones || null,
    }

    try {
      if (editando) {
        const actualizado = await serviciosApi.update(Number(id), payload)
        navigate(`/equipos/${actualizado.equipo_id}`)
      } else {
        const nuevo = await serviciosApi.create(equipoIdDestino as number, payload)
        navigate(`/equipos/${nuevo.equipo_id}`)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar el servicio')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    )
  }

  return (
    <Layout>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {editando ? 'Editar servicio' : 'Registrar servicio'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          value={tipoServicio}
          onChange={(e) => setTipoServicio(e.target.value as TipoServicio)}
          className={inputClass}
        >
          {(Object.keys(TIPO_LABEL) as TipoServicio[]).map((t) => (
            <option key={t} value={t}>
              {TIPO_LABEL[t]}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={fechaServ}
          onChange={(e) => setFechaServ(e.target.value)}
          required
          className={inputClass}
        />

        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones (opcional)"
          rows={3}
          className={inputClass}
        />

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 py-3 text-base font-medium text-white active:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </Layout>
  )
}
