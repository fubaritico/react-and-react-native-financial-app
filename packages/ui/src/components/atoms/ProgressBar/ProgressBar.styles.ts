/** Shared layout classes for ProgressBar inner elements (safe for both native and web) */
export const shared = {
  /** Meta row below the bar: space-between layout */
  metaRow: 'flex-row justify-between items-center mt-3',
  /** Fill bar for thick size variant */
  fillThick: 'h-full rounded-sm',
  /** Fill bar for thin size variant */
  fillThin: 'h-full rounded-lg',
  /** Flex row container for primary + buffer fills */
  fillRow: 'flex-row items-center h-full w-full',
  /** Primary fill when buffer is present — no right rounding (thick) */
  fillThickPrimaryWithBuffer: 'h-full rounded-l-sm mr-px',
  /** Primary fill when buffer is present — no right rounding (thin) */
  fillThinPrimaryWithBuffer: 'h-full rounded-l-lg mr-px',
  /** Buffer fill — no left rounding (thick) */
  fillThickBuffer: 'h-full rounded-r-sm',
  /** Buffer fill — no left rounding (thin) */
  fillThinBuffer: 'h-full rounded-r-lg',
} as const

/** Web-only classes for ProgressBar */
export const web = {
  /** Display flex for meta row container */
  metaRow: 'flex',
  /** Display flex for fill row container (web needs explicit display:flex) */
  fillRow: 'flex',
} as const

/** Native-only classes for ProgressBar */
export const native = {} as const
