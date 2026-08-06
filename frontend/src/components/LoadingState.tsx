export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-white/10 bg-navy-800/40 p-4"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="h-4 w-2/3 rounded-full bg-white/10" />
          <div className="mt-2.5 h-3 w-1/2 rounded-full bg-white/5" />
        </div>
      ))}
    </div>
  )
}
