/** Shared layout classes for ProgressBar inner elements (safe for both native and web) */
export const shared = {
  /** Meta row below the bar: space-between layout */
  metaRow: 'flex-row justify-between items-center mt-3',
  /** Fill bar for thick size variant */
  fillThick: 'h-full rounded-sm',
  /** Fill bar for thin size variant */
  fillThin: 'h-full rounded-lg',
} as const

/** Web-only classes for ProgressBar */
export const web = {
  /** Display flex for meta row container */
  metaRow: 'flex',
} as const

/** Native-only classes for ProgressBar */
export const native = {} as const
