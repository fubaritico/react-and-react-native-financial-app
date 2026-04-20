import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { headerVariants } from '../../variants'

import type { HeaderProps } from './Header'

/** Native implementation of the Header component. */
export const Header = ({ title, subtitle }: HeaderProps) => (
  <View style={tw`${headerVariants()}`}>
    <Text style={tw`text-2xl font-bold text-white`}>{title}</Text>
    {subtitle && (
      <Text style={tw`text-sm text-white opacity-80 mt-1`}>{subtitle}</Text>
    )}
  </View>
)
