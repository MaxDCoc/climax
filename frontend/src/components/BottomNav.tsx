import { NavLink } from 'react-router-dom'

const linkBase = 'flex flex-1 flex-col items-center justify-center py-2 text-xs'
const linkActive = 'text-blue-600 dark:text-blue-400 font-medium'
const linkInactive = 'text-gray-500 dark:text-gray-400'

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
      >
        Oportunidades
      </NavLink>
      <NavLink
        to="/clientes"
        className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
      >
        Clientes
      </NavLink>
    </nav>
  )
}
