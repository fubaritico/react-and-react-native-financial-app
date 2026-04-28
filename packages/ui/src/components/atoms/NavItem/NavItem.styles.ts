/** Shared layout classes for NavItem inner elements (safe for both native and web) */
export const shared = {
  /** Center icon horizontally in column (bottom bar) mode */
  iconWrap: 'items-center',
} as const

/** Web-only classes for NavItem (hover, focus, transition, cursor) */
export const web = {
  root: 'flex flex-col lg:flex-row lg:h-[54px]',
  /** Hover feedback on inactive items */
  hover: 'hover:text-on-dark',
  /** Smooth color transition */
  transition: 'transition-colors',
  /** Pointer cursor */
  cursor: 'cursor-pointer',
} as const
