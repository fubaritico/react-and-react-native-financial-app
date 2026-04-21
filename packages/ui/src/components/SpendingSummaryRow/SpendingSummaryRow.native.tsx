import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { ColorDot } from '../ColorDot/ColorDot.native'

import type { ISpendingSummaryRowProps } from './SpendingSummaryRow'

/** Native implementation of the SpendingSummaryRow component. */
export const SpendingSummaryRow = ({
  label,
  amount,
  color,
}: ISpendingSummaryRowProps) => (
  <View style={tw`flex-row items-center py-2`}>
    <ColorDot color={color} size={16} />
    <Text style={tw`flex-1 ml-3 text-xs text-grey-500`}>{label}</Text>
    <Text style={tw`text-sm font-bold text-grey-900`}>{amount}</Text>
  </View>
)
