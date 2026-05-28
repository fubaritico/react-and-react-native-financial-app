/**
 * Netlify serverless function wrapper for the Express API.
 *
 * Wraps the Express app created by `createApp()` with `serverless-http`
 * so it can run as a Netlify Function (AWS Lambda under the hood).
 *
 * @remarks
 * - Environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ALLOWED_ORIGINS)
 *   must be set in the Netlify site dashboard.
 * - Rate limiting (`express-rate-limit`) uses in-memory store — each Lambda invocation
 *   has its own memory, so rate limits are NOT shared across invocations.
 *   Consider Redis-backed rate limiting for production if abuse is a concern.
 */
import { wrapHandler } from '@sentry/aws-serverless'
import serverless from 'serverless-http'

import { createApp } from '../../dist/app.js'

const app = createApp()
const serverlessHandler = serverless(app)

/** Wraps with Sentry's Lambda handler — logs event body for debugging, then flushes. */
export const handler = wrapHandler(async (event, context) => {
  // Temporary debug log — DELETE after fixing body issue
  console.warn('[DEBUG] event.body type:', typeof event.body)
  console.warn('[DEBUG] event.body:', event.body?.substring?.(0, 200) ?? event.body)
  console.warn('[DEBUG] isBase64Encoded:', event.isBase64Encoded)
  console.warn('[DEBUG] content-type:', event.headers?.['content-type'])
  return serverlessHandler(event, context)
})
