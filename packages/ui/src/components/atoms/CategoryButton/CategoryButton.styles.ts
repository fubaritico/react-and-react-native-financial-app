/** Shared layout classes for CategoryButton (safe for both native and web) */
export const shared = {
  /** Circle container — flex centered content, fully rounded */
  circle: 'flex items-center justify-center rounded-full',
} as const

/** Web-only classes for CategoryButton */
export const web = {
  /** Cell wrapper — grey background, rounded, padding, centered text */
  cell: 'text-center bg-muted rounded-md p-4 border-0',
  /** Non-interactive cell — not-allowed cursor on hover for system categories */
  cellStatic: 'hover:cursor-not-allowed',
  /** Interactive cell — pointer cursor, keyboard focus ring */
  cellInteractive:
    'cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
  /** Name label — truncated, full width */
  label: 'truncate max-w-full block mt-1',
  /** Badge base — absolute corner positioning, destructive background, grey border */
  badge:
    'absolute -top-1 -right-1 items-center justify-center w-5 h-5 rounded-full bg-destructive border-2 border-grey-100',
  /** Badge hidden by default, revealed on group hover */
  badgeHover: 'hidden group-hover:flex',
  /** Badge always visible (isDeleting state) */
  badgeVisible: 'flex',
} as const

/** Native-only classes for CategoryButton */
export const native = {
  /** Cell wrapper — grey background, rounded, padding, centered items */
  cell: 'items-center bg-muted rounded-md p-3',
  /** Name label — full width, top margin */
  label: 'w-full mt-1',
  /** Delete badge — absolute top-right corner, grey border */
  badge:
    'absolute -top-1 -right-1 items-center justify-center w-5 h-5 rounded-full bg-destructive border-2 border-grey-100',
} as const
