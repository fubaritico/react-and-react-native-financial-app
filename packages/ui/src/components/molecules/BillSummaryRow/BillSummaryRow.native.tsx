import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Typography } from '../../atoms/Typography/Typography.native'

import { billSummaryRowVariants } from './BillSummaryRow.variants'

import type { IBillSummaryRowProps } from './BillSummaryRow'

/** Native implementation of the BillSummaryRow component. */
export const BillSummaryRow = ({
  label,
  amount,
  color,
}: IBillSummaryRowProps) => (
  <View style={tw`${billSummaryRowVariants()} border-l-${color}`}>
    <Typography variant="caption" color="muted">
      {label}
    </Typography>
    <Typography variant="body-bold">{amount}</Typography>
  </View>
)
