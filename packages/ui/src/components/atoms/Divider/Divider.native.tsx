import { View } from 'react-native'

import tw from '../../../lib/tw'

import styles from './Divider.styles'

import type { IDividerProps } from './Divider'

/** Native implementation of the Divider component. */
export const Divider = ({ spacing = 'md' }: IDividerProps) => (
  <View style={tw`${styles.base} ${styles.spacing[spacing]}`} />
)
