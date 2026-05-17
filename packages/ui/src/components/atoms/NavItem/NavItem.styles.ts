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
  /** Focus-visible ring for keyboard navigation */
  focus:
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Label visibility — hidden on small screens, visible on md+ */
  label: 'text-center hidden md:block',
} as const
