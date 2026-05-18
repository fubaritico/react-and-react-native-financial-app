import { cva } from 'class-variance-authority'

export const modeCardVariants = cva('bg-card rounded-xl', {
  variants: {
    /** Whether the card is non-interactive */
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: {},
})
