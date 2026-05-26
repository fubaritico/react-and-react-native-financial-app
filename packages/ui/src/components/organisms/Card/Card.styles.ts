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

/** Native boxShadow style — beige-500 (#98908B) at 50% opacity, equivalent to shadow-sm. */
export const NATIVE_BOX_SHADOW = '0 1px 2px 0 #98908B80'
