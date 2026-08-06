import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clientesApi } from '../api/clientes'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ApiError } from '../lib/apiClient'
import { btnPrimary, heading, input, label as labelClass } from '../lib/ui'

export default function ClienteForm() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [loading, setLoading] = useState(editando)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!editando) return
    clientesApi
      .get(Number(id))
      .then((cliente) => {
        setNombre(cliente.nombre)
        setTelefono(cliente.telefono)
        setDireccion(cliente.direccion ?? '')
        setObservaciones(cliente.observaciones ?? '')
      })
      .catch(() => setError('No se pudo cargar el cliente'))
      .finally(() => setLoading(false))
  }, [editando, id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = {
      nombre,
      telefono,
      direccion: direccion || null,
      observaciones: observaciones || null,
    }
    try {
      if (editando) {
        await clientesApi.update(Number(id), payload)
        navigate(`/clientes/${id}`)
      } else {
        const nuevo = await clientesApi.create(payload)
        navigate(`/clientes/${nuevo.id}`)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar el cliente')
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
      <h2 className={`mb-4 text-lg ${heading}`}>{editando ? 'Editar cliente' : 'Nuevo cliente'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required className={input} />
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            inputMode="tel"
            className={input}
          />
        </div>
        <div>
          <label className={labelClass}>Dirección (opcional)</label>
          <input value={direccion} onChange={(e) => setDireccion(e.target.value)} className={input} />
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
