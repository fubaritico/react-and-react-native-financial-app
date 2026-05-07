import { Router } from 'express'

import { registry } from '../lib/openapi.js'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import { validateQuery } from '../middleware/validate.js'
import {
  TransactionListSchema,
  TransactionQuerySchema,
} from '../schemas/transaction.js'

export const transactionsRouter = Router()
transactionsRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/transactions',
  tags: ['Transactions'],
  security: [{ BearerAuth: [] }],
  request: { query: TransactionQuerySchema },
  responses: {
    200: {
      description: 'Paginated transaction list',
      content: { 'application/json': { schema: TransactionListSchema } },
    },
  },
})

// --- Express handler ---

/** Sort column + direction mapping from query param. */
const SORT_MAP: Record<string, { column: string; ascending: boolean }> = {
  latest: { column: 'date', ascending: false },
  oldest: { column: 'date', ascending: true },
  'a-z': { column: 'name', ascending: true },
  'z-a': { column: 'name', ascending: false },
  highest: { column: 'amount', ascending: false },
  lowest: { column: 'amount', ascending: true },
}

transactionsRouter.get(
  '/',
  validateQuery(TransactionQuerySchema),
  async (req, res) => {
    const {
      page,
      limit,
      category,
      search,
      sort = 'latest',
    } = res.locals.query as {
      page: number
      limit: number
      category?: string
      search?: string
      sort?: string
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
      .from('transactions')
      .select('id, avatar, name, category, date, amount, recurring', {
        count: 'exact',
      })
      .eq('user_id', res.locals.userId)

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const sortConfig = SORT_MAP[sort] ?? SORT_MAP.latest
    query = query.order(sortConfig.column, { ascending: sortConfig.ascending })
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) {
      res.status(500).json({ error: `[DATABASE] ${error.message}` })
      return
    }

    const total = count ?? 0
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- data can be null at runtime
    const rows = data ?? []

    res.json({
      data: rows,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    })
  }
)
