import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { cardVariants } from '../../variants'

import type { ICardProps } from './Card'

/** Native implementation of the Card component. */
export const Card = ({ title, text, children, style }: ICardProps) => {
  const baseClasses = cardVariants()

  return (
    <View style={[tw`${baseClasses} shadow-md`, style]}>
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
