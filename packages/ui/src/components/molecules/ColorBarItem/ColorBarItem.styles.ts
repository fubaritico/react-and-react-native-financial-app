/** Shared layout classes for ColorBarItem inner elements (safe for both native and web) */
export const shared = {
  /** Root container with left color border and padding */
  root: 'border-l-4 pl-4',
  /** Horizontal layout when secondary amount is shown */
  rowLayout: 'flex-row items-center justify-between gap-2',
  /** Secondary amount group */
  secondaryGroup: 'flex-row items-center gap-1',
} as const

/** Web-only classes for ColorBarItem */
export const web = {
  /** Display flex for horizontal layout (web needs explicit display) */
  rowLayout: 'flex items-center justify-between gap-2',
  /** Secondary amount inline group */
  secondaryGroup: 'flex items-center gap-1',
} as const

/** Native-only classes for ColorBarItem */
export const native = {} as const
