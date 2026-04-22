import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { coloredBorderItemVariants } from '../../variants'

import styles from './BillSummaryRow.styles'

import type { IBillSummaryRowProps } from './BillSummaryRow'

/** Native implementation of the BillSummaryRow component. */
export const BillSummaryRow = ({
  label,
  amount,
  color,
}: IBillSummaryRowProps) => (
  <View
    style={tw`${coloredBorderItemVariants({ layout: 'row' })} bg-beige-100 border-l-4 border-l-${color}`}
  >
    <Text style={tw`${styles.label}`}>{label}</Text>
    <Text style={tw`${styles.amount}`}>{amount}</Text>
  </View>
)
