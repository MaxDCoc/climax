import { Link, useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { useApi } from '../hooks/useApi'
import { equiposApi } from '../api/equipos'
import { serviciosApi } from '../api/servicios'
import type { Equipo } from '../types'

const TIPO_LABEL: Record<string, string> = {
  aire: 'Aire acondicionado',
  heladera: 'Heladera',
  lavarropas: 'Lavarropas',
}

const TIPO_SERVICIO_LABEL: Record<string, string> = {
  INSTALACION: 'Instalación',
  SERVICE: 'Service',
  REPARACION: 'Reparación',
}

function detalleEspecifico(equipo: Equipo): string {
  if (equipo.tipo === 'aire') {
    return `${equipo.frigorias} frigorías${equipo.tipo_aire ? ' · ' + equipo.tipo_aire : ''}`
  }
  if (equipo.tipo === 'heladera') {
    return `${equipo.capac_litros} L${equipo.tipo_heladera ? ' · ' + equipo.tipo_heladera : ''}`
  }
  return `${equipo.capac_kilos} kg${equipo.tipo_lavarropas ? ' · ' + equipo.tipo_lavarropas : ''}`
}

export default function EquipoDetalle() {
  const { id } = useParams()
  const equipoId = Number(id)
  const navigate = useNavigate()

  const equipo = useApi(() => equiposApi.get(equipoId), [equipoId])
  const servicios = useApi(() => serviciosApi.listByEquipo(equipoId), [equipoId])

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar este equipo y su historial de servicios?')) return
    await equiposApi.remove(equipoId)
    navigate(`/clientes/${equipo.data?.cliente_id}`)
  }

  if (equipo.loading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    )
  }

  if (equipo.error || !equipo.data) {
    return (
      <Layout>
        <ErrorState message={equipo.error ?? undefined} onRetry={equipo.reload} />
      </Layout>
    )
  }

  const e = equipo.data

  return (
    <Layout>
      <div className="mb-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {TIPO_LABEL[e.tipo]}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {e.marca} {e.modelo ?? ''}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">{detalleEspecifico(e)}</p>
        {e.fecha_instalacion && (
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Instalado: {e.fecha_instalacion}
          </p>
        )}
        {e.observaciones && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">{e.observaciones}</p>
        )}

        <div className="mt-3 flex gap-2">
          <Link
            to={`/clientes/${e.cliente_id}`}
            className="flex-1 rounded-lg bg-gray-200 py-2 text-center text-sm font-medium text-gray-800 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100"
          >
            Ver cliente
          </Link>
          <Link
            to={`/equipos/${e.id}/editar`}
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
        <h3 className="font-medium text-gray-900 dark:text-gray-100">Historial de servicios</h3>
        <Link
          to={`/equipos/${e.id}/servicios/nuevo`}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white active:bg-blue-700"
        >
          + Nuevo
        </Link>
      </div>

      {servicios.loading && <LoadingState />}
      {servicios.error && <ErrorState message={servicios.error} onRetry={servicios.reload} />}
      {!servicios.loading && !servicios.error && servicios.data?.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Todavía no hay servicios registrados para este equipo.
        </p>
      )}

      <ul className="space-y-2">
        {servicios.data
          ?.slice()
          .sort((a, b) => b.fecha_serv.localeCompare(a.fecha_serv))
          .map((s) => (
            <li key={s.id}>
              <Link
                to={`/servicios/${s.id}/editar`}
                className="block rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900"
              >
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {TIPO_SERVICIO_LABEL[s.tipo_servicio]}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Realizado: {s.fecha_serv}
                </p>
                {s.fecha_prox_serv && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Próximo: {s.fecha_prox_serv}
                  </p>
                )}
              </Link>
            </li>
          ))}
      </ul>
    </Layout>
  )
}
