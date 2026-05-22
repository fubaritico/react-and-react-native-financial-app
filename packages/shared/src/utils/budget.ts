import { formatDate } from './date'

import type { IBudget, ITransaction } from '../types'

/**
 * Returns the current month as YYYY-MM string.
 * Will be replaced by a month picker when that feature is added.
 * @returns ISO month string (e.g. "2026-05")
 */
export function getCurrentBudgetMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${String(year)}-${month}`
}

/** Maximum number of latest spending transactions shown per budget category card. */
const LATEST_SPENDING_COUNT = 3

export interface IBudgetItem {
  /** Budget record ID from the database */
  id: string
  /** Budget category name (e.g. "Entertainment", "Bills") */
  category: string
  /** Maximum spending limit for this budget */
  maximum: number
  /** Amount already spent in this category */
  spent: number
  /** Theme color token (e.g. "#277C78") */
  color: string
}

export interface IBudgetSpendingItem {
  /** URL or path to the transaction avatar image */
  avatar: string
  /** Transaction recipient/sender name */
  name: string
  /** Numeric amount in base currency (negative for expenses) */
  amount: number
  /** Formatted transaction date */
  date: string
}

export interface IBudgetCategoryCard extends IBudgetItem {
  /** Latest spending transactions for this category */
  items: IBudgetSpendingItem[]
}

export interface IBudgetPageData {
  /** Budget overview items for the donut chart */
  budgetItems: IBudgetItem[]
  /** Detailed category cards with latest transactions */
  categoryCards: IBudgetCategoryCard[]
}

/**
 * Computes spent amount for a budget category.
 * Uses pre-computed `budget.spent` from the API when available,
 * falls back to summing negative transactions for the category.
 * @param budget - Budget record with optional pre-computed spent
 * @param categoryTransactions - Filtered negative transactions for this category
 * @returns Spent amount as a positive number
 */
function getSpent(
  budget: IBudget,
  categoryTransactions: readonly ITransaction[]
): number {
  if (budget.spent != null) return budget.spent
  return categoryTransactions.reduce(
    (sum, txn) => sum + Math.abs(txn.amount),
    0
  )
}

/**
 * Derives budget overview items and category cards from raw budgets + transactions.
 * @param budgets - Array of budget records from the API
 * @param transactions - Array of all transactions to compute spending from
 * @returns Object containing budgetItems for the donut chart and categoryCards with latest transactions
 */
export function buildBudgetPageData(
  budgets: readonly IBudget[],
  transactions: readonly ITransaction[]
): IBudgetPageData {
  const budgetItems: IBudgetItem[] = budgets.map((budget) => {
    const categoryTxns = transactions.filter(
      (txn) => txn.category === budget.category && txn.amount < 0
    )
    return {
      id: budget.id,
      category: budget.category,
      maximum: budget.maximum,
      spent: getSpent(budget, categoryTxns),
      color: budget.theme,
    }
  })

  const categoryCards: IBudgetCategoryCard[] = budgets.map((budget) => {
    const categoryTransactions = transactions
      .filter((txn) => txn.category === budget.category && txn.amount < 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const items: IBudgetSpendingItem[] = categoryTransactions
      .slice(0, LATEST_SPENDING_COUNT)
      .map((txn) => ({
        avatar: txn.avatar,
        name: txn.name,
        amount: txn.amount,
        date: formatDate(txn.date),
      }))

    return {
      id: budget.id,
      category: budget.category,
      maximum: budget.maximum,
      spent: getSpent(budget, categoryTransactions),
      color: budget.theme,
      items,
    }
  })

  return { budgetItems, categoryCards }
}
