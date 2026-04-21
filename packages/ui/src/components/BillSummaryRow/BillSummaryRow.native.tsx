import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { coloredBorderItemVariants } from '../../variants'

import type { IBillSummaryRowProps } from './BillSummaryRow'

/** Native implementation of the BillSummaryRow component. */
export const BillSummaryRow = ({
  label,
  amount,
  color,
}: IBillSummaryRowProps) => (
  <View
    style={[
      tw`${coloredBorderItemVariants({ layout: 'row' })} bg-beige-100`,
      { borderLeftWidth: 4, borderLeftColor: tw.color(color) },
    ]}
  >
    <Text style={tw`text-xs text-grey-500`}>{label}</Text>
    <Text style={tw`text-sm font-bold text-grey-900`}>{amount}</Text>
  </View>
)
