import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { useApi } from '../hooks/useApi'
import { clientesApi } from '../api/clientes'
import { btnPrimary, cardInteractive, heading } from '../lib/ui'
import { IconPlus, IconUsers, IconChevronRight } from '../components/icons'

function iniciales(nombre: string) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export default function ClientesList() {
  const { data, loading, error, reload } = useApi(() => clientesApi.list(), [])

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-lg ${heading}`}>Clientes</h2>
        <Link to="/clientes/nuevo" className={btnPrimary}>
          <IconPlus />
          Nuevo
        </Link>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && data && data.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <IconUsers className="h-10 w-10 text-slate-600" />
          <p className="text-sm text-slate-500">Todavía no hay clientes registrados.</p>
        </div>
      )}

      <ul className="space-y-2.5">
        {data?.map((cliente) => (
          <li key={cliente.id}>
            <Link to={`/clientes/${cliente.id}`} className={`${cardInteractive} flex items-center gap-3`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-ice-400/20 to-ice-600/20 text-sm font-semibold text-ice-300">
                {iniciales(cliente.nombre)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-100">{cliente.nombre}</p>
                <p className="text-sm text-slate-500">{cliente.telefono}</p>
              </div>
              <IconChevronRight className="shrink-0 text-slate-600" />
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
