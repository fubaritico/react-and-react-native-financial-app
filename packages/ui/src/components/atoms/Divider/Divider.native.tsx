import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './Divider.styles'

import type { IDividerProps } from './Divider'

/** Native implementation of the Divider component. */
export const Divider = ({ spacing = 'md' }: Readonly<IDividerProps>) => (
  <View style={tw`${shared.base} ${shared.spacing[spacing]}`} />
)
