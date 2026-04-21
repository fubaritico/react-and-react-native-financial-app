import { View } from 'react-native'

import tw from '../../lib/tw'

import type { IDividerProps } from './Divider'

const spacingMap = {
  sm: 'my-1',
  md: 'my-2',
  lg: 'my-4',
} as const

/** Native implementation of the Divider component. */
export const Divider = ({ spacing = 'md' }: IDividerProps) => (
  <View style={tw`h-px w-full bg-grey-100 ${spacingMap[spacing]}`} />
)
