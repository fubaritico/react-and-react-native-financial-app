import { Text, View } from 'react-native'

import tw from '../../lib/tw'

import styles from './StatCard.styles'
import { statCardVariants } from './StatCard.variants'

import type { IStatCardProps } from './StatCard'

/** Native implementation of the StatCard component. */
export const StatCard = ({ label, amount, color }: IStatCardProps) => (
  <View style={tw`${statCardVariants()} border-l-${color}`}>
    <Text style={tw`${styles.label}`}>{label}</Text>
    <Text style={tw`${styles.amount}`}>{amount}</Text>
  </View>
)
