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
