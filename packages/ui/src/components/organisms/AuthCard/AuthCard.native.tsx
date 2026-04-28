import { View } from 'react-native'

import tw from '#Lib/tw'

import { shared } from './AuthCard.styles'

import type { IAuthCardProps } from './AuthCard'

import { Typography } from '#Atoms'

/** Native implementation of the AuthCard component. */
export const AuthCard = ({
  title,
  children,
  footer,
}: Readonly<IAuthCardProps>) => (
  <View style={tw`${shared.root} px-5`}>
    <Typography variant="heading-lg">{title}</Typography>
    <View style={tw`${shared.childrenWrap}`}>{children}</View>
    {footer ? <View>{footer}</View> : null}
  </View>
)
