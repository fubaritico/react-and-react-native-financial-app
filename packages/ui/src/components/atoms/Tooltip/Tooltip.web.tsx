import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '#Lib/cn'

import { Portal } from '#Atoms/Portal/Portal.web'

import { DEFAULT_OFFSET, getArrowColor } from './Tooltip.constants'
import { shared, web } from './Tooltip.styles'
import { tooltipVariants } from './Tooltip.variants'
import { computeTooltipPosition } from './useTooltipPosition'

import type {
  ITooltipPosition,
  ITooltipProps,
  TooltipPlacement,
} from './Tooltip'
import type { RefObject } from 'react'

/** Primary axis extracted from a placement string. */
type PrimaryAxis = 'top' | 'bottom' | 'left' | 'right'

/** Border style for the arrow per primary axis direction. */
const ARROW_BORDER: Record<PrimaryAxis, string> = {
  top: 'border-b-0 border-t-[6px]',
  bottom: 'border-t-0 border-b-[6px]',
  left: 'border-r-0 border-l-[6px]',
  right: 'border-l-0 border-r-[6px]',
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

/** Web implementation of the Tooltip component. */
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
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [tooltipPos, setTooltipPos] = useState<ITooltipPosition | null>(null)
  const [effectivePlacement, setEffectivePlacement] =
    useState<TooltipPlacement>(placement)

  const updatePosition = useCallback(() => {
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

    if (targetRef) {
      const targetEl = (targetRef as RefObject<HTMLElement>).current
      const bubbleEl = bubbleRef.current
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- .current is nullable at runtime
      if (!targetEl || !bubbleEl) return

      const targetRect = targetEl.getBoundingClientRect()
      const bubbleRect = bubbleEl.getBoundingClientRect()

      const result = computeTooltipPosition(
        {
          x: targetRect.left,
          y: targetRect.top,
          width: targetRect.width,
          height: targetRect.height,
        },
        { width: bubbleRect.width, height: bubbleRect.height },
        placement,
        offset,
        { width: window.innerWidth, height: window.innerHeight }
      )

      setTooltipPos(result.position)
      setEffectivePlacement(result.effectivePlacement)
    }
  }, [visible, mode, manualPosition, targetRef, placement, offset])

  useEffect(() => {
    updatePosition()
  }, [updatePosition])

  useEffect(() => {
    if (!visible) return

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [visible, updatePosition])

  if (!visible) return null

  const arrowColor = getArrowColor(variant, 'web')

  return (
    <Portal>
      <div
        ref={bubbleRef}
        role="tooltip"
        aria-label={accessibilityLabel}
        data-name="tooltip"
        className={cn(
          tooltipVariants({ variant }),
          shared.bubble,
          web.bubble,
          web.portal,
          className
        )}
        style={{
          top: tooltipPos?.top ?? 0,
          left: tooltipPos?.left ?? 0,
          opacity: tooltipPos ? 1 : 0,
          ...(width != null && { width }),
        }}
      >
        {content}
        {tooltipPos?.arrow != null && mode === 'target' && (
          <div
            data-name="tooltip-arrow"
            className={cn(
              web.arrow,
              ARROW_BORDER[getPrimaryAxis(effectivePlacement)]
            )}
            style={{
              top: tooltipPos.arrow.top,
              left: tooltipPos.arrow.left,
              borderColor: 'transparent',
              [`border${capitalize(getPrimaryAxis(effectivePlacement))}Color`]:
                arrowColor,
            }}
          />
        )}
      </div>
    </Portal>
  )
}

/**
 * Capitalize the first letter of a string.
 *
 * @param s - string to capitalize
 * @returns capitalized string (e.g. 'bottom' -> 'Bottom')
 */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
