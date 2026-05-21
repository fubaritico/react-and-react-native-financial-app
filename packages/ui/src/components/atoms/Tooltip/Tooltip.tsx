import type { tooltipVariants } from './Tooltip.variants'
import type { VariantProps } from 'class-variance-authority'
import type { ReactNode, RefObject } from 'react'
import type { View } from 'react-native'

/** Supported tooltip placement relative to the target. */
export type TooltipPlacement =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom'

/** Manual positioning coordinates for the tooltip bubble. */
export interface ITooltipManualPosition {
  /** Distance from the top of the container (or viewport on web). */
  top: number
  /** Distance from the left of the container (or viewport on web). */
  left: number
}

/** Computed position for both the bubble and its arrow. */
export interface ITooltipPosition {
  /** Top offset for the tooltip bubble. */
  top: number
  /** Left offset for the tooltip bubble. */
  left: number
  /** Arrow position relative to the bubble. */
  arrow: {
    /** Top offset for the arrow element. */
    top: number
    /** Left offset for the arrow element. */
    left: number
  }
}

/** Measurements of a rectangular element used for positioning calculations. */
export interface IElementMeasurements {
  /** X coordinate of the element's left edge. */
  x: number
  /** Y coordinate of the element's top edge. */
  y: number
  /** Element width in pixels. */
  width: number
  /** Element height in pixels. */
  height: number
}

/** Props for the Tooltip component. */
export interface ITooltipProps extends VariantProps<typeof tooltipVariants> {
  /** Content rendered inside the tooltip bubble. */
  content: ReactNode
  /** Whether the tooltip is currently visible (controlled by parent). */
  visible: boolean
  /** Preferred placement of the tooltip relative to the target. May flip if not enough space. */
  placement?: TooltipPlacement
  /** Distance in pixels between the target element and the tooltip bubble. */
  offset?: number
  /** Additional CSS classes for the tooltip bubble (web: className, native: tw classes). */
  className?: string
  /**
   * Mode `'target'`: tooltip positions itself relative to `targetRef`.
   * Mode `'manual'`: tooltip is placed at the coordinates given in `position`.
   */
  mode?: 'target' | 'manual'
  /** Ref to the target element the tooltip anchors to. Required when `mode` is `'target'`. */
  targetRef?: RefObject<HTMLElement | null> | RefObject<View | null>
  /** Explicit coordinates for the tooltip. Required when `mode` is `'manual'`. */
  position?: ITooltipManualPosition
  /** Fixed width in pixels for the tooltip bubble. When set, text wraps to multiple lines. */
  width?: number
  /** Accessible label describing the tooltip content for screen readers. */
  accessibilityLabel?: string
}
