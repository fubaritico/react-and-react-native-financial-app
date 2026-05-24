/** Shared layout classes for TransactionRow (safe for both native and web) */
export const shared = {
  /** Root row layout */
  root: 'flex flex-row items-center py-3 gap-3',
  /** Category icon circle (40px, rounded, colored background) */
  iconCircle: 'flex w-10 h-10 rounded-full items-center justify-center',
} as const
