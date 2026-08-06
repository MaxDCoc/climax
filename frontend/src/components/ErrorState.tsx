import { IconAlertTriangle } from './icons'
import { btnSecondary } from '../lib/ui'

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/15 bg-red-500/5 p-8 text-center">
      <IconAlertTriangle className="h-8 w-8 text-red-400" />
      <p className="text-sm text-red-300">
        {message ?? 'No se pudo conectar. Revisá tu conexión e intentá de nuevo.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className={btnSecondary}>
          Reintentar
        </button>
      )}
    </div>
  )
}
