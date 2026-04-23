import type { IColorDotProps } from './ColorDot'
import type { CSSProperties } from 'react'

/** Web implementation of the ColorDot component. */
export const ColorDot = ({ color, size = 16 }: IColorDotProps) => (
  <span
    role="img"
    aria-label={`${color} indicator`}
    className="inline-block rounded-full bg-[var(--dot-color)] w-[var(--dot-size)] h-[var(--dot-size)]"
    style={
      {
        '--dot-color': `var(--color-base-${color}-DEFAULT)`,
        '--dot-size': `${String(size)}px`,
      } as CSSProperties
    }
  />
)
