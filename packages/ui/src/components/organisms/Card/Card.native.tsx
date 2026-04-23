import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Typography } from '../../atoms/Typography/Typography.native'

import styles from './Card.styles'
import { cardVariants } from './Card.variants'

import type { ICardProps } from './Card'

/** Native implementation of the Card component. */
export const Card = ({ title, text, children, style }: ICardProps) => (
  <View style={[tw`${cardVariants()}`, style]}>
    <Typography variant="subsection-title" style={tw`mb-2`}>
      {title}
    </Typography>
    {text && (
      <Typography variant="body" color="muted">
        {text}
      </Typography>
    )}
    {children && (
      <View style={tw`${styles.childrenWrap}`}>
        {typeof children === 'string' ? (
          <Typography variant="body" color="muted">
            {children}
          </Typography>
        ) : (
          children
        )}
      </View>
    )}
  </View>
)
