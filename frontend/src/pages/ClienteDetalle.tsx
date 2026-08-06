import { Link, useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { useApi } from '../hooks/useApi'
import { clientesApi } from '../api/clientes'
import { equiposApi } from '../api/equipos'
import { whatsappHref } from '../lib/whatsapp'

const TIPO_LABEL: Record<string, string> = {
  aire: 'Aire acondicionado',
  heladera: 'Heladera',
  lavarropas: 'Lavarropas',
}

export default function ClienteDetalle() {
  const { id } = useParams()
  const clienteId = Number(id)
  const navigate = useNavigate()

  const cliente = useApi(() => clientesApi.get(clienteId), [clienteId])
  const equipos = useApi(() => equiposApi.listByCliente(clienteId), [clienteId])

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar este cliente y todo su historial?')) return
    await clientesApi.remove(clienteId)
    navigate('/clientes')
  }

  if (cliente.loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    )
  }

  if (cliente.error || !cliente.data) {
    return (
      <Layout>
        <ErrorState message={cliente.error ?? undefined} onRetry={cliente.reload} />
      </Layout>
    )
  }

  const c = cliente.data

  return (
    <Layout>
      <div className="mb-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{c.nombre}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">{c.telefono}</p>
        {c.direccion && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{c.direccion}</p>
        )}
        {c.observaciones && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">{c.observaciones}</p>
        )}

        <div className="mt-3 flex gap-2">
          <a
            href={whatsappHref(c.telefono)}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-lg bg-green-600 py-2 text-center text-sm font-medium text-white active:bg-green-700"
          >
            WhatsApp
          </a>
          <Link
            to={`/clientes/${c.id}/editar`}
            className="flex-1 rounded-lg bg-gray-200 py-2 text-center text-sm font-medium text-gray-800 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100"
          >
            Editar
          </Link>
          <button
            onClick={handleEliminar}
            className="flex-1 rounded-lg bg-red-100 py-2 text-sm font-medium text-red-700 active:bg-red-200 dark:bg-red-950 dark:text-red-400"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Equipos</h3>
        <Link
          to={`/clientes/${c.id}/equipos/nuevo`}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white active:bg-blue-700"
        >
          + Nuevo
        </Link>
      </div>

      {equipos.loading && <LoadingState />}
      {equipos.error && <ErrorState message={equipos.error} onRetry={equipos.reload} />}
      {!equipos.loading && !equipos.error && equipos.data?.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Este cliente todavía no tiene equipos registrados.
        </p>
      )}

      <ul className="space-y-2">
        {equipos.data?.map((equipo) => (
          <li key={equipo.id}>
            <Link
              to={`/equipos/${equipo.id}`}
              className="block rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900"
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {TIPO_LABEL[equipo.tipo]}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {equipo.marca} {equipo.modelo ?? ''}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
