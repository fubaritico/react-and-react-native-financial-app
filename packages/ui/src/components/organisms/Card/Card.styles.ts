/** Shared layout classes for Card inner elements (safe for both native and web) */
export const shared = {
  /** Spacing above children content area */
  childrenWrap: 'mt-3',
} as const

/** Web-only classes for Card (shadow) */
export const web = {
  /** Elevated shadow on card surface */
  root: 'shadow-md',
} as const
