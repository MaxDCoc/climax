export type TipoEquipo = 'aire' | 'heladera' | 'lavarropas'
export type TipoServicio = 'INSTALACION' | 'SERVICE' | 'REPARACION'

export interface Cliente {
  id: number
  nombre: string
  direccion?: string | null
  telefono: string
  observaciones?: string | null
}

export interface ClienteInput {
  nombre: string
  direccion?: string | null
  telefono: string
  observaciones?: string | null
}

interface EquipoComun {
  id: number
  cliente_id: number
  marca: string
  modelo?: string | null
  fecha_instalacion?: string | null
  fecha_ultimo_servi?: string | null
  observaciones?: string | null
}

export interface EquipoAire extends EquipoComun {
  tipo: 'aire'
  frigorias: number
  tipo_aire?: string | null
}

export interface EquipoHeladera extends EquipoComun {
  tipo: 'heladera'
  capac_litros: number
  tipo_heladera?: string | null
}

export interface EquipoLavarropas extends EquipoComun {
  tipo: 'lavarropas'
  capac_kilos: number
  tipo_lavarropas?: string | null
}

export type Equipo = EquipoAire | EquipoHeladera | EquipoLavarropas

export interface Servicio {
  id: number
  equipo_id: number
  tipo_servicio: TipoServicio
  fecha_serv: string
  observaciones?: string | null
  fecha_prox_serv?: string | null
}

export interface Oportunidad {
  servicio_id: number
  tipo_servicio: TipoServicio
  fecha_proximo_servicio: string
  cliente: { id: number; nombre: string; telefono: string }
  equipo: { id: number; tipo: string; marca: string; modelo?: string | null }
}
