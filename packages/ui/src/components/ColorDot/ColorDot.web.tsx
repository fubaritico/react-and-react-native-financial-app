import type { IColorDotProps } from './ColorDot'

/** Web implementation of the ColorDot component. */
export const ColorDot = ({ color, size = 16 }: IColorDotProps) => (
  <span
    role="img"
    aria-label={`${color} indicator`}
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: `var(--color-base-${color}-default)`,
    }}
  />
)
