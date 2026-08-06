export function ErrorState({
  message,
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <p className="text-red-600 dark:text-red-400">
        {message ?? 'No se pudo conectar. Revisá tu conexión e intentá de nuevo.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white active:bg-blue-700"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}
