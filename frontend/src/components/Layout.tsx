import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { BottomNav } from './BottomNav'

export function Layout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 pb-16 dark:bg-gray-950">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Climax</h1>
        <button
          onClick={signOut}
          className="text-sm text-gray-500 active:text-gray-700 dark:text-gray-400"
        >
          Salir
        </button>
      </header>
      <main className="mx-auto max-w-md p-4">{children}</main>
      <BottomNav />
    </div>
  )
}
