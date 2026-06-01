import { cva } from 'class-variance-authority'

import type { VariantProps } from 'class-variance-authority'

/**
 * CVA variants for a single SegmentedControl segment — selection state only.
 *
 * Selection drives the fill and the border colour (black when selected, muted
 * otherwise). Every segment draws top/bottom/left borders here; the positional
 * classes (closing right border + leftmost/rightmost rounded corners) live in
 * `.styles.ts` and are applied by index, since they derive from position, not state.
 */
export const segmentVariants = cva(
  'flex flex-row items-center justify-center border-l border-t border-b px-4 py-3 bg-clip-border',
  {
    variants: {
      /** Whether this segment is the currently selected radio option. */
      selected: {
        true: 'border-foreground bg-foreground',
        false: 'border-border-muted bg-card',
      },
    },
    defaultVariants: { selected: false },
  }
)

/** Variant props accepted by `segmentVariants` — drives the segment's selected visual state. */
export type SegmentVariants = VariantProps<typeof segmentVariants>
