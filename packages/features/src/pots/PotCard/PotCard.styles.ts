/** Shared layout classes for PotCard inner elements (safe for both native and web) */
export const shared = {
  /** Header row: ColorDot + pot name + ellipsis menu */
  header: 'flex flex-row items-center',
  /** Pot name taking remaining horizontal space */
  title: 'flex-1 ml-4',
  /** "Total Saved" row: label left + amount right */
  totalRow: 'flex flex-row items-center justify-between mt-5',
  /** Wrapper around the ProgressBar */
  progressWrapper: 'mt-4',
  /** Action buttons row (min-w-11 ensures 44px touch targets on narrow viewports) */
  buttonsRow: 'flex flex-row gap-4 mt-5',
  /** Individual button wrapper ensuring 44px minimum touch target width */
  button: 'flex-1 min-w-11',
} as const

/** Web-only classes for PotCard (hover, focus, transition, shadow, cursor, animate) */
export const web = {} as const

/** Native-only classes for PotCard (RN layout quirks, explicit flex-row, absolute positioning) */
export const native = {} as const
