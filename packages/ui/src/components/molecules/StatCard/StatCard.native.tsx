import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Typography } from '../../atoms/Typography/Typography.native'

import { statCardVariants } from './StatCard.variants'

import type { IStatCardProps } from './StatCard'

/** Native implementation of the StatCard component. */
export const StatCard = ({ label, amount, color }: IStatCardProps) => (
  <View style={tw`${statCardVariants()} border-l-${color}`}>
    <Typography variant="caption" color="muted">
      {label}
    </Typography>
    <Typography variant="body-bold">{amount}</Typography>
  </View>
)
