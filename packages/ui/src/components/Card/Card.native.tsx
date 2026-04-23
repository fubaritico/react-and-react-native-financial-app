import { Text, View } from 'react-native'

import tw from '../../lib/tw'

import styles from './Card.styles'
import { cardVariants } from './Card.variants'

import type { ICardProps } from './Card'

/** Native implementation of the Card component. */
export const Card = ({ title, text, children, style }: ICardProps) => (
  <View style={[tw`${cardVariants()}`, style]}>
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
