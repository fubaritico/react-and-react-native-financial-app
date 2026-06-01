import type { TransactionType } from './TransactionFormContent'

/**
 * Returns today's date as an ISO string (YYYY-MM-DD).
 * @returns ISO date string in YYYY-MM-DD format
 */
export function getTodayISO(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${String(year)}-${month}-${day}`
}

/**
 * Converts the absolute amount string + transaction type into the signed amount
 * persisted by the API (expense → negative, income → positive).
 * @param amount - Absolute amount as entered in the form (no sign)
 * @param type - Selected transaction direction
 * @returns The signed amount, or null if the input is not a finite non-zero number
 */
export function toSignedAmount(
  amount: string,
  type: TransactionType
): number | null {
  const parsed = Math.abs(Number(amount))
  if (!Number.isFinite(parsed) || parsed === 0) return null
  return type === 'expense' ? -parsed : parsed
}
