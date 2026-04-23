import { Text, View } from 'react-native'

import tw from '../../lib/tw'

import styles from './BillSummaryRow.styles'
import { billSummaryRowVariants } from './BillSummaryRow.variants'

import type { IBillSummaryRowProps } from './BillSummaryRow'

/** Native implementation of the BillSummaryRow component. */
export const BillSummaryRow = ({
  label,
  amount,
  color,
}: IBillSummaryRowProps) => (
  <View style={tw`${billSummaryRowVariants()} border-l-${color}`}>
    <Text style={tw`${styles.label}`}>{label}</Text>
    <Text style={tw`${styles.amount}`}>{amount}</Text>
  </View>
)
