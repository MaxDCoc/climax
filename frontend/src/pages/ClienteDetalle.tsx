import { Link, useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { useApi } from '../hooks/useApi'
import { clientesApi } from '../api/clientes'
import { equiposApi } from '../api/equipos'
import { whatsappHref } from '../lib/whatsapp'
import { btnDanger, btnPrimary, btnSecondary, card, cardInteractive, heading } from '../lib/ui'
import {
  IconChevronRight,
  IconEdit,
  IconFridge,
  IconPlus,
  IconTrash,
  IconWasher,
  IconWhatsapp,
  IconWind,
} from '../components/icons'

const TIPO_LABEL: Record<string, string> = {
  aire: 'Aire acondicionado',
  heladera: 'Heladera',
  lavarropas: 'Lavarropas',
}

const TIPO_ICON: Record<string, typeof IconWind> = {
  aire: IconWind,
  heladera: IconFridge,
  lavarropas: IconWasher,
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
        <LoadingState rows={1} />
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
      <div className={`mb-4 ${card}`}>
        <h2 className={`text-lg ${heading}`}>{c.nombre}</h2>
        <p className="text-sm text-slate-400">{c.telefono}</p>
        {c.direccion && <p className="text-sm text-slate-400">{c.direccion}</p>}
        {c.observaciones && <p className="mt-2 text-sm text-slate-500">{c.observaciones}</p>}

        <div className="mt-4 flex gap-2">
          <a
            href={whatsappHref(c.telefono)}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366]/15 px-3 py-2.5 text-sm font-medium text-[#25D366] transition active:scale-[0.97] active:bg-[#25D366]/25"
          >
            <IconWhatsapp />
            WhatsApp
          </a>
          <Link to={`/clientes/${c.id}/editar`} className={`flex-1 ${btnSecondary}`}>
            <IconEdit />
            Editar
          </Link>
          <button onClick={handleEliminar} className={`flex-1 ${btnDanger}`}>
            <IconTrash />
            Eliminar
          </button>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className={heading}>Equipos</h3>
        <Link to={`/clientes/${c.id}/equipos/nuevo`} className={btnPrimary}>
          <IconPlus />
          Nuevo
        </Link>
      </div>

      {equipos.loading && <LoadingState rows={2} />}
      {equipos.error && <ErrorState message={equipos.error} onRetry={equipos.reload} />}
      {!equipos.loading && !equipos.error && equipos.data?.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-500">
          Este cliente todavía no tiene equipos registrados.
        </p>
      )}

      <ul className="space-y-2.5">
        {equipos.data?.map((equipo) => {
          const TipoIcon = TIPO_ICON[equipo.tipo] ?? IconWind
          return (
            <li key={equipo.id}>
              <Link to={`/equipos/${equipo.id}`} className={`${cardInteractive} flex items-center gap-3`}>
                <div className="rounded-xl bg-ice-500/10 p-2 text-ice-400">
                  <TipoIcon />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-100">{TIPO_LABEL[equipo.tipo]}</p>
                  <p className="truncate text-sm text-slate-500">
                    {equipo.marca} {equipo.modelo ?? ''}
                  </p>
                </div>
                <IconChevronRight className="shrink-0 text-slate-600" />
              </Link>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}
