import { View } from 'react-native'

import tw from '../../../lib/tw'
import { Typography } from '../../atoms/Typography/Typography.native'

import styles from './AuthCard.styles'

import type { IAuthCardProps } from './AuthCard'

/** Native implementation of the AuthCard component. */
export const AuthCard = ({ title, children, footer }: IAuthCardProps) => (
  <View style={tw`bg-card rounded-lg px-5 py-8 gap-8`}>
    <Typography variant="heading-lg">{title}</Typography>
    <View style={tw`${styles.childrenWrap}`}>{children}</View>
    {footer ? <View>{footer}</View> : null}
  </View>
)
