import { View } from 'react-native'

import { NATIVE_BOX_SHADOW } from '#Lib/shadow'
import tw from '#Lib/tw'

import { statCardVariants } from './StatCard.variants'

import type { IStatCardProps } from './StatCard'

import { Typography } from '#Atoms'

/** Native implementation of the StatCard component. */
export const StatCard = ({
  label,
  amount,
  color,
  shadow,
}: Readonly<IStatCardProps>) => (
  <View
    style={[
      tw`${statCardVariants()} border-l-${color}`,
      shadow && { boxShadow: NATIVE_BOX_SHADOW },
    ]}
  >
    <Typography variant="caption" color="muted">
      {label}
    </Typography>
    <Typography variant="body-bold">{amount}</Typography>
  </View>
)
