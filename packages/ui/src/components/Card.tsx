import React from 'react'
import { Text, View, ViewStyle } from 'react-native'

import tw from '../lib/tw'

interface CardProps {
  title: string
  text?: string
  children?: React.ReactNode
  style?: ViewStyle
}

export const Card: React.FC<CardProps> = ({ title, text, children, style }) => {
  return (
    <View style={[tw`bg-white rounded-xl p-4 shadow-md`, style]}>
      <Text style={tw`text-lg font-semibold text-foreground mb-2`}>
        {title}
      </Text>
      {text && (
        <Text style={tw`text-sm text-foreground-muted leading-5`}>{text}</Text>
      )}
      {children && (
        <View style={tw`mt-3`}>
          {typeof children === 'string' ? (
            <Text style={tw`text-sm text-foreground-muted leading-5`}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  )
}
