import { ColorDot } from '../ColorDot/ColorDot.web'

import type { ISpendingSummaryRowProps } from './SpendingSummaryRow'

/** Web implementation of the SpendingSummaryRow component. */
export const SpendingSummaryRow = ({
  label,
  amount,
  color,
}: ISpendingSummaryRowProps) => (
  <div className="flex items-center py-2">
    <ColorDot color={color} size={16} />
    <span className="flex-1 ml-3 text-xs text-grey-500">{label}</span>
    <span className="text-sm font-bold text-grey-900">{amount}</span>
  </div>
)
