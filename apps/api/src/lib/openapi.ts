/**
 * OpenAPI specification generation via `@asteasolutions/zod-to-openapi`.
 *
 * ## How it works
 *
 * The system has two independent layers that must stay in sync:
 *
 * 1. **OpenAPI registry** (`registry.registerPath`) — purely declarative.
 *    Each call describes a route (method, path, params, body, responses)
 *    using Zod schemas. It does NOT create an Express route — it only feeds
 *    the OpenAPI spec generator.
 *
 * 2. **Express handlers** (`router.get()`, `.post()`, etc.) — the actual
 *    runtime code that processes requests.
 *
 * At startup, `generateDocument()` collects all registered paths and schemas
 * into an OpenAPI 3.1 JSON document. This document is served to:
 * - **Swagger UI** at `/docs` — interactive API explorer (dev only)
 * - **`/openapi.json`** — raw spec consumed by code generators (HeyAPI)
 *
 * ### `registry.registerPath` anatomy
 *
 * ```ts
 * registry.registerPath({
 *   method: 'get',                         // HTTP method
 *   path: '/budgets',                      // OpenAPI path (with {id} params)
 *   tags: ['Budgets'],                     // groups in Swagger UI
 *   security: [{ BearerAuth: [] }],        // requires JWT auth
 *   request: {
 *     query: SomeZodSchema,                // query string validation shape
 *     params: z.object({ id: z.string() }),// URL params shape
 *     body: { content: { 'application/json': { schema: ZodSchema } } },
 *   },
 *   responses: {
 *     200: {
 *       description: 'Success',
 *       content: { 'application/json': { schema: ResponseZodSchema } },
 *     },
 *   },
 * })
 * ```
 *
 * The Zod schemas used here are the same ones used in `validateBody()` /
 * `validateQuery()` middleware — single source of truth for both validation
 * and documentation.
 *
 * @module
 */
import {
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi'

/**
 * Shared OpenAPI registry — collects all path and schema registrations.
 * Each route file imports this and calls `registry.registerPath()`.
 * At startup, `generateDocument()` reads all accumulated definitions.
 */
export const registry = new OpenAPIRegistry()

registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Supabase JWT access token',
})

/**
 * Generates a complete OpenAPI 3.1 document from the registry.
 * @returns The full OpenAPI 3.1 specification object ready for Swagger UI
 */
export function generateDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions)

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Financial App API',
      version: '1.0.0',
      description: 'REST API for the Personal Finance application',
    },
    servers: [
      {
        url: process.env.API_BASE_URL ?? 'http://localhost:3001',
        description: process.env.API_BASE_URL
          ? 'Configured server'
          : 'Local development',
      },
    ],
  })
}
