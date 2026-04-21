import { Text, View } from 'react-native'

import tw from '../../lib/tw'

import type { IAuthCardProps } from './AuthCard'

/** Native implementation of the AuthCard component. */
export const AuthCard = ({ title, children, footer }: IAuthCardProps) => (
  <View style={tw`bg-white rounded-lg px-5 py-8 gap-8`}>
    <Text style={tw`text-2xl font-bold text-grey-900`}>{title}</Text>
    <View style={tw`gap-4`}>{children}</View>
    {footer ? <View>{footer}</View> : null}
  </View>
)
