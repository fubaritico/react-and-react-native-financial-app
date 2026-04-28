import { ColorDot, Typography } from '#Atoms/index.web'

import type { ISpendingSummaryRowProps } from './SpendingSummaryRow'

/** Web implementation of the SpendingSummaryRow component. */
export const SpendingSummaryRow = ({
  label,
  amount,
  color,
}: Readonly<ISpendingSummaryRowProps>) => (
  <div className="flex items-center py-2">
    <ColorDot color={color} size={16} />
    <Typography
      variant="caption"
      color="muted"
      as="span"
      className="flex-1 ml-3"
    >
      {label}
    </Typography>
    <Typography variant="body-bold" as="span">
      {amount}
    </Typography>
  </div>
)
