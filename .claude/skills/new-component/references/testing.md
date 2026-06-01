# Testing — 5-level policy

See `.claude/rules/tests.md` for the full policy. Create `$Name.test.tsx` next to the component — **web-only** tests using Vitest + @testing-library/react.

Every test suite MUST cover these 5 levels:

1. **Happy path** — renders with default props, callbacks fire correctly
2. **Variant cases** — each variant/size/state prop combination renders correctly
3. **Managed error cases** — disabled state prevents interaction, validation feedback displays
4. **Unmanaged error cases** — missing optional props don't crash, unexpected children handled
5. **Edge cases** — empty strings, extreme values, rapid interactions, a11y attributes correct

```
describe('$Name', () => {
  describe('happy path', () => { ... })
  describe('variants', () => { ... })
  describe('managed errors', () => { ... })
  describe('unmanaged errors', () => { ... })
  describe('edge cases', () => { ... })
})
```

If a level genuinely does not apply, document it: `// L4: N/A — no async operations`

## Template

```tsx
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { $Name } from './$Name.web'

afterEach(cleanup)

describe('$Name', () => {
  describe('happy path', () => {
    it('renders with default props', () => {
      render(<$Name /* required props */ />)
      expect(screen.getByRole('...')).toBeInTheDocument()
    })

    it('calls onChange on interaction', async () => {
      const onChange = vi.fn()
      render(<$Name onChange={onChange} /* ... */ />)
      await userEvent.click(screen.getByRole('...'))
      expect(onChange).toHaveBeenCalledWith(/* expected value */)
    })
  })

  describe('variants', () => {
    it('applies primary variant classes', () => { ... })
    it('applies secondary variant classes', () => { ... })
  })

  describe('managed errors', () => {
    it('does not call onChange when disabled', async () => {
      const onChange = vi.fn()
      render(<$Name onChange={onChange} disabled /* ... */ />)
      await userEvent.click(screen.getByRole('...'))
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  // L4: N/A — no async operations
  describe('edge cases', () => {
    it('has correct accessibility attributes', () => { ... })
  })
})
```

## Rules

- Import the `.web` implementation directly (not from barrel) — avoids RN resolution issues
- Use `vi.fn()` for callback spies
- Use `@testing-library/user-event` for realistic interactions (not `fireEvent`)
- Use `screen.getByRole()` / `screen.getByText()` — prefer accessible queries
- Test the component's public API (props → rendered output), not internal implementation
- Native tests (`.native.tsx`) require Jest + react-native-testing-library — not yet set up, skip for now
- Prefer invoking `/test $Name` rather than writing the file by hand
