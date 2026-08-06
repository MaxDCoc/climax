import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { useApi } from '../hooks/useApi'
import { serviciosApi } from '../api/servicios'
import { whatsappHref } from '../lib/whatsapp'

const TIPO_LABEL: Record<string, string> = {
  INSTALACION: 'Instalación',
  SERVICE: 'Service',
  REPARACION: 'Reparación',
}

export default function Oportunidades() {
  const { data, loading, error, reload } = useApi(() => serviciosApi.oportunidades(30), [])

  return (
    <Layout>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Servicios a contactar
      </h2>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && data && data.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No hay servicios próximos a vencer.
        </p>
      )}

      <ul className="space-y-3">
        {data?.map((o) => (
          <li
            key={o.servicio_id}
            className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900"
          >
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {o.cliente.nombre}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {o.equipo.marca} {o.equipo.modelo ?? ''} · {TIPO_LABEL[o.tipo_servicio]}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Próximo service: {o.fecha_proximo_servicio}
            </p>
            <a
              href={whatsappHref(o.cliente.telefono)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white active:bg-green-700"
            >
              Contactar por WhatsApp
            </a>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
