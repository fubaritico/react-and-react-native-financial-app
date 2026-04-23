import { NavLink } from 'react-router'

const NAV_ITEMS = [
  { to: '/', label: 'Overview' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/budgets', label: 'Budgets' },
  { to: '/pots', label: 'Pots' },
  { to: '/recurring', label: 'Recurring Bills' },
] as const

/**
 * Temporary navigation component — will be replaced by a proper UI package component
 * with icons once @financial-app/icons is ready.
 *
 * Desktop (lg+): vertical sidebar on the left, dark background.
 * Tablet/mobile (< lg): horizontal bottom bar.
 */
export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[300px] lg:min-h-screen bg-grey-900 rounded-r-xl py-10 px-8">
        <p className="text-preset-1 text-on-dark mb-16">finance</p>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-4 px-8 py-4 rounded-r-xl text-preset-4 font-bold transition-colors border-l-4',
                  isActive
                    ? 'bg-beige-100 text-grey-900 border-green'
                    : 'text-grey-300 border-transparent hover:text-on-dark',
                ].join(' ')
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile / tablet bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden bg-grey-900 px-4 pt-2 pb-2 rounded-t-lg">
        {NAV_ITEMS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex-1 flex flex-col items-center gap-1 py-2 rounded-t-lg text-center transition-colors border-b-4',
                isActive
                  ? 'bg-beige-100 text-grey-900 border-green'
                  : 'text-grey-300 border-transparent hover:text-on-dark',
              ].join(' ')
            }
          >
            <span className="text-[11px] md:text-preset-5 font-bold leading-tight truncate max-w-full">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
