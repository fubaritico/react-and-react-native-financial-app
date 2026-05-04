/** Shared layout classes for ActionBar inner elements (safe for both native and web) */
export const shared = {
  /** Container row layout with gap and padding */
  container: 'flex-row items-center gap-3 p-3 w-full',
  /** Right actions row layout */
  rightActions: 'flex-row items-center gap-3',
} as const

/** Web-only classes for ActionBar (flex layout, spacing, shrink) */
export const web = {
  /** Container flex layout with padding */
  container: 'flex items-center pb-4 gap-4 w-full',
  /** Right actions shrink to fit content */
  rightActions: 'flex shrink items-center gap-4',
} as const

/** Native-only classes for ActionBar */
export const native = {} as const
