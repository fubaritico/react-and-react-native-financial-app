import type { headerVariants } from './Header.variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the Header component. */
export interface IHeaderProps extends VariantProps<typeof headerVariants> {
  /** Main heading text. */
  title: string
  /** Optional secondary text below the title. */
  subtitle?: string
}
