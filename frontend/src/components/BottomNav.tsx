import { NavLink } from 'react-router-dom'
import { IconBell, IconUsers } from './icons'

const items = [
  { to: '/', label: 'Oportunidades', Icon: IconBell, end: true },
  { to: '/clientes', label: 'Clientes', Icon: IconUsers, end: false },
]

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-white/10 bg-navy-950/90 backdrop-blur-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {items.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `relative flex flex-1 flex-col items-center gap-1 py-3 text-xs transition ${
              isActive ? 'text-ice-400' : 'text-slate-500 active:text-slate-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-ice-400 to-ice-600" />
              )}
              <Icon className={`h-5 w-5 ${isActive ? 'drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]' : ''}`} />
              <span className={isActive ? 'font-medium' : ''}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
