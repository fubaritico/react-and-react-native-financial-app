/**
 * Semantic color tokens shared across Typography and Icon.
 * Maps short names to Tailwind token keys.
 *
 * - Typography uses `text-${token}` in CVA variants
 * - Icon web uses `var(--color-${token})`
 * - Icon native uses `resolveColor(token)`
 */
export const SEMANTIC_COLORS = {
  foreground: 'foreground',
  muted: 'foreground-muted',
  'on-dark': 'on-dark',
  'on-dark-muted': 'on-dark-muted',
  success: 'success',
  destructive: 'destructive',
  'primary-foreground': 'primary-foreground',
  'transaction-positive': 'transaction-positive',
  'transaction-negative': 'transaction-negative',
  warning: 'warning',
  blue: 'blue',
  'beige-500': 'beige-500',
  'nav-text': 'nav-text',
  'nav-active': 'nav-active-text',
  'nav-accent': 'nav-accent',
  inherit: 'inherit',
  'grey-300': 'grey-300',
  'grey-500': 'grey-500',
  green: 'green',
} as const

/** Semantic color name — shared union for Typography `color` and Icon `color`. */
export type SemanticColor = keyof typeof SEMANTIC_COLORS
