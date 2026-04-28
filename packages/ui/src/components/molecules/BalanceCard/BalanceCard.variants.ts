import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/** CVA variants for the BalanceCard component — controls background tone (dark/light card surface) */
export const balanceCardVariants = cva('rounded-xl p-5 flex-col gap-2', {
  variants: {
    tone: {
      dark: 'bg-card-dark',
      light: 'bg-card',
    },
  },
  defaultVariants: { tone: 'light' },
})

export type BalanceCardVariants = VariantProps<typeof balanceCardVariants>
