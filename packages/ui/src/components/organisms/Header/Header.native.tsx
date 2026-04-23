import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Typography } from '../../atoms/Typography/Typography.native'

import { headerVariants } from './Header.variants'

import type { IHeaderProps } from './Header'

/** Native implementation of the Header component. */
export const Header = ({ title, subtitle }: IHeaderProps) => (
  <View style={tw`${headerVariants()}`}>
    <Typography variant="heading-lg" color="on-dark">
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body" color="on-dark" style={tw`opacity-80 mt-1`}>
        {subtitle}
      </Typography>
    )}
  </View>
)
