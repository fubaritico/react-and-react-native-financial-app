import type { balanceCardVariants } from './BalanceCard.variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the BalanceCard component. */
export interface IBalanceCardProps extends VariantProps<
  typeof balanceCardVariants
> {
  /** Label text (e.g., "Current Balance", "Income"). */
  label: string
  /** Numeric amount to display (formatted via Currency atom). */
  amount: number
  /** If true, will display a shadow. */
  shadow?: boolean
}
