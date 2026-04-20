import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import type { ViewStyle } from 'react-native'

import type { cardVariants } from '../../variants'

/** Props for the Card component. */
export interface ICardProps extends VariantProps<typeof cardVariants> {
  /** Card heading text. */
  title: string
  /** Optional body text below the title. */
  text?: string
  /** Optional child elements rendered below the body text. */
  children?: ReactNode
  /** Optional style override (native only). */
  style?: ViewStyle | object
}

export { cardVariants } from '../../variants'
