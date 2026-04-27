import { Typography } from '../../../../atoms/Typography/Typography.web'

import type { INoResultsProps } from './NoResults'

/** Empty state placeholder for DataTable (web). */
export function NoResults({ message }: INoResultsProps) {
  return (
    <div className="py-8 text-center">
      <Typography variant="body" color="muted">
        {message}
      </Typography>
    </div>
  )
}
