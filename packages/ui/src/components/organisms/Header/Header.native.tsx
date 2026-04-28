import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './Header.styles'
import { headerVariants } from './Header.variants'

import type { IHeaderProps } from './Header'

import { Typography } from '#Atoms'

/** Native implementation of the Header component. */
export const Header = ({ title, subtitle }: Readonly<IHeaderProps>) => (
  <View style={tw`${headerVariants()}`}>
    <Typography variant="heading-lg" color="on-dark">
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body" color="on-dark" style={tw`${shared.subtitle}`}>
        {subtitle}
      </Typography>
    )}
  </View>
)
