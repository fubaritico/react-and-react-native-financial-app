import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { supabase } from '../lib/supabase.js'
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
import { IdParamSchema } from '../schemas/constants.js'

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
      description: 'Budgets with computed spent amounts',
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

budgetsRouter.get('/', validateQuery(BudgetQuerySchema), async (req, res) => {
  const { month } = res.locals.query as { month: string }

  const { data, error } = await supabase.rpc('get_budgets_with_spent', {
    p_user_id: res.locals.userId,
    p_month: month,
  })

  if (error) {
    res.status(500).json({ error: `[DATABASE] ${error.message}` })
    return
  }

  res.json(data ?? [])
})

budgetsRouter.post('/', validateBody(CreateBudgetSchema), async (req, res) => {
  const { data, error } = await supabase
    .from('budgets')
    .insert({
      ...(req.body as Record<string, unknown>),
      user_id: res.locals.userId as string,
    })
    .select()
    .single()

  if (error) {
    res.status(500).json({ error: `[DATABASE] ${error.message}` })
    return
  }

  logger.info(
    {
      event: 'budget_created',
      budgetId: (data as { id: string }).id,
      userId: res.locals.userId,
    },
    'Budget created'
  )
  res.status(201).json(data)
})

budgetsRouter.put(
  '/:id',
  validateParams(IdParamSchema),
  validateBody(UpdateBudgetSchema),
  async (req, res) => {
    const { data, error } = await supabase
      .from('budgets')
      .update(req.body as Record<string, unknown>)
      .eq('id', req.params.id)
      .eq('user_id', res.locals.userId as string)
      .select()
      .single()

    if (error) {
      // PGRST116 = .single() found 0 rows → resource not found (or wrong user)
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: '[DATABASE] Not found' })
        return
      }
      res.status(500).json({ error: `[DATABASE] ${error.message}` })
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
    res.json(data)
  }
)

budgetsRouter.delete(
  '/:id',
  validateParams(IdParamSchema),
  async (req, res) => {
    const { error, count } = await supabase
      .from('budgets')
      .delete({ count: 'exact' })
      .eq('id', req.params.id)
      .eq('user_id', res.locals.userId)

    if (error) {
      res.status(500).json({ error: `[DATABASE] ${error.message}` })
      return
    }

    if (count === 0) {
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
