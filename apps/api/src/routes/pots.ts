import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { supabase } from '../lib/supabase.js'
import { z } from '../lib/zod.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import { IdParamSchema } from '../schemas/constants.js'
import {
  CreatePotSchema,
  PotAmountSchema,
  PotSchema,
  UpdatePotSchema,
} from '../schemas/pot.js'

export const potsRouter = Router()
potsRouter.use(requireAuth)

const POT_COLUMNS = 'id, name, target, total, theme'

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/pots',
  tags: ['Pots'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'All pots for the authenticated user',
      content: { 'application/json': { schema: z.array(PotSchema) } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/pots',
  tags: ['Pots'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: CreatePotSchema } },
    },
  },
  responses: {
    201: {
      description: 'Pot created',
      content: { 'application/json': { schema: PotSchema } },
    },
  },
})

registry.registerPath({
  method: 'put',
  path: '/pots/{id}',
  tags: ['Pots'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: UpdatePotSchema } },
    },
  },
  responses: {
    200: {
      description: 'Pot updated',
      content: { 'application/json': { schema: PotSchema } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/pots/{id}',
  tags: ['Pots'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    204: { description: 'Pot deleted' },
  },
})

registry.registerPath({
  method: 'post',
  path: '/pots/{id}/add',
  tags: ['Pots'],
  summary: 'Add money to a pot',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: PotAmountSchema } },
    },
  },
  responses: {
    200: {
      description: 'Pot after adding money',
      content: { 'application/json': { schema: PotSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/pots/{id}/withdraw',
  tags: ['Pots'],
  summary: 'Withdraw money from a pot',
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: { 'application/json': { schema: PotAmountSchema } },
    },
  },
  responses: {
    200: {
      description: 'Pot after withdrawal',
      content: { 'application/json': { schema: PotSchema } },
    },
  },
})

// --- Express handlers ---

potsRouter.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('pots')
    .select(POT_COLUMNS)
    .eq('user_id', res.locals.userId)

  if (error) {
    logger.error({ err: error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- data can be null at runtime
  res.json(data ?? [])
})

potsRouter.post('/', validateBody(CreatePotSchema), async (req, res) => {
  const { data, error } = await supabase
    .from('pots')
    .insert({
      ...(req.body as Record<string, unknown>),
      user_id: res.locals.userId as string,
    })
    .select(POT_COLUMNS)
    .single()

  if (error) {
    logger.error({ err: error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  logger.info(
    {
      event: 'pot_created',
      potId: (data as { id: string }).id,
      userId: res.locals.userId,
    },
    'Pot created'
  )
  res.status(201).json(data)
})

potsRouter.put(
  '/:id',
  validateParams(IdParamSchema),
  validateBody(UpdatePotSchema),
  async (req, res) => {
    const { data, error } = await supabase
      .from('pots')
      .update(req.body as Record<string, unknown>)
      .eq('id', req.params.id)
      .eq('user_id', res.locals.userId as string)
      .select(POT_COLUMNS)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: '[DATABASE] Not found' })
        return
      }
      logger.error({ err: error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    logger.info(
      { event: 'pot_updated', potId: req.params.id, userId: res.locals.userId },
      'Pot updated'
    )
    res.json(data)
  }
)

potsRouter.delete('/:id', validateParams(IdParamSchema), async (req, res) => {
  const { error, count } = await supabase
    .from('pots')
    .delete({ count: 'exact' })
    .eq('id', req.params.id)
    .eq('user_id', res.locals.userId)

  if (error) {
    logger.error({ err: error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  if (count === 0) {
    res.status(404).json({ error: '[DATABASE] Not found' })
    return
  }

  logger.info(
    { event: 'pot_deleted', potId: req.params.id, userId: res.locals.userId },
    'Pot deleted'
  )
  res.status(204).send()
})

/**
 * Atomically update pot total by a delta (positive = add, negative = withdraw).
 * Uses a single UPDATE ... WHERE total + delta >= 0 — no TOCTOU race condition.
 * CWE-362 fix: the check and write happen in one atomic SQL statement.
 */
async function updatePotTotal(
  potId: string,
  userId: string,
  delta: number,
  res: import('express').Response
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- supabase.rpc returns untyped data
  const { data, error } = await supabase.rpc('update_pot_total', {
    p_pot_id: potId,
    p_user_id: userId,
    p_delta: delta,
  })

  if (error) {
    logger.error({ err: error, potId, userId }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  const rows = (data ?? []) as {
    id: string
    name: string
    target: number
    total: number
    theme: string
  }[]

  if (rows.length === 0) {
    logger.warn(
      { event: 'pot_money_rejected', potId, userId, delta },
      'Pot not found or insufficient funds'
    )
    res
      .status(400)
      .json({ error: '[BUSINESS] Pot not found or insufficient funds' })
    return
  }

  const pot = rows[0]
  logger.info(
    { event: 'pot_money_movement', potId, userId, delta, newTotal: pot.total },
    'Pot balance updated'
  )
  res.json(pot)
}

potsRouter.post(
  '/:id/add',
  validateParams(IdParamSchema),
  validateBody(PotAmountSchema),
  async (req, res) => {
    const id = req.params.id as string
    const userId = res.locals.userId as string
    const { amount } = req.body as { amount: number }
    await updatePotTotal(id, userId, amount, res)
  }
)

potsRouter.post(
  '/:id/withdraw',
  validateParams(IdParamSchema),
  validateBody(PotAmountSchema),
  async (req, res) => {
    const id = req.params.id as string
    const userId = res.locals.userId as string
    const { amount } = req.body as { amount: number }
    await updatePotTotal(id, userId, -amount, res)
  }
)
