import type { IconName } from '@financial-app/icons'

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
  /** Counterparty or transaction description */
  name: string
  /** ISO 8601 date string of the transaction */
  date: string
  /** Amount in currency units (positive = income, negative = expense) */
  amount: number
  /** Whether this is a recurring transaction */
  recurring: boolean
  /** FK to the categories table */
  category_id: string
  /** Category display name (from JOIN) */
  category_name: string
  /** Category icon identifier (from JOIN) */
  category_icon: IconName
  /** Category color token key (from JOIN) */
  category_color: string
}

export interface IBudget {
  /** Unique budget identifier */
  id: string
  /** Maximum budgeted amount for the period */
  maximum: number
  /** Budget month in YYYY-MM format (present when fetched from API) */
  month?: string
  /** Pre-computed spent amount (present when fetched from API via RPC) */
  spent?: number
  /** FK to the categories table */
  category_id: string
  /** Category display name (from JOIN) */
  category_name: string
  /** Category icon identifier (from JOIN) */
  category_icon: IconName
  /** Category color token key (from JOIN) */
  category_color: string
}

export interface ICategory {
  /** Unique category identifier */
  id: string
  /** Category display name */
  name: string
  /** Icon identifier from the icons package */
  icon: IconName
  /** Design token color key (e.g. "blue", "army-green") */
  color: string
  /** Whether this is a system-provided category (undeletable) */
  is_system: boolean
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
