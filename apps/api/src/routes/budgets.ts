/**
 * Budget routes — CRUD operations on monthly budgets.
 *
 * A budget ties a category to a maximum spending amount for a given month.
 * The GET endpoint returns budgets enriched with the computed `spent` amount
 * (sum of transactions in that category for the month) via a Supabase RPC.
 *
 * All routes require authentication (`requireAuth` at router level).
 * Write operations are additionally rate-limited by the `writeLimiter` in app.ts.
 *
 * @module
 */
import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { z } from '../lib/zod.js'
import { requireAuth } from '../middleware/auth.js'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate.js'
import {
  BudgetSchema,
  CreateBudgetSchema,
  UpdateBudgetSchema,
} from '../schemas/budget.js'
import { IdParamSchema, PGRST_NOT_FOUND } from '../schemas/constants.js'
import {
  createBudget,
  deleteBudget,
  getBudgetsWithSpent,
  updateBudget,
} from '../supabase/index.js'

export const budgetsRouter = Router()
budgetsRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/budgets',
  tags: ['Budgets'],
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      month: z
        .string()
        .regex(/^\d{4}-\d{2}$/)
        .openapi({ example: '2025-08', description: 'Budget month (YYYY-MM)' }),
    }),
  },
  responses: {
    200: {
      description: 'Budgets with computed spent amounts and category info',
      content: {
        'application/json': { schema: z.array(BudgetSchema) },
      },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/budgets',
  tags: ['Budgets'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: CreateBudgetSchema } },
    },
  },
  responses: {
    201: {
      description: 'Budget created',
      content: { 'application/json': { schema: BudgetSchema } },
    },
  },
})

registry.registerPath({
  method: 'put',
  path: '/budgets/{id}',
  tags: ['Budgets'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: UpdateBudgetSchema } },
    },
  },
  responses: {
    200: {
      description: 'Budget updated',
      content: { 'application/json': { schema: BudgetSchema } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/budgets/{id}',
  tags: ['Budgets'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    204: { description: 'Budget deleted' },
    404: { description: 'Budget not found' },
  },
})

// --- Express handlers ---

const BudgetQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
})

/**
 * GET /budgets?month=YYYY-MM — lists budgets with computed spent amounts.
 * Each budget includes its category info and the sum of matching transactions.
 */
budgetsRouter.get('/', validateQuery(BudgetQuerySchema), async (req, res) => {
  const { month } = res.locals.query as { month: string }

  const result = await getBudgetsWithSpent(res.locals.userId as string, month)

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  res.json(result.data)
})

/** POST /budgets — creates a new budget for a category and month. */
budgetsRouter.post('/', validateBody(CreateBudgetSchema), async (req, res) => {
  const body = req.body as {
    category_id: string
    maximum: number
    month: string
  }

  const result = await createBudget(res.locals.userId as string, body)

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  logger.info(
    {
      event: 'budget_created',
      budgetId: result.data.id,
      userId: res.locals.userId,
    },
    'Budget created'
  )
  res.status(201).json(result.data)
})

/** PUT /budgets/:id — updates a budget's category or maximum amount. Returns 404 if not found. */
budgetsRouter.put(
  '/:id',
  validateParams(IdParamSchema),
  validateBody(UpdateBudgetSchema),
  async (req, res) => {
    const body = req.body as {
      category_id?: string
      maximum?: number
    }

    const result = await updateBudget(
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
        event: 'budget_updated',
        budgetId: req.params.id,
        userId: res.locals.userId,
      },
      'Budget updated'
    )
    res.json(result.data)
  }
)

/** DELETE /budgets/:id — removes a budget. Returns 404 if not found, 204 on success. */
budgetsRouter.delete(
  '/:id',
  validateParams(IdParamSchema),
  async (req, res) => {
    const result = await deleteBudget(
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
        event: 'budget_deleted',
        budgetId: req.params.id,
        userId: res.locals.userId,
      },
      'Budget deleted'
    )
    res.status(204).send()
  }
)
