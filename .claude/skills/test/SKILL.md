---
name: test
description: Write tests for a component, hook, or route following the 5-level test policy. Use when creating or updating tests for any code unit.
allowed-tools: Read Write Glob Grep
argument-hint: "[ComponentName or path]"
paths:
  - packages/**
  - apps/api/**
metadata:
  author: financial-app
  version: "1.0"
---

# Test

Write tests following the mandatory 5-level test policy.

## Arguments

`$ARGUMENTS` = component/hook/route name or file path (e.g. `CategoryButton`, `useFormValidation`, `transactions`)

## Steps

1. **Read the source** — read all files of the component/hook/route to understand props, branches, callbacks, async behavior
2. **Determine the layer** — UI atom/molecule/organism, feature screen view, hook, or API route
3. **Write the test file** following the 5-level structure below
4. **Run prettier** — `npx prettier --write <test-file-path>`
5. **Run tests** — `pnpm --filter <package> test` to verify all pass

## 5-Level Structure (MANDATORY — no level skipped)

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Component } from './Component.web'

afterEach(cleanup)

describe('ComponentName', () => {
  describe('happy path', () => {
    // L1 — nominal use case with valid inputs
    // - renders correctly with required props
    // - fires callbacks with expected arguments
    // - hook returns expected shape
  })

  describe('variants', () => {
    // L2 — all meaningful prop/input variations
    // - each variant/size/state combination
    // - conditional rendering branches
    // - different valid parameter sets
  })

  describe('managed errors', () => {
    // L3 — errors the code explicitly handles
    // - validation errors with user feedback
    // - disabled states prevent interaction
    // - 400/404/409 API responses
  })

  describe('unmanaged errors', () => {
    // L4 — unexpected failures
    // - network timeout, 500 responses
    // - malformed data
    // - If N/A: comment `// L4: N/A — no async operations`
  })

  describe('edge cases', () => {
    // L5 — boundary conditions
    // - empty arrays, null, undefined optional props
    // - max length strings, zero/negative amounts
    // - rapid mount/unmount, concurrent calls
    // - unicode/special characters
  })
})
```

## Layer-Specific Guidance

### UI Components (packages/ui)

- Test the `.web.tsx` implementation (jsdom environment)
- Import directly: `import { X } from './X.web'`
- Check: renders, variants, disabled/loading states, accessibility roles/labels
- L4 is usually N/A (no async) — add the comment

### Feature Screen Views (packages/features)

- Mock `react-i18next`: `vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))`
- Import directly: `import { XScreenView } from './XScreenView.web'`
- Check: renders all sections, callbacks fire, form validation, empty/loading/error states
- L4 is usually N/A (pure presentational) — add the comment

### Hooks (packages/shared, packages/features)

- Use `renderHook` from `@testing-library/react`
- Check: return shape, state transitions, cleanup on unmount
- L4: mock failed async calls

### API Routes (apps/api)

- Use supertest + MSW (mock Supabase REST, not the API itself)
- Check: 200 CRUD, query params, 400/404/409/500 responses, auth 401
- ALL 5 levels apply — no N/A

## Rules

- **Always run prettier** after writing the test file
- **Never hardcode fallback values** in test expectations — if the code shouldn't have fallbacks, the test shouldn't either
- **Mock only external boundaries** — i18n, navigation, network. Never mock the component under test.
- **One behavior per `it()`** — name describes what is tested, not implementation
- **Use `screen` queries** — prefer `getByRole`, `getByText`, `getByPlaceholderText` over `querySelector`
- **Accessibility-first queries** — `getByRole('button', { name: '...' })` over `getByTestId`

## File Naming

| Layer | Test file location |
|-------|-------------------|
| UI web | `Component/Component.test.tsx` |
| UI native | `Component/Component.native.test.tsx` |
| Feature view | `ScreenView/ScreenView.test.tsx` |
| Hook | `hooks/useHook.test.ts` |
| API route | `src/routes/__tests__/entity.test.ts` |
