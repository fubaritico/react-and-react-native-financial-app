import type { balanceCardVariants } from '../../variants'
import type { VariantProps } from 'class-variance-authority'

/** Props for the BalanceCard component. */
export interface IBalanceCardProps extends VariantProps<
  typeof balanceCardVariants
> {
  /** Label text (e.g., "Current Balance", "Income"). */
  label: string
  /** Amount to display, formatted as currency string. */
  amount: string
}

export { balanceCardVariants } from '../../variants'
