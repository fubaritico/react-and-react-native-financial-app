import type { IconName } from '@financial-app/icons'

import { formatCurrency } from './currency'

import type { ITransaction } from '../types'

/** Bill payment status derived from transaction date. */
export type BillStatus = 'paid' | 'upcoming' | 'due-soon'

/** Category visual config — icon name + background hex color. */
interface ICategoryConfig {
  icon: IconName
  color: string
}

/** Maps transaction category strings to their visual config. */
const CATEGORY_MAP: Record<string, ICategoryConfig> = {
  General: { icon: 'categoryGeneral', color: '#3F82B2' },
  'Dining Out': { icon: 'categoryDiningOut', color: '#93674F' },
  Groceries: { icon: 'categoryGroceries', color: '#7F9161' },
  Entertainment: { icon: 'categoryEntertainment', color: '#C94736' },
  Transportation: { icon: 'categoryTransportation', color: '#97A0AC' },
  Lifestyle: { icon: 'categoryLifeStyle', color: '#626070' },
  'Personal Care': { icon: 'categoryPersonalCare', color: '#F2CDAC' },
  Education: { icon: 'categoryEducation', color: '#82C9D7' },
  Bills: { icon: 'categoryBills', color: '#3F82B2' },
  Shopping: { icon: 'categoryShopping', color: '#934F6F' },
}

/** Fallback config when category is not in the map. */
const DEFAULT_CATEGORY: ICategoryConfig = {
  icon: 'categoryGeneral',
  color: '#3F82B2',
}

/** A recurring bill row for the DataTable. */
export interface IRecurringBill {
  /** Unique transaction identifier. */
  id: string
  /** Bill name / payee. */
  name: string
  /** Transaction category (e.g. "Bills", "Entertainment"). */
  category: string
  /** ISO date string of the bill occurrence. */
  date: string
  /** Numeric amount (negative = expense). */
  amount: number
  /** Derived payment status. */
  status: BillStatus
  /** Icon name from the icons package for the category. */
  categoryIcon: IconName
  /** Hex background color for the category icon circle. */
  categoryColor: string
}

/** Summary data for the recurring bills page. */
export interface IRecurringBillsPageData {
  /** Formatted total of all recurring bills. */
  totalBills: string
  /** Number of paid bills. */
  paidCount: number
  /** Formatted total of paid bills. */
  paidTotal: string
  /** Number of upcoming bills. */
  upcomingCount: number
  /** Formatted total of upcoming bills. */
  upcomingTotal: string
  /** Number of due-soon bills. */
  dueSoonCount: number
  /** Formatted total of due-soon bills. */
  dueSoonTotal: string
  /** Bill rows for the DataTable. */
  bills: IRecurringBill[]
}

/**
 * Derives bill status from transaction date.
 * - August (month 7) → paid
 * - Day of month <= 5 → due-soon
 * - Otherwise → upcoming
 */
function deriveBillStatus(date: string): BillStatus {
  const d = new Date(date)
  if (d.getMonth() === 7) return 'paid'
  if (d.getDate() <= 5) return 'due-soon'
  return 'upcoming'
}

/** Deduplicates recurring transactions by name, keeping the latest occurrence. */
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

/** Maps unique transactions to bill rows with derived status + category config. */
function toBillRows(transactions: ITransaction[]): IRecurringBill[] {
  return transactions
    .map((txn) => {
      const config = CATEGORY_MAP[txn.category] ?? DEFAULT_CATEGORY
      return {
        id: txn.id,
        name: txn.name,
        category: txn.category,
        date: txn.date,
        amount: txn.amount,
        status: deriveBillStatus(txn.date),
        categoryIcon: config.icon,
        categoryColor: config.color,
      }
    })
    .sort((a, b) => new Date(a.date).getDate() - new Date(b.date).getDate())
}

/** Sums absolute amounts of the given bills. */
function sumAbsolute(bills: IRecurringBill[]): number {
  return bills.reduce((sum, b) => sum + Math.abs(b.amount), 0)
}

/** Builds recurring bills page data from raw transactions. */
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
    totalBills: formatCurrency(totalAmount),
    paidCount: paid.length,
    paidTotal: formatCurrency(sumAbsolute(paid)),
    upcomingCount: upcoming.length,
    upcomingTotal: formatCurrency(sumAbsolute(upcoming)),
    dueSoonCount: dueSoon.length,
    dueSoonTotal: formatCurrency(sumAbsolute(dueSoon)),
    bills,
  }
}
