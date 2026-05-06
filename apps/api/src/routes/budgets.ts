import { Router } from 'express'

import { registry } from '../lib/openapi.js'
import { supabase } from '../lib/supabase.js'
import { z } from '../lib/zod.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, validateQuery } from '../middleware/validate.js'
import {
  BudgetSchema,
  CreateBudgetSchema,
  UpdateBudgetSchema,
} from '../schemas/budget.js'

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
  },
})

// --- Express handlers ---

const BudgetQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
})

budgetsRouter.get('/', validateQuery(BudgetQuerySchema), async (req, res) => {
  const month = req.query.month as string

  const { data, error } = await supabase.rpc('get_budgets_with_spent', {
    p_user_id: res.locals.userId,
    p_month: month,
  })

  if (error) {
    res.status(500).json({ error: error.message })
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
    res.status(500).json({ error: error.message })
    return
  }

  res.status(201).json(data)
})

budgetsRouter.put(
  '/:id',
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
      res.status(500).json({ error: error.message })
      return
    }

    res.json(data)
  }
)

budgetsRouter.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', res.locals.userId)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(204).send()
})
