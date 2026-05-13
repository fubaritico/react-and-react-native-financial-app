import type { progressBarVariants } from './ProgressBar.variants'
import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

/** Props for the ProgressBar component. */
export interface IProgressBarProps extends VariantProps<
  typeof progressBarVariants
> {
  /** Current value (amount filled). */
  value: number
  /** Maximum value (total capacity). Defaults to 100. */
  max?: number
  /** Token color name for the filled portion (e.g. "green", "cyan"). */
  color: string
  /** Buffer value stacked after the primary fill (same unit as value, not %). */
  buffer?: number
  /** Color intent for the buffer segment. */
  bufferColor?: 'success' | 'destructive'
  /** Content rendered below the bar on the left side. */
  metaLeft?: ReactNode
  /** Content rendered below the bar on the right side. */
  metaRight?: ReactNode
}
