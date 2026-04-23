import { Text, View } from 'react-native'

import tw from '../../lib/tw'

import styles from './Header.styles'
import { headerVariants } from './Header.variants'

import type { IHeaderProps } from './Header'

/** Native implementation of the Header component. */
export const Header = ({ title, subtitle }: IHeaderProps) => (
  <View style={tw`${headerVariants()}`}>
    <Text style={tw`${styles.title}`}>{title}</Text>
    {subtitle && <Text style={tw`${styles.subtitle}`}>{subtitle}</Text>}
  </View>
)
