import { logger } from '../lib/logger.js'

import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

/** Validates `req.body` against a Zod schema. Responds 400 on failure. */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      const message = parsed.error.issues.map((i) => i.message).join(', ')
      logger.warn(
        {
          event: 'validation_failure',
          target: 'body',
          path: req.path,
          issues: parsed.error.issues,
        },
        message
      )
      res.status(400).json({ error: `[VALIDATION] ${message}` })
      return
    }
    req.body = parsed.data
    next()
  }
}

/** Validates `req.params` against a Zod schema. Responds 400 on failure. */
export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params)
    if (!parsed.success) {
      const message = parsed.error.issues.map((i) => i.message).join(', ')
      logger.warn(
        {
          event: 'validation_failure',
          target: 'params',
          path: req.path,
          issues: parsed.error.issues,
        },
        message
      )
      res.status(400).json({ error: `[VALIDATION] ${message}` })
      return
    }
    next()
  }
}

/** Validates `req.query` against a Zod schema. Responds 400 on failure.
 *  Parsed data is stored in `res.locals.query` (Express 5 makes req.query read-only). */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query)
    if (!parsed.success) {
      const message = parsed.error.issues.map((i) => i.message).join(', ')
      logger.warn(
        {
          event: 'validation_failure',
          target: 'query',
          path: req.path,
          issues: parsed.error.issues,
        },
        message
      )
      res.status(400).json({ error: `[VALIDATION] ${message}` })
      return
    }
    res.locals.query = parsed.data
    next()
  }
}
