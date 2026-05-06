import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

import tw from '#Lib/tw'

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

/** Native implementation of the Skeleton component — pulse opacity shimmer. */
export function Skeleton({
  variant = 'rectangle',
  width,
  height,
  aspectRatio,
  rounded = true,
}: Readonly<ISkeletonProps>) {
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    )
    animation.start()
    return () => {
      animation.stop()
    }
  }, [opacity])

  const roundedClass = getRoundedClass(variant, rounded)

  return (
    <Animated.View
      style={[
        tw`${skeletonVariants()} ${roundedClass} ${width ?? ''} ${height ?? ''}`,
        { opacity },
        aspectRatio ? { aspectRatio } : undefined,
      ]}
    />
  )
}
