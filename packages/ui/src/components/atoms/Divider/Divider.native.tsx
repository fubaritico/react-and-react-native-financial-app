import { View } from 'react-native'

import tw from '#Lib/tw'

import styles from './Divider.styles'

import type { IDividerProps } from './Divider'

/** Native implementation of the Divider component. */
export const Divider = ({ spacing = 'md' }: Readonly<IDividerProps>) => (
  <View style={tw`${styles.base} ${styles.spacing[spacing]}`} />
)
