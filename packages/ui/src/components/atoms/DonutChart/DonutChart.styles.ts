/** Shared layout classes for DonutChart inner elements (safe for both native and web) */
export const shared = {} as const

/** Web-only classes for DonutChart */
export const web = {
  /** Root container — relative positioning for center text overlay */
  root: 'relative',
  /** Center text container — absolute positioning over the SVG */
  centerWrap:
    'absolute inset-0 flex items-center justify-center flex-col pointer-events-none',
} as const

/** Native-only classes for DonutChart (RN absolute positioning for center text) */
export const native = {
  /** Center text container — absolute fill over the SVG */
  centerWrap: 'absolute inset-0 items-center justify-center',
} as const
