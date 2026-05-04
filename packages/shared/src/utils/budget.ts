import { formatCurrency } from './currency'
import { formatDate } from './date'

import type { IBudget, ITransaction } from '../types'

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

/** Derives budget overview items and category cards from raw budgets + transactions. */
export function buildBudgetPageData(
  budgets: readonly IBudget[],
  transactions: readonly ITransaction[]
): IBudgetPageData {
  const budgetItems: IBudgetItem[] = budgets.map((budget) => {
    const spent = transactions
      .filter((txn) => txn.category === budget.category && txn.amount < 0)
      .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)
    return {
      category: budget.category,
      maximum: budget.maximum,
      spent,
      color: budget.theme,
    }
  })

  const categoryCards: IBudgetCategoryCard[] = budgets.map((budget) => {
    const categoryTransactions = transactions
      .filter((txn) => txn.category === budget.category && txn.amount < 0)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const spent = categoryTransactions.reduce(
      (sum, txn) => sum + Math.abs(txn.amount),
      0
    )

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
      spent,
      color: budget.theme,
      items,
    }
  })

  return { budgetItems, categoryCards }
}
