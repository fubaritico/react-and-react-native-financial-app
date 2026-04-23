/** Formats a number as a signed currency string. */
export const formatAmount = (amount: number): string => {
  const prefix = amount >= 0 ? '+' : '-'
  return `${prefix}$${Math.abs(amount).toFixed(2)}`
}
