import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { LoadingState } from '../components/LoadingState'
import { equiposApi } from '../api/equipos'
import { ApiError } from '../lib/apiClient'
import type { TipoEquipo } from '../types'

const TIPO_LABEL: Record<TipoEquipo, string> = {
  aire: 'Aire acondicionado',
  heladera: 'Heladera',
  lavarropas: 'Lavarropas',
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-3 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100'

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
        <LoadingState />
      </Layout>
    )
  }

  return (
    <Layout>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {editando ? 'Editar equipo' : 'Nuevo equipo'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {!editando && (
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoEquipo)}
            className={inputClass}
          >
            {(Object.keys(TIPO_LABEL) as TipoEquipo[]).map((t) => (
              <option key={t} value={t}>
                {TIPO_LABEL[t]}
              </option>
            ))}
          </select>
        )}

        <input
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          placeholder="Marca"
          required
          className={inputClass}
        />
        <input
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
          placeholder="Modelo (opcional)"
          className={inputClass}
        />

        {tipo === 'aire' && (
          <>
            <input
              value={frigorias}
              onChange={(e) => setFrigorias(e.target.value)}
              placeholder="Frigorías"
              type="number"
              required
              className={inputClass}
            />
            <input
              value={tipoAire}
              onChange={(e) => setTipoAire(e.target.value)}
              placeholder="Tipo (split, ventana, etc.)"
              className={inputClass}
            />
          </>
        )}

        {tipo === 'heladera' && (
          <>
            <input
              value={capacLitros}
              onChange={(e) => setCapacLitros(e.target.value)}
              placeholder="Capacidad (litros)"
              type="number"
              required
              className={inputClass}
            />
            <input
              value={tipoHeladera}
              onChange={(e) => setTipoHeladera(e.target.value)}
              placeholder="Tipo de heladera"
              className={inputClass}
            />
          </>
        )}

        {tipo === 'lavarropas' && (
          <>
            <input
              value={capacKilos}
              onChange={(e) => setCapacKilos(e.target.value)}
              placeholder="Capacidad (kilos)"
              type="number"
              required
              className={inputClass}
            />
            <input
              value={tipoLavarropas}
              onChange={(e) => setTipoLavarropas(e.target.value)}
              placeholder="Tipo de lavarropas"
              className={inputClass}
            />
          </>
        )}

        <input
          value={fechaInstalacion}
          onChange={(e) => setFechaInstalacion(e.target.value)}
          type="date"
          className={inputClass}
        />
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones (opcional)"
          rows={3}
          className={inputClass}
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
