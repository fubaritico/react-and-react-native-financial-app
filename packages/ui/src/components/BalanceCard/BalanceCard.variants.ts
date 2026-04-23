import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

export const balanceCardVariants = cva('rounded-xl p-5 flex-col gap-2', {
  variants: {
    tone: {
      dark: 'bg-grey-900',
      light: 'bg-white',
    },
  },
  defaultVariants: { tone: 'light' },
})

export type BalanceCardVariants = VariantProps<typeof balanceCardVariants>
