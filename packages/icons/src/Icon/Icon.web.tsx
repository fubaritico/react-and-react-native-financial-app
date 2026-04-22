import { iconData } from '../generated/iconData'

import type { IIconWebProps } from './Icon'

/**
 * Renders an SVG icon by name using DOM elements.
 * Color defaults to 'currentColor' so it inherits from parent text color.
 */
export function Icon({
  name,
  size = 24,
  color = 'currentColor',
  accessibilityLabel,
  ...rest
}: IIconWebProps) {
  const icon = iconData[name]

  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      fill="none"
      aria-hidden={!accessibilityLabel}
      aria-label={accessibilityLabel}
      role={accessibilityLabel ? 'img' : undefined}
      {...rest}
    >
      {icon.elements.map((el, i) => {
        if ('type' in el && el.type === 'circle') {
          return (
            <circle
              key={i}
              cx={el.cx}
              cy={el.cy}
              r={el.r}
              fill={el.fill ?? color}
            />
          )
        }

        return (
          <path
            key={i}
            d={el.d}
            fill={el.fill ?? color}
            fillRule={el.fillRule as React.SVGProps<SVGPathElement>['fillRule']}
            clipRule={el.clipRule as React.SVGProps<SVGPathElement>['clipRule']}
            stroke={el.stroke}
            strokeWidth={el.strokeWidth}
            strokeLinecap={
              el.strokeLinecap as React.SVGProps<SVGPathElement>['strokeLinecap']
            }
            strokeLinejoin={
              el.strokeLinejoin as React.SVGProps<SVGPathElement>['strokeLinejoin']
            }
          />
        )
      })}
    </svg>
  )
}
