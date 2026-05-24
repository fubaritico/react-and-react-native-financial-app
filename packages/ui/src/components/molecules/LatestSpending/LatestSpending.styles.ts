/** Shared layout classes for LatestSpending inner elements (safe for both native and web) */
export const shared = {
  /** Beige rounded background wrapper around the entire section */
  wrapper: 'rounded-lg bg-beige-100 p-4',
  /** Header row with title and See All link */
  header: 'flex flex-row items-center justify-between mb-2',
  /** Single transaction item row */
  itemRow: 'flex flex-row items-center py-3 gap-3',
  /** Category icon circle (32px, rounded, colored background) */
  iconCircle: 'flex w-8 h-8 rounded-full items-center justify-center',
  /** Name text taking remaining space */
  name: 'flex-1 truncate',
  /** Right-aligned amount + date column */
  itemRight: 'flex flex-col items-end',
  /** Spacing above date text */
  dateSpacing: 'mt-1',
} as const

/** Web-only classes for LatestSpending (hover, focus, transition, shadow, cursor, animate) */
export const web = {} as const

/** Native-only classes for LatestSpending (RN layout quirks, explicit flex-row, absolute positioning) */
export const native = {} as const
