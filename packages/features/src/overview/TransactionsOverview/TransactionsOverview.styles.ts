/** Shared layout classes for TransactionsOverview inner elements (safe for both native and web) */
export const shared = {
  /** Header row layout with spacing */
  header: 'flex flex-row justify-between items-center mb-3',
  /** Transactions list with dividers */
  list: 'divide-y divide-border',
  /** Overview content if there's no data */
  noData:
    'flex flex-col justify-center items-center gap-4 bg-beige-100 p-8 rounded-md',
} as const

/** Web-only classes for TransactionsOverview (focus-visible, block display) */
export const web = {
  /** Overview content button if there's no data */
  noDataButton:
    'block w-full rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-900',
} as const
