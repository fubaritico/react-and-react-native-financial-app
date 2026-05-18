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

/** Maximum characters for free-text name fields (pot name, transaction name) */
export const MAX_NAME_LENGTH = 100

/** Maximum characters for category fields */
export const MAX_CATEGORY_LENGTH = 50

/** Maximum characters for theme fields */
export const MAX_THEME_LENGTH = 30
