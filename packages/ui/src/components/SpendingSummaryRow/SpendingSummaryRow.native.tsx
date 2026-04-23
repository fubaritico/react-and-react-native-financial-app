import { View } from 'react-native'

import tw from '../../lib/tw'
import { ColorDot } from '../ColorDot/ColorDot.native'
import { Typography } from '../Typography/Typography.native'

import type { ISpendingSummaryRowProps } from './SpendingSummaryRow'

/** Native implementation of the SpendingSummaryRow component. */
export const SpendingSummaryRow = ({
  label,
  amount,
  color,
}: ISpendingSummaryRowProps) => (
  <View style={tw`flex-row items-center py-2`}>
    <ColorDot color={color} size={16} />
    <Typography variant="caption" color="muted" style={tw`flex-1 ml-3`}>
      {label}
    </Typography>
    <Typography variant="body-bold">{amount}</Typography>
  </View>
)
