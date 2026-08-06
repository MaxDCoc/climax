import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { useApi } from '../hooks/useApi'
import { clientesApi } from '../api/clientes'

export default function ClientesList() {
  const { data, loading, error, reload } = useApi(() => clientesApi.list(), [])

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Clientes</h2>
        <Link
          to="/clientes/nuevo"
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white active:bg-blue-700"
        >
          + Nuevo
        </Link>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && data && data.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Todavía no hay clientes registrados.
        </p>
      )}

      <ul className="space-y-2">
        {data?.map((cliente) => (
          <li key={cliente.id}>
            <Link
              to={`/clientes/${cliente.id}`}
              className="block rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900"
            >
              <p className="font-medium text-gray-900 dark:text-gray-100">{cliente.nombre}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.telefono}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
