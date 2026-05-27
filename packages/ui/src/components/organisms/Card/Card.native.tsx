import { View, useWindowDimensions } from 'react-native'

import { NATIVE_BOX_SHADOW } from '#Lib/shadow'
import tw from '#Lib/tw'

import { TABLET_BREAKPOINT } from './Card.constants'
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
  shadow,
}: Readonly<ICardProps>) => {
  const { width } = useWindowDimensions()
  const responsivePadding = width >= TABLET_BREAKPOINT ? 'p-6' : 'p-4'
  return (
    <View
      style={[
        tw`${cardVariants()} ${responsivePadding}`,
        shadow && { boxShadow: NATIVE_BOX_SHADOW },
        style,
      ]}
    >
      {title && (
        <Typography
          variant="subsection-title"
          style={tw`${shared.titleSpacing}`}
        >
          {title}
        </Typography>
      )}
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
}
