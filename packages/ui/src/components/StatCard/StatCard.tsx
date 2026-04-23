import type { statCardVariants } from './StatCard.variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the StatCard component. */
export interface IStatCardProps extends VariantProps<typeof statCardVariants> {
  /** Label text (e.g., "Savings", "Gift"). */
  label: string
  /** Amount to display, formatted as currency string. */
  amount: string
  /** Token color name for the left border (e.g., "green", "navy"). */
  color: string
}
