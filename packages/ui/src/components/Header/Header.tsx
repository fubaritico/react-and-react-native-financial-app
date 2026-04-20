import type { VariantProps } from 'class-variance-authority'

import type { headerVariants } from '../../variants'

/** Props for the Header component. */
export interface HeaderProps extends VariantProps<typeof headerVariants> {
  /** Main heading text. */
  title: string
  /** Optional secondary text below the title. */
  subtitle?: string
}

export { headerVariants } from '../../variants'
