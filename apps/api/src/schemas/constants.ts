import { z } from '../lib/zod.js'

/** Zod schema for UUID `:id` path params — shared across all entity routes */
export const IdParamSchema = z.object({
  id: z
    .string()
    .uuid({ message: 'Invalid UUID' })
    .openapi({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' }),
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

/** Maximum characters for theme fields (pots) */
export const MAX_THEME_LENGTH = 30

/** PostgreSQL error code for unique constraint violation (duplicate key) */
export const PG_UNIQUE_VIOLATION = '23505'

/** PostgREST error code for `.single()` returning no rows */
export const PGRST_NOT_FOUND = 'PGRST116'
