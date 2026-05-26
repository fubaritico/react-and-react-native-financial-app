import { ScrollView, View } from 'react-native'

import tw from '#Lib/tw'

import type { IAuthLayoutProps } from './AuthLayout'

/** Native implementation of the AuthLayout component. */
export function AuthLayout({ children }: Readonly<IAuthLayoutProps>) {
  return (
    <ScrollView
      style={tw`flex-1 bg-beige-200`}
      contentContainerStyle={tw`flex-grow`}
    >
      <View style={tw`flex-1 justify-center px-4 py-10`}>{children}</View>
    </ScrollView>
  )
}
