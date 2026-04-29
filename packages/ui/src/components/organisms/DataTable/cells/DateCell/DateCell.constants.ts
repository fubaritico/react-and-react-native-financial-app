/** Default date format options. */
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}

/**
 * Formats an ISO date string to human-readable: "19 Aug 2024".
 * @param dateString - ISO date string
 * @param locale - BCP 47 locale tag (defaults to 'en-US')
 */
export function formatDisplayDate(
  dateString: string,
  locale = 'en-US'
): string {
  return new Intl.DateTimeFormat(locale, DATE_FORMAT_OPTIONS).format(
    new Date(dateString)
  )
}
