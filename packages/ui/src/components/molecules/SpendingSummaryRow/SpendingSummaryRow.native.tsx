import { View } from 'react-native'

import tw from '#Lib/tw'

import type { ISpendingSummaryRowProps } from './SpendingSummaryRow'

import { ColorDot, Typography } from '#Atoms'

/** Native implementation of the SpendingSummaryRow component. */
export const SpendingSummaryRow = ({
  label,
  amount,
  color,
}: Readonly<ISpendingSummaryRowProps>) => (
  <View style={tw`flex-row items-center py-2`}>
    <ColorDot color={color} size={16} />
    <Typography variant="caption" color="muted" style={tw`flex-1 ml-3`}>
      {label}
    </Typography>
    <Typography variant="body-bold">{amount}</Typography>
  </View>
)
