import { cn } from '#Lib/cn'

import { Icon, Typography } from '#Atoms/index.web'

import { COLOR_MAP, ICON_MAP } from './PasswordRulesList.constants'
import { shared, web } from './PasswordRulesList.styles'

import type { IPasswordRulesListProps } from './PasswordRulesList'

/** Semantic icon color per rule validation state */
const ICON_COLOR_MAP = {
  valid: 'success',
  invalid: 'destructive',
} as const

/** Web implementation of the PasswordRulesList component. */
export function PasswordRulesList({
  rules,
}: Readonly<IPasswordRulesListProps>) {
  return (
    <div className={cn(web.list, shared.list)}>
      {rules.map((rule) => (
        <div key={rule.label} className={cn(web.row, shared.row)}>
          {ICON_MAP[rule.state] ? (
            <span className={cn(web.iconWrap, shared.iconWrap)}>
              <Icon
                name={ICON_MAP[rule.state] as 'paid' | 'dueSoon'}
                iconSize="xxs"
                color={ICON_COLOR_MAP[rule.state as 'valid' | 'invalid']}
              />
            </span>
          ) : (
            <span className={shared.iconPlaceholder} />
          )}
          <Typography variant="caption" color={COLOR_MAP[rule.state]}>
            {rule.label}
          </Typography>
        </div>
      ))}
    </div>
  )
}
