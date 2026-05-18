import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { z } from '../lib/zod.js'
import { requireAuth } from '../middleware/auth.js'
import { RecurringBillSchema } from '../schemas/recurring-bill.js'
import { getRecurringBills } from '../supabase/index.js'

export const recurringBillsRouter = Router()
recurringBillsRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/recurring-bills',
  tags: ['Recurring Bills'],
  summary: 'Get recurring bills (deduplicated by name, latest occurrence)',
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Deduplicated recurring bills',
      content: {
        'application/json': { schema: z.array(RecurringBillSchema) },
      },
    },
  },
})

// --- Express handler ---

recurringBillsRouter.get('/', async (req, res) => {
  const result = await getRecurringBills(res.locals.userId as string)

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  res.json(result.data)
})
