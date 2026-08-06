import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import { BottomNav } from './BottomNav'
import { LogoMark, IconLogout } from './icons'

export function Layout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-navy-950/80 px-4 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <div className="leading-tight">
            <p className="font-display text-base font-bold tracking-tight text-slate-50">Climax</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-ice-400/70">
              Refrigeraciones
            </p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-slate-400 transition active:bg-white/5 active:text-slate-200"
        >
          <IconLogout />
          Salir
        </button>
      </header>
      <main className="mx-auto max-w-md p-4">{children}</main>
      <BottomNav />
    </div>
  )
}
