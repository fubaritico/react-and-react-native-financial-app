/** Maximum number of page buttons shown in the full (desktop/tablet) range */
export const PAGINATION_LENGTH = 5

/** Page index (1-based) at which the sliding window starts moving */
export const OFFSET_THRESHOLD = 3

export type PageItem = number | 'ellipsis'

/**
 * Sliding window of up to 5 consecutive pages.
 * Used by desktop/tablet web layout.
 * @param countPages - Total number of pages
 * @param currentPage - Current page index (0-based)
 * @returns Array of consecutive page indices visible in the window
 */
export function getFullRange(
  countPages: number,
  currentPage: number
): number[] {
  if (countPages <= PAGINATION_LENGTH) {
    return Array.from({ length: countPages }, (_, i) => i)
  }

  const maxOffset = countPages - PAGINATION_LENGTH

  let offset = 0
  if (currentPage + 1 > OFFSET_THRESHOLD) {
    const allowedValue =
      currentPage + 1 - OFFSET_THRESHOLD >= maxOffset
        ? maxOffset
        : currentPage + 1 - OFFSET_THRESHOLD
    offset = allowedValue
  }

  return Array.from({ length: PAGINATION_LENGTH }, (_, i) => offset + i)
}

/**
 * Compact range with ellipsis for gaps.
 * Used by mobile web and native layouts.
 * @param countPages - Total number of pages
 * @param currentPage - Current page index (0-based)
 * @returns Array of page indices interspersed with 'ellipsis' markers
 */
export function getCompactRange(
  countPages: number,
  currentPage: number
): PageItem[] {
  if (countPages <= 4) {
    return Array.from({ length: countPages }, (_, i) => i)
  }

  const last = countPages - 1
  const pages = new Set([0, currentPage, last])

  if (currentPage <= 1) pages.add(1)
  if (currentPage >= last - 1) pages.add(last - 1)

  const sorted = [...pages].sort((a, b) => a - b)
  const result: PageItem[] = []

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('ellipsis')
    }
    result.push(sorted[i])
  }

  return result
}
