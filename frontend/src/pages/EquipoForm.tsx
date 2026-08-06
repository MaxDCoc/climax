import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { equiposApi } from '../api/equipos'
import { ApiError } from '../lib/apiClient'
import type { TipoEquipo } from '../types'
import { btnPrimary, heading, input, label as labelClass } from '../lib/ui'

const TIPO_LABEL: Record<TipoEquipo, string> = {
  aire: 'Aire acondicionado',
  heladera: 'Heladera',
  lavarropas: 'Lavarropas',
}

export default function EquipoForm() {
  const { clienteId, id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()

  const [tipo, setTipo] = useState<TipoEquipo>('aire')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [fechaInstalacion, setFechaInstalacion] = useState('')
  const [observaciones, setObservaciones] = useState('')

  const [frigorias, setFrigorias] = useState('')
  const [tipoAire, setTipoAire] = useState('')
  const [capacLitros, setCapacLitros] = useState('')
  const [tipoHeladera, setTipoHeladera] = useState('')
  const [capacKilos, setCapacKilos] = useState('')
  const [tipoLavarropas, setTipoLavarropas] = useState('')

  const [clienteIdDestino, setClienteIdDestino] = useState<number | null>(
    clienteId ? Number(clienteId) : null,
  )
  const [loading, setLoading] = useState(editando)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!editando) return
    equiposApi
      .get(Number(id))
      .then((equipo) => {
        setTipo(equipo.tipo)
        setMarca(equipo.marca)
        setModelo(equipo.modelo ?? '')
        setFechaInstalacion(equipo.fecha_instalacion ?? '')
        setObservaciones(equipo.observaciones ?? '')
        setClienteIdDestino(equipo.cliente_id)
        if (equipo.tipo === 'aire') {
          setFrigorias(String(equipo.frigorias))
          setTipoAire(equipo.tipo_aire ?? '')
        } else if (equipo.tipo === 'heladera') {
          setCapacLitros(String(equipo.capac_litros))
          setTipoHeladera(equipo.tipo_heladera ?? '')
        } else {
          setCapacKilos(String(equipo.capac_kilos))
          setTipoLavarropas(equipo.tipo_lavarropas ?? '')
        }
      })
      .catch(() => setError('No se pudo cargar el equipo'))
      .finally(() => setLoading(false))
  }, [editando, id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const base = {
      marca,
      modelo: modelo || null,
      fecha_instalacion: fechaInstalacion || null,
      observaciones: observaciones || null,
    }

    const especifico =
      tipo === 'aire'
        ? { frigorias: Number(frigorias), tipo_aire: tipoAire || null }
        : tipo === 'heladera'
          ? { capac_litros: Number(capacLitros), tipo_heladera: tipoHeladera || null }
          : { capac_kilos: Number(capacKilos), tipo_lavarropas: tipoLavarropas || null }

    try {
      if (editando) {
        await equiposApi.update(Number(id), { ...base, ...especifico })
        navigate(`/equipos/${id}`)
      } else {
        const nuevo = await equiposApi.create(clienteIdDestino as number, {
          tipo,
          ...base,
          ...especifico,
        })
        navigate(`/equipos/${nuevo.id}`)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar el equipo')
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
      <h2 className={`mb-4 text-lg ${heading}`}>{editando ? 'Editar equipo' : 'Nuevo equipo'}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!editando && (
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(TIPO_LABEL) as TipoEquipo[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`rounded-xl border px-2 py-2.5 text-center text-xs font-medium transition ${
                  tipo === t
                    ? 'border-ice-500/50 bg-ice-500/10 text-ice-300'
                    : 'border-white/10 bg-navy-900/40 text-slate-400'
                }`}
              >
                {TIPO_LABEL[t]}
              </button>
            ))}
          </div>
        )}

        <div>
          <label className={labelClass}>Marca</label>
          <input value={marca} onChange={(e) => setMarca(e.target.value)} required className={input} />
        </div>
        <div>
          <label className={labelClass}>Modelo (opcional)</label>
          <input value={modelo} onChange={(e) => setModelo(e.target.value)} className={input} />
        </div>

        {tipo === 'aire' && (
          <>
            <div>
              <label className={labelClass}>Frigorías</label>
              <input
                value={frigorias}
                onChange={(e) => setFrigorias(e.target.value)}
                type="number"
                required
                className={input}
              />
            </div>
            <div>
              <label className={labelClass}>Tipo (split, ventana, etc.)</label>
              <input value={tipoAire} onChange={(e) => setTipoAire(e.target.value)} className={input} />
            </div>
          </>
        )}

        {tipo === 'heladera' && (
          <>
            <div>
              <label className={labelClass}>Capacidad (litros)</label>
              <input
                value={capacLitros}
                onChange={(e) => setCapacLitros(e.target.value)}
                type="number"
                required
                className={input}
              />
            </div>
            <div>
              <label className={labelClass}>Tipo de heladera</label>
              <input
                value={tipoHeladera}
                onChange={(e) => setTipoHeladera(e.target.value)}
                className={input}
              />
            </div>
          </>
        )}

        {tipo === 'lavarropas' && (
          <>
            <div>
              <label className={labelClass}>Capacidad (kilos)</label>
              <input
                value={capacKilos}
                onChange={(e) => setCapacKilos(e.target.value)}
                type="number"
                required
                className={input}
              />
            </div>
            <div>
              <label className={labelClass}>Tipo de lavarropas</label>
              <input
                value={tipoLavarropas}
                onChange={(e) => setTipoLavarropas(e.target.value)}
                className={input}
              />
            </div>
          </>
        )}

        <div>
          <label className={labelClass}>Fecha de instalación</label>
          <input
            value={fechaInstalacion}
            onChange={(e) => setFechaInstalacion(e.target.value)}
            type="date"
            className={input}
          />
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
