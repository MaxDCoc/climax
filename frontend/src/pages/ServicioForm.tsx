import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { serviciosApi } from '../api/servicios'
import { ApiError } from '../lib/apiClient'
import type { TipoServicio } from '../types'
import { btnPrimary, heading, input, label as labelClass } from '../lib/ui'

const TIPO_LABEL: Record<TipoServicio, string> = {
  INSTALACION: 'Instalación',
  SERVICE: 'Service',
  REPARACION: 'Reparación',
}

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
        <LoadingState rows={1} />
      </Layout>
    )
  }

  return (
    <Layout>
      <h2 className={`mb-4 text-lg ${heading}`}>
        {editando ? 'Editar servicio' : 'Registrar servicio'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Tipo de servicio</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(TIPO_LABEL) as TipoServicio[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipoServicio(t)}
                className={`rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition ${
                  tipoServicio === t
                    ? 'border-ice-500/50 bg-ice-500/10 text-ice-300'
                    : 'border-white/10 bg-navy-900/40 text-slate-400'
                }`}
              >
                {TIPO_LABEL[t]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Fecha</label>
          <input
            type="date"
            value={fechaServ}
            onChange={(e) => setFechaServ(e.target.value)}
            required
            className={input}
          />
        </div>

        <div>
          <label className={labelClass}>Observaciones (opcional)</label>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            className={input}
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={saving} className={`w-full ${btnPrimary}`}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </Layout>
  )
}
