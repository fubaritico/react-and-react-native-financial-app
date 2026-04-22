import { Text, View } from 'react-native'

import tw from '../../lib/tw'

import styles from './AuthCard.styles'

import type { IAuthCardProps } from './AuthCard'

/** Native implementation of the AuthCard component. */
export const AuthCard = ({ title, children, footer }: IAuthCardProps) => (
  <View style={tw`bg-white rounded-lg px-5 py-8 gap-8`}>
    <Text style={tw`${styles.title}`}>{title}</Text>
    <View style={tw`${styles.childrenWrap}`}>{children}</View>
    {footer ? <View>{footer}</View> : null}
  </View>
)
