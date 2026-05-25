import type { IconName } from '@financial-app/icons'

import type { SemanticColor } from '#Lib/semanticColors'

import type { AlertSeverity } from './Alert'

/** Severity-to-icon mapping */
export const SEVERITY_ICON: Record<AlertSeverity, IconName> = {
  success: 'paid',
  warning: 'warning',
  error: 'dueSoon',
  info: 'dueSoon',
} as const

/** Severity-to-Tailwind bg class mapping (applied to the backdrop element) */
export const SEVERITY_BG: Record<AlertSeverity, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  info: 'bg-blue',
} as const

/** Severity-to-semantic color mapping (for Icon color prop) */
export const SEVERITY_TOKEN: Record<AlertSeverity, SemanticColor> = {
  success: 'success',
  warning: 'warning',
  error: 'destructive',
  info: 'blue',
} as const
