import type { IconName } from '@financial-app/icons'

import type { ITransaction } from '../types'

/** Bill payment status derived from transaction date. */
export type BillStatus = 'paid' | 'upcoming' | 'due-soon'

/** A recurring bill row for the DataTable. */
export interface IRecurringBill {
  /** Unique transaction identifier. */
  id: string
  /** Bill name / payee. */
  name: string
  /** Category display name (from API JOIN). */
  category: string
  /** ISO date string of the bill occurrence. */
  date: string
  /** Numeric amount (negative = expense). */
  amount: number
  /** Derived payment status. */
  status: BillStatus
  /** Category icon identifier (from API JOIN). */
  categoryIcon: IconName
  /** Category color token key (from API JOIN). */
  categoryColor: string
}

/** Summary data for the recurring bills page. */
export interface IRecurringBillsPageData {
  /** Total of all recurring bills (raw number). */
  totalBills: number
  /** Number of paid bills. */
  paidCount: number
  /** Total of paid bills (raw number). */
  paidTotal: number
  /** Number of upcoming bills. */
  upcomingCount: number
  /** Total of upcoming bills (raw number). */
  upcomingTotal: number
  /** Number of due-soon bills. */
  dueSoonCount: number
  /** Total of due-soon bills (raw number). */
  dueSoonTotal: number
  /** Bill rows for the DataTable. */
  bills: IRecurringBill[]
}

/**
 * Derives bill status from transaction date relative to the current month.
 * - Same month as today → paid
 * - Day of month <= 5 → due-soon
 * - Otherwise → upcoming
 * @param date - ISO date string of the bill occurrence
 * @returns Derived bill status
 */
function deriveBillStatus(date: string): BillStatus {
  const d = new Date(date)
  const now = new Date()
  if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear())
    return 'paid'
  if (d.getDate() <= 5) return 'due-soon'
  return 'upcoming'
}

/**
 * Deduplicates recurring transactions by name, keeping the latest occurrence.
 * @param transactions - Full list of transactions (may include non-recurring)
 * @returns Deduplicated recurring transactions
 */
function deduplicateRecurring(
  transactions: readonly ITransaction[]
): ITransaction[] {
  const byName = new Map<string, ITransaction>()
  for (const txn of transactions) {
    if (!txn.recurring) continue
    const existing = byName.get(txn.name)
    if (
      !existing ||
      new Date(txn.date).getTime() > new Date(existing.date).getTime()
    ) {
      byName.set(txn.name, txn)
    }
  }
  return [...byName.values()]
}

/**
 * Maps unique transactions to bill rows with derived status + category fields from API.
 * @param transactions - Deduplicated recurring transactions
 * @returns Bill rows sorted by day of month
 */
function toBillRows(transactions: ITransaction[]): IRecurringBill[] {
  return transactions
    .map((txn) => ({
      id: txn.id,
      name: txn.name,
      category: txn.category_name,
      date: txn.date,
      amount: txn.amount,
      status: deriveBillStatus(txn.date),
      categoryIcon: txn.category_icon,
      categoryColor: txn.category_color,
    }))
    .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate())
}

/**
 * Sums absolute amounts of the given bills.
 * @param bills - Array of recurring bill rows
 * @returns Sum of absolute amounts
 */
function sumAbsolute(bills: IRecurringBill[]): number {
  return bills.reduce((sum, b) => sum + Math.abs(b.amount), 0)
}

/**
 * Builds recurring bills page data from raw transactions.
 * @param transactions - Full list of transactions (recurring ones are filtered internally)
 * @returns Aggregated page data with bills, counts, and totals
 */
export function buildRecurringBillsPageData(
  transactions: readonly ITransaction[]
): IRecurringBillsPageData {
  const bills = toBillRows(deduplicateRecurring(transactions))

  const totalAmount = transactions
    .filter((txn) => txn.recurring)
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0)

  const paid = bills.filter((b) => b.status === 'paid')
  const upcoming = bills.filter((b) => b.status === 'upcoming')
  const dueSoon = bills.filter((b) => b.status === 'due-soon')

  return {
    totalBills: totalAmount,
    paidCount: paid.length,
    paidTotal: sumAbsolute(paid),
    upcomingCount: upcoming.length,
    upcomingTotal: sumAbsolute(upcoming),
    dueSoonCount: dueSoon.length,
    dueSoonTotal: sumAbsolute(dueSoon),
    bills,
  }
}
