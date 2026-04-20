# Quality — Review Rules

## Critical Violations (QUAL-0xx)

### QUAL-001: console.log usage
- **Files**: All
- **Check**: No `console.log()` — use `console.warn()` or `console.error()` only
- **Exception**: None

### QUAL-002: Explicit `any` type
- **Files**: All `*.ts`, `*.tsx`
- **Check**: No `any` type annotation — use `unknown`, proper types, or generics
- **Forbidden**: `: any`, `as any`, `<any>`
- **Exception**: None — strict TypeScript is non-negotiable

### QUAL-002b: Mixed type and value imports
- **Files**: All `*.ts`, `*.tsx`
- **Check**: Types and values from the same module MUST use separate import statements
- **Forbidden**: `import { create, type TwConfig } from 'twrnc'`
- **Required**:
  ```ts
  import type { TwConfig } from 'twrnc'
  import { create } from 'twrnc'
  ```
- **Rationale**: Keeps type-only imports explicit, enables better tree-shaking, and matches `isolatedModules` best practices

## High Violations

### QUAL-003: Missing JSDoc on interface properties
- **Files**: All `*.ts`, `*.tsx` in `packages/**`
- **Check**: Every property in every interface must have a JSDoc comment
- **Applies to**: Props interfaces, domain types, abstractions, internal interfaces
- **Format**:
  ```ts
  export interface IButtonProps {
    /** Text displayed inside the button */
    label: string
    /** Callback fired when button is pressed */
    onPress: () => void
    /** Visual style variant */
    variant?: 'primary' | 'secondary'
  }
  ```

### QUAL-004: Missing JSDoc on functions
- **Files**: All functions in `packages/**` (exported AND private)
- **Check**: Every function must have JSDoc with description
- **Check**: `@param` for each parameter, `@returns` for non-void functions
- **Note**: Private helpers included — they are internal documentation for maintainers
- **Format**:
  ```ts
  /**
   * Resolves variant classes for the given props.
   * @param props - Component variant props
   * @returns Concatenated class string
   */
  export function resolveVariant(props: ButtonVariants): string { ... }
  ```

### QUAL-005: Missing JSDoc on custom hooks
- **Files**: `packages/ui/src/hooks/**`, `packages/shared/src/hooks/**`
- **Check**: Hook must have JSDoc with description
- **Check**: `@returns` documenting the return value/tuple
- **Check**: Key state variables in the hook should have inline comments if non-obvious

### QUAL-006: Function exceeds 30 lines
- **Files**: All
- **Check**: Functions/methods longer than 30 lines of logic (excluding JSDoc, blank lines, type declarations)
- **Suggestion**: Extract sub-functions or simplify control flow

### QUAL-007: Code duplication
- **Files**: All within same package
- **Check**: 3+ lines of identical or near-identical logic repeated in multiple places
- **Suggestion**: Extract to shared utility or hook
- **Note**: Cross-platform duplication between .native.tsx and .web.tsx is acceptable (different renderers)

## Medium Violations

### QUAL-008: Dead code
- **Files**: All
- **Check**: Commented-out code blocks (>2 lines)
- **Check**: Unreachable code after return/throw
- **Check**: Unused imports (should be caught by ESLint, but verify)
- **Check**: Unused local variables or parameters (prefix with `_` if intentionally unused)

### QUAL-009: God component (>200 lines)
- **Files**: `*.native.tsx`, `*.web.tsx`
- **Check**: Component file exceeding 200 lines suggests need to split
- **Suggestion**: Extract sub-components, custom hooks, or utilities

### QUAL-010: Stale or incorrect JSDoc
- **Files**: All
- **Check**: `@param` referencing non-existent parameters
- **Check**: JSDoc description contradicting actual behavior
- **Check**: `@returns` type not matching actual return type

### QUAL-011: Unnecessary abstraction
- **Files**: All
- **Check**: Wrapper functions that add no logic (just forward args)
- **Check**: Single-use utility functions that could be inline
- **Check**: Over-engineered patterns for simple operations

## Low Violations

### QUAL-012: Missing error context
- **Files**: All
- **Check**: `catch` blocks that swallow errors silently (`catch {}` or `catch { /* empty */ }`)
- **Suggest**: At minimum `console.error` with context about what failed

### QUAL-013: Magic numbers/strings
- **Files**: All (except token source files)
- **Check**: Numeric literals (other than 0, 1, -1) without explanation
- **Check**: String literals used in multiple places without a constant
- **Suggest**: Extract to named constant or token

### QUAL-014: Inconsistent patterns within same file
- **Files**: All
- **Check**: Mixing arrow functions and function declarations in same module
- **Check**: Mixing default and named exports inconsistently
- **Check**: Inconsistent error handling approaches within same scope

### QUAL-015: Interface naming convention
- **Files**: All `*.ts`, `*.tsx`
- **Check**: All interface names MUST start with `I` prefix (e.g., `IAuthClient`, `IAuthStorage`, `IButtonProps`)
- **Forbidden**: `export interface AuthStorage { ... }` — must be `export interface IAuthStorage { ... }`
- **Exception**: None — this applies to all interfaces, including Props, domain types, and abstractions
- **Rationale**: Distinguishes interfaces from types, classes, and concrete implementations at a glance
