/**
 * @fileoverview HeyAPI OpenAPI-to-TypeScript configuration.
 *
 * This configuration file tells HeyAPI how to generate the Financial App API client.
 *
 * ## Generated files (in `./src/client/`):
 * - `types.gen.ts` — TypeScript interfaces for all API types
 * - `sdk.gen.ts` — SDK functions for each API endpoint
 * - `client.gen.ts` — HTTP client instance
 * - `@tanstack/react-query.gen.ts` — TanStack Query options and mutations
 *
 * ## Plugins used:
 * - `@hey-api/client-fetch` — Fetch API-based HTTP client
 * - `@hey-api/typescript` — Generates TypeScript types from OpenAPI schemas
 * - `@hey-api/sdk` — Generates SDK functions (e.g., `getTransactions()`)
 * - `@tanstack/react-query` — TanStack Query integration (queryOptions + mutationOptions)
 *
 * ## Usage:
 * Run `pnpm generate` to regenerate the client after OpenAPI spec changes.
 *
 * @see https://heyapi.dev/openapi-ts/configuration
 */
import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: '../../apps/api/openapi.yaml',
  output: {
    path: './src/client',
  },
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    '@hey-api/client-fetch',
    {
      name: '@tanstack/react-query',
      queryOptions: true,
      mutationOptions: true,
    },
  ],
})
