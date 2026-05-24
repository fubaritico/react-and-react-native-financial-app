import { Router } from 'express'

import { logger } from '../lib/logger.js'
import { registry } from '../lib/openapi.js'
import { z } from '../lib/zod.js'
import { requireAuth } from '../middleware/auth.js'
import { validateBody, validateParams } from '../middleware/validate.js'
import { CategorySchema, CreateCategorySchema } from '../schemas/category.js'
import { IdParamSchema, PG_UNIQUE_VIOLATION } from '../schemas/constants.js'
import {
  createCategory,
  deleteCategory,
  getCategoryRefCount,
  listCategories,
} from '../supabase/index.js'

export const categoriesRouter = Router()
categoriesRouter.use(requireAuth)

// --- OpenAPI registration ---

registry.registerPath({
  method: 'get',
  path: '/categories',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'User categories (system + custom)',
      content: {
        'application/json': { schema: z.array(CategorySchema) },
      },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/categories',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: CreateCategorySchema } },
    },
  },
  responses: {
    201: {
      description: 'Category created',
      content: { 'application/json': { schema: CategorySchema } },
    },
    409: { description: 'Category name already exists for this user' },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/categories/{id}',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    204: { description: 'Category deleted' },
    404: { description: 'Category not found or is a system category' },
    409: { description: 'Category is referenced by transactions or budgets' },
  },
})

// --- Express handlers ---

/**
 * GET /categories — lists all categories for the authenticated user.
 * @param req - Express request
 * @param res - Express response with CategoryRow[]
 */
categoriesRouter.get('/', async (req, res) => {
  const result = await listCategories(res.locals.userId as string)

  if (result.error) {
    logger.error({ err: result.error, path: req.path }, 'Database error')
    res.status(500).json({ error: '[DATABASE] Internal server error' })
    return
  }

  res.json(result.data)
})

/**
 * POST /categories — creates a new custom category.
 * @param req - Express request with validated CreateCategorySchema body
 * @param res - Express response with the created CategoryRow
 */
categoriesRouter.post(
  '/',
  validateBody(CreateCategorySchema),
  async (req, res) => {
    const body = req.body as { name: string; icon: string; color: string }

    const result = await createCategory(res.locals.userId as string, body)

    if (result.error) {
      if (result.error.code === PG_UNIQUE_VIOLATION) {
        res
          .status(409)
          .json({ error: 'A category with this name already exists' })
        return
      }
      logger.error({ err: result.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    logger.info(
      {
        event: 'category_created',
        categoryId: result.data.id,
        userId: res.locals.userId,
      },
      'Category created'
    )
    res.status(201).json(result.data)
  }
)

/**
 * DELETE /categories/:id — deletes a custom category if unreferenced.
 * Returns 409 if the category is used by transactions or budgets.
 * Returns 404 if not found or is a system category.
 * @param req - Express request with validated :id param
 * @param res - Express response (204 on success)
 */
categoriesRouter.delete(
  '/:id',
  validateParams(IdParamSchema),
  async (req, res) => {
    const userId = res.locals.userId as string
    const categoryId = req.params.id as string

    const refResult = await getCategoryRefCount(categoryId, userId)
    if (refResult.error) {
      logger.error({ err: refResult.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    if (refResult.data.transactions > 0 || refResult.data.budgets > 0) {
      res
        .status(409)
        .json({ error: 'Category is in use and cannot be deleted' })
      return
    }

    const result = await deleteCategory(categoryId, userId)
    if (result.error) {
      logger.error({ err: result.error, path: req.path }, 'Database error')
      res.status(500).json({ error: '[DATABASE] Internal server error' })
      return
    }

    if (result.count === 0) {
      res
        .status(404)
        .json({ error: 'Category not found or is a system category' })
      return
    }

    logger.info(
      { event: 'category_deleted', categoryId, userId },
      'Category deleted'
    )
    res.status(204).send()
  }
)
