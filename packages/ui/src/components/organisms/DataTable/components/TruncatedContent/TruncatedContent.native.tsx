import { Typography } from '../../../../atoms/Typography/Typography.native'

import type { ITruncatedContentProps } from './TruncatedContent'

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
