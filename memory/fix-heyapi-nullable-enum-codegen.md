---
title: fix-heyapi-nullable-enum-codegen
type: note
permalink: financial-app/fix-heyapi-nullable-enum-codegen
tags:
- fix
- heyapi
- openapi
- zod
- codegen
---

# HeyAPI Nullable Enum Codegen Fix

## Problem
HeyAPI generated `mode: 'manual' | 'bank'` instead of `mode: 'manual' | 'bank' | null` for a nullable enum field.

## Root Cause
Using `z.enum(['manual', 'bank']).nullable()` in Zod produced OpenAPI YAML with `enum: [manual, bank]` but without `null` in the enum list. HeyAPI correctly omitted null because the spec didn't include it.

## Fix
Replace `z.enum().nullable()` with `z.union([z.literal('manual'), z.literal('bank'), z.null()])` and add explicit `.openapi()` override:

```ts
mode: z.union([z.literal('manual'), z.literal('bank'), z.null()]).openapi({
  type: ['string', 'null'],
  enum: ['manual', 'bank', null],
  example: 'manual',
})
```

## Key Insights
- `z.enum()` is discouraged — user strongly prefers TypeScript unions via `z.literal()` (avoids enum problems in TS)
- Without the `.openapi()` override, `z.union([z.literal(), z.literal(), z.null()])` produces verbose `anyOf` with duplicate `type: "null"` entries
- The `.openapi()` override forces clean OpenAPI 3.1 output: `type: [string, null]` with `enum: [manual, bank, null]`
- `.optional()` in Zod means the field can be **omitted** (undefined), distinct from `.nullable()` which allows explicit null
- These schemas are used for OpenAPI spec generation only (codegen), not runtime validation in this context

## Related
- [[zod-schema-validation]] — Zod schema patterns
- [[api-architecture]] — API server patterns
