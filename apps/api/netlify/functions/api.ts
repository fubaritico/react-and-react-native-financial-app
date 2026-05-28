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
 * - `@sentry/aws-serverless` `wrapHandler` consumes the event body before `serverless-http`
 *   can parse it for Express — use manual `Sentry.flush()` instead.
 */
import * as Sentry from '@sentry/node'
import serverless from 'serverless-http'

import { createApp } from '../../dist/app.js'

const app = createApp()
const serverlessHandler = serverless(app)

/** Passes the Lambda event to serverless-http, then flushes Sentry before freeze. */
export const handler = async (
  event: Parameters<typeof serverlessHandler>[0],
  context: Parameters<typeof serverlessHandler>[1]
) => {
  // Temporary debug logs — DELETE after fixing body issue
  console.warn('[DEBUG] event.body type:', typeof event.body)
  console.warn('[DEBUG] event.body:', event.body?.substring?.(0, 200) ?? event.body)
  console.warn('[DEBUG] isBase64Encoded:', event.isBase64Encoded)
  console.warn('[DEBUG] content-type:', event.headers?.['content-type'])

  const response = await serverlessHandler(event, context)

  console.warn('[DEBUG] response.statusCode:', response.statusCode)
  console.warn('[DEBUG] response.body:', response.body?.substring?.(0, 300) ?? response.body)

  await Sentry.flush(2000)
  return response
}
