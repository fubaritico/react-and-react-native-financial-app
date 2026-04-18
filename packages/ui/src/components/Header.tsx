import React from 'react'
import { Text, View } from 'react-native'

import tw from '../lib/tw'

interface HeaderProps {
  title: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <View style={tw`py-4 px-5 bg-primary`}>
      <Text style={tw`text-2xl font-bold text-white`}>{title}</Text>
      {subtitle && (
        <Text style={tw`text-sm text-white opacity-80 mt-1`}>{subtitle}</Text>
      )}
    </View>
  )
}
