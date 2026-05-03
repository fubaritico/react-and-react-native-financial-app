/** Shared layout classes for Card inner elements (safe for both native and web) */
export const shared = {
  /** Spacing above children content area */
  childrenWrap: 'mt-0',
  /** Margin below the title */
  titleSpacing: 'mb-2',
} as const

/** Web-only classes for Card (responsive padding + shadow) */
export const web = {
  /** Responsive padding: 16px mobile, 24px tablet, 32px laptop+ */
  root: 'p-4 md:p-6 lg:p-8',
} as const

/** Native-only classes for Card */
export const native = {} as const
