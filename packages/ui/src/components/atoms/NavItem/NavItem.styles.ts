/** Shared layout classes for NavItem inner elements (safe for both native and web) */
export const shared = {
  /** Center icon horizontally in column (bottom bar) mode */
  iconWrap: 'items-center',
} as const

/** Web-only classes for NavItem (hover, focus, transition, cursor) */
export const web = {
  /** Root container — flex column on small screens, flex row with fixed height on lg+ */
  root: 'flex flex-col lg:flex-row lg:h-[54px]',
  /** Hover feedback on inactive items */
  hover: 'hover:text-on-dark',
  /** Bottom-bar (column) item shape — rounded box, no accent border (web uses fills, not borders) */
  bottomBarShape: 'rounded-md border-b-0',
  /** Bottom-bar (column) hover — subtle translucent white fill (same shape as the active fill) */
  bottomBarHover: 'hover:bg-white/10',
  /** Active fill for the sidebar (row) — solid white pill */
  activeRow: 'bg-white',
  /** Active fill for the bottom bar (column) — translucent white */
  activeColumn: 'bg-white/20',
  /** Smooth color transition */
  transition: 'transition-colors',
  /** Pointer cursor */
  cursor: 'cursor-pointer',
  /** Focus-visible ring for keyboard navigation (white — visible on the dark nav) */
  focus:
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
  /** Label visibility — hidden on small screens, visible on md+ */
  label: 'text-center hidden md:block',
} as const
