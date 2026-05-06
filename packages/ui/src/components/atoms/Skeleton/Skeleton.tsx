import type { SkeletonVariants } from './Skeleton.variants'

/** Shape variant for the skeleton placeholder */
export type SkeletonVariant = 'rectangle' | 'circle' | 'line'

export interface ISkeletonProps extends SkeletonVariants {
  /** Shape variant */
  variant?: SkeletonVariant
  /** Width (Tailwind class, e.g. 'w-32') */
  width?: string
  /** Height (Tailwind class, e.g. 'h-8') */
  height?: string
  /** Aspect ratio (e.g. '16/9', '1/1') */
  aspectRatio?: string
  /** Apply rounded corners (default: true for rectangle/line, always true for circle) */
  rounded?: boolean
  /** Additional CSS classes for layout (web only — margin, flex, grid positioning) */
  className?: string
}
