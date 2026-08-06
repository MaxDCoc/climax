export function whatsappHref(telefono: string): string {
  return `https://wa.me/${telefono.replace(/\D/g, '')}`
}
