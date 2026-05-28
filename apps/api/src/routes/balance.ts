/**
 * Balance route — computed financial summary.
 *
 * Returns `{ current, income, expenses }` computed from the user's
 * reference balance and transaction history. The formula is:
 * `current = reference_balance + income - expenses - pots_total`
 *
 * Accepts an optional `month` query param (YYYY-MM) to scope the
 * calculation to a specific month. Without it, returns the all-time balance.
 *
 * Read-only — no mutations. Only the global rate limiter applies.
 *
 * @module
 */
import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { requireAuth } from '../middleware/auth.js'
import { validateQuery } from '../middleware/validate.js'
import { BalanceQuerySchema, BalanceSchema } from '../schemas/balance.js'
import { getBalance } from '../supabase/index.js'

export const balanceRouter = Router()
balanceRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/balance',
  tags: ['Balance'],
  security: [{ BearerAuth: [] }],
  request: {
    query: BalanceQuerySchema,
  },
  responses: {
    200: {
      description: 'Computed balance (current, income, expenses)',
      content: { 'application/json': { schema: BalanceSchema } },
    },
  },
})

// --- Express handlers ---

/** GET /balance?month= — returns computed balance (current, income, expenses). Month is optional. */
balanceRouter.get('/', validateQuery(BalanceQuerySchema), async (req, res) => {
  const { month = null } = (res.locals.query ?? {}) as { month?: string | null }

  const result = await getBalance(res.locals.userId as string, month ?? null)

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  res.json(result.data)
})
