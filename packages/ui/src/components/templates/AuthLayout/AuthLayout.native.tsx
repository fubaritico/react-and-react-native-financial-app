import { ScrollView, View } from 'react-native'

import tw from '#Lib/tw'

import type { IAuthLayoutProps } from './AuthLayout'

import { Typography } from '#Atoms'

/** Native implementation of the AuthLayout component. */
export function AuthLayout({ children, appName }: Readonly<IAuthLayoutProps>) {
  return (
    <ScrollView
      style={tw`flex-1 bg-beige-100`}
      contentContainerStyle={tw`flex-grow`}
    >
      <View style={tw`bg-card-dark py-6 px-10 items-center rounded-b-lg`}>
        <Typography variant="section-title" color="on-dark">
          {appName}
        </Typography>
      </View>
      <View style={tw`flex-1 justify-center items-center px-4 py-10`}>
        {children}
      </View>
    </ScrollView>
  )
}
