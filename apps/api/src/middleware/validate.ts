import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

/** Validates `req.body` against a Zod schema. Responds 400 on failure. */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues.map((i) => i.message).join(', ') })
      return
    }
    req.body = parsed.data
    next()
  }
}

/** Validates `req.query` against a Zod schema. Responds 400 on failure. */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query)
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: parsed.error.issues.map((i) => i.message).join(', ') })
      return
    }
    req.query = parsed.data
    next()
  }
}
