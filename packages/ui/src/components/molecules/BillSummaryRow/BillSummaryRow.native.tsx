import { View } from 'react-native'

import tw from '#Lib/tw'

import { billSummaryRowVariants } from './BillSummaryRow.variants'

import type { IBillSummaryRowProps } from './BillSummaryRow'

import { Typography } from '#Atoms'

/** Native implementation of the BillSummaryRow component. */
export const BillSummaryRow = ({
  label,
  amount,
  color,
}: Readonly<IBillSummaryRowProps>) => (
  <View style={tw`${billSummaryRowVariants()} border-l-${color}`}>
    <Typography variant="caption" color="muted">
      {label}
    </Typography>
    <Typography variant="body-bold">{amount}</Typography>
  </View>
)
