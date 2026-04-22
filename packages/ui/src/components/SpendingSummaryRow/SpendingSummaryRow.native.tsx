import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { ColorDot } from '../ColorDot/ColorDot.native'

import styles from './SpendingSummaryRow.styles'

import type { ISpendingSummaryRowProps } from './SpendingSummaryRow'

/** Native implementation of the SpendingSummaryRow component. */
export const SpendingSummaryRow = ({
  label,
  amount,
  color,
}: ISpendingSummaryRowProps) => (
  <View style={tw`flex-row items-center py-2`}>
    <ColorDot color={color} size={16} />
    <Text style={tw`${styles.label}`}>{label}</Text>
    <Text style={tw`${styles.amount}`}>{amount}</Text>
  </View>
)
