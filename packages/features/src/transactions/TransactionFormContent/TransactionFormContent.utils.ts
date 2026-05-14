/** Returns today's date as an ISO string (YYYY-MM-DD) */
export function getTodayISO(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${String(year)}-${month}-${day}`
}
