import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './Card.styles'
import { cardVariants } from './Card.variants'

import type { ICardProps } from './Card'

import { Typography } from '#Atoms'

/** Native implementation of the Card component. */
export const Card = ({
  title,
  text,
  children,
  style,
}: Readonly<ICardProps>) => (
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
      <View style={tw`${shared.childrenWrap}`}>
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
