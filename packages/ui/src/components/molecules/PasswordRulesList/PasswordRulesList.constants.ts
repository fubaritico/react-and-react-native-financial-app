import type { PasswordRuleState } from './PasswordRulesList'

/** Icon name per rule state — null means no icon (pristine) */
export const ICON_MAP: Record<PasswordRuleState, string | null> = {
  pristine: null,
  valid: 'paid',
  invalid: 'dueSoon',
}

/** Typography color per rule state */
export const COLOR_MAP: Record<
  PasswordRuleState,
  'muted' | 'success' | 'destructive'
> = {
  pristine: 'muted',
  valid: 'success',
  invalid: 'destructive',
}
