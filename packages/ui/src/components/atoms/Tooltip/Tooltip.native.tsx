import { useCallback, useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native'

import { resolveColor } from '#Lib/resolveColor'
import tw from '#Lib/tw'

import { Portal } from '#Atoms/Portal/Portal.native'

import { ARROW_SIZE, DEFAULT_OFFSET, getArrowColor } from './Tooltip.constants'
import { native, shared } from './Tooltip.styles'
import { tooltipVariants } from './Tooltip.variants'
import { computeTooltipPosition } from './useTooltipPosition'

import type {
  ITooltipPosition,
  ITooltipProps,
  TooltipPlacement,
} from './Tooltip'
import type { RefObject } from 'react'
import type { LayoutChangeEvent } from 'react-native'

/** Primary axis extracted from a placement string. */
type PrimaryAxis = 'top' | 'bottom' | 'left' | 'right'

/** Arrow rotation per primary axis — rotates a downward-pointing triangle. */
const ARROW_ROTATION: Record<PrimaryAxis, string> = {
  top: '180deg',
  bottom: '0deg',
  left: '90deg',
  right: '-90deg',
}

/**
 * Extract the primary axis from a placement string.
 *
 * @param placement - full placement (e.g. 'top-left', 'right')
 * @returns the primary axis direction
 */
function getPrimaryAxis(placement: TooltipPlacement): PrimaryAxis {
  return placement.split('-')[0] as PrimaryAxis
}

/** Native implementation of the Tooltip component. */
export function Tooltip({
  content,
  visible,
  placement = 'bottom',
  offset = DEFAULT_OFFSET,
  variant = 'dark',
  mode = 'target',
  targetRef,
  position: manualPosition,
  width,
  className,
  accessibilityLabel,
}: Readonly<ITooltipProps>) {
  const [tooltipPos, setTooltipPos] = useState<ITooltipPosition | null>(null)
  const [effectivePlacement, setEffectivePlacement] =
    useState<TooltipPlacement>(placement)
  const [bubbleSize, setBubbleSize] = useState<{
    width: number
    height: number
  } | null>(null)

  /** Measure the bubble after layout to compute final position. */
  const handleBubbleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setBubbleSize({ width, height })
  }, [])

  const measureAndPosition = useCallback(() => {
    if (!visible) {
      setTooltipPos(null)
      return
    }

    if (mode === 'manual' && manualPosition) {
      setTooltipPos({
        top: manualPosition.top,
        left: manualPosition.left,
        arrow: { top: 0, left: 0 },
      })
      setEffectivePlacement(placement)
      return
    }

    if (targetRef && bubbleSize) {
      const viewRef = targetRef as RefObject<View>
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- .current is nullable after type cast
      viewRef.current?.measureInWindow((x, y, width, height) => {
        const result = computeTooltipPosition(
          { x, y, width, height },
          bubbleSize,
          placement,
          offset,
          {
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }
        )

        setTooltipPos(result.position)
        setEffectivePlacement(result.effectivePlacement)
      })
    }
  }, [visible, mode, manualPosition, targetRef, bubbleSize, placement, offset])

  useEffect(() => {
    measureAndPosition()
  }, [measureAndPosition])

  if (!visible) return null

  const arrowColorToken = getArrowColor(variant, 'native')
  const resolvedArrowColor = resolveColor(arrowColorToken)
  const primaryAxis = getPrimaryAxis(effectivePlacement)
  const arrowRotation = ARROW_ROTATION[primaryAxis]

  return (
    <Portal>
      {/* Bubble */}
      <View
        onLayout={handleBubbleLayout}
        accessibilityRole="summary"
        accessibilityLabel={accessibilityLabel}
        style={[
          tw`${tooltipVariants({ variant })} ${shared.bubble} ${native.bubble}`,
          className ? tw`${className}` : undefined,
          width != null ? { width } : undefined,
          tooltipPos
            ? { top: tooltipPos.top, left: tooltipPos.left }
            : { opacity: 0 },
        ]}
      >
        {content}
      </View>

      {/* Arrow */}
      {tooltipPos?.arrow && mode === 'target' && (
        <View
          style={[
            tw`${native.arrow}`,
            {
              position: 'absolute',
              top: tooltipPos.arrow.top,
              left: tooltipPos.arrow.left,
              borderLeftWidth: ARROW_SIZE,
              borderRightWidth: ARROW_SIZE,
              borderBottomWidth: ARROW_SIZE,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: resolvedArrowColor,
              transform: [{ rotate: arrowRotation }],
            },
          ]}
        />
      )}
    </Portal>
  )
}
