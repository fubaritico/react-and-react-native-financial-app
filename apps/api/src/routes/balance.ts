import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import {
  BalanceQuerySchema,
  BalanceSchema,
  ReferenceBalanceSchema,
  UpdateReferenceBalanceSchema,
} from '../schemas/balance.js'
import {
  getBalance,
  getReferenceBalance,
  updateReferenceBalance,
} from '../supabase/index.js'

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

registry.registerPath({
  method: 'get',
  path: '/balance/reference',
  tags: ['Balance'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Raw reference balance',
      content: { 'application/json': { schema: ReferenceBalanceSchema } },
    },
  },
})

registry.registerPath({
  method: 'put',
  path: '/balance/reference',
  tags: ['Balance'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': { schema: UpdateReferenceBalanceSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated reference balance',
      content: { 'application/json': { schema: ReferenceBalanceSchema } },
    },
  },
})

// --- Express handlers ---

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

balanceRouter.get('/reference', async (req, res) => {
  const result = await getReferenceBalance(res.locals.userId as string)

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  res.json(result.data)
})

balanceRouter.put(
  '/reference',
  validateBody(UpdateReferenceBalanceSchema),
  async (req, res) => {
    const { reference } = req.body as { reference: number }
    const result = await updateReferenceBalance(
      res.locals.userId as string,
      reference
    )

    if (result.error) {
      logger.error({ err: result.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    res.json(result.data)
  }
)
