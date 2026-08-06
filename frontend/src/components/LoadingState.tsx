export function LoadingState({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
      {label}
    </div>
  )
}
