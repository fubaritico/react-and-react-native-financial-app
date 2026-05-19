---
title: Zod Schema Validation
type: note
permalink: zod-schema-validation
tags: [pattern, api, validation, forms]
---

# Zod Schema Validation

## Observations

- [pattern] Zod is the boundary guard — validates all external input (API requests, form data)
- [api] Every schema registered with `registry.register()` for automatic OpenAPI spec generation
- [api] Every field has `.openapi({ example: '...' })` metadata — feeds Swagger UI docs
- [api] Input schemas (Create/Update) separate from response schemas
- [api] Query param schemas use `z.coerce.number()` for numeric params from query strings
- [forms] `useFormValidation` hook takes a Zod schema as single source of truth
- [forms] Progressive validation — only validates touched fields, no errors on mount
- [rule] Validate at system boundaries only — user input, external APIs
- [rule] Don't add validation for scenarios that can't happen — trust internal code

## Relations

- used_by [[API Architecture]]
- used_by [[Why Custom useFormValidation Over RHF]]
- generates [[OpenAPI Specification]]
