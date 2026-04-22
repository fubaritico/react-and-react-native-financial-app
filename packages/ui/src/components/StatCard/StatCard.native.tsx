import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { coloredBorderItemVariants } from '../../variants'

import styles from './StatCard.styles'

import type { IStatCardProps } from './StatCard'

/** Native implementation of the StatCard component. */
export const StatCard = ({ label, amount, color }: IStatCardProps) => (
  <View
    style={tw`${coloredBorderItemVariants({ layout: 'stacked' })} border-l-4 border-l-${color}`}
  >
    <Text style={tw`${styles.label}`}>{label}</Text>
    <Text style={tw`${styles.amount}`}>{amount}</Text>
  </View>
)
