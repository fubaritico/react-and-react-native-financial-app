import Svg, { Circle, Path } from 'react-native-svg'

import { iconData } from '../generated/iconData'

import type { IIconNativeProps } from './Icon'

const DEFAULT_NATIVE_COLOR = '#201F24'

/**
 * Renders an SVG icon by name using react-native-svg.
 * Color defaults to the app's dark text color.
 */
export function Icon({
  name,
  size = 24,
  color = DEFAULT_NATIVE_COLOR,
  accessibilityLabel,
  ...rest
}: IIconNativeProps) {
  const icon = iconData[name]

  return (
    <Svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="none"
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      {...rest}
    >
      {icon.elements.map((el, i) => {
        if ('type' in el && el.type === 'circle') {
          return (
            <Circle
              key={i}
              cx={el.cx}
              cy={el.cy}
              r={el.r}
              fill={el.fill ?? color}
            />
          )
        }

        return (
          <Path
            key={i}
            d={el.d}
            fill={el.fill ?? color}
            fillRule={el.fillRule as 'nonzero' | 'evenodd' | undefined}
            clipRule={el.clipRule as 'nonzero' | 'evenodd' | undefined}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth ? Number(el.strokeWidth) : undefined}
            strokeLinecap={
              el.strokeLinecap as 'butt' | 'round' | 'square' | undefined
            }
            strokeLinejoin={
              el.strokeLinejoin as 'miter' | 'round' | 'bevel' | undefined
            }
          />
        )
      })}
    </Svg>
  )
}
