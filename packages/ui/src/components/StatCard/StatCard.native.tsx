import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { coloredBorderItemVariants } from '../../variants'

import type { IStatCardProps } from './StatCard'

/** Native implementation of the StatCard component. */
export const StatCard = ({ label, amount, color }: IStatCardProps) => (
  <View
    style={[
      tw`${coloredBorderItemVariants({ layout: 'stacked' })}`,
      { borderLeftWidth: 4, borderLeftColor: tw.color(color) },
    ]}
  >
    <Text style={tw`text-xs text-grey-500`}>{label}</Text>
    <Text style={tw`text-sm font-bold text-grey-900`}>{amount}</Text>
  </View>
)
