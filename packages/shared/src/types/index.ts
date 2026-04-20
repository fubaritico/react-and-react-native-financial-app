export interface IBalance {
  /** Current account balance */
  current: number
  /** Total income for the period */
  income: number
  /** Total expenses for the period */
  expenses: number
}

export interface ITransaction {
  /** Unique transaction identifier */
  id: string
  /** URL or path to the counterparty avatar */
  avatar: string
  /** Counterparty or transaction description */
  name: string
  /** Transaction category (e.g., "Entertainment", "Bills") */
  category: string
  /** ISO 8601 date string of the transaction */
  date: string
  /** Amount in currency units (positive = income, negative = expense) */
  amount: number
  /** Whether this is a recurring transaction */
  recurring: boolean
}

export interface IBudget {
  /** Unique budget identifier */
  id: string
  /** Budget category (e.g., "Entertainment", "Bills") */
  category: string
  /** Maximum budgeted amount for the period */
  maximum: number
  /** Color theme token name for UI display */
  theme: string
}

export interface IPot {
  /** Unique pot identifier */
  id: string
  /** User-defined pot name */
  name: string
  /** Target savings amount */
  target: number
  /** Current total saved in the pot */
  total: number
  /** Color theme token name for UI display */
  theme: string
}
