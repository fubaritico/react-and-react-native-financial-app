import { cn } from '#Lib/cn'

import { web } from './Skeleton.styles'
import { skeletonVariants } from './Skeleton.variants'

import type { ISkeletonProps } from './Skeleton'

/** Rounding class based on variant + rounded prop */
function getRoundedClass(
  variant: ISkeletonProps['variant'],
  rounded: boolean
): string {
  if (variant === 'circle') return 'rounded-full'
  if (variant === 'line' && rounded) return 'rounded'
  if (variant === 'rectangle' && rounded) return 'rounded-lg'
  return ''
}

/** Web implementation of the Skeleton component. */
export function Skeleton({
  variant = 'rectangle',
  width,
  height,
  aspectRatio,
  rounded = true,
  className,
}: Readonly<ISkeletonProps>) {
  return (
    <div
      className={cn(
        skeletonVariants(),
        getRoundedClass(variant, rounded),
        web.shimmer,
        width,
        height,
        className
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    />
  )
}
