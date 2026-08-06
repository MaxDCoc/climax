export function diasRestantes(fechaISO: string): number {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const fecha = new Date(fechaISO + 'T00:00:00')
  return Math.round((fecha.getTime() - hoy.getTime()) / 86_400_000)
}

export function formatFecha(fechaISO: string): string {
  const fecha = new Date(fechaISO + 'T00:00:00')
  return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}
