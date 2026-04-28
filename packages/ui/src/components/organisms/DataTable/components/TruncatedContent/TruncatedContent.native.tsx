import type { ITruncatedContentProps } from './TruncatedContent'

import { Typography } from '#Atoms'

/**
 * TruncatedContent (native).
 * Truncates text via RN numberOfLines prop.
 */
export function TruncatedContent({
  value,
  numberOfLines = 1,
}: Readonly<ITruncatedContentProps>) {
  return (
    <Typography variant="body" numberOfLines={numberOfLines}>
      {value}
    </Typography>
  )
}
