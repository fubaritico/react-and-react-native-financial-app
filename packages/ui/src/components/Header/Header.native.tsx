import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { headerVariants } from '../../variants'

import type { IHeaderProps } from './Header'

/** Native implementation of the Header component. */
export const Header = ({ title, subtitle }: IHeaderProps) => (
  <View style={tw`${headerVariants()}`}>
    <Text style={tw`text-2xl font-bold text-white`}>{title}</Text>
    {subtitle && (
      <Text style={tw`text-sm text-white opacity-80 mt-1`}>{subtitle}</Text>
    )}
  </View>
)
