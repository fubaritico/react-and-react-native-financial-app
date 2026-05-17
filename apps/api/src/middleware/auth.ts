import { logger } from '../lib/logger.js'
import { supabase } from '../lib/supabase.js'

import type { NextFunction, Request, Response } from 'express'

/**
 * Decodes the JWT payload without verification (already verified by getUser).
 * Returns the parsed claims object, or null if decoding fails.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString()) as Record<
      string,
      unknown
    >
  } catch {
    return null
  }
}

/**
 * Express middleware that validates the Supabase JWT from the Authorization header.
 * Delegates verification to Supabase Auth (supports HS256 + ECC P-256 signing keys).
 * Enforces AAL2 when the user has MFA factors enrolled (OWASP A07-007).
 * On success, sets `res.locals.userId`.
 * On failure, responds with 401 or 403.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    logger.warn(
      {
        event: 'auth_failure',
        reason: 'missing_token',
        ip: req.ip,
        path: req.path,
      },
      'Missing authorization token'
    )
    res.status(401).json({ error: '[AUTH] Missing authorization token' })
    return
  }

  const token = header.slice(7)

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    logger.warn(
      {
        event: 'auth_failure',
        reason: 'invalid_token',
        ip: req.ip,
        path: req.path,
      },
      'Invalid or expired token'
    )
    res.status(401).json({ error: '[AUTH] Invalid or expired token' })
    return
  }

  // --- AAL2 enforcement (OWASP A07-007) ---
  // Only check MFA factors when the JWT indicates aal1 (password-only).
  // If aal2, the user already passed TOTP — skip the extra call.
  const claims = decodeJwtPayload(token)
  const aal = claims?.aal as string | undefined

  if (aal === 'aal1') {
    const { data: factorsData } = await supabase.auth.admin.mfa.listFactors({
      userId: user.id,
    })

    const hasVerifiedTotp = factorsData?.factors.some(
      (f) => f.factor_type === 'totp' && f.status === 'verified'
    )

    if (hasVerifiedTotp) {
      logger.warn(
        {
          event: 'auth_failure',
          reason: 'aal2_required',
          userId: user.id,
          ip: req.ip,
          path: req.path,
        },
        'MFA enrolled but session is aal1 — TOTP challenge required'
      )
      res.status(403).json({ error: '[AUTH] MFA verification required' })
      return
    }
  }

  res.locals.userId = user.id
  next()
}
