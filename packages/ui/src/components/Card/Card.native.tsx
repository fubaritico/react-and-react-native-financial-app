import { Text, View } from 'react-native'

import tw from '../../lib/tw'
import { cardVariants } from '../../variants'

import styles from './Card.styles'

import type { ICardProps } from './Card'

/** Native implementation of the Card component. */
export const Card = ({ title, text, children, style }: ICardProps) => {
  const baseClasses = cardVariants()

  return (
    <View style={[tw`${baseClasses} shadow-md`, style]}>
      <Text style={tw`${styles.title}`}>{title}</Text>
      {text && <Text style={tw`${styles.text}`}>{text}</Text>}
      {children && (
        <View style={tw`${styles.childrenWrap}`}>
          {typeof children === 'string' ? (
            <Text style={tw`${styles.text}`}>{children}</Text>
          ) : (
            children
          )}
        </View>
      )}
    </View>
  )
}
