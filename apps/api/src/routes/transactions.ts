import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { supabase } from '../lib/supabase.js'
import { requireAuth } from '../middleware/auth.js'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate.js'
import { IdParamSchema } from '../schemas/constants.js'
import {
  CreateTransactionSchema,
  TransactionListSchema,
  TransactionQuerySchema,
  TransactionSchema,
  UpdateTransactionSchema,
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

registry.registerPath({
  method: 'post',
  path: '/transactions',
  tags: ['Transactions'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: CreateTransactionSchema } },
    },
  },
  responses: {
    201: {
      description: 'Created transaction',
      content: { 'application/json': { schema: TransactionSchema } },
    },
  },
})

registry.registerPath({
  method: 'put',
  path: '/transactions/{id}',
  tags: ['Transactions'],
  security: [{ BearerAuth: [] }],
  request: {
    params: registry.register(
      'TransactionIdParam',
      TransactionSchema.pick({ id: true })
    ),
    body: {
      content: { 'application/json': { schema: UpdateTransactionSchema } },
    },
  },
  responses: {
    200: {
      description: 'Updated transaction',
      content: { 'application/json': { schema: TransactionSchema } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/transactions/{id}',
  tags: ['Transactions'],
  security: [{ BearerAuth: [] }],
  request: {
    params: registry.register(
      'TransactionDeleteIdParam',
      TransactionSchema.pick({ id: true })
    ),
  },
  responses: {
    204: { description: 'Transaction deleted' },
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

transactionsRouter.post(
  '/',
  validateBody(CreateTransactionSchema),
  async (req, res) => {
    const { name, category, date, amount, recurring } = req.body as {
      name: string
      category: string
      date: string
      amount: number
      recurring: boolean
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: res.locals.userId,
        name,
        category,
        date,
        amount,
        recurring,
        avatar: '',
        source: 'manual',
      })
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: `[DATABASE] ${error.message}` })
      return
    }

    logger.info(
      {
        event: 'transaction_created',
        transactionId: (data as { id: string }).id,
        userId: res.locals.userId,
        amount,
      },
      'Transaction created'
    )
    res.status(201).json(data)
  }
)

transactionsRouter.put(
  '/:id',
  validateParams(IdParamSchema),
  validateBody(UpdateTransactionSchema),
  async (req, res) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(req.body as Record<string, unknown>)
      .eq('id', req.params.id)
      .eq('user_id', res.locals.userId)
      .select()
      .single()

    if (error) {
      res.status(500).json({ error: `[DATABASE] ${error.message}` })
      return
    }

    if (!data) {
      res.status(404).json({ error: 'Transaction not found' })
      return
    }

    logger.info(
      {
        event: 'transaction_updated',
        transactionId: req.params.id,
        userId: res.locals.userId,
      },
      'Transaction updated'
    )
    res.json(data)
  }
)

transactionsRouter.delete(
  '/:id',
  validateParams(IdParamSchema),
  async (req, res) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', res.locals.userId)

    if (error) {
      res.status(500).json({ error: `[DATABASE] ${error.message}` })
      return
    }

    logger.info(
      {
        event: 'transaction_deleted',
        transactionId: req.params.id,
        userId: res.locals.userId,
      },
      'Transaction deleted'
    )
    res.status(204).send()
  }
)
