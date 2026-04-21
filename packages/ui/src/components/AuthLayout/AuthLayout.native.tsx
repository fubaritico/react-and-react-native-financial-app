import { ScrollView, Text, View } from 'react-native'

import tw from '../../lib/tw'

import type { IAuthLayoutProps } from './AuthLayout'

/** Native implementation of the AuthLayout component. */
export const AuthLayout = ({ children }: IAuthLayoutProps) => (
  <ScrollView
    style={tw`flex-1 bg-beige-100`}
    contentContainerStyle={tw`flex-grow`}
  >
    <View style={tw`bg-grey-900 py-6 px-10 items-center rounded-b-lg`}>
      <Text style={tw`text-white text-xl font-bold`}>finance</Text>
    </View>
    <View style={tw`flex-1 justify-center items-center px-4 py-10`}>
      {children}
    </View>
  </ScrollView>
)
