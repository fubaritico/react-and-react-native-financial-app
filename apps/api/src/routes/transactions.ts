import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { requireAuth } from '../middleware/auth.js'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate.js'
import { IdParamSchema, PGRST_NOT_FOUND } from '../schemas/constants.js'
import {
  CreateTransactionSchema,
  TransactionListSchema,
  TransactionQuerySchema,
  TransactionSchema,
  UpdateTransactionSchema,
} from '../schemas/transaction.js'
import {
  createTransaction,
  deleteTransaction,
  listTransactions,
  updateTransaction,
} from '../supabase/index.js'

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

// --- Express handlers ---

transactionsRouter.get(
  '/',
  validateQuery(TransactionQuerySchema),
  async (req, res) => {
    const {
      page,
      limit,
      category_id,
      search,
      sort = 'latest',
    } = res.locals.query as {
      page: number
      limit: number
      category_id?: string
      search?: string
      sort?: string
    }

    const result = await listTransactions(res.locals.userId as string, {
      page,
      limit,
      category_id,
      search,
      sort,
    })

    if (result.error) {
      logger.error({ err: result.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    res.json({
      data: result.data,
      page,
      totalPages: Math.ceil(result.count / limit),
      total: result.count,
    })
  }
)

transactionsRouter.post(
  '/',
  validateBody(CreateTransactionSchema),
  async (req, res) => {
    const body = req.body as {
      name: string
      category_id: string
      date: string
      amount: number
      recurring: boolean
    }

    const result = await createTransaction(res.locals.userId as string, body)

    if (result.error) {
      logger.error({ err: result.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    logger.info(
      {
        event: 'transaction_created',
        transactionId: result.data.id,
        userId: res.locals.userId,
      },
      'Transaction created'
    )
    res.status(201).json(result.data)
  }
)

transactionsRouter.put(
  '/:id',
  validateParams(IdParamSchema),
  validateBody(UpdateTransactionSchema),
  async (req, res) => {
    const body = req.body as {
      name?: string
      category_id?: string
      date?: string
      amount?: number
      recurring?: boolean
    }

    const result = await updateTransaction(
      req.params.id as string,
      res.locals.userId as string,
      body
    )

    if (result.error) {
      if (result.error.code === PGRST_NOT_FOUND) {
        res.status(404).json({ error: '[DATABASE] Not found' })
        return
      }
      logger.error({ err: result.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
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
    res.json(result.data)
  }
)

transactionsRouter.delete(
  '/:id',
  validateParams(IdParamSchema),
  async (req, res) => {
    const result = await deleteTransaction(
      req.params.id as string,
      res.locals.userId as string
    )

    if (result.error) {
      logger.error({ err: result.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    if (result.count === 0) {
      res.status(404).json({ error: '[DATABASE] Not found' })
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
