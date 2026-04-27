import { Typography } from '../../../../atoms/Typography/Typography.web'

import type { ITruncatedContentProps } from './TruncatedContent'

/**
 * TruncatedContent (web).
 * Truncates text with CSS and shows full value via native title tooltip on hover.
 */
export function TruncatedContent({
  value,
  numberOfLines = 1,
}: ITruncatedContentProps) {
  return (
    <div className="min-w-0 max-w-full" title={value}>
      <Typography variant="body" numberOfLines={numberOfLines}>
        {value}
      </Typography>
    </div>
  )
}
