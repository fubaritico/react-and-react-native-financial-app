import { View } from 'react-native'

import tw from '../../lib/tw'

import type { IColorDotProps } from './ColorDot'

/** Native implementation of the ColorDot component. */
export const ColorDot = ({ color, size = 16 }: IColorDotProps) => (
  <View
    accessibilityLabel={`${color} indicator`}
    accessibilityRole="image"
    style={[tw`bg-${color} rounded-full`, { width: size, height: size }]}
  />
)
