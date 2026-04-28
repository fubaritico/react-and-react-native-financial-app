/** Shared layout classes for TransactionsOverview inner elements (safe for both native and web) */
export const shared = {
  /** Root card surface */
  root: 'bg-card rounded-xl p-5',
  /** Header row layout with spacing */
  header: 'flex justify-between items-center mb-3',
  /** Transactions list with dividers */
  list: 'divide-y divide-border',
} as const
