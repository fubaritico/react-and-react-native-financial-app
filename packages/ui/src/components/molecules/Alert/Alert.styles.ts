/** Shared layout classes for Alert inner elements (safe for both native and web) */
export const shared = {
  /** Flex row layout for icon + message */
  content: 'flex-row items-center gap-3',
} as const

/** Web-only classes for Alert (opacity-based lighter background) */
export const web = {
  /** White base layer for opacity mixing */
  backdropWhite: 'absolute inset-0 bg-white rounded-md',
  /** Colored overlay with low opacity for lighter appearance */
  backdropColor: 'absolute inset-0 opacity-15 rounded-md',
} as const

/** Native-only classes for Alert (opacity-based lighter background) */
export const native = {
  /** White base layer for opacity mixing */
  backdropWhite: 'absolute inset-0 bg-white',
  /** Colored overlay with low opacity for lighter appearance */
  backdropColor: 'absolute inset-0 opacity-15',
} as const
