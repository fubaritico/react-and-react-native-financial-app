import { Router } from 'express'

import { registry } from '../lib/openapi.js'
import { supabase } from '../lib/supabase.js'
import { z } from '../lib/zod.js'
import { requireAuth } from '../middleware/auth.js'
import { validateQuery } from '../middleware/validate.js'
import { BalanceSchema } from '../schemas/balance.js'

export const balanceRouter = Router()
balanceRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/balance',
  tags: ['Balance'],
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      month: z
        .string()
        .regex(/^\d{4}-\d{2}$/)
        .optional()
        .openapi({
          example: '2025-08',
          description: 'Filter by month (YYYY-MM). Omit for all-time.',
        }),
    }),
  },
  responses: {
    200: {
      description: 'Computed balance (current, income, expenses)',
      content: { 'application/json': { schema: BalanceSchema } },
    },
  },
})

// --- Express handler ---

const BalanceQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/)
    .optional(),
})

balanceRouter.get('/', validateQuery(BalanceQuerySchema), async (req, res) => {
  const month = (req.query.month as string) || null

  const { data, error } = await supabase.rpc('get_balance', {
    p_user_id: res.locals.userId,
    p_month: month,
  })

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  const rows = (data ?? []) as {
    current: number
    income: number
    expenses: number
  }[]
  if (rows.length === 0) {
    res.json({ current: 0, income: 0, expenses: 0 })
    return
  }

  res.json(rows[0])
})
