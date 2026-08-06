import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clientesApi } from '../api/clientes'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ApiError } from '../lib/apiClient'

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
        <LoadingState />
      </Layout>
    )
  }

  return (
    <Layout>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {editando ? 'Editar cliente' : 'Nuevo cliente'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <input
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Teléfono"
          required
          inputMode="tel"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <input
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Dirección (opcional)"
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        />
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones (opcional)"
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
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
