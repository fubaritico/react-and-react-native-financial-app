/** Shared layout classes for ActionBar inner elements (safe for both native and web) */
export const shared = {
  /** Container row layout with gap and padding */
  container: 'flex-row items-center gap-3 pt-3 pb-3 pl-0 pr-0',
  /** Left actions row layout */
  leftActions: 'flex-row items-center gap-3',
} as const

/** Web-only classes for ActionBar (flex layout, spacing) */
export const web = {
  /** Container flex layout with padding */
  container: 'flex items-center p-4 gap-4',
  /** Left actions grow to fill space */
  leftActionsWrap: 'flex grow gap-4',
} as const
