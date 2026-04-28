import { Typography } from '#Atoms/index.web'

import type { ITruncatedContentProps } from './TruncatedContent'

/**
 * TruncatedContent (web).
 * Truncates text with CSS and shows full value via native title tooltip on hover.
 */
export function TruncatedContent({
  variant = 'body',
  color,
  value,
  numberOfLines = 1,
}: Readonly<ITruncatedContentProps>) {
  return (
    <div className="min-w-0 max-w-full" title={value}>
      <Typography numberOfLines={numberOfLines} variant={variant} color={color}>
        {value}
      </Typography>
    </div>
  )
}
