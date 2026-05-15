/**
 * Formats an ISO date string to a human-readable short format.
 * @param dateString - ISO 8601 date string (e.g., "2024-03-15")
 * @returns Formatted date (e.g., "15 Mar 2024")
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Normalizes any date input to Supabase/Postgres `timestamptz` format.
 *
 * Accepted inputs:
 * - `"2024-08-08"` (date only from DatePicker)
 * - `"2024-08-19T14:23:11Z"` (ISO with Z)
 * - `"2024-08-19T14:23:11+00:00"` (ISO with offset)
 * - `"2024-07-21 10:05:42+00"` (already Supabase format)
 *
 * @returns `"YYYY-MM-DD HH:mm:ss+00"` — Supabase timestamptz format in UTC
 */
export function toTimestamptz(input: string): string {
  const d = new Date(input)
  const year = String(d.getUTCFullYear())
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  const hours = String(d.getUTCHours()).padStart(2, '0')
  const minutes = String(d.getUTCMinutes()).padStart(2, '0')
  const seconds = String(d.getUTCSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}+00`
}
