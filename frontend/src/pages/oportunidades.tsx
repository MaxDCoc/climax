import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { ErrorState } from '../components/ErrorState'
import { useApi } from '../hooks/useApi'
import { serviciosApi } from '../api/servicios'
import { whatsappHref } from '../lib/whatsapp'
import { diasRestantes, formatFecha } from '../lib/dates'
import { card, heading } from '../lib/ui'
import { IconWind, IconFridge, IconWasher, IconWhatsapp, IconInbox } from '../components/icons'

const TIPO_LABEL: Record<string, string> = {
  INSTALACION: 'Instalación',
  SERVICE: 'Service',
  REPARACION: 'Reparación',
}

const TIPO_EQUIPO_ICON: Record<string, typeof IconWind> = {
  aire: IconWind,
  heladera: IconFridge,
  lavarropas: IconWasher,
}

function urgenciaChip(dias: number) {
  if (dias < 0) {
    return { text: `Vencido hace ${Math.abs(dias)}d`, cls: 'bg-red-500/10 text-red-300 border-red-500/20' }
  }
  if (dias <= 7) {
    return { text: dias === 0 ? 'Hoy' : `En ${dias}d`, cls: 'bg-amber-500/10 text-amber-300 border-amber-500/20' }
  }
  return { text: `En ${dias}d`, cls: 'bg-ice-500/10 text-ice-300 border-ice-500/20' }
}

export default function Oportunidades() {
  const { data, loading, error, reload } = useApi(() => serviciosApi.oportunidades(30), [])

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-lg ${heading}`}>Servicios a contactar</h2>
        {!loading && !error && data && data.length > 0 && (
          <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400">
            {data.length}
          </span>
        )}
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && data && data.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <IconInbox className="h-10 w-10 text-slate-600" />
          <p className="text-sm text-slate-500">No hay servicios próximos a vencer.</p>
        </div>
      )}

      <ul className="space-y-3">
        {data?.map((o) => {
          const TipoIcon = TIPO_EQUIPO_ICON[o.equipo.tipo] ?? IconWind
          const dias = diasRestantes(o.fecha_proximo_servicio)
          const urgencia = urgenciaChip(dias)

          return (
            <li key={o.servicio_id} className={card}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-ice-500/10 p-2 text-ice-400">
                    <TipoIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-100">{o.cliente.nombre}</p>
                    <p className="text-sm text-slate-400">
                      {o.equipo.marca} {o.equipo.modelo ?? ''} · {TIPO_LABEL[o.tipo_servicio]}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Próximo: {formatFecha(o.fecha_proximo_servicio)}
                    </p>
                  </div>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-medium ${urgencia.cls}`}>
                  {urgencia.text}
                </span>
              </div>
              <a
                href={whatsappHref(o.cliente.telefono)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#25D366]/15 px-3 py-2 text-sm font-medium text-[#25D366] transition active:scale-[0.97] active:bg-[#25D366]/25"
              >
                <IconWhatsapp className="h-4 w-4" />
                Contactar por WhatsApp
              </a>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}
