import { z } from '../lib/zod.js'

/** Zod schema for UUID `:id` path params — shared across all entity routes */
export const IdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID' }),
})

/** Minimum allowed financial amount (symmetric bound for transactions/balances) */
export const MIN_AMOUNT = -1_000_000

/** Maximum allowed financial amount (applies to all monetary fields) */
export const MAX_AMOUNT = 1_000_000

/** Maximum characters for search query parameters */
export const MAX_SEARCH_LENGTH = 100

/** Maximum items per page for paginated endpoints */
export const MAX_PAGE_SIZE = 1000
