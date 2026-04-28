/** Shared layout classes for PotsOverview inner elements (safe for both native and web) */
export const shared = {
  /** Root card surface */
  root: 'bg-card rounded-xl p-5',
  /** Header row layout with spacing */
  header: 'flex justify-between items-center mb-3',
  /** Total saved box layout */
  totalSavedBox: 'bg-beige-100 rounded-xl p-4 flex-row items-center gap-4',
  /** Icon area sizing */
  iconArea: 'w-12 h-12 rounded-xl items-center justify-center',
  /** Pot item left padding for colored border */
  potItem: 'pl-4',
} as const

/** Web-only classes for PotsOverview (responsive layout) */
export const web = {
  /** Responsive content: stacked on mobile, side by side on desktop */
  content: 'flex flex-col md:flex-row md:gap-5',
  /** Responsive pots grid */
  potsGrid: 'grid grid-cols-2 gap-x-4 mt-4 md:mt-0 md:flex-1',
  /** Responsive total saved box desktop stretch */
  totalSavedBoxExtra: 'md:flex-1',
  /** Icon area shrink prevention */
  iconAreaExtra: 'shrink-0',
} as const
