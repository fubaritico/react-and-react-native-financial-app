import { supabase } from '../lib/supabase.js'

import type { NextFunction, Request, Response } from 'express'

/**
 * Express middleware that validates the Supabase JWT from the Authorization header.
 * Delegates verification to Supabase Auth (supports HS256 + ECC P-256 signing keys).
 * On success, sets `res.locals.userId`.
 * On failure, responds with 401.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: '[AUTH] Missing authorization token' })
    return
  }

  const token = header.slice(7)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    res.status(401).json({ error: '[AUTH] Invalid or expired token' })
    return
  }

  res.locals.userId = user.id
  next()
}
