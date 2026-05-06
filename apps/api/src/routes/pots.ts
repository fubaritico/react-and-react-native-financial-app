import { Router } from 'express'

import { registry } from '../lib/openapi.js'
import { supabase } from '../lib/supabase.js'
import { z } from '../lib/zod.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody } from '../middleware/validate.js'
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

potsRouter.get('/', async (_req, res) => {
  const { data, error } = await supabase
    .from('pots')
    .select(POT_COLUMNS)
    .eq('user_id', res.locals.userId)

  if (error) {
    res.status(500).json({ error: error.message })
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
    res.status(500).json({ error: error.message })
    return
  }

  res.status(201).json(data)
})

potsRouter.put('/:id', validateBody(UpdatePotSchema), async (req, res) => {
  const { data, error } = await supabase
    .from('pots')
    .update(req.body as Record<string, unknown>)
    .eq('id', req.params.id)
    .eq('user_id', res.locals.userId as string)
    .select(POT_COLUMNS)
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
})

potsRouter.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('pots')
    .delete()
    .eq('id', req.params.id)
    .eq('user_id', res.locals.userId)

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.status(204).send()
})

/** Helper to update pot total by a delta (positive = add, negative = withdraw). */
async function updatePotTotal(
  potId: string,
  userId: string,
  delta: number,
  res: import('express').Response
) {
  // Fetch current total
  const { data: pot, error: fetchError } = await supabase
    .from('pots')
    .select(POT_COLUMNS)
    .eq('id', potId)
    .eq('user_id', userId)
    .single()

  if (fetchError) {
    res.status(404).json({ error: 'Pot not found' })
    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- pot can be null at runtime
  if (!pot) {
    res.status(404).json({ error: 'Pot not found' })
    return
  }

  const potData = pot as {
    id: string
    name: string
    target: number
    total: number
    theme: string
  }
  const newTotal = potData.total + delta
  if (newTotal < 0) {
    res.status(400).json({ error: 'Insufficient funds in pot' })
    return
  }

  const { data, error } = await supabase
    .from('pots')
    .update({ total: newTotal })
    .eq('id', potId)
    .eq('user_id', userId)
    .select(POT_COLUMNS)
    .single()

  if (error) {
    res.status(500).json({ error: error.message })
    return
  }

  res.json(data)
}

potsRouter.post('/:id/add', validateBody(PotAmountSchema), async (req, res) => {
  const id = req.params.id as string
  const userId = res.locals.userId as string
  const { amount } = req.body as { amount: number }
  await updatePotTotal(id, userId, amount, res)
})

potsRouter.post(
  '/:id/withdraw',
  validateBody(PotAmountSchema),
  async (req, res) => {
    const id = req.params.id as string
    const userId = res.locals.userId as string
    const { amount } = req.body as { amount: number }
    await updatePotTotal(id, userId, -amount, res)
  }
)
