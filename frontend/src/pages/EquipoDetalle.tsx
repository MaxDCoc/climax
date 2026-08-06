import { Link, useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { useApi } from '../hooks/useApi'
import { equiposApi } from '../api/equipos'
import { serviciosApi } from '../api/servicios'
import type { Equipo } from '../types'
import { formatFecha } from '../lib/dates'
import { btnDanger, btnPrimary, btnSecondary, card, cardInteractive, heading } from '../lib/ui'
import {
  IconChevronLeft,
  IconEdit,
  IconFridge,
  IconPlus,
  IconTrash,
  IconWasher,
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
        <LoadingState rows={1} />
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
  const TipoIcon = TIPO_ICON[e.tipo] ?? IconWind

  return (
    <Layout>
      <Link
        to={`/clientes/${e.cliente_id}`}
        className="mb-3 inline-flex items-center gap-1 text-sm text-slate-400 transition active:text-slate-200"
      >
        <IconChevronLeft className="h-4 w-4" />
        Ver cliente
      </Link>

      <div className={`mb-4 ${card}`}>
        <div className="mb-1 flex items-center gap-3">
          <div className="rounded-xl bg-ice-500/10 p-2 text-ice-400">
            <TipoIcon />
          </div>
          <h2 className={`text-lg ${heading}`}>{TIPO_LABEL[e.tipo]}</h2>
        </div>
        <p className="text-sm text-slate-400">
          {e.marca} {e.modelo ?? ''}
        </p>
        <p className="text-sm text-slate-500">{detalleEspecifico(e)}</p>
        {e.fecha_instalacion && (
          <p className="text-sm text-slate-500">Instalado: {formatFecha(e.fecha_instalacion)}</p>
        )}
        {e.observaciones && <p className="mt-2 text-sm text-slate-500">{e.observaciones}</p>}

        <div className="mt-4 flex gap-2">
          <Link to={`/equipos/${e.id}/editar`} className={`flex-1 ${btnSecondary}`}>
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
        <h3 className={heading}>Historial de servicios</h3>
        <Link to={`/equipos/${e.id}/servicios/nuevo`} className={btnPrimary}>
          <IconPlus />
          Nuevo
        </Link>
      </div>

      {servicios.loading && <LoadingState rows={2} />}
      {servicios.error && <ErrorState message={servicios.error} onRetry={servicios.reload} />}
      {!servicios.loading && !servicios.error && servicios.data?.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-500">
          Todavía no hay servicios registrados para este equipo.
        </p>
      )}

      <ul className="space-y-2.5">
        {servicios.data
          ?.slice()
          .sort((a, b) => b.fecha_serv.localeCompare(a.fecha_serv))
          .map((s) => (
            <li key={s.id}>
              <Link to={`/servicios/${s.id}/editar`} className={cardInteractive}>
                <p className="font-medium text-slate-100">{TIPO_SERVICIO_LABEL[s.tipo_servicio]}</p>
                <p className="text-sm text-slate-500">Realizado: {formatFecha(s.fecha_serv)}</p>
                {s.fecha_prox_serv && (
                  <p className="text-sm text-slate-500">Próximo: {formatFecha(s.fecha_prox_serv)}</p>
                )}
              </Link>
            </li>
          ))}
      </ul>
    </Layout>
  )
}
