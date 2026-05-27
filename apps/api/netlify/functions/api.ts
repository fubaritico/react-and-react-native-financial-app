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
import serverless from 'serverless-http'

import { createApp } from '../../dist/app.js'

const app = createApp()

export const handler = serverless(app)
