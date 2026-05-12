import { formatCurrency } from './currency'
import { formatDate } from './date'

import type { IBudget, ITransaction } from '../types'

/** Current budget month — matches seed data. Will be dynamic when month picker is added. */
export const BUDGET_MONTH = '2024-08'

const LATEST_SPENDING_COUNT = 3

export interface IBudgetItem {
  category: string
  maximum: number
  spent: number
  color: string
}

export interface IBudgetSpendingItem {
  avatar: string
  name: string
  amount: string
  date: string
}

export interface IBudgetCategoryCard extends IBudgetItem {
  items: IBudgetSpendingItem[]
}

export interface IBudgetPageData {
  budgetItems: IBudgetItem[]
  categoryCards: IBudgetCategoryCard[]
}

/**
 * Computes spent amount for a budget category.
 * Uses pre-computed `budget.spent` from the API when available,
 * falls back to summing negative transactions for the category.
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

/** Derives budget overview items and category cards from raw budgets + transactions. */
export function buildBudgetPageData(
  budgets: readonly IBudget[],
  transactions: readonly ITransaction[]
): IBudgetPageData {
  const budgetItems: IBudgetItem[] = budgets.map((budget) => {
    const categoryTxns = transactions.filter(
      (txn) => txn.category === budget.category && txn.amount < 0
    )
    return {
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
        amount: formatCurrency(txn.amount),
        date: formatDate(txn.date),
      }))

    return {
      category: budget.category,
      maximum: budget.maximum,
      spent: getSpent(budget, categoryTransactions),
      color: budget.theme,
      items,
    }
  })

  return { budgetItems, categoryCards }
}
